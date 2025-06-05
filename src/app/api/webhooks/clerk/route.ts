import prisma from '@/lib/client';
import { syncClerkUserMetadata } from '@/server/services/clerk';

import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

 
    const {type:eventType, data:clerkUser} = evt

    if( eventType === 'user.created' && clerkUser?.id) {
  
        try{
            await prisma.user.upsert({
                where:{
                    id: clerkUser.id
                },
                create: {
                    id: clerkUser.id,
                    email:clerkUser.email_addresses[0].email_address,
                    name: clerkUser.first_name,
                    surname: clerkUser.last_name,
                    avatar: clerkUser.profile_image_url || "/noAvatar.png",
                    username: clerkUser.username,
                    school: "",
                    work: "",
                    city: "",
                    website: "",
                },
                update:{
                    email: clerkUser.email_addresses[0].email_address,
                    name: clerkUser.first_name,
                    surname: clerkUser.last_name,
                    avatar: clerkUser.profile_image_url || "/noAvatar.png",
                    username: clerkUser.username,
                    school: "",
                    work: "",
                    city: "",
                    website: "",
                }
            })
            await syncClerkUserMetadata(clerkUser)
            return new Response('User created', { status: 200 })
        }catch(err){
            console.error('Error creating user:', err)
            return new Response('Error creating user', { status: 500 })
        }
    }
  
    if( eventType === 'user.updated') {
        
        try{
            await prisma.user.update({
                where:{
                    id: evt.data.id
                },
                data: {
                    avatar: evt.data.profile_image_url || "/noAvatar.png",
                    username: evt.data.username,
                    
                }
            })
            return new Response('User updated', { status: 200 })
        }catch(err){
            console.error('Error updating user:', err)
            return new Response('Error updating user', { status: 500 })
        }
    }
    if (eventType === 'user.deleted') {
        try{
            await prisma.user.delete({
                where:{
                    id: evt.data.id
                }
            })
            return new Response('User deleted', { status: 200 })
        }catch(err){
            console.error('Error deleting user:', err)
            return new Response('Error deleting user', { status: 500 })
        }
    }
    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}

// function getUser(id: string): any {
//     throw new Error('Function not implemented.');
// }
