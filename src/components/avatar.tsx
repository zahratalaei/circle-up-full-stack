import Image from "next/image"
import Link from "next/link";

type Props = {
    userImageUrl: string,
    username: string | null,
    size: 'sm' | 'md' | 'lg'| 'xl'
}

const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80
}
const Avatar = ({userImageUrl, username,size}:Props) => {
  
  return (
    <Link href={`/profile/${username}`}>
    <Image src={userImageUrl || "/noAvatar.png"} alt="" width={sizeMap[size]} height={sizeMap[size]} className='w-12 h-12 object-cover rounded-full' />
    </Link>
  )
}

export default Avatar