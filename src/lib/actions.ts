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

  // Validate postId and commentId
  if (!postId || postId <= 0) {
    throw new Error("Invalid post ID");
  }
  
  if (commentId !== null && commentId !== undefined && commentId <= 0) {
    throw new Error("Invalid comment ID");
  }

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true }
    });
    
    if (!post) {
      throw new Error("Post not found");
    }

    // If commentId is provided, check if the comment exists
    if (commentId !== null && commentId !== undefined) {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { id: true }
      });
      
      if (!comment) {
        throw new Error("Comment not found");
      }
    }

    // Set up the filter with proper null handling
    const filter = { 
      userId, 
      postId, 
      commentId: commentId || null 
    };

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

    const likeCount = await prisma.like.count({ 
      where: { 
        postId, 
        commentId: commentId || null 
      } 
    });
    
    revalidatePath("/");
    return {
      postId,
      commentId,
      likeCount,
      isLiked: !existingLike,   // true if we just created it
    };
  } catch (error) {
    console.error("Error switching like:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        throw new Error("Invalid reference: Post or comment may not exist");
      }
      if (error.message.includes("Post not found") || error.message.includes("Comment not found")) {
        throw error;
      }
    }
    
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

export const addPost = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const description = formData.get("description") as string;
  const image = formData.get("image") as string | null;
  
  // Allow empty descriptions for posts that might have just images or events
  
  try {
    const post = await prisma.post.create({
      data: {
        description: description ? description.trim() : null,
        image: image || null,
        authorId: userId,
      },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
};

export const deletePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // First, check if the user is authorized to delete this post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== userId) {
      throw new Error("Not authorized to delete this post");
    }

    // Delete the post (this will cascade delete likes and comments)
    await prisma.post.delete({
      where: { id: postId }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
};

export const editPost = async (postId: number, formData: FormData) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const description = formData.get("description") as string;
  const image = formData.get("image") as string | null;

  if (!description || description.trim() === "") {
    throw new Error("Post description is required");
  }

  try {
    // First, check if the user is authorized to edit this post
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, image: true }
    });

    if (!existingPost) {
      throw new Error("Post not found");
    }

    if (existingPost.authorId !== userId) {
      throw new Error("Not authorized to edit this post");
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        description: description.trim(),
        image: image || existingPost.image, // Keep existing image if no new image provided
        updatedAt: new Date(),
      },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });

    revalidatePath('/');
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Error editing post:", error);
    throw new Error("Failed to edit post");
  }
};

export const createEvent = async (eventData: {
  title: string;
  description?: string;
  location?: string;
  date: string;
  time?: string;
  image?: string;
}) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { title, description, location, date, time, image } = eventData;

  if (!title || !date) {
    throw new Error("Event title and date are required");
  }

  try {
    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        location: location?.trim() || null,
        date: new Date(date),
        time: time || null,
        image: image || null,
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    revalidatePath("/");
    return event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event");
  }
};

export const addPostWithEvent = async (formData: FormData, eventId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const description = formData.get("description") as string;
  const image = formData.get("image") as string | null;
  
  // Allow empty descriptions for posts with events
  
  try {
    const post = await prisma.post.create({
      data: {
        description: description ? description.trim() : null,
        image: image || null,
        eventId: eventId ? parseInt(eventId) : null,
        authorId: userId,
      },
      include: {
        author: true,
        likes: true,
        comments: true,
        event: true,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
};

export const toggleEventParticipation = async (eventId: number, status: "INTERESTED" | "GOING") => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!eventId || eventId <= 0) {
    throw new Error("Invalid event ID");
  }

  try {
    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, authorId: true }
    });
    
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user already has participation record
    const existingParticipation = await prisma.eventParticipation.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });

    if (existingParticipation) {
      if (existingParticipation.status === status) {
        // If same status, remove participation (toggle off)
        await prisma.eventParticipation.delete({
          where: {
            id: existingParticipation.id
          }
        });
        
        revalidatePath("/");
        return { 
          success: true, 
          action: "removed", 
          status: null,
          eventId,
          userId 
        };
      } else {
        // Update to new status
        const updatedParticipation = await prisma.eventParticipation.update({
          where: {
            id: existingParticipation.id
          },
          data: {
            status,
            updatedAt: new Date()
          }
        });
        
        revalidatePath("/");
        return { 
          success: true, 
          action: "updated", 
          status: updatedParticipation.status,
          eventId,
          userId 
        };
      }
    } else {
      // Create new participation
      const newParticipation = await prisma.eventParticipation.create({
        data: {
          userId,
          eventId,
          status
        }
      });
      
      revalidatePath("/");
      return { 
        success: true, 
        action: "created", 
        status: newParticipation.status,
        eventId,
        userId 
      };
    }
  } catch (error) {
    console.error("Error toggling event participation:", error);
    throw new Error("Failed to toggle event participation");
  }
};

export const getUserEventParticipations = async (userId?: string) => {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }

  const targetUserId = userId || currentUserId;

  try {
    const participations = await prisma.eventParticipation.findMany({
      where: {
        userId: targetUserId
      },
      include: {
        event: {
          include: {
            author: true,
            _count: {
              select: {
                participants: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return participations;
  } catch (error) {
    console.error("Error getting user event participations:", error);
    throw new Error("Failed to get user event participations");
  }
};

export const getEventParticipants = async (eventId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const participants = await prisma.eventParticipation.findMany({
      where: {
        eventId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            name: true,
            surname: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Group by status
    const interested = participants.filter(p => p.status === "INTERESTED");
    const going = participants.filter(p => p.status === "GOING");

    return {
      interested,
      going,
      total: participants.length
    };
  } catch (error) {
    console.error("Error getting event participants:", error);
    throw new Error("Failed to get event participants");
  }
};
