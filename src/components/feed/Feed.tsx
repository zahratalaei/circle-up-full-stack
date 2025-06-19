import PostContent from './Post'
import { auth } from '@clerk/nextjs/server'
import { Comment, Post, User } from '@/generated/prisma'
import prisma from '@/lib/client'

export type PostWithAuthor = Post & {
  author:User | null;
  likes:{
    userId:string | null;
  }[];
  comments:Comment[];
  _count:{
    likes:number;
    comments:number;
  }
}

const Feed = async ({username}:{username?:string}) => {
  const {userId} = await auth()
  let posts:PostWithAuthor[] = []
  if(username){
    posts = await prisma.post.findMany({
      where:{
        author:{
          username:username
        }
      },
      include:{
        author:true,
        likes:{
          select:{
            userId:true
          }
        },
        comments:true,
        _count:{
          select:{
            likes:true,
            comments:true
          }
        }
      },
      orderBy:{
        createdAt:'desc'
      }
    })
  }
  if(!username && userId){
    const following = await prisma.follower.findMany({
      where:{
        followerId:userId
      },
      select:{
        followingId:true
      }
    })
    const followingIds = following.map(f => f.followingId)
    const ids = [userId, ...followingIds]
    posts = await prisma.post.findMany({
      where:{
        authorId:{
            in:ids
        }
      },
      include:{
        author:true,
        likes:{
          select:{
            userId:true
          }
        },
        comments:true,
        _count:{
          select:{
            likes:true,
            comments:true
          }
        }
      },
      orderBy:{
        createdAt:'desc'
      }
    })
  }
  return (
    <div className='p-4 bg-white rounded-lg shadow-md flex flex-col gap-12'>
      {posts.map(post => 
        <PostContent post={post} key={post.id}/>
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