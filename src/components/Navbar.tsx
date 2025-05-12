import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import Logo  from '../../public/Logo.png'
import MobileMenu from './MobileMenu'
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
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
            <ClerkLoading>
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
            </ClerkLoading>
            <ClerkLoaded>
                <SignedIn>
                    <div className='cursor-pointer'>
                        <Image src='/friends.png' width={20} height={20} alt=""/>
                    </div>
                    <div className='cursor-pointer'>
                        <Image src='/messages.png' width={20} height={20} alt=""/>
                    </div>
                    <div className='cursor-pointer'>
                        <Image src='/notifications.png' width={20} height={20} alt=""/>
                    </div>
                    <UserButton/>
                </SignedIn>
                <SignedOut>
                    <div className='flex gap-2 items-center text-sm'>
                    <Image src='/login.png' width={20} height={20} alt=""/>
                    <Link href="/sign-in">Login/Register</Link>
                    </div>
                </SignedOut>
            </ClerkLoaded>
            <MobileMenu/>
        </div>
    </div>
  )
}

export default Navbar