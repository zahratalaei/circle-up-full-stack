import Image from "next/image";
import React from "react";
import { PostWithAuthor } from "./Feed";
import PostInteractionWrapper from "./PostInteractionWrapper";
import { fetchComments } from "./fetchComments";
import PostOptions from "./PostOptions";
import EventParticipationButton from "./EventParticipationButton";


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
        <PostOptions 
          postId={post.id} 
          authorId={post.authorId} 
          currentDescription={post.description ?? ""}
          currentImage={post.image}
        />
      </div>
      {/* Desc */}
      <div className="flex flex-col gap-4">
        {/* Event Information */}
        {post?.event && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📅</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">{post.event.title}</h3>
                <div className="flex items-center gap-4 text-xs text-blue-700">
                  <span>{new Date(post.event.date).toLocaleDateString()}</span>
                  {post.event.time && <span>🕐 {post.event.time}</span>}
                  {post.event.location && <span>📍 {post.event.location}</span>}
                </div>
              </div>
            </div>
            {post.event.description && (
              <p className="text-blue-800 text-sm mb-3">{post.event.description}</p>
            )}
            {post.event.image && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
                <Image
                  src={post.event.image}
                  alt={post.event.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            {/* Event participation buttons */}
            <EventParticipationButton
              eventId={post.event.id}
              participants={post.event.participants}
              participantCount={post.event._count.participants}
            />
          </div>
        )}
        
        {post?.image && (
          <div className="w-full min-h-96 relative">
            {/* Check if it's a video */}
            {post.image.includes('.mp4') || post.image.includes('.mov') || post.image.includes('.avi') || post.image.includes('.webm') ? (
              <video 
                src={post.image} 
                controls 
                className="w-full h-auto rounded-md"
                style={{ maxHeight: '600px' }}
                preload="metadata"
              />
            ) : (
              <Image
                src={post.image}
                alt=""
                fill
                className="object-cover rounded-md"
              />
            )}
          </div>
        )}
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
