"use server";
import z from "zod";
import prisma from "./client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
export type SwitchLikeArgs = { postId: number; commentId?: number | null };
export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  payload: { formData: FormData; cover: string }
) => {
  const { formData, cover } = payload;
  const fields = Object.fromEntries(formData);
  // filter out empty strings and null values;
  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(([key, value]) => {
      // Filter out empty strings and null values
      return value !== "" && value !== null && value !== undefined;
    })
  );
  const profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
  });
  const validatedFields = profile.safeParse({ cover, ...fields });
  if (!validatedFields.success) {
    console.error(
      "Validation error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { success: false, error: true };
  }
  const { userId } = await auth();
  if (!userId) {
    // throw new Error("User not authenticated")
    return { success: false, error: true };
  }
  try {
    await prisma.user.update({
      where: { id: userId },
      data: validatedFields.data,
    });
    return { success: true, error: false };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: true };
  }
};

export const acceptFollowRequest = async (requestId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    // Accept the follow request
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        id: requestId,
      },
      select: {
        senderId: true,
        receiverId: true,
        id: true,
      },
    });
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: { id: existingFollowRequest.id },
      });
      await prisma.follower.create({
        data: {
          followerId: existingFollowRequest.senderId,
          followingId: userId,
        },
      });
    }
  } catch (error) {
    console.error("Error accepting follow request:", error);
    throw new Error("Failed to accept follow request");
  }
};

export const declineFollowRequest = async (requestId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    // Decline the follow request
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        id: requestId,
      },
      select: {
        senderId: true,
        receiverId: true,
        id: true,
      },
    });
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: { id: existingFollowRequest.id },
      });
    }
  } catch (error) {
    console.error("Error declining follow request:", error);
    throw new Error("Failed to decline follow request");
  }
};

export const switchLike = async ({ postId, commentId }: SwitchLikeArgs) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const filter = { userId, postId, commentId };
  try {
    const existingLike = await prisma.like.findFirst({
      where: filter,
    });
    if (existingLike) {
      // If the like exists, delete it
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // If the like does not exist, create it
      await prisma.like.create({
        data: filter,
      });
    }

    const likeCount = await prisma.like.count({ where: { postId, commentId } });
    revalidatePath("/");
     return {
    postId,
    commentId,
    likeCount,
    isLiked: !existingLike,   // true if we just created it
  };
  } catch (error) {
    console.error("Error switching like:", error);
    throw new Error("Failed to switch like");
  }
};

export const addComment = async (postId: number, desc: string, parentId?: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content: desc,
        parentId: parentId || null,
      },
      include: {
        user: true,
        likes: true,
      },
    });
    revalidatePath('/')
    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
};

export const deleteComment = async (commentId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  try {
    // First, check if the user is authorized to delete this comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        post: {
          select: {
            authorId: true
          }
        }
      }
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if user is the comment author or the post author
    const isCommentAuthor = comment.userId === userId;
    const isPostAuthor = comment.post.authorId === userId;

    if (!isCommentAuthor && !isPostAuthor) {
      throw new Error("Not authorized to delete this comment");
    }

    // Delete the comment (this will cascade delete all replies due to schema)
    await prisma.comment.delete({
      where: { id: commentId }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }
};
