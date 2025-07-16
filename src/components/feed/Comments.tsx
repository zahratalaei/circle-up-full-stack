import prisma from '@/lib/client'
import CommentsList from './CommentsList'
import AddComment from './AddComment'
import { Comment, Like, User } from '@/generated/prisma'

export type CommentWithUser = Comment & {
    user: User,
    likes: Like[];
    replies?: CommentWithUser[];
}

const Comments = async ({ postId }: { postId: number }) => {
   
    const comments: CommentWithUser[] = await prisma.comment.findMany({
        where: { 
            postId,
            parentId: null // Only get top-level comments
        },
        include: {
            user: true,
            likes: true,
            replies: {
                include: {
                    user: true,
                    likes: true,
                    replies: {
                        include: {
                            user: true,
                            likes: true,
                            replies: {
                                include: {
                                    user: true,
                                    likes: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    })
    console.log("comments", comments)
    return (
        <div>
             {/* Write */}
            {/* <AddComment postId={postId} /> */}
           <CommentsList comments={comments} postId={postId}  />
        </div>
    )
}

export default Comments