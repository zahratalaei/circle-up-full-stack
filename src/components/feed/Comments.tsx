import prisma from '@/lib/client'
import CommentsList from './CommentsList'
import AddComment from './AddComment'
import { Comment, Like, User } from '@/generated/prisma'

export type CommentWithUser = Comment & {
    user:User,
    likes:Like[];
 
}

const Comments = async ({ postId }: { postId: number }) => {
   
    const comments:CommentWithUser[] = await prisma.comment.findMany({
        where: { postId },
        include: {
            user: true,
            likes:true
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