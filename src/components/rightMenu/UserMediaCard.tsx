import { User } from '@/generated/prisma'
import prisma from '@/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const UserMediaCard = async ({ user }: { user: User }) => {

    const imagePosts = await prisma.post.findMany({
        where: {
            authorId: user.id,
            image: { not: null },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 8,
        select: {
            id: true,
            image: true,
        },
    })
    console.log("imagePosts", imagePosts);

    return (
        <div className='p-4 bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-4'>
            {/* Top */}
            <div className='flex items-center justify-between mb-4 font-medium'>
                <span className='text-yellow-950 font-serif'>User Media</span>
                <Link href="/" className='text-accent text-xs'>See all</Link>
            </div>
            {/* Bottom */}
            <div className='flex flex-wrap justify-start gap-4'>
                
                {imagePosts.length > 0 ? imagePosts.map(p=>(
                      <div className='relative w-1/5 h-24' key={p.id}>
                    <Image src={p.image ?? "/default-image.png"} alt="" fill className='object-cover rounded-md' />
                </div>
                )): "No Media Found"}
                {/* <div className='relative w-1/5 h-24'>
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
                </div> */}


            </div>

        </div>
    )
}

export default UserMediaCard