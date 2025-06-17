"use client"
import { User } from '@/generated/prisma'
import { updateProfile } from '@/lib/actions'
import Image from 'next/image'
import { useActionState, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary';
import { useRouter } from 'next/navigation'
import UpdateButton from './UpdateButton'



type Props = {}

const UpdateUser = ({ user }: { user: User }) => {
  // modify useState to have type

  const [open, setOpen] = useState<boolean>(false)
  const [cover, setCover] = useState<any>(user.cover || "/noCover.png")
  const [state, formAction] = useActionState(updateProfile, { success: false, error: false })
  const router = useRouter()
  const handleClose = () => {
    setOpen(false)
    state.success && router.refresh() // refresh the page if the profile was updated successfully
  }
  return (
    <div>
      <span onClick={() => setOpen(true)} className='text-accent text-xs cursor-pointer'>Update</span>
      {open && <div className='absolute top-0 left-0 w-screen h-screen bg-black/50 bg-opacity-65 z-50 flex items-center justify-center'>
        <form action={(formData) => formAction({ formData, cover: cover?.secure_url })} className='p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative'>
          {/* Tiltle  */}
          <h1>Update Profile</h1>
          <div className="mt-4 text-xs text-gray-500">Use the navbar profile to change the avatar or username.</div>
          <CldUploadWidget uploadPreset="circleup" onSuccess={result => setCover(result.info)}>
            {({ open }) => {
              return (
                <div className='flex flex-col my-4 gap-4' onClick={() => open?.()}>
                  <label htmlFor="name">Cover Picture</label>
                  <div className='flex items-center gap-2 cursor-pointer'>
                    <Image src={user.cover || "/noCover.png"} alt="" width={48} height={32} className='w-12 h-8 rounded-md object-cover' />
                    <span className='text-sm underline text-gray-600'>Change</span>
                  </div>
                </div>
              );
            }}
          </CldUploadWidget>



          <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
            <div className='flex flex-col w-full md:w-1/2'>
              <label htmlFor="name">Name</label>
              <input type="text" name='name' defaultValue={user.name || ""} className='border border-gray-300 rounded-md p-2 focus:outline-none focus:border-yellow-500' />
            </div>
            <div className='flex flex-col w-full md:w-1/2'>
              <label htmlFor="surname">Surname</label>
              <input type="text" name='surname' defaultValue={user.surname || ""} className='border border-gray-300 rounded-md p-2 focus:outline-none focus:border-yellow-500' />
            </div>
            <div className='flex flex-col w-1/2'>
              <label htmlFor="username">Username</label>
              <input type="text" name='username' defaultValue={user.username || ""} className='border border-gray-300 rounded-md p-2 focus:outline-none focus:border-yellow-500' />
            </div>
            <div className='flex flex-col w-1/2'>
              <label htmlFor="work">Work</label>
              <input type="text" name='work' defaultValue={user.work || ""} className='border border-gray-300 rounded-md p-2 focus:outline-none focus:border-yellow-500' />
            </div>
            <div className='flex flex-col w-1/2'>
              <label htmlFor="website">Website</label>
              <input type="text" name='website' defaultValue={user.website || ""} className='border border-gray-300 rounded-md p-2 focus:outline-none focus:border-yellow-500' />
            </div>
            <div className='flex flex-col w-1/2'>
              <label htmlFor="city">City</label>
              <input type="text" name='city' defaultValue={user.city || ""} className='border border-gray-300 rounded-md p-2 focus:outline-none focus:border-yellow-500' />
            </div>
            <div className='flex flex-col w-1/2'>
              <label htmlFor="school">School</label>
              <input type="text" name='school' defaultValue={user.school || ""} className='border border-gray-300 rounded-md p-2 focus:outline-none focus:border-yellow-500' />
            </div>
            <div className='flex flex-col w-full'>
              <label htmlFor="description">Description</label>
              <textarea name="description" id="" cols={30} rows={3} defaultValue={user.description || ""} className='border border-gray-300 rounded-md p-2 focus:outline-none focus:border-yellow-500'></textarea>
            </div>
          </div>
          <UpdateButton />
          {state.success && <span className='text-green-500 text-sm'>Profile updated successfully!</span>}
          {state.error && <span className='text-red-500 text-sm'>Something went wrong!</span>}
          {/* Close Button */}
          <div className='absolute text-xl right-2 top-3 cursor-pointer' onClick={handleClose}>X</div>
        </form>
      </div>}

    </div>
  )
}

export default UpdateUser