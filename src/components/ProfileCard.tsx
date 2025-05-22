import prisma from '@/lib/client'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const ProfileCard = async (props: Props) => {
    const { userId } = await auth()
    if(!userId) return null
    const user = await prisma.user.findFirst({
        where:{
            id: userId
        },
        include:{
            _count:{
                select:{
                    followers: true,
                }
        }}
    })
    if(!user) return null
    return (
        <div className='p-4 bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-6'>
            <div className='h-20 relative'>
                <Image src={user.cover || '/noCover.png' } alt="" fill className='object-cover rounded-md' />
                <Image src={user.avatar || '/noAvatar.png' } alt="" width={48} height={48} className='absolute right-0 left-0 m-auto -bottom-6 w-12 h-12 object-cover rounded-full border-2 border-white shadow-md ring-1 ring-white z-10' />
            </div>
            <div className='flex flex-col items-center gap-2'>
                <span className='font-semibold'>{user?.name && user?.surname ? user.name+ ' '+ user.surname : user?.username }</span>
                <div className='flex gap-2 items-center'>
                    <div className='flex'>
                        <Image src="https://images.pexels.com/photos/250591/pexels-photo-250591.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={12} height={12} className='w-3 h-3 rounded-full object-cover' />
                        <Image src="https://images.pexels.com/photos/250591/pexels-photo-250591.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={12} height={12} className='w-3 h-3 rounded-full object-cover' />
                        <Image src="https://images.pexels.com/photos/250591/pexels-photo-250591.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={12} height={12} className='w-3 h-3 rounded-full object-cover' />
                    </div>
                    <span className='text-gray-500 text-xs'>{user._count.followers} followers</span>
                </div>
                <Link href={`/profile/${user.username}`}>
                    <button className='bg-primary text-white px-2 py-1 rounded-lg text-xs'>My Profile</button>
                </Link>
            </div>
        </div>
    )
}

export default ProfileCard