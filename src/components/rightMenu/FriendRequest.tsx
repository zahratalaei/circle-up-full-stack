// import { acceptFollowRequest, declineFollowRequest } from '@/lib/actions'
import prisma from '@/lib/client'
import { auth } from '@clerk/nextjs/server'
// import Image from 'next/image'
import Link from 'next/link'
import FriendRequestList from './FriendRequestList';

type Props = {}

const FriendRequest = async (props: Props) => {
    const { userId } = await auth();
    const requests = await prisma.followRequest.findMany({
        where: userId ? {receiverId: userId} : {},
        include: {
            sender: true
        }
    })
 

    return (
        <div className='p-4 bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-4'>
            {/* Top */}
            <div className='flex items-center justify-between mb-4 font-medium'>
                <span className='text-yellow-950 font-serif'>Friend Request</span>
                <Link href="/" className='text-accent text-xs'>See all</Link>
            </div>
            {/* Bottom */}
            <FriendRequestList requests={requests} />
        </div>
    )
}

export default FriendRequest