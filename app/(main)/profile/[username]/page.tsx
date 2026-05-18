import Image from "next/image";
import { cloudinaryTransform } from "@/utils/cloudinaryTransform";
import { getProfile, isUserFollowing } from "@/data/dal/User/queries";
import Link from "next/link";
import Tabs from "./_components/Tabs";
import { MapPin } from "lucide-react";
import { Suspense } from "react";
import OptimisticFollow from "@/components/User/OptimisticFollow";
import { getUserSession } from "@/data/dal/getUserSession";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const userParam = await params;
  const result = await getProfile(userParam.username);
  if (!result.success || !result.userData) {
    return <div>profile not found....</div>
  }
  const { id, email, name, username, image, bio, location, portfolio, _count: { artPosts, followers, following } } = result.userData;
  return (
    <div className="w-full min-h-screen pb-20 overflow-x-hidden">
      <div className="w-[80%] mx-auto px-4">
        <div

          className="bg-transparent w-[70%] backdrop-blur-2xl rounded-3xl p-6 md:p-10"
        >
          <div className="flex flex-col gap-8">
            <div className="info">
              <div className="profileImage flex gap-5 shrink-0 mb-5">
                {image && (
                  <Image
                    src={cloudinaryTransform(
                      image,
                      "150",
                    )}
                    width={100}
                    height={100}
                    alt="profile-pic"
                    className="object-contain rounded-full"
                  />
                )}
                <div className="usernameandname flex flex-col ">
                  <div className="name text-2xl font-serif">{name}</div>
                  <div className="username text-sm mb-4 text-blue-200/50">@{username}</div>
                  <Suspense><Follow userId={id}/></Suspense>
                  {/* <button className={`p-1 text-sm ${isFollowing ? "text-white/30 border-2 border-white/30 bg-transparent" : "bg-blue-100/90 text-black font-sans font-semibold"} cursor-pointer transition-all duration-300 h-fit rounded-sm px-2`}>{!!followers.length ? "Following" : "Follow"}</button> */}
                </div>
              </div>
              <div className="otherDetails flex flex-col gap-2 w-full">
                <div className="bioAndPortfolioLink flex flex-col gap-1">
                  {bio && (
                    <div className="bio text-sm wrap-break-word">{bio}</div>
                  )}
                  {portfolio && (
                    <Link href={portfolio} className="portfolioLink">Portfolio</Link>
                  )}
                  {location && (
                    <p className="text-sm text-muted-foreground"><MapPin size={15} className="inline mr-2" />{location}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="stats text-sm flex gap-10">
              <div className="posts">{artPosts} <span className="text-blue-100/60">Posts</span></div>
              <div className="followers">{followers} <span className="text-blue-100/60">Followers</span></div>
              <div className="followings">{following} <span className="text-blue-100/60">Followings</span></div>
            </div>
          </div>
        </div>

        <Tabs userId={id} />

      </div>
    </div>
  )
}


export async function Follow({ userId }: { userId: string }) {
  const session = await getUserSession()
  if (!session || session.user.id === userId || !session.user.username || !session.user.name) return null;
  const result = await isUserFollowing(userId, session.user.id);
  if (!result.success) return null;
  const isFollowing = !!result.data
  return (
    <OptimisticFollow data={{
      isFollowing,
      postOwnerId: userId,
      userId: session.user.id
    }} />
  )
}