import prisma from "@/lib/client";
import { doRelationAction, getRelationStatus, RelationAction } from "@/server/services/relationship";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
export async function GET (req:NextRequest,{params}:{params:{id:string}}){
    const {userId:currentUserId} = await auth()
    if (!currentUserId) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    const status = await getRelationStatus(params.id,currentUserId)
    return NextResponse.json({ status });
}

export async function POST(req:NextRequest,{params}:{params:{id:string}}){
    const {userId:currentUserId} = await auth()
    if (!currentUserId) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    const {action} = (await req.json()) as {action: RelationAction};
    if (!action) {
        return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }
    await doRelationAction(params.id,currentUserId,action)
    return NextResponse.json({ message: "Action performed successfully" }, { status: 200 });
}

