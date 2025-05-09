import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import Logo  from '../../public/Logo.png'
import MobileMenu from './MobileMenu'
type Props = {}

const Navbar = (props: Props) => {
  return (
    <div className='flex items-center justify-between h-24'>
        {/* left */}
        <div className='md:hidden lg:block w-[20%]'>
            <Link href="/">
                <Image
                    src={Logo}
                    width="70"
                    height="70"
                    className="d-inline-block"
                    alt="CircleUp logo"
                />
            </Link>
        </div>
        {/* center */}
        <div className='hidden md:flex w-[50%] text-sm'>
            {/* list */}
            <div className='flex gap-6 text-gray-600'>
                <Link href="/" className='flex gap-2 items-center justify-center'>
                    <Image src="/home.png" width={16} height={16} alt="home" className='mx-0 h-4 justify-center'/>
                    <span>Homepage</span>
                </Link>
                <Link href="/" className='flex gap-2 items-center justify-center'>
                    <Image src="/friends.png" width={16} height={16} alt="home" className='mx-0 h-4 justify-center'/>
                    <span>Friends</span>
                </Link>
                <Link href="/" className='flex gap-2 items-center justify-center'>
                    <Image src="/stories.png" width={16} height={16} alt="home" className='mx-0 h-4 justify-center'/>
                    <span>Stories</span>
                </Link>
            </div>
        </div>
        {/* right */}
        <div className='w-[30%] flex items-center gap-4 xl:gap-8 justify-end'>
            <MobileMenu/>
        </div>
    </div>
  )
}

export default Navbar