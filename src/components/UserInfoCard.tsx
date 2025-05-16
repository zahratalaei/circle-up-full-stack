import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const UserInfoCard = ({ userId }: { userId: string }) => {
    return (
        <div className='p-4 bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-4'>
            {/* Top */}
            <div className='flex items-center justify-between mb-4 font-medium'>
                <span className='text-gray-500'>User Information</span>
                <Link href="/" className='text-accent text-xs'>See all</Link>
            </div>
            {/* Bottom */}
            <div className="flex flex-col gap-4 text-yellow-800">
                <div className="flex items-center gap-2">
                    <span className='text-xl text-black'>Zahra Talaei</span>
                    <span className='text-sm'>@zahra</span>
                </div>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem quisquam nisi commodi aliquid totam ut.</p>
                <div className='flex items-center gap-2'>
                    <Image src="/map.png" alt="" width={16} height={16} />
                    <span className='text-sm'>Living in <b >Brisbane, Australia</b> </span>
                </div>
                <div className='flex items-center gap-2'>
                    <Image src="/school.png" alt="" width={16} height={16} />
                    <span className='font-medium'>Went to <b >University of Queensland</b> </span>
                </div>
                <div className='flex items-center gap-2'>
                    <Image src="/work.png" alt="" width={16} height={16} />
                    <span className='text-sm'>Works at <b >Enzen</b> </span>
                </div>
                <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-1">
                        <Image src="/link.png" alt="" width={16} height={16} />
                        <Link href="https://zahratalaei.github.io/portfolio/" className='text-sm text-yellow-700'>Zahra's Portfolio </Link>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image src="/date.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer" />
                        <span className='text-xs'>Joined May 2025</span>
                    </div>
                </div>
                <button className='bg-primary rounded-lg py-2 text-white text-sm'>Following</button>
                <span className="text-red-400 self-end text-xs cursor-pointer">Block User</span>

            </div>

        </div>
    )
}

export default UserInfoCard