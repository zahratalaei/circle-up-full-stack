import Image from "next/image";
import React from "react";
import Comments from "./Comments";
import { PostWithAuthor } from "./Feed";
import PostInteraction from "./PostInteraction";


export type PostContentProps = {
  post: PostWithAuthor;
  postLikers: (string | null)[];
  postLikeCount: number;
  commentLikeCount: number;
  commentNumber: number;
};
const PostContent = ({post, postLikers, postLikeCount, commentLikeCount, commentNumber}:PostContentProps) => {
 
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
      {/* Interaction */}
      <PostInteraction  postId={post.id}
        postLikers={postLikers}
        postLikeCount={postLikeCount}
        commentNumber={commentNumber}
         />     
      {/* <PostInteraction postId={post.id} likes={post.likes.map(like=>like.userId)} commentNumber={post._count.comments} />      */}
      {/* Comments */}
      <Comments postId={post.id}/>
    </div>
  );
};

export default PostContent;
