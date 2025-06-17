"use server"
import z from "zod"
import prisma from "./client"
import { auth } from "@clerk/nextjs/server"
import { success } from "zod/v4"

export const updateProfile = async (prevState:{success:boolean, error:boolean}, payload:{formData:FormData,cover:string})=>{
    const {formData, cover} = payload
    const fields = Object.fromEntries(formData)
    // filter out empty strings and null values;
    const filteredFields =  Object.fromEntries(
        Object.entries(fields).filter(([key, value]) => {
            // Filter out empty strings and null values
            return value !== "" && value !== null && value !== undefined;
        })
    );
    const profile = z.object({
        cover: z.string().optional(),
        name: z.string().max(60).optional(),
        surname: z.string().max(60).optional(),
        work: z.string().max(60).optional(),    
        website: z.string().max(60).optional(),
        city: z.string().max(60).optional(),
        school: z.string().max(60).optional(),
        description: z.string().max(255).optional(),
    })
    const validatedFields = profile.safeParse({cover,...fields})
    if (!validatedFields.success) {
        console.error("Validation error:", validatedFields.error.flatten().fieldErrors)
        return {success: false, error: true}
    }
    const {userId} = await auth()
    if (!userId) {
        // throw new Error("User not authenticated")
        return {success: false, error: true}
    }
    try{
        await prisma.user.update({
            where:{id:userId},
            data:validatedFields.data
        })
        return {success:true, error:false}
    }catch(error) {
        console.error("Database error:", error)
        return {success: false, error: true}
    }
}

export const acceptFollowRequest = async (requestId: number) => {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }
    try {
        // Accept the follow request
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where: { 
                id: requestId,
            },
            select: {
                senderId: true,
                receiverId: true,
                id: true
            }
            
        });
        if(existingFollowRequest){
            await prisma.followRequest.delete({
                where: { id: existingFollowRequest.id } 
        }
        );
            await prisma.follower.create({
                data: {
                    followerId: existingFollowRequest.senderId,
                    followingId: userId
                }
            });
        }
    } catch (error) {
        console.error("Error accepting follow request:", error);
        throw new Error("Failed to accept follow request");
    }
}

export const declineFollowRequest = async (requestId: number) => {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }
    try {
        // Decline the follow request
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where: { 
                id: requestId,
            },
            select:{
                senderId: true,
                receiverId: true,
                id: true
            }
        });
        if(existingFollowRequest){
            await prisma.followRequest.delete({
                where: { id: existingFollowRequest.id } 
            });
        }
    } catch (error) {
        console.error("Error declining follow request:", error);
        throw new Error("Failed to decline follow request");
    }
}