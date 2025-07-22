"use client";

import Image from 'next/image'
import React, { useState, useRef } from 'react'
import { SendHorizontal, X } from 'lucide-react';
import { addPost, addPostWithEvent } from '@/lib/actions';
import { useUser } from '@clerk/nextjs';
import { CldUploadWidget } from 'next-cloudinary';
import AddEvent from './AddEvent';
import Avatar from '../avatar';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'post' | 'event';
}

const CreatePostModal = ({ isOpen, onClose, initialMode = 'post' }: CreatePostModalProps) => {
  const { user } = useUser();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string>("none");
  const [isUploading, setIsUploading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(initialMode === 'event');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || (!description.trim() && !selectedEvent)) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("description", description);
      if (selectedImage) {
        const finalImageUrl = getTransformedImageUrl();
        formData.append("image", finalImageUrl || selectedImage);
      }

      let result;
      if (selectedEvent) {
        result = await addPostWithEvent(formData, selectedEvent.id);
      } else {
        result = await addPost(formData);
      }

      if (result.success) {
        // Reset form and close modal
        setDescription("");
        setSelectedImage(null);
        setImagePublicId(null);
        setSelectedEffect("none");
        setSelectedEvent(null);
        setShowEventModal(false);
        onClose();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePublicId(null);
    setSelectedEffect("none");
  };

  const effects = [
    { label: "Original", value: "none" },
    { label: "Grayscale", value: "e_grayscale" },
    { label: "Sepia", value: "e_sepia" },
    { label: "Blur", value: "e_blur:300" },
    { label: "Pixelate", value: "e_pixelate:15" },
    { label: "Oil Paint", value: "e_oil_paint" },
    { label: "Cartoonify", value: "e_cartoonify" },
    { label: "Vignette", value: "e_vignette" },
    { label: "Sharpen", value: "e_sharpen" },
    { label: "Brightness", value: "e_brightness:40" },
    { label: "Contrast", value: "e_contrast:40" },
    { label: "Saturation", value: "e_saturation:60" },
    { label: "Art: Athena", value: "e_art:athena" },
    { label: "Art: Hokusai", value: "e_art:hokusai" },
    { label: "Art: Peacock", value: "e_art:peacock" },
    { label: "Art: Zorro", value: "e_art:zorro" },
  ];

  const getTransformedImageUrl = (effect = selectedEffect) => {
    if (!imagePublicId) return selectedImage;
    if (effect === "none") return selectedImage;
    
    const cloudName = selectedImage?.match(/https:\/\/res\.cloudinary\.com\/([^\/]+)/)?.[1];
    if (!cloudName) return selectedImage;
    
    return `https://res.cloudinary.com/${cloudName}/image/upload/${effect}/${imagePublicId}`;
  };

  const handleEventCreated = (event: any) => {
    setSelectedEvent(event);
    setShowEventModal(false);
  };

  const removeEvent = () => {
    setSelectedEvent(null);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-[1px] bg-black/5" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedEvent ? 'Create Post with Event' : 'Create Post'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar 
              userImageUrl={user.imageUrl} 
              username={user.username} 
              size="md"
              clickable={false}
            />
            <div>
              <p className="font-medium text-gray-800">{user.username}</p>
              <p className="text-sm text-gray-500">Public</p>
            </div>
          </div>

          {/* Text Input */}
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="What's on your mind?"
              className="w-full bg-transparent text-lg resize-none border-none outline-none placeholder-gray-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isSubmitting}
              autoFocus
            />
          </form>

          {/* Image/Video Preview */}
          {selectedImage && (
            <div className="mt-4 relative">
              {selectedImage.includes('.mp4') || selectedImage.includes('.mov') || selectedImage.includes('.avi') || selectedImage.includes('.webm') ? (
                <video
                  src={selectedImage}
                  controls
                  className="rounded-lg object-cover w-full max-h-96"
                />
              ) : (
                <div className="space-y-4">
                  <Image
                    src={getTransformedImageUrl() || ""}
                    alt="Selected"
                    width={600}
                    height={400}
                    className="rounded-lg object-cover w-full max-h-96"
                  />
                  
                  {/* Effect Preview Grid */}
                  {imagePublicId && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Choose an Effect:</h3>
                      <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                        {effects.map((effect) => (
                          <div
                            key={effect.value}
                            className={`cursor-pointer rounded-lg border-2 p-1 transition-all ${
                              selectedEffect === effect.value
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedEffect(effect.value)}
                          >
                            <div className="relative">
                              <Image
                                src={getTransformedImageUrl(effect.value) || ""}
                                alt={effect.label}
                                width={60}
                                height={60}
                                className="w-full h-12 object-cover rounded"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-b">
                                {effect.label}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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

          {/* Event Preview */}
          {selectedEvent && (
            <div className="mt-4 relative">
              <div className="border border-secondary rounded-lg p-4 bg-muted">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-yellow-950">Event: {selectedEvent.title}</h3>
                  <button
                    type="button"
                    onClick={removeEvent}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-2">{selectedEvent.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>📅 {selectedEvent.date instanceof Date ? selectedEvent.date.toLocaleDateString() : selectedEvent.date}</span>
                  {selectedEvent.time && <span>🕐 {selectedEvent.time}</span>}
                  {selectedEvent.location && <span>📍 {selectedEvent.location}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Add to Post Options */}
          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">Add to your post</p>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Photo Upload */}
              <CldUploadWidget
                uploadPreset="circleup"
                options={{
                  maxFiles: 1,
                  resourceType: "image",
                  folder: "social_media_posts",
                  showUploadMoreButton: false,
                  sources: ["local", "url", "camera"],
                  showAdvancedOptions: true,
                  cropping: true,
                  styles: {
                    palette: {
                      window: "#F4F2EE",
                      windowBorder: "#641a0f",
                      tabIcon: "#ae8d44",
                      inactiveTabIcon: "#641a0f",
                      link: "#641a0f",
                      action: "#C7A04C",
                      inProgress: "#C7A04C",
                      complete: "#20B832",
                      error: "#E63946",
                      textDark: "#641a0f",
                      textLight: "#FFFFFF",
                      sourceBg: "#F4F2EE",
                      sourceTextActive: "#C7A04C"
                    },
                    frame: {
                      background: "rgba(0, 0, 0, 0.3)"
                    }
                  }
                }}
                onSuccess={(result) => {
                  if (typeof result.info === 'object' && result.info?.secure_url) {
                    setSelectedImage(result.info.secure_url);
                    setImagePublicId(result.info.public_id);
                    setSelectedEffect("none");
                    setIsUploading(false);
                  }
                }}
                onError={() => setIsUploading(false)}
                onClose={() => setIsUploading(false)}
              >
                {({ open }) => (
                  <button
                    type="button"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                      setIsUploading(true);
                      open();
                    }}
                  >
                    <Image src="/addImage.png" alt="" width={20} height={20} />
                    <span className="text-sm">Photo</span>
                  </button>
                )}
              </CldUploadWidget>

              {/* Video Upload */}
              <CldUploadWidget
                uploadPreset="circleup"
                options={{
                  maxFiles: 1,
                  resourceType: "video",
                  maxFileSize: 50000000, // 50MB limit for videos
                  folder: "social_media_posts",
                  showUploadMoreButton: false,
                  sources: ["local", "url", "camera"],
                  styles: {
                    palette: {
                      window: "#F4F2EE",
                      windowBorder: "#641a0f",
                      tabIcon: "#ae8d44",
                      inactiveTabIcon: "#641a0f",
                      link: "#641a0f",
                      action: "#C7A04C",
                      inProgress: "#C7A04C",
                      complete: "#20B832",
                      error: "#E63946",
                      textDark: "#641a0f",
                      textLight: "#FFFFFF",
                      sourceBg: "#F4F2EE",
                      sourceTextActive: "#C7A04C"
                    },
                    frame: {
                      background: "rgba(0, 0, 0, 0.3)"
                    }
                  }
                }}
                onSuccess={(result) => {
                  if (typeof result.info === 'object' && result.info?.secure_url) {
                    setSelectedImage(result.info.secure_url);
                    // Don't set publicId for videos since effects don't apply
                    if (result.info.resource_type === 'image') {
                      setImagePublicId(result.info.public_id);
                    }
                    setIsUploading(false);
                  }
                }}
                onError={() => setIsUploading(false)}
                onClose={() => setIsUploading(false)}
              >
                {({ open }) => (
                  <button
                    type="button"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                      setIsUploading(true);
                      open();
                    }}
                  >
                    <Image src="/addVideo.png" alt="" width={20} height={20} />
                    <span className="text-sm">Video</span>
                  </button>
                )}
              </CldUploadWidget>

              {/* Event */}
              <button
                type="button"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowEventModal(true)}
              >
                <Image src="/addEvent.png" alt="" width={20} height={20} />
                <span className="text-sm">Event</span>
              </button>

              {/* Poll */}
              <button
                type="button"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Image src="/poll.png" alt="" width={20} height={20} />
                <span className="text-sm">Poll</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isSubmitting || (!description.trim() && !selectedEvent)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <AddEvent
          onClose={() => setShowEventModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  );
};

export default CreatePostModal;
