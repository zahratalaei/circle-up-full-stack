"use client";

import { useState } from 'react';
import { Trash2, MoreHorizontal, Edit3 } from 'lucide-react';
import { deletePost } from '@/lib/actions';
import { useUser } from '@clerk/nextjs';
import EditPost from './EditPost';

interface PostOptionsProps {
  postId: number;
  authorId: string;
  currentDescription: string;
  currentImage: string | null;
}

const PostOptions = ({ postId, authorId, currentDescription, currentImage }: PostOptionsProps) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deletePost(postId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsOpen(false);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  // Only show options if user is the post author
  if (!user || user.id !== authorId) {
    return null;
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors transition-transform duration-200 hover:scale-105"
        >
          <MoreHorizontal size={16}  />
        </button>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit3 size={14} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Edit Modal */}
      {isEditing && (
        <EditPost
          postId={postId}
          currentDescription={currentDescription}
          currentImage={currentImage}
          onClose={handleCloseEdit}
        />
      )}
    </>
  );
};

export default PostOptions;
