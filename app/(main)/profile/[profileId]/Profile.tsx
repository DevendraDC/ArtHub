"use server"


import { UserProfile } from "@/src/data/dal/User/queries";
import { cloudinaryTransform } from "@/src/utils/cloudinaryTransform";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import Tabs from "./_components/Tabs";



export default function Profile({ user }: { user: UserProfile }) {
  const { userData } = user;
  if (!userData?.id)
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-red-500 font-medium">
        Profile not found
      </div>
    );
  const isFollowing = !!userData.profile?.followers.length;

  return (
    <div className="w-full min-h-screen pb-20 overflow-x-hidden">
      <div className="w-[60%] mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 md:p-10"
        >
          <div className="flex flex-col gap-8">
            <div className="info flex gap-8">
              <div className="profileImage shrink-0">
                {userData.image && (
                  <Image
                    src={cloudinaryTransform(
                      userData.image,
                      "f_auto,q_auto,w_300,c_limit",
                    )}
                    width={140}
                    height={100}
                    alt="profile-pic"
                    className="object-contain rounded-full"
                  />
                )}
              </div>
              <div className="otherDetails flex flex-col gap-1 w-full">
                <div className="userInfoAndFunctions flex justify-between">
                  <div className="usernameandname flex flex-col ">
                    <div className="name text-2xl font-serif">{userData.name}</div>
                    <div className="username text-sm text-blue-200/50">{userData.username}</div>
                  </div>
                  <div className="functions flex gap-10 items-center">
                    <button className={`p-1 ${isFollowing ? "text-white/30 border-2 border-white/30 bg-transparent" : "bg-blue-100/90 text-black font-sans font-semibold"} cursor-pointer hover:-translate-y-1 transition-all duration-300 h-fit rounded-lg px-10`}>{!!userData.profile?.followers.length ? "Following" : "Follow"}</button>
                    <Link href={"/create-post"} className="bg-blue-700 font-sans h-fit p-1 rounded-lg px-2">Create Post</Link>
                  </div>
                </div>
                <div className="bioAndPortfolioLink flex flex-col gap-1">
                  {userData.profile?.bio && (
                    <div className="bio">{userData.profile.bio}</div>
                  )}
                  {userData.profile?.portfolio && (
                    <Link href={userData.profile.portfolio} className="portfolioLink">Portfolio</Link>
                  )}
                </div>
              </div>
            </div>
            <div className="stats flex gap-10">
              <div className="posts text-blue-100/60">{userData.profile?._count.artPosts} <span className="font-sans text-sm">Posts</span></div>
              <div className="followers text-blue-100/60">{userData.profile?._count.followers} <span>Followers</span></div>
              <div className="followings text-blue-100/60">{userData.profile?._count.following} <span>Followings</span></div>
            </div>
          </div>
        </motion.div>

        <Tabs userId={userData.id} />

      </div>
    </div>
  );
}


