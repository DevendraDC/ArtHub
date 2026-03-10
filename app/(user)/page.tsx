"use server"

import { getPosts } from "@/dal/posts";
import { getSession } from "@/utils/getSession";
import { redirect } from "next/navigation";
import Image from "next/image";


export default async function Home() {
  const userSession = await getSession(); 
  if(!userSession){
    redirect("/login")
  }
  if(!userSession.user.name){
    redirect("/settings")
  }
  const posts = await getPosts();
  return (
    <div className="bg-(--bg) flex justify-center">
      <div className="w-[70%] flex flex-wrap p-10">
        {posts && (
          posts.map(post => (
            <div key={post.id} className="w-100 h-80 bg-(--surface2) rounded-lg overflow-hidden">
              <Image src={post.artImages[0]} alt="" width={80} height={80} className="w-full h-[60%] object-cover" />
              <div>
                <Image src={post.user.} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}