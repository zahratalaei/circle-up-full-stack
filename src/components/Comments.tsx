import Image from 'next/image'
import React from 'react'

type Props = {}

const Comments = (props: Props) => {
    return (
        <div>
            {/* Write */}
            <div className='flex items-center gap-4'>
                <Image src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className='w-8 h-8 rounded-full object-cover' width={32} height={32} />
                <div className='flex items-center justify-between bg-slate-100 w-full p-2 rounded-xl text-sm flex-1'>
                    <input type="text" placeholder='Write a comment...' className='bg-transparent outline-none' />
                    <Image
                        src="/emoji.png"
                        alt=""
                        width={16}
                        height={16}
                        className="cursor-pointer"
                    />
                </div>
            </div>
            {/* Comments */}
            <div >
                {/* Comment */}
                <div className='flex gap-4 justify-between mt-6' >
                    {/* Avatar */}
                    <Image src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className='w-10 h-10 rounded-full object-cover' width={40} height={40} />
                    {/* Desc */}
                    <div className='flex flex-col gap-2 flex-1'>
                        <span className='font-medium'>User 3</span>
                        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.</p>
                        <div className='flex items-center gap-8 text-xs'>
                            <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
                                <Image src="/like.png" alt="" width={12} height={12} className="w-4 h-4 cursor-pointer" />
                                <span className='text-gray-300'>|</span>
                                <span className='text-gray-500'>12 Likes</span>
                            </div>
                            <div>Reply</div>
                        </div>
                    </div>
                    {/* Icon */}
                    <Image src="/more.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer" />


                </div>

            </div>
        </div>
    )
}

export default Comments