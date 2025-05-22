import React from 'react'
import FriendRequest from './FriendRequest'
import Birthday from './Birthday'
import Ad from './Ad'
import UserInfoCard from './UserInfoCard'
import UserMediaCard from './UserMediaCard'
import { User } from '@/generated/prisma'



type Props = {
 
}

const RightMenu = ({user}: {user:User}) => {
 
 
  return (
    <div className='flex flex-col gap-6'>
      {user ? (
        <>
          <UserInfoCard userId = {user.id}/>
          <UserMediaCard userId = {user.id}/>
        </>
      ): null}
      <FriendRequest/>
      <Birthday/>
      <Ad size="md"/>
    </div>
  )
}

export default RightMenu