import React from 'react'
import ProfileCard from './ProfileCard'
import Image from 'next/image'
import Link from 'next/link'
import Ad from './Ad'
import { SquarePen, Bike, Store, CalendarRange, Images, FileVideo, Newspaper, LibraryBig } from 'lucide-react';


type Props = {}

const LeftMenu = ({type}:{type:"home" | "profile"}) => {
  return (
    <div className='flex flex-col gap-6'>
      {type === "home" && <ProfileCard/>}
      <div className="bg-white shadow-md text-sm mx-2 rounded-lg flex flex-col gap-4 p-4 text-yellow-700">
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          {/* <Image src="/posts.png" alt="" width={20} height={20} className='' /> */}
          <SquarePen size={20}  className=''/>
          <span>My Posts</span>
        </Link>
        <hr className='border-t-1 border-gray-50 w-36 self-center'/>
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          {/* <Image src="/activity.png" alt="" width={20} height={20} /> */}
          <Bike size={20} className=''/>
          <span>Activity</span>
        </Link>
        <hr className='border-t-1 border-gray-50 w-36 self-center'/>
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          {/* <Image src="/market.png" alt="" width={20} height={20} /> */}
          <Store size={20} className=''/>
          <span>MarketPlace</span>
        </Link>
        <hr className='border-t-1 border-gray-50 w-36 self-center'/>
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          {/* <Image src="/events.png" alt="" width={20} height={20} /> */}
          <CalendarRange size={20} className=''/>
          <span>Events</span>
        </Link>
        <hr className='border-t-1 border-gray-50 w-36 self-center'/>
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          {/* <Image src="/albums.png" alt="" width={20} height={20} /> */}
          <Images size={20} className=''/>
          <span>Albums</span>
        </Link>
        <hr className='border-t-1 border-gray-50 w-36 self-center'/>
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          {/* <Image src="/videos.png" alt="" width={20} height={20} /> */}
          <FileVideo size={20} className=''/>
          <span>Videos</span>
        </Link>
        <hr className='border-t-1 border-gray-50 w-36 self-center'/>
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          {/* <Image src="/news.png" alt="" width={20} height={20} /> */}
          <Newspaper size={20} className=''/>
          <span>News</span>
        </Link>
        <hr className='border-t-1 border-gray-50 w-36 self-center'/>
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          {/* <Image src="/courses.png" alt="" width={20} height={20} /> */}
          <LibraryBig size={20} className=''/>
          <span>Courses</span>
        </Link>
        <hr className='border-t-1 border-gray-50 w-36 self-center'/>
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          <Image src="/lists.png" alt="" width={20} height={20} />
          <span>Lists</span>
        </Link>
        <hr className='border-t-1 border-gray-50 w-36 self-center'/>
        <Link href="/" className='flex items-center gap-4 rounded-lg hover:bg-muted'>
          <Image src="/settings.png" alt="" width={20} height={20} />
          <span>Settings</span>
        </Link>
        
      </div>
      <Ad size="sm" />
    </div>
  )
}

export default LeftMenu