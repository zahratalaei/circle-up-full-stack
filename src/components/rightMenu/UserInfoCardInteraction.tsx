"use client";
import { FollowStatus, RelationAction, RelationData } from "@/server/services/relationship";
import { useOptimistic, useState, useTransition } from "react";

type Props = {
    userId: string;
    initialStatus: RelationData
}


const labelMap: Record<FollowStatus, string> = {
    None: "Follow",
    Requested: "Friend Request Sent",
    Following: "Following",
};
const actionMap: Record<FollowStatus, { action: RelationAction, next: FollowStatus } | null> = {
    None: { action: "follow", next: "Requested" },
    Requested: { action: "cancel", next: "None" },
    Following: { action: "unfollow", next: "None" },

}
const UserInfoCardInteraction = (props: Props) => {
    const { userId, initialStatus } = props;
    // const { status, blockedByMe, blockedByThem } = initialStatus;
    console.log("initialStatus", initialStatus)
    const [state, setState] = useState<RelationData>(initialStatus);
    const [optStatus, updateOptStatus] = useOptimistic<
        RelationData,
        Partial<RelationData>
    >(state, (prev, next) => ({ ...prev, ...next }))
    const mutate = async (action: RelationAction, next: Partial<RelationData>) => {
        updateOptStatus(next)
        try {
            await fetch(`/api/users/${userId}/relationship`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            setState(s => ({ ...s, ...next }))
        } catch (error) {
            console.error("Error performing action:", error);
            // // Rollback to previous status if the action fails
            // updateOptStatus(status);
        }
    }
    const followAction = async () => {
        const actionEntry = actionMap[state.status];
        if (!actionEntry) return;

        await mutate(actionEntry.action, { status: actionEntry.next });
    }

    const blockAction = async () => {
        if (state.blockedBy) return;          // cannot override their block
        await mutate(state.blocked ? "unblock" : "block", {
            blocked: !state.blocked,
        });
    }
    // if (optStatus.blockedBy) {
    //     return <span className="text-error text-xs">You are blocked</span>;
    // }
    return (
        <div className="flex flex-col pt-2">
            <div className="w-full flex justify-center ">
                <form action={followAction} className="w-full">
                    <button
                        disabled={optStatus.blockedBy}
                        className='bg-primary rounded-xl w-full mb-2 py-2 text-white text-sm hover:bg-yellow-600'>
                        {optStatus.blockedBy ? "You are Blocked" : labelMap[optStatus.status]}
                    </button>
                </form>
            </div>
            <div className="flex justify-end">
                <form action={blockAction}>
                    <button className="text-error text-xs cursor-pointer">
                        {optStatus.blocked ? "Unblock" : "Block"} User
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UserInfoCardInteraction