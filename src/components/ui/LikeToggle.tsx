"use client";

import { switchLike } from "@/lib/actions";
import { useAuth }     from "@clerk/nextjs";
import { useOptimistic, useState, startTransition } from "react";
import Image           from "next/image";

export type LikeButtonProps = {
  postId:    number;
  commentId?: number;
  /** initial list of user-ids who liked this item */
  initialLikes: string[];
  /** if true, render a smaller icon/text */
  compact?:  boolean;
};

export const LikeToggle = ({
  postId,
  commentId,
  initialLikes,
  compact = false,
}: LikeButtonProps) => {
  const { userId, isLoaded } = useAuth();

  // derive initial state
  type State = { likeCount: number; isLiked: boolean };
  const [base, setBase] = useState<State>({
    likeCount: initialLikes.length,
    isLiked:   !!userId && initialLikes.includes(userId),
  });

  // optimistic flips: ignores the passed value, just toggles
  const [optimistic, flipOptimistic] = useOptimistic<State, undefined>(
    base,
    (prev) => ({
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      isLiked:   !prev.isLiked,
    })
  );

  const iconSize = compact ? 12 : 16;

  const handleClick = () => {
    if (!isLoaded || !userId) return;
    // 1) optimistic ui
    flipOptimistic(undefined);
    // 2) fire the server action inside a transition
    startTransition(async () => {
      try {
        await switchLike({ postId, commentId });
        // sync base state so further toggles start from the new truth
        setBase(optimistic);
      } catch {
        // rollback on error
        flipOptimistic(undefined);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isLoaded || !userId}
      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100"
    >
      <Image
        src={optimistic.isLiked ? "/liked.png" : "/like.png"}
        alt={optimistic.isLiked ? "Unlike" : "Like"}
        width={iconSize}
        height={iconSize}
        className="icon-primary"
      />
      {!compact && (
        <span className="text-sm text-gray-600">
          {optimistic.likeCount}
        </span>
      )}
    </button>
  );
};
