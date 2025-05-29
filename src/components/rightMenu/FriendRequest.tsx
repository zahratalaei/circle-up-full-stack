import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const FriendRequest = (props: Props) => {
  return (
    <div className='p-4 bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-4'>
        {/* Top */}
        <div className='flex items-center justify-between mb-4 font-medium'>
            <span className='text-yellow-950 font-serif'>Friend Request</span>
            <Link href="/" className='text-accent text-xs'>See all</Link>
        </div>
        {/* Bottom */}
        <div className='flex items-center justify-between gap-4'>
        {/* User*/}
            <div className='flex items-center gap-2'>  
                <Image src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={40} height={40} className='w-10 h-10 object-cover rounded-full'/>
                <span className='font-semibold'>User 22</span>
            </div>
            <div className='flex items-center gap-3 justify-end'>
                <Image src="/accept.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer icon-primary" />
                <Image src="/reject.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer " />
            </div>
        </div>
        <div className='flex items-center justify-between gap-4'>
        {/* User*/}
            <div className='flex items-center gap-2'>  
                <Image src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={40} height={40} className='w-10 h-10 object-cover rounded-full'/>
                <span className='font-semibold'>User 22</span>
            </div>
            <div className='flex items-center gap-3 justify-end'>
                <Image src="/accept.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer icon-primary" />
                <Image src="/reject.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer" />
            </div>
        </div>
        <div className='flex items-center justify-between gap-4'>
        {/* User*/}
            <div className='flex items-center gap-2'>  
                <Image src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={40} height={40} className='w-10 h-10 object-cover rounded-full'/>
                <span className='font-semibold'>User 22</span>
            </div>
            <div className='flex items-center gap-3 justify-end'>
                <Image src="/accept.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer icon-primary" />
                <Image src="/reject.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer" />
            </div>
        </div>
    </div>
  )
}

export default FriendRequest