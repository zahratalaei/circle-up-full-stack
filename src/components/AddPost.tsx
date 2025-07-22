"use client";

import Image from 'next/image'
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs';
import Avatar from './avatar';
import CreatePostModal from './feed/CreatePostModal';

const AddPost = () => {
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'post' | 'event'>('post');

    const openModal = (mode: 'post' | 'event' = 'post') => {
        setModalMode(mode);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <div className='p-4 bg-white rounded-lg shadow-md flex gap-4 justify-between text-sm'>
                {/* Avatar */}
                <Avatar 
                    userImageUrl={user.imageUrl} 
                    username={user.username} 
                    size="lg"
                    clickable={false}
                />
                
                {/* Post Trigger */}
                <div className='flex-1'>
                    {/* Text Input Trigger */}
                    <button
                        onClick={() => openModal('post')}
                        className='w-full bg-muted hover:bg-gray-200 rounded-full p-3 text-left text-gray-500 transition-colors cursor-pointer'
                    >
                        What's on your mind?
                    </button>

                    {/* Post Options */}
                    <div className='flex items-center justify-between mt-4 pt-3 border-t border-gray-200'>
                        <div className='flex items-center gap-6 text-gray-600'>
                            <button
                                onClick={() => openModal('post')}
                                className='flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors'
                            >
                                <Image src="/addImage.png" alt="" width={20} height={20} />
                                <span className='text-sm font-medium'>Photo</span>
                            </button>

                            <button
                                onClick={() => openModal('post')}
                                className='flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors'
                            >
                                <Image src="/addVideo.png" alt="" width={20} height={20} />
                                <span className='text-sm font-medium'>Video</span>
                            </button>

                            <button
                                onClick={() => openModal('event')}
                                className='flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors'
                            >
                                <Image src="/addEvent.png" alt="" width={20} height={20} />
                                <span className='text-sm font-medium'>Event</span>
                            </button>

                            <button
                                onClick={() => openModal('post')}
                                className='flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors'
                            >
                                <Image src="/poll.png" alt="" width={20} height={20} />
                                <span className='text-sm font-medium'>Poll</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CreatePostModal 
                isOpen={showModal}
                onClose={closeModal}
                initialMode={modalMode}
            />
        </>
    )
}

export default AddPost