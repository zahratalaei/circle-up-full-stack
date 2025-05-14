import AddPost from '@/components/AddPost'
import Feed from '@/components/Feed'
import LeftMenu from '@/components/LeftMenu'
import RightMenu from '@/components/RightMenu'
import Stories from '@/components/Stories'
import Image from 'next/image'
import React from 'react'

type Props = {}

const ProfilePage = (props: Props) => {
  return (
    <div className="flex g-6 p-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type='profile' />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className='w-full h-64 relative'>
              <Image src="https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" fill className='object-cover rounded-sm' />
              <Image src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={128} height={128} className='absolute right-0 left-0 m-auto -bottom-16 w-32 h-32 object-cover rounded-full bor der-2 border-white shadow-md ring-4 ring-white z-10' />
            </div>
            <h1 className='font-medium mt-20 mb-4 text-2xl'>Zahra Talaei</h1>
            <div className='flex gap-12 items-center justify-center mb-4'>
              <div className='flex flex-col items-center'>
                <span className='font-medium'>142</span>
                <span className='text-sm'>Posts</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium'>1.2K</span>
                <span className='text-sm'>Followers</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium'>1.4K</span>
                <span className='text-sm'>Following</span>
              </div>
            </div>
          </div>
          <Feed />
        </div>
      </div>
      <div className="hidden lg:block w-[30%] ">
        <RightMenu userId="test" />
      </div>
    </div>
  )
}

export default ProfilePage