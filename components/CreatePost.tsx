"use client"


import { Upload, X } from "lucide-react";
import { sessionType } from "./profile/Settings";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function CreatePost({
    userSession,
}: {
    userSession: sessionType;
}) {
    const [tagInputVal, setTagInputVal] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const imagesUploadRef = useRef<HTMLInputElement>(null)
    const [description, setDescription] = useState("")
    return (
        <div className="w-full flex justify-center p-5 bg-[var(--bg)]">
            <div className="w-[55%] flex flex-col gap-7">
                <div>
                    <div className="text-sm flex gap-3"><span className="text-amber-400">Home</span><span className="text-white/60">&gt;</span><span className="text-[var(--text-subtle)]">createPost</span></div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-serif text-4xl">Create a new Post</div>
                    <div className="text-sm text-white/70">share your artwork with the community</div>
                </div>
                <div className="images flex bg-[var(--surface)] flex-col gap-5 border border-[var(--border)] p-6 rounded-xl cursor-pointer">
                    <div className="text-sm font-sans tracking-widest text-[var(--text-muted)]"><span className="text-amber-400">&middot; </span>IMAGES</div>
                    <div onClick={() => imagesUploadRef.current?.click()} className="flex flex-col items-center gap-1 bg-[var(--surface2)] border-[1.5px] border-dashed border-[var(--border-hover)] text-sm p-7 rounded-lg text-sm hover:bg-[var(--amber-glow)] hover:border-[var(--amber)] transition-all duration-300">
                        <input type="file" ref={imagesUploadRef} onChange={(e) => {
                            if (selectedImages.length > 10) {
                                toast("Cannot add more than 10 images");
                                return;
                            }
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setSelectedImages(prev => [...new Set([...prev, file])])
                        }} name="uploadImages" className="absolute -translate-x-999" id="" />
                        <Upload className="bg-[var(--amber-light)] text-[var(--amber)] border border-[var(--amber-mid)] rounded-lg p-3 w-10 h-10" />
                        <div>Upload your artworks</div>
                        <div className="text-sm text-white/40">Drag & drop or <span className="text-[var(--amber)]">click to browse</span> &middot; JPG, PNG, GIF up to 20MB</div>
                    </div>
                    <div className="text-xs text-[var(--text-subtle)]"><span className="text-amber-500">{selectedImages.length} </span>/ 10 images &middot; first image is the cover &middot; Click on an image to remove it</div>
                    {selectedImages.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {selectedImages.map((img, i) => (
                                <motion.div key={i} className="relative cursor-pointer" initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }} onClick={() => {
                                        setSelectedImages(prev => prev.filter(prevImg => prevImg !== img))
                                    }}>
                                    <img
                                        src={URL.createObjectURL(img)}

                                        className="w-50 h-50 rounded-lg object-cover"
                                    />
                                    {i === 0 && (
                                        <div className="bg-amber-600 rounded-sm p-1 px-2 font-bold text-xs absolute top-3 left-3">Cover</div>
                                    )}
                                </motion.div>

                            ))}
                        </div>
                    )}
                </div>
                <div className="details bg-[var(--surface)] flex flex-col gap-8 border border-[var(--border)] p-8 rounded-xl">
                    <div className="text-sm font-sans tracking-widest text-[var(--text-muted)]"><span className="text-amber-400">&middot; </span>DETAILS</div>
                    <div className="text-sm flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="description" className="flex justify-between font-sans text-[#c8bfb0]">Description<span className="text-xs text-[var(--text-subtle)]">{description.length} / 500</span></label>
                            <textarea name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onInput={(e) => {
                                    const el = e.currentTarget;
                                    el.style.height = "auto";
                                    el.style.height = `${el.scrollHeight}px`;
                                }} maxLength={500} placeholder="Tell the story behind this piece" className="border placeholder:text-[var(--text-subtle)] rounded-sm p-4 resize-none focus:outline-0 border-[var(--border)] bg-[var(--surface2)]" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="tags" className="font-sans text-[#c8bfb0]">Tags</label>
                            <input type="text" name="tags" id="tags" value={tagInputVal} onChange={e => {
                                const cur = e.target.value;
                                if (cur.endsWith(",")) {
                                    const curTag = cur.slice(0, -1);
                                    setTags(prev => [...new Set([...prev, curTag])])
                                    setTagInputVal("")
                                }
                                else setTagInputVal(cur)
                            }} placeholder="Type a tag and click on Add" className="border placeholder:text-[var(--text-subtle)] w-full rounded-sm p-4 pr-20 resize-none focus:outline-none border-[var(--border)] bg-[var(--surface2)]" />
                            <div className="text-xs text-[var(--text-subtle)]">
                                Enter comma to add a tag
                            </div>
                            {tags.length > 0 && (
                                <div className="flex gap-5">
                                    {tags.map((tag, idx) => (
                                        <div key={idx} className="bg-[var(--amber-light)] text-[var(--amber)] border border-[var(--amber-mid)] py-1 px-3 rounded-md relative">{tag} <X onClick={() => setTags(prev => prev.filter(cur => cur !== tag))} className="absolute w-5 h-5 p-1 font-bold text-black bg-white rounded-full -top-1 -left-2" /></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-7 bg-[var(--surface)] border border-[var(--border)] p-5 rounded-xl">
                    <button className="py-2 px-4 border border-[var(--border)] text-[var(--text-muted)] rounded-sm hover:border-[var(--border-hover)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors duration-300">Discard</button>
                    <button className="py-2 px-4 border bg-amber-400 font-sans font-semibold text-black w-full rounded-lg hover:bg-amber-300 hover:scale-102 transition-all duration-300">Publish Post</button>
                </div>
            </div>
        </div>
    )
}