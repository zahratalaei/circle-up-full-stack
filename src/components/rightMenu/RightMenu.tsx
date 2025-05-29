import React, { Suspense } from 'react'
import FriendRequest from './FriendRequest'
import Birthday from './Birthday'
import Ad from '../Ad'
import UserInfoCard from './UserInfoCard'
import UserMediaCard from './UserMediaCard'
import { User } from '@/generated/prisma'



type Props = {
 
}

const RightMenu = ({user}: {user?:User}) => {
 
 
  return (
    <div className='flex flex-col gap-6'>
      {user ? (
        <>
        <Suspense fallback={<div className='h-64 w-full bg-white shadow-md rounded-lg animate-pulse'>Loading...</div>}>
          <UserInfoCard user = {user}/>
        </Suspense>
        <Suspense fallback={<div className='h-64 w-full bg-white shadow-md rounded-lg animate-pulse'>Loading...</div>}>

          <UserMediaCard user = {user}/>
        </Suspense>

        </>
      ): null}
      <FriendRequest/>
      <Birthday/>
      <Ad size="md"/>
    </div>
  )
}

export default RightMenu