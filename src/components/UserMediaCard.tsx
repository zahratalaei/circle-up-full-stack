import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const UserMediaCard = ({userId}: {userId: string}) => {
  return (
    <div className='p-4 bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-4'>
        {/* Top */}
        <div className='flex items-center justify-between mb-4 font-medium'>
            <span className='text-gray-500'>User Media</span>
            <Link href="/" className='text-blue-500 text-xs'>See all</Link>
        </div>
        {/* Bottom */}
        <div className='flex flex-wrap justify-start gap-4'>
            <div className='relative w-1/5 h-24'>
                <Image src="https://images.pexels.com/photos/9940318/pexels-photo-9940318.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" fill className='object-cover rounded-md' />
            </div>
            <div className='relative w-1/5 h-24'>
                <Image src="https://images.pexels.com/photos/8651819/pexels-photo-8651819.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" fill className='object-cover rounded-md' />
            </div>
            <div className='relative w-1/5 h-24'>
                <Image src="https://images.pexels.com/photos/445109/pexels-photo-445109.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" fill className='object-cover rounded-md' />
            </div>
            <div className='relative w-1/5 h-24'>
                <Image src="https://images.pexels.com/photos/240561/pexels-photo-240561.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" fill className='object-cover rounded-md' />
            </div>
            <div className='relative w-1/5 h-24'>
                <Image src="https://images.pexels.com/photos/302743/pexels-photo-302743.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" fill className='object-cover rounded-md' />
            </div>
            <div className='relative w-1/5 h-24'>
                <Image src="https://images.pexels.com/photos/193821/pexels-photo-193821.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" fill className='object-cover rounded-md' />
            </div>
            <div className='relative w-1/5 h-24'>
                <Image src="https://images.pexels.com/photos/460295/pexels-photo-460295.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" fill className='object-cover rounded-md' />
            </div>


        </div>

    </div>
  )
}

export default UserMediaCard