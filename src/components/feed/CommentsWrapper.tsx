"use client";

import React, { useState } from 'react';
import { CommentWithUser } from './fetchComments';
import CommentsList from './CommentsList';

interface CommentsWrapperProps {
  postId: number;
  comments: CommentWithUser[];
  showComments: boolean;
}

const CommentsWrapper: React.FC<CommentsWrapperProps> = ({ postId, comments, showComments }) => {
  if (!showComments) {
    return null;
  }

  return (
    <div>
      <CommentsList comments={comments} postId={postId} />
    </div>
  );
};

export default CommentsWrapper;
