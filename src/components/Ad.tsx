import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



const Ad = ({ size }: { size: "sm" | "md" | "lg" }) => {
    return (
        <div className='p-4 bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-4'>
            <div className='flex items-center justify-between mb-4 font-medium'>
                <span className='text-yellow-950 font-serif'>Sponsored Ads</span>
                <Image src="/more.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer" />
            </div>
            <div className={`flex flex-col  text-gray-500 ${size === "sm" ? "gap-2" : size === "md" ? "gap-4" : "gap-6"}`}>
                <div className={`relative w-full ${size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"} `}>
                    <Image src="https://images.pexels.com/photos/2739295/pexels-photo-2739295.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" fill className='object-cover rounded-lg' />
                </div>
                <div className='flex items-center gap-4'>
                    <Image src="https://images.pexels.com/photos/2739295/pexels-photo-2739295.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={24} height={24} className='w-6 h-6 object-cover rounded-full' />
                    <span className='font-medium text-gray-800'>Lorem, ipsum.</span>
                </div>
                <p className={size=="sm" ? "text-xs text-yellow-700" : "text-sm text-yellow-700" }>
                    {size === "sm" ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus." : size === "md" ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus." : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus."}
                </p>
                <button className="bg-secondary text-gray-600 p-2 text-xs rounded-lg">Learn more</button>
            </div>
        </div>
    )
}

export default Ad