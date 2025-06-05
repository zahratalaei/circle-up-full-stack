"use client"
import { UserProfile } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <UserProfile />
    </div>
  )
}

export default page