import prisma from '@/lib/client'
import { Comment, Like, User, Post } from '@/generated/prisma'

export type CommentWithUser = Comment & {
    user: User,
    likes: Like[];
    replies?: CommentWithUser[];
    post: {
        authorId: string;
    };
}

export const fetchComments = async (postId: number): Promise<CommentWithUser[]> => {
    // Fetch all comments for this post
    const allComments = await prisma.comment.findMany({
        where: { 
            postId
        },
        include: {
            user: true,
            likes: true,
            post: {
                select: {
                    authorId: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    })
    
    // Build the nested structure
    const commentMap = new Map<number, CommentWithUser>();
    const rootComments: CommentWithUser[] = [];
    
    // Initialize all comments in the map
    allComments.forEach(comment => {
        commentMap.set(comment.id, {
            ...comment,
            replies: []
        });
    });
    
    // Build the tree structure
    allComments.forEach(comment => {
        const commentWithReplies = commentMap.get(comment.id)!;
        
        if (comment.parentId === null) {
            // This is a root comment
            rootComments.push(commentWithReplies);
        } else {
            // This is a reply, add it to its parent
            const parent = commentMap.get(comment.parentId);
            if (parent) {
                parent.replies = parent.replies || [];
                parent.replies.push(commentWithReplies);
            }
        }
    });
    
    return rootComments;
};
