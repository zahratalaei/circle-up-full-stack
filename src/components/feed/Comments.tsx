import CommentsList from './CommentsList'
import AddComment from './AddComment'
import { fetchComments, CommentWithUser } from './fetchComments'

const Comments = async ({ postId }: { postId: number }) => {
    const comments: CommentWithUser[] = await fetchComments(postId)
    
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