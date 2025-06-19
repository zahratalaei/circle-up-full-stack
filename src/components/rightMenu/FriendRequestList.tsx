"use client";
import { FollowRequest, User } from '@/generated/prisma'
import { acceptFollowRequest, declineFollowRequest } from '@/lib/actions';
import Image from 'next/image'
import { useOptimistic, useState } from 'react';

type FollowRequestType = FollowRequest & {
    sender: User | null;
}

const FriendRequestList = ({ requests }: { requests: FollowRequestType[] }) => {
    const [requestsState, setRequestsState] = useState(requests);
    const [optimisticRequests, removeOptimisticRequests] = useOptimistic(requestsState, (state, value: number) => state.filter((req) => req.id !== value))
    const accept = async (requestId: number) => {
        removeOptimisticRequests(requestId);
        try {
            await acceptFollowRequest(requestId);
            setRequestsState((prev) => prev.filter((req) => req.id !== requestId));
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    }
    const decline = async (requestId: number) => {
        removeOptimisticRequests(requestId);
        try {
            await declineFollowRequest(requestId);
            setRequestsState((prev) => prev.filter((req) => req.id !== requestId));
        } catch (error) {
            console.error("Error declining friend request:", error);
        }
    }
    return (
        <>
            {optimisticRequests.map((request: FollowRequestType) => {
                const sender = request.sender;
                if (!sender) return null; // Skip if sender is not available
                return (
                    <div className='flex items-center justify-between gap-4' key={request.id}>
                        {/* User*/}
                        <div className='flex items-center gap-2'>
                            <Image src={sender?.avatar ?? "/avatar.png"} alt="" width={40} height={40} className='w-10 h-10 object-cover rounded-full' />
                            <span className='font-semibold'>{sender.name && sender.surname
                                ? sender.name + " " + sender.surname
                                : sender.username}</span>
                        </div>
                        <div className='flex items-center gap-3 justify-end'>
                            <form action={() => accept(request.id)} >
                                <button>
                                    <Image src="/accept.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer icon-primary" />
                                </button>
                            </form>
                            <form action={() => decline(request.id)} >
                                <button>
                                    <Image src="/reject.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer" />
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
            )
            }
        </>
    )
}

export default FriendRequestList