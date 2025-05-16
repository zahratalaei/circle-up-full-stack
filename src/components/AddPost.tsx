import Image from 'next/image'
import React from 'react'

const AddPost = () => {
  return (
    <div className='p-4 bg-white rounded-lg shadow-md flex flex-col min-[360px]:flex-row gap-4 justify-between text-sm'>
        {/* Avatar */}
        <Image src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={48} height={48} className='w-12 h-12 object-cover rounded-full'/>
        {/* Post */}
        <div className='p-2 flex-1 min-w-0'>
            {/* Text Input */}
            <div className='flex gap-4'>
                <textarea placeholder="What's on your mind" className='flex-1 bg-muted rounded-lg  p-2'></textarea>
                <Image src="/emoji.png" alt="" width={20} height={20} className='w-5 h-5 cursor-pointer self-end'/>
            </div>
            {/* Post Options */}
            <div className='flex items-center gap-4 mt-4 text-gray-400 flex-wrap'>
                <div className='flex gap-2 cursor-pointer'>
                    <Image src="/addImage.png" alt="" width={20} height={20}/>Photo
                </div>
                <div className='flex gap-2 cursor-pointer'>
                    <Image src="/addVideo.png" alt="" width={20} height={20}/>Video
                </div>
                <div className='flex gap-2 cursor-pointer'>
                    <Image src="/addEvent.png" alt="" width={20} height={20}/>Event
                </div>
                <div className='flex gap-2 cursor-pointer'>
                    <Image src="/poll.png" alt="" width={20} height={20}/>Poll
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddPost