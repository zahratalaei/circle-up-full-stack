"use client";
import { useOptimistic } from "react";

type Props = {
    userId: string;
    initialStatus: RelationStatus
}
type RelationStatus = "None" | "Requested" | "Following" | "Blocked" | "BlockedBy";
type RelationAction = "follow" | "cancel" | "accept" | "unfollow" | "block" | "unblock";
const labelMap: Record<RelationStatus, string> = {
    None: "Follow",
    Requested: "Requested",
    Following: "Following",
    Blocked: "Blocked",
    BlockedBy: "You are blocked"
};
const actionMap: Record<RelationStatus, { action: RelationAction, next: RelationStatus } | null> = {
    None: { action: "follow", next: "Requested" },
    Requested: { action: "cancel", next: "None" },
    Following: { action: "unfollow", next: "None" },
    Blocked: null,
    BlockedBy: null
}

const UserInfoCardInteraction = (props: Props) => {
    const { userId, initialStatus } = props;
    const [status, updateStatus] = useOptimistic<RelationStatus>(initialStatus);
    const handle = async (action: RelationAction, next: RelationStatus) => {
        updateStatus(next);
        try {
            await fetch(`/api/users/${userId}/relationship`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
        } catch (error) {
            console.error("Error performing action:", error);
            // Rollback to previous status if the action fails
            updateStatus(status);
        }
    }
    const handleBlockStatus = async () => {
        if (status === "BlockedBy") return;
        const isBlocked = status === "Blocked";
        const action: RelationAction = isBlocked ? "unblock" : "block";
        const nextStatus: RelationStatus = isBlocked ? "None" : "Blocked";
        await handle(action, nextStatus);
    }
    if (status === "BlockedBy") {
        return (
            <span className="text-error text-xs">You are blocked by this user</span>
        )
    }
    const actionEntry = actionMap[status];
    return (
        <>
            <button
                onClick={() => actionEntry && handle(actionEntry.action, actionEntry.next)}
                disabled={status === "Blocked"}
                className='bg-primary rounded-lg py-2 text-white text-sm'>{labelMap[status]}</button>


            <span onClick={handleBlockStatus} className="text-error self-end text-xs cursor-pointer">{status === "Blocked" ? "Unblock" : "Block"}</span>
        </>
    )
}

export default UserInfoCardInteraction