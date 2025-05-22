import AddPost from '@/components/AddPost'
import Feed from '@/components/Feed'
import LeftMenu from '@/components/LeftMenu'
import RightMenu from '@/components/RightMenu'
import Stories from '@/components/Stories'
import prisma from '@/lib/client'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {}

const ProfilePage = async ({params}: {params:{username:string} }) => {
  const {username} = await params
  const user = await prisma.user.findFirst({
    where:{
       username
    },
    include:{
      _count:{
        select:{
          followers: true,
          following: true,
          posts: true
        }
      }
    }
  })
  if(!user) return notFound()
  const { userId:currentUserId } = await auth()
let isBlocked;
  if(currentUserId){
    const res= await prisma.block.findFirst({
      where:{
        blockerId: user.id,
        blockedId: currentUserId
      }
    })
    if (res) isBlocked =true;
  }else{
    isBlocked = false;
  }
  if(isBlocked) return notFound()
  return (
    <div className="flex g-6 p-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type='profile' />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className='w-full h-64 relative'>
              <Image src={user?.cover || '/noCover.png'} alt="" fill className='object-cover rounded-sm' />
              <Image src={user?.avatar || '/noAvatar.png'} alt="" width={128} height={128} className='absolute right-0 left-0 m-auto -bottom-16 w-32 h-32 object-cover rounded-full bor der-2 border-white shadow-md ring-4 ring-white z-10' />
            </div>
            <h1 className='font-medium mt-20 mb-4 text-2xl'>{user?.name && user?.surname ? user.name+ ' '+ user.surname : user?.username }</h1>
            <div className='flex gap-12 items-center justify-center mb-4'>
              <div className='flex flex-col items-center'>
                <span className='font-medium'>{user?._count.posts}</span>
                <span className='text-sm'>Posts</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium'>{user?._count.posts}</span>
                <span className='text-sm'>Followers</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium'>{user?._count.posts}</span>
                <span className='text-sm'>Following</span>
              </div>
            </div>
          </div>
          <Feed />
        </div>
      </div>
      <div className="hidden lg:block w-[30%] ">
        <RightMenu user={user} />
      </div>
    </div>
  )
}

export default ProfilePage