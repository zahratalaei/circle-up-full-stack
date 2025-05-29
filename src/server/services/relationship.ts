import prisma from "@/lib/client";



export type RelationStatus =
  | "None"
  | "Requested"
  | "Following"
  | "Blocked"
  |"BlockedBy"

export type RelationAction =
  | "follow"
  | "cancel"
  | "accept"
  | "unfollow"
  | "block"
  | "unblock";
  export interface RelationData {
  status: RelationStatus;     // follow/request status
  blockedByMe: boolean;       // I have blocked them
  blockedByThem: boolean;     // they have blocked me
}
export const getRelationStatus = async (userId: string, currentUserId:string):Promise<RelationStatus>=>{
    // const {userId: currentUserId} = await auth()
    // if (!currentUserId) {throw new Error("User not authenticated")}
    // Block takes highest priority
    // Have I been blocked?
  const blockedBy = await prisma.block.findUnique({
    where: { blockedId_blockerId: { blockedId: currentUserId, blockerId: userId } }
  });
  if (blockedBy) return "BlockedBy";
    // Have I blocked?
    const blocked = await prisma.block.findUnique({
        where: { blockedId_blockerId: { blockerId: userId, blockedId: currentUserId } }
    });
    if (blocked) return "Blocked";
  // Check if already following
  const follow = await prisma.follower.findUnique({
    where: { followerId_followingId: { followerId: currentUserId, followingId: userId } }
  })
  if (follow) return "Following";

  // Check if a follow‐request exists
  const req = await prisma.followRequest.findUnique({
    where: { senderId_receiverId: { senderId: currentUserId, receiverId: userId } }
  });
  if (req) return "Requested";

  // Otherwise
  return "None";
}

//perform action on relation
export const doRelationAction = async (userId: string, currentUserId:string, action: RelationAction):Promise<void> => {
    switch (action){
        case "follow":
            await prisma.followRequest.upsert({
                where:{
                    senderId_receiverId: {
                        senderId: currentUserId,
                        receiverId: userId
                    }
                },
                create: {
                    senderId: currentUserId,
                    receiverId: userId
                },
                update: {}
            })
            break;
        case "cancel":
            await prisma.followRequest.delete({
                where: {
                    senderId_receiverId: {
                        senderId: currentUserId,
                        receiverId: userId
                    }
                }
            });
            break;
        case "accept":
            await prisma.follower.create({
                data: {
                    followerId: currentUserId,
                    followingId: userId
                }
            });
            await prisma.followRequest.delete({
                where: {
                    senderId_receiverId: {
                        senderId: userId,
                        receiverId: currentUserId
                    }
                }
            });
            break;
        case "unfollow":
            await prisma.follower.delete({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: userId
                    }
                }
            });
            break;
        case "block":
            await prisma.block.create({
                data: {
                    blockerId: currentUserId,
                    blockedId: userId
                }
            });
            break;
        case "unblock":
            await prisma.block.delete({
                where: {
                    blockedId_blockerId: {
                        blockedId: userId,
                        blockerId: currentUserId
                    }
                }
            });
            break;
        default:
            throw new Error("Invalid action");
    }
}