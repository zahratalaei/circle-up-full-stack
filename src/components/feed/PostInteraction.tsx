"use client";
import Image from "next/image"
import { MessageCircleMore, Share2, ThumbsUp } from "lucide-react";
import { switchLike } from "@/lib/actions";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
export type LikeState = {
    likeCount: number;
    isLiked: boolean;
}

export type PostInteractionProps = {
    postId: number;
    postLikers: (string | null)[];
    postLikeCount: number;
    //   commentLikeCount: number;
    commentNumber: number;
};
// const PostInteraction = ({ postId, likes, commentNumber }: { postId: number, likes: (string | null)[], commentNumber: number }) => {
const PostInteraction = ({
    postId,
    postLikers,
    postLikeCount,
    commentNumber,
}: PostInteractionProps) => {
    const { userId } =  useAuth()
    // Initialize state from props
    // const initialLikeState: LikeState = {
    //     likeCount: postLikers.length,
    //     isLiked: Boolean(userId && postLikers.includes(userId)),
    // };
    // const [likeState, setLikeState] = useState<LikeState>(initialLikeState);
    const [isLiking, setIsLiking] = useState<boolean>(false);
    const [isLiked, setIsLike] = useState<boolean>(Boolean(userId && postLikers.includes(userId)));
    const [optimisticLikeCount, setOptimisticLikeCount] = useState<number>(postLikers.length);
    
    useEffect(()=>{
        setOptimisticLikeCount(postLikers.length);
        setIsLike(Boolean(userId && postLikers.includes(userId)));
    },[postLikers, userId])
    const likeAction = async () => {
        if (isLiking) return; // Prevent multiple clicks
        setIsLiking(true);
        try {
             await switchLike({ postId, commentId: null });
            // setLikeState({ likeCount, isLiked });
            setOptimisticLikeCount((prev) => prev + (isLiked ? -1 : 1));
            setIsLike(!isLiked);
            // router.refresh();
        } catch (error) {
            console.error("Error liking post:", error);
            startTransition(() => {
                setOptimisticLikeCount(postLikers.length);
                setIsLike(Boolean(userId && postLikers.includes(userId)));
            });
        } finally {
            setIsLiking(false);
        }
    };
    // useEffect(() => {
    //     const newState = {
    //         likeCount: postLikers.length,
    //         isLiked: Boolean(userId && postLikers.includes(userId)),
    //     }
    //     setLikeState(newState)
    // }, [postLikers, userId])
    // // Optimistic updater flips isLiked & adjusts count
    // const [optimisticLike, switchOptimisticLike] = useOptimistic<LikeState, void>(
    //     likeState,
    //     (state) => ({
    //         likeCount: state.likeCount + (state.isLiked ? -1 : 1),
    //         isLiked: !state.isLiked,
    //     })
    // );
    // const likeAction = async () => {
    //     startTransition(() => switchOptimisticLike())
    //     try {
    //         const { likeCount, isLiked } = await switchLike({ postId, commentId: null })

    //         setLikeState({ likeCount, isLiked });
    //         // router.refresh()
    //     } catch (error) {
    //         console.error("Error liking post:", error);
    //         startTransition(() => switchOptimisticLike());

    //     }
    // }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm my-4 space-y-2 md:space-y-0 my-4">
            <div className="flex gap-8 text-yellow-700">
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                    <form action={likeAction}>
                        <button>
                            <Image
                                src={isLiked ? "/liked.png" : "/like.png"}
                                // src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
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
                        {optimisticLikeCount} <span className="hidden md:inline"> Likes</span>{" "}
                        {/* {optimisticLike.likeCount} <span className="hidden md:inline"> Likes</span>{" "} */}
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