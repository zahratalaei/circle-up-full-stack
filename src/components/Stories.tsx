import Image from 'next/image'
import React from 'react'

type Props = {}

const Stories = (props: Props) => {
  return (
    <div className='p-4 bg-white rounded-lg shadow-md overflow-x-auto text-xs scrollbar-hide'>
        <div className='flex gap-8 w-max'>
            <div className='flex flex-col items-center gap-2 cursor-pointer'>
                <Image src="https://images.pexels.com/photos/31592126/pexels-photo-31592126/free-photo-of-red-squirrel-on-tree-trunk-in-misty-forest.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load" alt='' width={80} height={80} className='w-20 h-20 rounded-full ring-2'/>
                <span className='text-center font-medium'>User 1</span>
            </div>
            <div className='flex flex-col items-center gap-2 cursor-pointer'>
                <Image src="https://images.pexels.com/photos/47547/squirrel-animal-cute-rodents-47547.jpeg?auto=compress&cs=tinysrgb&w=1200" alt='' width={80} height={80} className='w-20 h-20 rounded-full ring-2'/>
                <span className='text-center font-medium'>User 1</span>
                </div>
            <div className='flex flex-col items-center gap-2 cursor-pointer'>
                <Image src="https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=1200" alt='' width={80} height={80} className='w-20 h-20 rounded-full ring-2'/>
                <span className='text-center font-medium'>User 1</span>
                </div>
            <div className='flex flex-col items-center gap-2 cursor-pointer'>
                <Image src="https://images.pexels.com/photos/162140/duckling-birds-yellow-fluffy-162140.jpeg?auto=compress&cs=tinysrgb&w=1200" alt='' width={80} height={80} className='w-20 h-20 rounded-full ring-2'/>
                <span className='text-center font-medium'>User 1</span>
                </div>
            <div className='flex flex-col items-center gap-2 cursor-pointer'>
                <Image src="https://images.pexels.com/photos/34231/antler-antler-carrier-fallow-deer-hirsch.jpg?auto=compress&cs=tinysrgb&w=1200" alt='' width={80} height={80} className='w-20 h-20 rounded-full ring-2'/>
                <span className='text-center font-medium'>User 1</span>
            </div>
        </div>
    </div>
  )
}

export default Stories