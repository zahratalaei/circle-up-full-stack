"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { useState } from "react";

export type SettingsPayload = {
    name?:string;
    surname?:string;
    description?: string;
    city?: string;
    website?:string;
    school?: string;
    work?:string;

}
const SettingsForm = () => {
    const {userId:currentUserId, isLoaded} = useAuth()
    const {user} = useUser()
    const [name,setName] = useState<string>("")
  return (
    <form>
        <div>
            <label className="block text-sm font-medium">Name:</label>
            <input className="border p-2 w-full rounded" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
    </form>
  )
}

export default SettingsForm