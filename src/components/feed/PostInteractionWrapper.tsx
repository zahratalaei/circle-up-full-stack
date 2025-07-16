"use client";

import React, { useState } from 'react';
import PostInteraction from './PostInteraction';
import { CommentWithUser } from './fetchComments';
import CommentsWrapper from './CommentsWrapper';
import { PostWithAuthor } from './Feed';

interface PostInteractionWrapperProps {
  post: PostWithAuthor;
  postLikers: (string | null)[];
  postLikeCount: number;
  commentNumber: number;
  comments: CommentWithUser[];
}

const PostInteractionWrapper: React.FC<PostInteractionWrapperProps> = ({
  post,
  postLikers,
  postLikeCount,
  commentNumber,
  comments
}) => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <>
      <PostInteraction
        postId={post.id}
        postLikers={postLikers}
        postLikeCount={postLikeCount}
        commentNumber={commentNumber}
        onToggleComments={toggleComments}
      />
      <CommentsWrapper
        postId={post.id}
        comments={comments}
        showComments={showComments}
      />
    </>
  );
};

export default PostInteractionWrapper;
