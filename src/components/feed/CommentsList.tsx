"use client"

import React, { startTransition, useOptimistic, useState, useRef, useEffect } from 'react'
import Image from 'next/image'

import { CommentWithUser } from './Comments'
import CommentInteraction from './CommentInteraction'
import { useUser } from '@clerk/nextjs'
import { addComment } from '@/lib/actions'
import dynamic from 'next/dynamic'
import data from '@emoji-mart/data'

type Props = {}
// Option B: import the module––Next uses its default export
const Picker = dynamic(() => import("@emoji-mart/react"), {
  ssr: false,
});


const CommentsList = ({ comments, postId }: { comments: CommentWithUser[], postId: number }) => {
    const { user } = useUser()
    const [desc, setDesc] = useState<string>("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const emojiPickerRef = useRef<HTMLDivElement>(null)
    const [optimisticComments, addOptimisticComments] = useOptimistic<CommentWithUser[], CommentWithUser>(
        comments, (currentComments, newComment) => [
            ...currentComments,
            newComment
        ]
    )

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false)
            }
        }

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showEmojiPicker])

    const add = async () => {
        if (!user || !desc.trim()) return
        // create optimistic comment
        const tempComment: CommentWithUser = {
            id: Math.random(), // temporary ID
            content: desc,
            postId,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: {
                id: user.id,
                username: user.username ?? '',
                avatar: user.imageUrl ?? '/noAvatar.png',
                name: null,
                surname: null,
                email: null,
                cover: null,
                description: null,
                city: null,
                school: null,
                work: null,
                website: null,
                password: null,
                createdAt: new Date(),
                updatedAt: new Date(),

            },
            likes: [],
        }
        startTransition(() => {
            addOptimisticComments(tempComment)
        }
        )
        const newComment = await addComment(postId, desc)
        setDesc("")
        setShowEmojiPicker(false)
    }

    const handleEmojiSelect = (emoji: any) => {
        setDesc(prev => prev + emoji.native)
        setShowEmojiPicker(false)
    }
    return (
        <div >
            {/* addComment */}
            {user && <div className='flex items-center gap-4'>
                <Image src={user?.imageUrl} alt="" className='w-8 h-8 rounded-full object-cover' width={32} height={32} />

                <form onSubmit={(e) => {
                    e.preventDefault()
                    add()
                }} className='flex items-center justify-between bg-muted w-full p-2 rounded-xl text-sm flex-1 relative'>
                    <input type="text" placeholder='Write a comment...' className='bg-transparent outline-none w-8/9' onChange={(e) => setDesc(e.target.value)} value={desc} />
                    {/* hidden submit button so Enter always works */}
                    <button type="submit" className="sr-only">
                        Submit
                    </button>
                    <div className="relative" ref={emojiPickerRef}>
                        <Image
                            src="/emoji.png"
                            alt="Add emoji"
                            width={16}
                            height={16}
                            className="cursor-pointer"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />
                        {showEmojiPicker && (
                            <div className="absolute bottom-8 right-0 z-50">
                                <Picker 
                                    data={data}
                                    onEmojiSelect={handleEmojiSelect}
                                    theme="light"
                                />
                            </div>
                        )}
                    </div>
                </form>

            </div>}
            {/* Comment */}
            {user && optimisticComments.map((comment) => (
                <div className='flex gap-4 justify-between mt-6' key={comment.id} >
                    {/* Avatar */}
                    <Image src={comment.user.avatar ?? '/noAvatar'} alt="" className='w-10 h-10 rounded-full object-cover icon-primary' width={40} height={40} />
                    {/* Desc */}
                    <div className='flex flex-col gap-2 flex-1'>
                        <span className='font-medium'>{comment.user.username}</span>
                        <p className='text-sm'>{comment.content}</p>
                        {/* Interaction */}
                        <CommentInteraction postId={comment.postId} commentId={comment.id} likes={comment.likes.map(like => like.userId)} />
                        
                    </div>
                    {/* Icon */}
                    <Image src="/more.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer icon-primary" />
                </div>))
            }
        </div>

    )
}

export default CommentsList