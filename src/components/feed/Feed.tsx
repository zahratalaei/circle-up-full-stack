import PostContent, { PostContentProps } from './PostContent'
import { auth } from '@clerk/nextjs/server'
import { Comment, Post, User } from '@/generated/prisma'
import prisma from '@/lib/client'

// export type PostWithAuthor = Post & {
//   author:User | null;
//   likes:{
//     userId:string | null;
//   }[];
//   comments:(Comment & {likes:{userId: string | null}[]})[];
//   _count:{
//     likes:number;
//     comments:number;
//   }
// }
export type PostWithAuthor = Post & {
  author: User | null;
  event: { id: number; title: string; description: string | null; date: Date; time: string | null; location: string | null; image: string | null } | null;
  likes: { userId: string | null }[];
  comments: (Comment & { likes: { userId: string | null }[] })[];
  _count: {
    likes: number;    // post-like count
    comments: number; // number of comments
  };
};
const Feed = async ({ username }: { username?: string }) => {
  const { userId } = await auth()
  let posts: PostWithAuthor[] = []
  if (username) {
    posts = await prisma.post.findMany({
      where: {
        author: {
          username: username
        }
      },
      include: {
        author: true,
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            time: true,
            location: true,
            image: true
          }
        },
        likes: {
          where: { commentId: null },
          select: {
            userId: true
          }
        },
        comments: {
          include: {
            likes: {
              select: {
                userId: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  if (!username && userId) {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId
      },
      select: {
        followingId: true
      }
    })
    const followingIds = following.map(f => f.followingId)
    const ids = [userId, ...followingIds]
    posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: ids
        }
      },
      include: {
        author: true,
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            time: true,
            location: true,
            image: true
          }
        },
        likes: {
          where: { commentId: null },
          select: {
            userId: true
          }
        },
        comments: {
          include: {
            likes: {
              select: {
                userId: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  const postPropsList: PostContentProps[] = posts.map(post => ({
    post,
    postLikers: post.likes.map(l => l.userId),
    postLikeCount: post._count.likes,
    commentLikeCount: post._count.comments,
    commentNumber: post.comments.length
  }))
  console.log("postPropsList", postPropsList)
  return (
    <div className='p-4 bg-white rounded-lg shadow-md flex flex-col gap-12'>
      {postPropsList.map(p =>
        // <PostContent post={post} key={post.id}/>
        <PostContent
          key={p.post.id}
          {...p}
        />
      )}
      {/* <PostContent post={post}/>
      <PostContent/>
      <PostContent/>
      <PostContent/>
      <PostContent/> */}
    </div>
  )
}

export default Feed