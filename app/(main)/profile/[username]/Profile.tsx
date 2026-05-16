"use server"

import { UserProfile } from "@/data/dal/User/queries";
import { cloudinaryTransform } from "@/utils/cloudinaryTransform";
import Image from "next/image";
import Link from "next/link";
import Tabs from "./_components/Tabs";
import { MapPin } from "lucide-react";


export default async function Profile({ user }: { user: UserProfile }) {
  const { userData } = user;
  if (!userData?.id)
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-red-500 font-medium">
        Profile not found
      </div>
    );
  const isFollowing = !!userData.followers.length;

  return (
    <div className="w-full min-h-screen pb-20 overflow-x-hidden">
      <div className="w-[80%] mx-auto px-4">
        <div

          className="bg-transparent w-[70%] backdrop-blur-2xl rounded-3xl p-6 md:p-10"
        >
          <div className="flex flex-col gap-8">
            <div className="info">
              <div className="profileImage flex gap-5 shrink-0 mb-5">
                {userData.image && (
                  <Image
                    src={cloudinaryTransform(
                      userData.image,
                      "150",
                    )}
                    width={100}
                    height={100}
                    alt="profile-pic"
                    className="object-contain rounded-full"
                  />
                )}
                <div className="usernameandname flex flex-col ">
                  <div className="name text-2xl font-serif">{userData.name}</div>
                  <div className="username text-sm mb-2 text-blue-200/50">@{userData.username}</div>
                  <button className={`p-1 ${isFollowing ? "text-white/30 border-2 border-white/30 bg-transparent" : "bg-blue-100/90 text-black font-sans font-semibold"} cursor-pointer transition-all duration-300 h-fit rounded-sm px-6`}>{!!userData.followers.length ? "Following" : "Follow"}</button>
                </div>
              </div>
              <div className="otherDetails flex flex-col gap-2 w-full">
                <div className="bioAndPortfolioLink flex flex-col gap-1">
                  {userData.bio && (
                    <div className="bio text-sm wrap-break-word">{userData.bio}</div>
                  )}
                  {userData.portfolio && (
                    <Link href={userData.portfolio} className="portfolioLink">Portfolio</Link>
                  )}
                  {userData.location && (
                    <p className="text-sm text-muted-foreground"><MapPin size={15} className="inline mr-2"/>{userData.location}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="stats flex gap-10">
              <div className="posts text-blue-100/60">{userData._count.artPosts} <span className="font-sans text-sm">Posts</span></div>
              <div className="followers text-blue-100/60">{userData._count.followers} <span>Followers</span></div>
              <div className="followings text-blue-100/60">{userData._count.following} <span>Followings</span></div>
            </div>
          </div>
        </div>

        <Tabs userId={userData.id} />

      </div>
    </div>
  );
}


