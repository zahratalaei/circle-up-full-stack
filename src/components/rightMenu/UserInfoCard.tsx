import { User } from '@/generated/prisma'
import prisma from '@/lib/client'
import { auth, currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense } from 'react'
import UserInfoCardInteraction from './UserInfoCardInteraction'
import { getRelationStatus } from '@/server/services/relationship'
import UpdateUser from './UpdateUser'

type Props = {}

const UserInfoCard = async ({ user }: { user: User }) => {
    const createdAtDate = new Date(user.createdAt)
    const formattedDate = createdAtDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        // day: 'numeric',
    })

    const {userId: currentUserId } = await auth()
    if (!currentUserId) { throw new Error("User not authenticated") }
    const relationStatus = await getRelationStatus(user.id, currentUserId)

    return (
        <div className='p-4 bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-4'>
            {/* Top */}
            <div className='flex items-center justify-between mb-4 font-medium'>
                <span className='text-yellow-950 font-serif'>User Information</span>
                {currentUserId === user.id ? <UpdateUser user={user} /> : <Link href="/" className='text-accent text-xs'>See all</Link>}
                {/* <Link href="/" className='text-accent text-xs'>See all</Link> */}
            </div>
            {/* Bottom */}
            <div className="flex flex-col gap-4 text-yellow-800">
                <div className="flex items-center gap-2">
                    <span className='text-xl text-black'>{(user.name || user.surname) ? user?.name + ' ' + user?.surname : user.username}</span>
                    <span className='text-sm'>{`@${user?.username}`}</span>
                </div>
                {user?.description && <p>{user.description}</p>}
                {user?.city && <div className='flex items-center gap-2'>
                    <Image src="/map.png" alt="" width={16} height={16} />
                    <span className='text-sm'>Living in <b >{user?.city}</b> </span>
                </div>}
                {user?.school && <div className='flex items-center gap-2'>
                    <Image src="/school.png" alt="" width={16} height={16} />
                    <span className='font-medium'>Went to <b >{user?.school}</b> </span>
                </div>}
                {user?.work && <div className='flex items-center gap-2'>
                    <Image src="/work.png" alt="" width={16} height={16} />
                    <span className='text-sm'>Works at <b >{user?.work} </b> </span>
                </div>}
                <div className='flex items-center justify-between'>
                    {user?.website && <div className="flex items-center gap-1">
                        <Image src="/link.png" alt="" width={16} height={16} />
                        <Link href="https://zahratalaei.github.io/portfolio/" className='text-sm text-yellow-700'>{user?.website} </Link>
                    </div>}
                    <div className="flex items-center gap-1">
                        <Image src="/date.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer" />
                        <span className='text-xs'>Joined {formattedDate}</span>
                    </div>
                </div>
                {currentUserId && currentUserId !== user.id &&
                    (
                        <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
                            <UserInfoCardInteraction userId={user.id} initialStatus = {relationStatus}/>
                        </Suspense>
                    )}

            </div>

        </div>
    )
}

export default UserInfoCard