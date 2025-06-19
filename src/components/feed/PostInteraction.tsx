"use client";
import Image from "next/image"
import { MessageCircleMore, Share2, ThumbsUp } from "lucide-react";
import { switchLike } from "@/lib/actions";
import { useOptimistic, useState } from "react";
import { useAuth } from "@clerk/nextjs";

type LikeState = {
    likeCount: number;
    isLiked: boolean;
}

const PostInteraction = ({ postId, likes, commentNumber }: { postId: number, likes: (string | null)[], commentNumber: number }) => {
    const { isLoaded, userId } = useAuth()
    const [likeState, setLikeState] = useState<LikeState>({ likeCount: likes.length, isLiked: userId ? likes.includes(userId) : false });

    const [optimisticLike, switchOptimisticLike] = useOptimistic(likeState, (state, value) => {
        return {
            likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
            isLiked: !state.isLiked
        }
    })
    const likeAction = async () => {
        switchOptimisticLike("")
        try {
            switchLike(postId)
            setLikeState((state) => ({
                likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
                isLiked: !state.isLiked
            }))
        } catch (error) { }
    }
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm my-4 space-y-2 md:space-y-0 my-4">
            <div className="flex gap-8 text-yellow-700">
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                    <form action={likeAction}>
                        <button>
                            <Image
                                src={optimisticLike.isLiked ? "/liked.png" :"/like.png"}
                                alt=""
                                width={16}
                                height={16}
                                className="cursor-pointer icon-primary"
                            />
                        </button>
                    </form>
                    {/* <ThumbsUp  size={16} className="cursor-pointer icon-primary" /> */}
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">
                        {optimisticLike.likeCount} <span className="hidden md:inline"> Likes</span>{" "}
                    </span>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                    <Image
                        src="/comment.png"
                        alt=""
                        width={16}
                        height={16}
                        className="cursor-pointer icon-primary"
                    />
                    {/* <MessageCircleMore  size={16} className="cursor-pointer icon-primary bg-muted" /> */}
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">
                        {commentNumber} <span className="hidden md:inline"> Comments</span>{" "}
                    </span>
                </div>
            </div>
            <div className="text-yellow-700">
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                    {/* <Image
                  src="/share.png"
                  alt=""
                  width={16}
                  height={16}
                  className="cursor-pointer icon-primary"
                /> */}
                    <Share2 size={16} className="cursor-pointer icon-primary" />
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">
                        123 <span className="hidden md:inline"> Shares</span>{" "}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PostInteraction