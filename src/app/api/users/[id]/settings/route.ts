import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export type SettingsPayload = {
    name?:string;
    surname?:string;
    description?: string;
    city?: string;
    website?:string;
    school?: string;
    work?:string;

}

export async function GET(
    req: NextRequest,context :{params:{id:string}}
){
    const paramUserId = context.params.id;
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
        return new NextResponse(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
    }
    if (currentUserId !== paramUserId) {
        return new NextResponse(JSON.stringify({ error: "You are not authorized to access this resource" }), { status: 403 });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: currentUserId
        },
        select: {
            name: true,
            surname: true,
            description: true,
            city: true,
            website: true,
            school: true,
            work: true
        }
    });
    if (!user) {
        return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new NextResponse(JSON.stringify(user), { status: 200 });
}

export async function POST(req:NextRequest, context:{params:{id:string}}){
    const paramUserId = context.params.id;
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
        return new NextResponse(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
    }
    if (currentUserId !== paramUserId) {
        return new NextResponse(JSON.stringify({ error: "You are not authorized to access this resource" }), { status: 403 });
    }
    const payload: SettingsPayload = await req.json();
    try{
        const updated = await prisma.user.update({
            where: {
                id: currentUserId
            },
            data: {
                name: payload.name,
                surname: payload.surname,
                description: payload.description,
                city: payload.city,
                website: payload.website,
                school: payload.school,
                work: payload.work
            },
            select: {
                name: true,
                surname: true,
                description: true,
                city: true,
                website: true,
                school: true,

            }
        })
        return new NextResponse(JSON.stringify(updated), { status: 200 });
    }catch(error) {
        console.error("Error updating user settings:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to update user settings" }), { status: 500 });
    }
}