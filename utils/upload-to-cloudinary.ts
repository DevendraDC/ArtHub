"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadImage(image: File) {
  const imageBuffer = await image.arrayBuffer();
  const base64 = Buffer.from(imageBuffer).toString("base64");
  const imageUri = `data:${image.type};base64,${base64}`;
  const result = await cloudinary.uploader.upload(imageUri);

  return result;
}
