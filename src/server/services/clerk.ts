import { clerkClient } from "@clerk/nextjs/server";
import {User} from '@/generated/prisma'
import prisma from "@/lib/client";
const client = await clerkClient()

export const syncClerkUserMetadata = async (user:{
    id:string
    school?: string
    work?: string
    city?: string
    website?: string
})=>{
    return await client.users.updateUserMetadata(user.id, {
        publicMetadata: {
        school: "",
        work: "",
        city: "",
        website: "",
        },
    })
}

