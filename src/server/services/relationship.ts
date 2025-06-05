import prisma from "@/lib/client";



export type FollowStatus =
  | "None"
  | "Requested"
  | "Following"
  
export type BlockStatus =
  | "Blocked"
  | "BlockedBy";

export type RelationAction =
  | "follow"
  | "cancel"
  | "accept"
  | "unfollow"
  | "block"
  | "unblock";
  export interface RelationData {
  status: FollowStatus;     // follow/request status
  blocked: boolean;       // I have blocked them
  blockedBy: boolean;     // they have blocked me
}
export const getRelationStatus = async (userId: string, currentUserId:string):Promise<RelationData>=>{
    // const {userId: currentUserId} = await auth()
    // if (!currentUserId) {throw new Error("User not authenticated")}
    /** run all four look-ups in parallel */
  const [blockedBy, blocked, follow, request] = await Promise.all([
    prisma.block.findUnique({
      where: { blockedId_blockerId: { blockedId: currentUserId, blockerId: userId } },
      select: { id: true },
    }),
    prisma.block.findUnique({
      where: { blockedId_blockerId: { blockedId: userId, blockerId: currentUserId } },
      select: { id: true },
    }),
    prisma.follower.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: userId } },
      select: { id: true },
    }),
    prisma.followRequest.findUnique({
      where: { senderId_receiverId: { senderId: currentUserId, receiverId: userId } },
      select: { id: true },
    }),
  ]);
  const status:FollowStatus = follow ? "Following" : request ? "Requested" : "None";
  return {status, blocked: !!blocked, blockedBy: !!blockedBy};
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