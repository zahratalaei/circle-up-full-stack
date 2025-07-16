import Image from "next/image";
import React from "react";
import { PostWithAuthor } from "./Feed";
import PostInteractionWrapper from "./PostInteractionWrapper";
import { fetchComments } from "./fetchComments";


export type PostContentProps = {
  post: PostWithAuthor;
  postLikers: (string | null)[];
  postLikeCount: number;
  commentLikeCount: number;
  commentNumber: number;
};
const PostContent = async ({post, postLikers, postLikeCount, commentLikeCount, commentNumber}:PostContentProps) => {
  // Fetch comments data on the server side
  const comments = await fetchComments(post.id);
 
  return (
    <div className="flex flex-col gap-4">
      {/* User */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post?.author?.avatar ?? '/noAvatar.png'}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-sm">{post?.author?.username ?? ""}</span>
        </div>
        <div>
          <Image src="/more.png" alt="" width={16} height={16} />
        </div>
      </div>
      {/* Desc */}
      <div className="flex flex-col gap-4">
        <div className="w-full min-h-96 relative">
          <Image
            src={post?.image ?? '/DefaultImage.jpg'}
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <p>
          {post?.description ?? ""}
        </p>
      </div>
      {/* Interaction and Comments */}
      <PostInteractionWrapper
        post={post}
        postLikers={postLikers}
        postLikeCount={postLikeCount}
        commentNumber={commentNumber}
        comments={comments}
      />
    </div>
  );
};

export default PostContent;
