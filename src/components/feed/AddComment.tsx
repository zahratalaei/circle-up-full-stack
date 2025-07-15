"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { addComment } from '@/lib/actions'
type Props = {}

const AddComment = ({ postId }: { postId: number }) => {
    const { user } = useUser()
    
    const [desc, setDesc] = useState<string>("")
    const [comment, setComment] = useState<Comment>()
    const add = async () => {
        if (!user || !desc) return
        const newComment = await addComment(postId, desc)

    }
    return (
        <>
            {user && <div className='flex items-center gap-4'>
                <Image src={user?.imageUrl} alt="" className='w-8 h-8 rounded-full object-cover' width={32} height={32} />
                
                    <form action={add} className='flex items-center justify-between bg-muted w-full p-2 rounded-xl text-sm flex-1'>
                        <input type="text" placeholder='Write a comment...' className='bg-transparent outline-none w-8/9' onChange={(e) => setDesc(e.target.value)} />
                        <Image
                            src="/emoji.png"
                            alt=""
                            width={16}
                            height={16}
                            className="cursor-pointer"
                        />
                    </form>
               
            </div>}
        </>
    )
}

export default AddComment