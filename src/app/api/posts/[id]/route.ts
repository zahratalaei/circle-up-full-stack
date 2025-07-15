import { NextRequest, NextResponse } from 'next/server';
import { switchLike } from '@/lib/actions';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const postId = Number(params.id);
  // Toggle like in DB and get updated count
  const { likeCount } = await switchLike({ postId });

  // Broadcast via Socket.IO if available
  if ((globalThis as any).io) {
    (globalThis as any).io.emit('postLiked', { postId, likeCount });
  }

  return NextResponse.json({ postId, likeCount });
}