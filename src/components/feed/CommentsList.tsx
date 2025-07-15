"use client"

import React, { startTransition, useOptimistic, useState } from 'react'
import Image from 'next/image'

import { CommentWithUser } from './Comments'
import CommentInteraction from './CommentInteraction'
import { useUser } from '@clerk/nextjs'
import { addComment } from '@/lib/actions'

type Props = {}

const CommentsList = ({ comments, postId }: { comments: CommentWithUser[], postId: number }) => {
    const { user } = useUser()
    const [desc, setDesc] = useState<string>("")
    const [optimisticComments, addOptimisticComments] = useOptimistic<CommentWithUser[], CommentWithUser>(
        comments, (currentComments, newComment) => [
            ...currentComments,
            newComment
        ]
    )

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

    }
    return (
        <div >
            {/* addComment */}
            {user && <div className='flex items-center gap-4'>
                <Image src={user?.imageUrl} alt="" className='w-8 h-8 rounded-full object-cover' width={32} height={32} />

                <form onSubmit={(e) => {
                    e.preventDefault()
                    add()
                }} className='flex items-center justify-between bg-muted w-full p-2 rounded-xl text-sm flex-1'>
                    <input type="text" placeholder='Write a comment...' className='bg-transparent outline-none w-8/9' onChange={(e) => setDesc(e.target.value)} value={desc} />
                    {/* hidden submit button so Enter always works */}
                    <button type="submit" className="sr-only">
                        Submit
                    </button>
                    <Image
                        src="/emoji.png"
                        alt=""
                        width={16}
                        height={16}
                        className="cursor-pointer"
                    />
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
                        {/* <div className='flex items-center gap-8 text-xs'>
                            <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
                                <form action="">
                                    <button>
                                        <Image
                                            src={"/like.png"}
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="cursor-pointer icon-primary"
                                        />
                                    </button>
                                </form> */}
                        {/* <Image src="/like.png" alt="" width={12} height={12} className="w-4 h-4 cursor-pointer icon-primary" /> */}
                        {/* <span className='text-gray-300'>|</span>
                                <span className='text-gray-500'>12 Likes</span>
                            </div>
                            <div>Reply</div>
                        </div> */}
                    </div>
                    {/* Icon */}
                    <Image src="/more.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer icon-primary" />
                </div>))
            }
        </div>

    )
}

export default CommentsList