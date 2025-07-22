"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { deleteComment } from '@/lib/actions';
import Image from 'next/image';

interface CommentOptionsProps {
  commentId: number;
  commentUserId: string;
  postAuthorId: string;
  onDelete?: () => void;
}

const CommentOptions: React.FC<CommentOptionsProps> = ({
  commentId,
  commentUserId,
  postAuthorId,
  onDelete
}) => {
  const { userId } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Check if user can delete this comment
  const canDelete = userId && (userId === commentUserId || userId === postAuthorId);

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log("🚀 ~ handleClickOutside ~ optionsRef.current:", optionsRef.current)
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  const handleDelete = async () => {
    if (!canDelete || isDeleting) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteComment(commentId);
      onDelete?.();
      setShowOptions(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Don't render if user can't delete
  if (!canDelete) {
    return null;
  }

  return (
    <div className="relative" ref={optionsRef}>
      <Image
        src="/more.png"
        alt="Options"
        width={16}
        height={16}
        className="w-4 h-4 cursor-pointer icon-primary hover:opacity-70 transition-transform duration-200 hover:scale-120"
        onClick={() => setShowOptions(!showOptions)}
      />
      
      {showOptions && (
        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-10">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentOptions;
