"use client";

import FollowList from "@/src/components/FollowList";
import ProfilePostsGrid from "@/src/components/Navbar/UIComponent";
import { getProfileData, ProfileData } from "@/src/data/dal/user-queries";
import { UserProfile } from "@/src/data/dal/User/queries";
import { cloudinaryTransform } from "@/src/utils/cloudinaryTransform";
import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  Edit,
  MapPin,
  Link as LinkIcon,
  Palette,
  Image as ImageIcon,
  Users,
  UserPlus,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function groupOptions(id: number, userId: string) {
  return queryOptions({
    queryKey: ["ProfilePage", id, userId],
    queryFn: async () => await getProfileData(id, userId),
    staleTime: 10 * 60 * 1000,
  });
}

const TABS = [
  { label: "Posts", icon: ImageIcon },
  { label: "Saved", icon: Palette },
  { label: "Followers", icon: Users },
  { label: "Following", icon: UserPlus },
];

export default function Profile({ user }: { user: UserProfile }) {
  const { userData } = user;
  if (!userData?.id)
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-red-500 font-medium">
        Profile not found
      </div>
    );
  const isFollowing = !!userData.profile?.followers.length;
  const [selectedTab, setSelectedTab] = useState(0);
  const { isPending, isError, data, error } = useQuery(
    groupOptions(selectedTab, userData.id),
  );

  return (
    <div className="w-full min-h-screen pb-20 overflow-x-hidden">
      <div className="w-[60%] mx-auto px-4">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 md:p-10"
        >
          {/* <div className="flex flex-row gap-6 items-start">

            <div className="relative group shrink-0">
              <div className="relative w-32 h-32 rounded-full border-4 border-background overflow-hidden bg-background">
                {userData.image && (
                  <Image
                    src={cloudinaryTransform(
                      userData.image,
                      "f_auto,q_auto,w_300,c_limit",
                    )}
                    alt={userData.name ?? "Profile"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-5 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl text-foreground font-sans">
                    {userData.name}
                  </h1>
                  <p className="text-lg text-amber-500 dark:text-amber-400 font-medium">
                    @{userData.username}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link href="/create-post">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-5 rounded-full shadow-lg shadow-amber-500/30 transition-colors"
                    >
                      Create Post
                    </motion.button>
                  </Link>
                  <Link href="/settings">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-2 px-4 rounded-full transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </motion.button>
                  </Link>
                </div>
              </div>

  
              <div className="space-y-4">
                {userData.profile?.bio ? (
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl font-sans">
                    {userData.profile.bio}
                  </p>
                ) : (
                  <p className="text-muted-foreground/50 text-sm italic font-sans">
                    No bio provided yet.
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
                  {userData.profile?.location && (
                    <div className="flex items-center gap-1.5 bg-background/50 py-1.5 px-3 rounded-full border border-border">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span>{userData.profile.location}</span>
                    </div>
                  )}
                  {userData.profile?.portfolio && (
                    <a
                      href={
                        userData.profile.portfolio.startsWith("http")
                          ? userData.profile.portfolio
                          : `https://${userData.profile.portfolio}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-background/50 hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-amber-500 transition-colors py-1.5 px-3 rounded-full border border-border"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>
                        {userData.profile.portfolio.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                  )}
                </div>
              </div>


            </div>
            <div className="flex gap-8 pt-4 border-t border-border/50">
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-serif text-foreground">
                  {userData.profile?._count?.artPosts || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Posts
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-serif text-foreground">
                  {userData.profile?._count?.followers || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Followers
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-serif text-foreground">
                  {userData.profile?._count?.following || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Following
                </span>
              </div>
            </div>
          </div> */}
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

        {/* Content Tabs */}
        <div className="mt-12 w-full">
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
            {TABS.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = selectedTab === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedTab(i)}
                  className={`
                    relative flex items-center gap-2 py-3 px-6 rounded-full text-sm font-semibold transition-all
                    ${isActive ? "text-blue-500" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-amber-500/10 border border-amber-500/30 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8 min-h-100"
            >
              {isPending ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <p className="text-sm font-medium animate-pulse">
                    Loading {TABS[selectedTab].label}...
                  </p>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-64 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
                  Failed to load data. Please try again later.
                </div>
              ) : data ? (
                <ProfileTabContent data={data} />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProfileTabContent({ data }: { data: ProfileData }) {
  if (!data) return null;
  switch (data.type) {
    case "posts":
    case "saved":
      if (!data.data || data.data.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-secondary/20 rounded-3xl border border-border/50 border-dashed">
            <Palette className="w-12 h-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">
              No {data.type} yet
            </h3>
            <p className="text-sm mt-1">
              When you create or save posts, they'll appear here.
            </p>
          </div>
        );
      }
      return <ProfilePostsGrid posts={data.data} />;
    case "followers":
      if (!data.data || data.data.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-secondary/20 rounded-3xl border border-border/50 border-dashed">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">
              No followers yet
            </h3>
          </div>
        );
      }
      return (
        <FollowList
          users={data.data.map((f: any) => f.follower)}
          emptyMessage="No followers yet"
        />
      );
    case "following":
      if (!data.data || data.data.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-secondary/20 rounded-3xl border border-border/50 border-dashed">
            <UserPlus className="w-12 h-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">
              Not following anyone
            </h3>
          </div>
        );
      }
      return (
        <FollowList
          users={data.data.map((f: any) => f.following)}
          emptyMessage="Not following anyone yet"
        />
      );
    default:
      return null;
  }
}
