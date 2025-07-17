"use client";

import { toggleEventParticipation } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

type EventParticipationButtonProps = {
  eventId: number;
  participants: {
    id: number;
    status: string;
    userId: string;
    user: {
      id: string;
      username: string | null;
      avatar: string | null;
      name: string | null;
      surname: string | null;
    };
  }[];
  participantCount: number;
};

const EventParticipationButton = ({
  eventId,
  participants,
  participantCount,
}: EventParticipationButtonProps) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user) return null;

  // Check current user's participation status
  const currentParticipation = participants.find(p => p.userId === user.id);
  const isInterested = currentParticipation?.status === "INTERESTED";
  const isGoing = currentParticipation?.status === "GOING";

  const handleToggleParticipation = async (status: "INTERESTED" | "GOING") => {
    setIsLoading(true);
    try {
      await toggleEventParticipation(eventId, status);
    } catch (error) {
      console.error("Error toggling participation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Count participants by status
  const interestedCount = participants.filter(p => p.status === "INTERESTED").length;
  const goingCount = participants.filter(p => p.status === "GOING").length;

  return (
    <div className="flex flex-col gap-2">
      {/* Participation buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleToggleParticipation("INTERESTED")}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            isInterested
              ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
              : "bg-gray-100 text-gray-600 hover:bg-yellow-50 border border-gray-300"
          }`}
        >
          <span>⭐</span>
          <span>{isInterested ? "Interested" : "Interested"}</span>
        </button>
        
        <button
          onClick={() => handleToggleParticipation("GOING")}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            isGoing
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-gray-100 text-gray-600 hover:bg-green-50 border border-gray-300"
          }`}
        >
          <span>✓</span>
          <span>{isGoing ? "Going" : "Going"}</span>
        </button>
      </div>

      {/* Participation count */}
      {participantCount > 0 && (
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {interestedCount > 0 && (
            <span className="flex items-center gap-1">
              <span>⭐</span>
              <span>{interestedCount} interested</span>
            </span>
          )}
          {goingCount > 0 && (
            <span className="flex items-center gap-1">
              <span>✓</span>
              <span>{goingCount} going</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EventParticipationButton;
