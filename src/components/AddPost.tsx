"use client";

import Image from 'next/image'
import React, { useState, useRef } from 'react'
import { SendHorizontal, X } from 'lucide-react';
import { addPost, addPostWithEvent } from '@/lib/actions';
import { useUser } from '@clerk/nextjs';
import { CldUploadWidget } from 'next-cloudinary';
import AddEvent from './feed/AddEvent';
import Avatar from './avatar';

const AddPost = () => {
    const { user } = useUser();
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imagePublicId, setImagePublicId] = useState<string | null>(null);
    const [selectedEffect, setSelectedEffect] = useState<string>("none");
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
                // Use the transformed image URL for submission
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
                setDescription(""); // Clear the form after successful submission
                setSelectedImage(null); // Clear the image after successful submission
                setImagePublicId(null); // Clear the public ID
                setSelectedEffect("none"); // Reset effect
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
        
        // Extract cloud name from the original URL
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

    if (!user) {
        return null; // Don't render if user is not authenticated
    }

    return (
        <div className='p-4 bg-white rounded-lg shadow-md flex flex-col min-[360px]:flex-row gap-4 justify-between text-sm'>
            {/* Avatar */}
            {/* <Image src={user.imageUrl || "/noAvatar.png"} alt="" width={48} height={48} className='w-12 h-12 object-cover rounded-full' /> */}
            {/* Post */}
            <div className='p-2 flex-1 min-w-0'>            {/* Text Input */}
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
                            <Image src="/emoji.png" alt="" width={16} height={16} className='w-4 h-4 cursor-pointer' />
                        </div>
                    </div>
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
                            <div className='space-y-4'>
                                <Image
                                    src={getTransformedImageUrl() || ""}
                                    alt="Selected"
                                    width={400}
                                    height={300}
                                    className='rounded-lg object-cover max-w-full h-auto max-h-96'
                                />
                                
                                {/* Effect Preview Grid - Only show for images */}
                                {imagePublicId && (
                                    <div className='bg-gray-50 p-4 rounded-lg border'>
                                        <h3 className='text-sm font-medium text-gray-700 mb-3'>Choose an Effect:</h3>
                                        <div className='grid grid-cols-4 gap-3 max-h-64 overflow-y-auto'>
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
                                                    <div className='relative'>
                                                        <Image
                                                            src={getTransformedImageUrl(effect.value) || ""}
                                                            alt={effect.label}
                                                            width={80}
                                                            height={80}
                                                            className='w-full h-16 object-cover rounded'
                                                        />
                                                        <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-b'>
                                                            {effect.label}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className='text-xs text-gray-500 mt-2'>
                                            Selected: {effects.find(e => e.value === selectedEffect)?.label}
                                        </p>
                                    </div>
                                )}
                            </div>
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
                <div className='flex items-center justify-between mt-4'>
                    <div className='flex items-center gap-4 text-gray-400 flex-wrap'>
                        <CldUploadWidget
                            uploadPreset="circleup"
                            options={{
                                maxFiles: 1,
                                resourceType: "auto",
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
                                        // sourceText: "#641a0f",
                                        sourceTextActive: "#C7A04C"
                                    },
                                    frame: {
                                        background: "rgba(0, 0, 0, 0.3)"
                                    },
                                    // fonts: {
                                    //     default: null,
                                    //     "'Merriweather', serif": {
                                    //         url: "https://fonts.googleapis.com/css?family=Merriweather",
                                    //         active: true
                                    //     }
                                    // }
                                }
                            }}
                            onSuccess={(result) => {
                                if (typeof result.info === 'object' && result.info?.secure_url) {
                                    console.log("Upload result:", result.info); // Debug log
                                    setSelectedImage(result.info.secure_url);
                                    setImagePublicId(result.info.public_id);
                                    setSelectedEffect("none"); // Reset effect when new image is uploaded
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
                                    className='flex gap-2 cursor-pointer hover:text-gray-600 transition-colors duration-200 hover:scale-105'
                                    onClick={() => {
                                        setIsUploading(true);
                                        open();
                                    }}
                                >
                                    <Image src="/addImage.png" alt="" width={20} height={20} />
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
                                folder: "social_media_posts",
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
                                    // Only set publicId for images, not videos
                                    if (result.info.resource_type === 'image') {
                                        setImagePublicId(result.info.public_id);
                                    }
                                }
                            }}
                            onError={(error) => {
                                console.error("Cloudinary video upload error:", error);
                            }}
                        >
                            {({ open }) => (
                                <div className='flex gap-2 cursor-pointer hover:text-gray-600 transition-colors duration-200 hover:scale-105' onClick={() => open()}>
                                    <Image src="/addVideo.png" alt="" width={20} height={20} />Video
                                </div>
                            )}
                        </CldUploadWidget>

                        <div
                            className='flex gap-2 cursor-pointer hover:text-gray-600 transition-colors duration-200 hover:scale-105'
                            onClick={() => setShowEventModal(true)}
                        >
                            <Image src="/addEvent.png" alt="" width={20} height={20} />Event
                        </div>
                        <div className='flex gap-2 cursor-pointer duration-200 hover:scale-105'>
                            <Image src="/poll.png" alt="" width={20} height={20} />Poll
                        </div>
                    </div>

                    {/* Submit Button - aligned with post options */}
                    <button
                        type='button'
                        onClick={handleSubmit}
                        className='py-2 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed duration-200 hover:scale-105'
                        disabled={isSubmitting || (!description.trim() && !selectedEvent)}
                    >
                        <SendHorizontal
                            size={28}
                            color={isSubmitting || (!description.trim() && !selectedEvent) ? "#ccc" : "#905906"}
                            strokeWidth={2}
                        />
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
    )
}

export default AddPost