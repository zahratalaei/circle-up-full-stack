import prisma from '@/lib/client';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    // console.log('Webhook payload:', evt.data)
    if( eventType === 'user.created') {
        try{
            await prisma.user.create({
                data: {
                    id: evt.data.id,
                    email: evt.data.email_addresses[0].email_address,
                    name: evt.data.first_name,
                    avatar: evt.data.profile_image_url || "/noAvatar.png",
                    username: evt.data.username
                }
            })
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
                    username: evt.data.username
                }
            })
            return new Response('User updated', { status: 200 })
        }catch(err){
            console.error('Error updating user:', err)
            return new Response('Error updating user', { status: 500 })
        }
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}