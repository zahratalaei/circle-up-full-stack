"use client"

import React, { startTransition, useOptimistic, useState, useRef, useEffect } from 'react'
import Image from 'next/image'

import { CommentWithUser } from './fetchComments'
import CommentInteraction from './CommentInteraction'
import CommentOptions from './CommentOptions'
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
    const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false)
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null)
    const [replyText, setReplyText] = useState<string>("")
    const emojiPickerRef = useRef<HTMLDivElement>(null)
    const replyEmojiPickerRef = useRef<HTMLDivElement>(null)
    const mainInputRef = useRef<HTMLInputElement>(null)
    const replyInputRef = useRef<HTMLInputElement>(null)
    const [optimisticComments, addOptimisticComments] = useOptimistic<CommentWithUser[], CommentWithUser | { type: 'delete', id: number }>(
        comments, (currentComments, action) => {
            if (typeof action === 'object' && 'type' in action && action.type === 'delete') {
                // Remove comment and its replies
                const removeCommentAndReplies = (comments: CommentWithUser[]): CommentWithUser[] => {
                    return comments.filter(comment => {
                        if (comment.id === action.id) {
                            return false;
                        }
                        if (comment.replies) {
                            comment.replies = removeCommentAndReplies(comment.replies);
                        }
                        return true;
                    });
                };
                return removeCommentAndReplies(currentComments);
            }
            return [...currentComments, action as CommentWithUser];
        }
    )

    // Recursive function to render nested replies
    const renderReplies = (replies: CommentWithUser[], level: number = 0) => {
        const maxLevel = 10; // Allow very deep nesting
        if (level > maxLevel) return null;
        
        return replies.map((reply) => (
            <div key={reply.id} className={`mt-3 ${level === 0 ? 'ml-14' : 'ml-6'}`}>
                <div className='flex gap-3'>
                    {/* Reply Avatar */}
                    <Image 
                        src={reply.user.avatar ?? '/noAvatar'} 
                        alt="" 
                        className={`rounded-full object-cover icon-primary ${
                            level === 0 ? 'w-8 h-8' : 
                            level === 1 ? 'w-7 h-7' : 
                            level === 2 ? 'w-6 h-6' :
                            'w-5 h-5'
                        }`} 
                        width={
                            level === 0 ? 32 : 
                            level === 1 ? 28 : 
                            level === 2 ? 24 :
                            20
                        } 
                        height={
                            level === 0 ? 32 : 
                            level === 1 ? 28 : 
                            level === 2 ? 24 :
                            20
                        } 
                    />
                    {/* Reply Content */}
                    <div className='flex flex-col gap-1 flex-1'>
                        <span className={`font-medium ${
                            level === 0 ? 'text-sm' : 
                            level === 1 ? 'text-xs' : 
                            'text-xs'
                        }`}>
                            {reply.user.username}
                        </span>
                        <p className={`${
                            level === 0 ? 'text-sm' : 
                            level === 1 ? 'text-xs' : 
                            'text-xs'
                        }`}>
                            {reply.content}
                        </p>
                        {/* Reply Interaction */}
                        <CommentInteraction 
                            postId={reply.postId} 
                            commentId={reply.id} 
                            likes={reply.likes.map(like => like.userId)}
                            onReply={() => handleReply(reply.id)}
                        />
                    </div>
                    {/* Comment Options */}
                    <CommentOptions
                        commentId={reply.id}
                        commentUserId={reply.userId}
                        postAuthorId={reply.post.authorId}
                        onDelete={() => handleDeleteComment(reply.id)}
                    />
                </div>
                
                {/* Reply form for this reply */}
                {activeReplyId === reply.id && user && (
                    <div className={`mt-2 ${
                        level === 0 ? 'ml-11' : 
                        level === 1 ? 'ml-9' : 
                        'ml-7'
                    }`}>
                        <div className='flex items-center gap-2'>
                            <Image 
                                src={user?.imageUrl} 
                                alt="" 
                                className={`rounded-full object-cover ${
                                    level <= 2 ? 'w-6 h-6' : 'w-5 h-5'
                                }`} 
                                width={level <= 2 ? 24 : 20} 
                                height={level <= 2 ? 24 : 20} 
                            />
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                addReply(reply)
                            }} className='flex items-center justify-between bg-muted w-full p-2 rounded-xl text-sm flex-1 relative'>
                                <input 
                                    type="text" 
                                    placeholder={`Reply to @${reply.user.username}...`}
                                    className='bg-transparent outline-none flex-1' 
                                    onChange={(e) => setReplyText(e.target.value)} 
                                    value={replyText}
                                    ref={replyInputRef}
                                    autoFocus
                                />
                                <button type="submit" className="sr-only">Submit</button>
                                <div className="relative" ref={replyEmojiPickerRef}>
                                    <Image
                                        src="/emoji.png"
                                        alt="Add emoji"
                                        width={16}
                                        height={16}
                                        className="cursor-pointer"
                                        onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)}
                                    />
                                    {showReplyEmojiPicker && (
                                        <div className="absolute bottom-8 right-0 z-50">
                                            <Picker 
                                                data={data}
                                                onEmojiSelect={handleReplyEmojiSelect}
                                                theme="light"
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                
                {/* Nested replies */}
                {reply.replies && reply.replies.length > 0 && (
                    <div className="space-y-2">
                        {renderReplies(reply.replies, level + 1)}
                    </div>
                )}
            </div>
        ))
    }

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false)
            }
            if (replyEmojiPickerRef.current && !replyEmojiPickerRef.current.contains(event.target as Node)) {
                setShowReplyEmojiPicker(false)
            }
        }

        if (showEmojiPicker || showReplyEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showEmojiPicker, showReplyEmojiPicker])

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
            parentId: null, // Main comments have no parent
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
            replies: [], // Add empty replies array
            post: {
                authorId: optimisticComments.length > 0 ? optimisticComments[0].post.authorId : user.id
            }
        }
        startTransition(() => {
            addOptimisticComments(tempComment)
        }
        )
        const newComment = await addComment(postId, desc)
        setDesc("")
        setShowEmojiPicker(false)
    }

    const addReply = async (parentComment: CommentWithUser) => {
        if (!user || !replyText.trim()) return
        
        // Create reply without @username prefix since we have proper parent-child relationship
        const replyContent = replyText
        
        // Generate a temporary ID for the reply
        const tempReplyId = Math.random()
        
        // create optimistic reply comment
        const tempReply: CommentWithUser = {
            id: tempReplyId,
            content: replyContent,
            postId,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: parentComment.id,
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
            replies: [], // Add empty replies array
            post: {
                authorId: parentComment.post.authorId
            }
        }
        
        startTransition(() => {
            addOptimisticComments(tempReply)
        })
        
        await addComment(postId, replyContent, parentComment.id)
        setReplyText("")
        setActiveReplyId(null)
    }

    const handleReply = (commentId: number) => {
        setActiveReplyId(activeReplyId === commentId ? null : commentId)
        setReplyText("")
    }

    const handleEmojiSelect = (emoji: any) => {
        setDesc(prev => prev + emoji.native)
        setShowEmojiPicker(false)
        // Refocus the main input after emoji selection
        setTimeout(() => {
            mainInputRef.current?.focus()
        }, 0)
    }

    const handleDeleteComment = (commentId: number) => {
        startTransition(() => {
            addOptimisticComments({ type: 'delete', id: commentId });
        });
    };

    const handleReplyEmojiSelect = (emoji: any) => {
        setReplyText(prev => prev + emoji.native)
        setShowReplyEmojiPicker(false)
        // Refocus the reply input after emoji selection
        setTimeout(() => {
            replyInputRef.current?.focus()
        }, 0)
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
                    <input 
                        type="text" 
                        placeholder='Write a comment...' 
                        className='bg-transparent outline-none w-8/9' 
                        onChange={(e) => setDesc(e.target.value)} 
                        value={desc}
                        ref={mainInputRef}
                    />
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
                <div key={comment.id} className="mb-6">
                    {/* Main Comment */}
                    <div className='flex gap-4 justify-between'>
                        {/* Avatar */}
                        <Image src={comment.user.avatar ?? '/noAvatar'} alt="" className='w-10 h-10 rounded-full object-cover icon-primary' width={40} height={40} />
                        {/* Content */}
                        <div className='flex flex-col gap-2 flex-1'>
                            <span className='font-medium'>{comment.user.username}</span>
                            <p className='text-sm'>{comment.content}</p>
                            {/* Interaction */}
                            <CommentInteraction 
                                postId={comment.postId} 
                                commentId={comment.id} 
                                likes={comment.likes.map(like => like.userId)}
                                onReply={() => handleReply(comment.id)}
                            />
                        </div>
                        {/* Comment Options */}
                        <CommentOptions
                            commentId={comment.id}
                            commentUserId={comment.userId}
                            postAuthorId={comment.post.authorId}
                            onDelete={() => handleDeleteComment(comment.id)}
                        />
                    </div>

                    {/* Reply Form for main comment */}
                    {activeReplyId === comment.id && user && (
                        <div className="ml-14 mt-3">
                            <div className='flex items-center gap-3'>
                                <Image src={user?.imageUrl} alt="" className='w-8 h-8 rounded-full object-cover' width={32} height={32} />
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    addReply(comment)
                                }} className='flex items-center justify-between bg-muted w-full p-2 rounded-xl text-sm flex-1 relative'>
                                    <input 
                                        type="text" 
                                        placeholder={`Reply to @${comment.user.username}...`}
                                        className='bg-transparent outline-none flex-1' 
                                        onChange={(e) => setReplyText(e.target.value)} 
                                        value={replyText}
                                        ref={replyInputRef}
                                        autoFocus
                                    />
                                    <button type="submit" className="sr-only">Submit</button>
                                    <div className="relative" ref={replyEmojiPickerRef}>
                                        <Image
                                            src="/emoji.png"
                                            alt="Add emoji"
                                            width={16}
                                            height={16}
                                            className="cursor-pointer"
                                            onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)}
                                        />
                                        {showReplyEmojiPicker && (
                                            <div className="absolute bottom-8 right-0 z-50">
                                                <Picker 
                                                    data={data}
                                                    onEmojiSelect={handleReplyEmojiSelect}
                                                    theme="light"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="space-y-3">
                            {renderReplies(comment.replies)}
                        </div>
                    )}
                </div>
            ))
            }
        </div>

    )
}

export default CommentsList