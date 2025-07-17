"use client";

import Image from 'next/image'
import React, { useState, useRef } from 'react'
import { SendHorizontal, X } from 'lucide-react';
import { addPost, addPostWithEvent } from '@/lib/actions';
import { useUser } from '@clerk/nextjs';
import { CldUploadWidget } from 'next-cloudinary';
import AddEvent from './feed/AddEvent';

const AddPost = () => {
    const { user } = useUser();
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Allow submission if user exists and either has description or selected event
        if (!user || (!description.trim() && !selectedEvent)) return;
        
        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            formData.append("description", description);
            if (selectedImage) {
                formData.append("image", selectedImage);
            }
            
            let result;
            if (selectedEvent) {
                result = await addPostWithEvent(formData, selectedEvent.id);
            } else {
                result = await addPost(formData);
            }
            
            if (result.success) {
                setDescription(""); // Clear the form after successful submission
                setSelectedImage(null); // Clear the image after successful submission
                setSelectedEvent(null); // Clear the selected event
            }
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    const handleEventCreated = (event: any) => {
        setSelectedEvent(event);
        setShowEventModal(false);
    };

    const removeEvent = () => {
        setSelectedEvent(null);
    };
  
  if (!user) {
    return null; // Don't render if user is not authenticated
  }

  return (
    <div className='p-4 bg-white rounded-lg shadow-md flex flex-col min-[360px]:flex-row gap-4 justify-between text-sm'>
        {/* Avatar */}
        <Image src={user.imageUrl || "/noAvatar.png"} alt="" width={48} height={48} className='w-12 h-12 object-cover rounded-full'/>
        {/* Post */}
        <div className='p-2 flex-1 min-w-0'>
            {/* Text Input */}
            <form onSubmit={handleSubmit} className='flex gap-4 items-end'>
                <div className='flex-1 relative'>
                    <textarea 
                        placeholder="What's on your mind" 
                        className='w-full bg-muted rounded-lg p-2 pr-8 resize-none' 
                        name='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        disabled={isSubmitting}
                    />
                    <div className='absolute bottom-2 right-2'>
                        <Image src="/emoji.png" alt="" width={16} height={16} className='w-4 h-4 cursor-pointer'/>
                    </div>
                </div>
                <button 
                    type='submit' 
                    className='py-2 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={isSubmitting || (!description.trim() && !selectedEvent)}
                >
                    <SendHorizontal 
                        size={28} 
                        color={isSubmitting || (!description.trim() && !selectedEvent) ? "#ccc" : "#905906"}  
                        strokeWidth={2}
                    />
                </button>
            </form>
            
            {/* Image/Video Preview */}
            {selectedImage && (
                <div className='mt-4 relative'>
                    {/* Check if it's a video */}
                    {selectedImage.includes('.mp4') || selectedImage.includes('.mov') || selectedImage.includes('.avi') || selectedImage.includes('.webm') ? (
                        <video 
                            src={selectedImage} 
                            controls 
                            className='rounded-lg object-cover max-w-full h-auto max-h-96'
                            style={{ maxHeight: '400px' }}
                        />
                    ) : (
                        <Image 
                            src={selectedImage} 
                            alt="Selected" 
                            width={400} 
                            height={300} 
                            className='rounded-lg object-cover max-w-full h-auto max-h-96'
                        />
                    )}
                    <button 
                        type='button'
                        onClick={handleRemoveImage}
                        className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Event Preview */}
            {selectedEvent && (
                <div className='mt-4 relative'>
                    <div className='border border-secondary rounded-lg p-4 bg-muted'>
                        <div className='flex items-center justify-between mb-2'>
                            <h3 className='font-semibold text-lg text-yellow-950 font-sans'>Event: {selectedEvent.title}</h3>
                            <button 
                                type='button'
                                onClick={removeEvent}
                                className='text-red-500 hover:text-red-700 transition-colors'
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <p className='text-gray-600 text-sm mb-2'>{selectedEvent.description}</p>
                        <div className='flex items-center gap-4 text-xs text-gray-500'>
                            <span>📅 {selectedEvent.date instanceof Date ? selectedEvent.date.toLocaleDateString() : selectedEvent.date}</span>
                            {selectedEvent.time && <span>🕐 {selectedEvent.time}</span>}
                            {selectedEvent.location && <span>📍 {selectedEvent.location}</span>}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Post Options */}
            <div className='flex items-center gap-4 mt-4 text-gray-400 flex-wrap'>
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
                        if (typeof result.info === 'object' && result.info?.secure_url) {
                            setSelectedImage(result.info.secure_url);
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
                        <div 
                            className='flex gap-2 cursor-pointer hover:text-gray-600 transition-colors' 
                            onClick={() => {
                                setIsUploading(true);
                                open();
                            }}
                        >
                            <Image src="/addImage.png" alt="" width={20} height={20}/>
                            {isUploading ? "Uploading..." : "Photo"}
                        </div>
                    )}
                </CldUploadWidget>
                
                <CldUploadWidget 
                    uploadPreset="circleup"
                    options={{
                        maxFiles: 1,
                        resourceType: "video",
                        maxFileSize: 50000000, // 50MB limit for videos
                        folder: "social_media_posts"
                    }}
                    onSuccess={(result) => {
                        if (typeof result.info === 'object' && result.info?.secure_url) {
                            setSelectedImage(result.info.secure_url);
                        }
                    }}
                    onError={(error) => {
                        console.error("Cloudinary video upload error:", error);
                    }}
                >
                    {({ open }) => (
                        <div className='flex gap-2 cursor-pointer hover:text-gray-600 transition-colors' onClick={() => open()}>
                            <Image src="/addVideo.png" alt="" width={20} height={20}/>Video
                        </div>
                    )}
                </CldUploadWidget>
                
                <div 
                    className='flex gap-2 cursor-pointer hover:text-gray-600 transition-colors' 
                    onClick={() => setShowEventModal(true)}
                >
                    <Image src="/addEvent.png" alt="" width={20} height={20}/>Event
                </div>
                <div className='flex gap-2 cursor-pointer'>
                    <Image src="/poll.png" alt="" width={20} height={20}/>Poll
                </div>
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
  )
}

export default AddPost