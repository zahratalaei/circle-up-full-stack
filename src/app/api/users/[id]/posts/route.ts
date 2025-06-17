import prisma from "@/lib/client";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    if (!userId) {
        return new Response("User ID is required", { status: 400 });
    }
    try{
        const posts = await prisma.post.findMany({
            where:{
                authorId: userId,
                image: { not: null },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take:8,
            select:{
                id: true,
                image: true,
            }
        })
        return new Response(JSON.stringify(posts), { status: 200, headers: { "Content-Type": "application/json" } });
    }catch (error) {
        console.error("Error fetching posts:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
   