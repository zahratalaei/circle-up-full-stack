"use client";

import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { editPost } from '@/lib/actions';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

interface EditPostProps {
  postId: number;
  currentDescription: string;
  currentImage: string | null;
  onClose: () => void;
}

const EditPost = ({ postId, currentDescription, currentImage, onClose }: EditPostProps) => {
  const [description, setDescription] = useState(currentDescription);
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("description", description);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      
      await editPost(postId, formData);
      onClose();
    } catch (error) {
      console.error("Error editing post:", error);
      alert("Failed to edit post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Edit Post</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Image/Video Preview */}
            {selectedImage && (
              <div className="relative">
                {selectedImage.includes('.mp4') || selectedImage.includes('.mov') || selectedImage.includes('.avi') || selectedImage.includes('.webm') ? (
                  <video
                    src={selectedImage}
                    controls
                    preload="metadata"
                    className="w-full h-auto rounded-lg max-h-96"
                  />
                ) : (
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg max-h-96 object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Upload Options */}
            <div className="flex items-center gap-4 py-2 border-t border-gray-200">
              <CldUploadWidget
                uploadPreset="circleup"
                options={{
                  maxFiles: 1,
                  resourceType: "auto",
                  folder: "social_media_posts",
                  showUploadMoreButton: false,
                  sources: ["local", "url", "camera"]
                }}
                onSuccess={(result) => {
                  if (typeof result.info === 'object' && result.info && 'secure_url' in result.info) {
                    setSelectedImage(result.info.secure_url as string);
                    setIsUploading(false);
                  }
                }}
                onError={(error) => {
                  console.error("Cloudinary upload error:", error);
                  setIsUploading(false);
                }}
                onClose={() => {
                  setIsUploading(false);
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploading(true);
                      open();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ImageIcon size={16} />
                    {isUploading ? "Uploading..." : "Change Photo/Video"}
                  </button>
                )}
              </CldUploadWidget>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
