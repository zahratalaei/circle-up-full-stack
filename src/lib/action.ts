import { auth } from "@clerk/nextjs/server"
import prisma from "./client"

export const getRelationStatus = async (userId: string, currentUserId:string)=>{
    // const {userId: currentUserId} = await auth()
    // if (!currentUserId) {throw new Error("User not authenticated")}
    let res;
      res = await prisma.follower.findFirst({
        where: {
            followerId: currentUserId,
            followingId: userId
        }
    })
    if(res){ return "Following"}else{
        res = await prisma.followRequest.findFirst({
            where: {
                senderId: currentUserId,
                receiverId: userId
            }
        })
        if(res){ return "Requested"} else{ return "Follow"}
    }
}

export const getBlockStatus = async (userId: string,currentUserId:string)=>{
    // const {userId: currentUserId} = await auth()
    // if (!currentUserId) {throw new Error("User not authenticated")}
    const block = await prisma.block.findFirst({
        where: {
            blockerId: currentUserId,
            blockedId: userId
        }
    })
    if (block) {
        return true; // User is blocked
    } else {
        return false; // User is not blocked
    }
    
}

export const toggleFollow = async (userId: string)=>{
    const {userId: currentUserId} = await auth()
    if (!currentUserId) {throw new Error("User not authenticated")}
    const relationStatus = await getRelationStatus(userId, currentUserId);
    switch (relationStatus) {
        case "Following":
            await prisma.follower.delete({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: userId
                    }
                }
            });
            return "Follow";
        case "Requested":
            await prisma.followRequest.delete({
                where: {
                    senderId_receiverId: {
                        senderId: currentUserId,
                        receiverId: userId
                    }
                }
            });
            return "Follow";
        case "Follow":
            await prisma.follower.create({
                data: {
                    followerId: currentUserId,
                    followingId: userId
                }
            });
            return "Following";
        default:
            throw new Error("Unknown relation status");
           
    }
}

export const toggleBlock = async (userId: string)=>{
    const {userId: currentUserId} = await auth()
    if (!currentUserId) {throw new Error("User not authenticated")}
    const blockStatus = await getBlockStatus(userId, currentUserId);
    switch (blockStatus) {
        case true:
            await prisma.block.delete({
                where: {
                    blockedId_blockerId: {
                        blockerId: currentUserId,
                        blockedId: userId
                    }
                }
            });
            return false; // Unblock
        case false:
            await prisma.block.create({
                data: {
                    blockerId: currentUserId,
                    blockedId: userId
                }
            });
            return true; // Block
        default:
            throw new Error("Unknown block status");
    }
}