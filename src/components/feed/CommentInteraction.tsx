import { useAuth } from "@clerk/nextjs"
import Image from "next/image"
import { useOptimistic, useState } from "react"
import { LikeState } from "./PostInteraction"
import { switchLike } from "@/lib/actions"
type Props = {}

const CommentInteraction = ({ postId, commentId, likes, onReply }: { 
    postId: number, 
    commentId: number, 
    likes: (string | null)[], 
    onReply?: () => void
}) => {

    const { userId } = useAuth()
    const [likeState, setLikeState] = useState<LikeState>({ likeCount: likes.length, isLiked: userId ? likes.includes(userId) : false });
    const [optimisticLike, switchOptimisticLike] = useOptimistic(likeState, (prev) => ({
        likeCount: prev.likeCount + (prev.isLiked ? -1 : 1),
        isLiked: !prev.isLiked
    }))
    const likeAction = async () => {
        switchOptimisticLike("")
        try {
            // Call the server action to switch like
            await switchLike({ postId, commentId })
            setLikeState((state) => ({
                likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
                isLiked: !state.isLiked
            }))
        } catch (error) {
            console.error("Error switching like:", error)
        }
    }
    return (
        <div className='flex items-center gap-8 text-xs'>
            <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
                <form action={likeAction}>
                    <button className="transition-transform duration-200 hover:scale-120">
                        <Image
                            src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
                            alt=""
                            width={16}
                            height={16}
                            className="cursor-pointer icon-primary"
                        />
                    </button>
                </form>
                {/* <Image src="/like.png" alt="" width={12} height={12} className="w-4 h-4 cursor-pointer icon-primary" /> */}
                <span className='text-gray-300'>|</span>
                <span className='text-gray-500'>{optimisticLike.likeCount} <span className="hidden md:inline"> Likes</span>{" "}</span>
            </div>
            <div 
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => onReply && onReply()}
            >
                Reply
            </div>
        </div>
    )
}

export default CommentInteraction