import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
type Props = {}

const Birthday = (props: Props) => {
    return (
        <div className='p-4 bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-4'>
            <div>
                <div className='flex items-center justify-between mb-4 font-medium'>
                    <span className='text-gray-500'>Birthdays</span>
                    <Link href="/" className='text-blue-500 text-xs'>See all</Link>
                </div>
            </div>
            <div>
                <div className='flex items-center justify-between gap-4'>
                    {/* User*/}
                    <div className='flex items-center gap-2'>
                        <Image src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={40} height={40} className='w-10 h-10 object-cover rounded-full' />
                        <span className='font-semibold'>User 22</span>
                    </div>
                    <div className='flex items-center gap-3 justify-end'>
                        <button className='bg-blue-500 text-white text-xs px-2 py-1 rounded-md'>Celebrate</button>
                    </div>
                </div>
            </div>
            <div className='flex items-center bg-slate-100 gap-4 p-4 rounded-lg'>
                <Image src="/gift.png" alt='' width={24} height={24}/>
                <Link href="/" className='flex flex-col text-xs gap-1'>
                    <span className='text-gray-700 font-semibold'>Upcoming Birthdays</span>
                    <span className='text-gray-500'>See other 16 have upcoming birthdays</span>
                </Link>
            </div>

        </div>
    )
}

export default Birthday