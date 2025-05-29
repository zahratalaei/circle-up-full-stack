import Image from "next/image";
import React from "react";
import Comments from "./Comments";
import { MessageCircleMore, Share2, ThumbsUp } from "lucide-react";

type Props = {};

const Post = (props: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {/* User */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-sm">User10</span>
        </div>
        <div>
          <Image src="/more.png" alt="" width={16} height={16} />
        </div>
      </div>
      {/* Desc */}
      <div className="flex flex-col gap-4">
        <div className="w-full min-h-96 relative">
          <Image
            src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim
          voluptatum nam sequi molestiae laudantium deserunt, aliquid quidem
          repellendus sapiente? Tenetur dignissimos voluptatem adipisci amet
          omnis molestias error sit reprehenderit est?
        </p>
      </div>
      {/* Interaction */}
      {/* <div className="flex items-center justify-between text-sm my-4"> */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm my-4 space-y-2 md:space-y-0 my-4">
        <div className="flex gap-8 text-yellow-700">
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
            <Image
              src="/like.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer icon-primary"
            />
            {/* <ThumbsUp  size={16} className="cursor-pointer icon-primary" /> */}
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              123 <span className="hidden md:inline"> Likes</span>{" "}
            </span>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
            <Image
              src="/comment.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer icon-primary"
            />
            {/* <MessageCircleMore  size={16} className="cursor-pointer icon-primary bg-muted" /> */}
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              123 <span className="hidden md:inline"> Comments</span>{" "}
            </span>
          </div>
        </div>
        <div className="text-yellow-700">
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
            {/* <Image
              src="/share.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer icon-primary"
            /> */}
            <Share2 size={16} className="cursor-pointer icon-primary" />
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              123 <span className="hidden md:inline"> Shares</span>{" "}
            </span>
          </div>
        </div>
      </div>
      {/* Comments */}
      <Comments/>
    </div>
  );
};

export default Post;
