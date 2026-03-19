"use server";

import cloudinary from "@/src/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function uploadImage(image: File) {
  const imageBuffer = await image.arrayBuffer();
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type : "auto",
        quality : "auto",
        fetch_format : "auto",
        eager_async : true
      },
      (error, result) => {
        if(error) reject(error);
        else resolve(result!);
      }
    );
    uploadStream.end(Buffer.from(imageBuffer));
  });
}


export async function uploadMultipleImages(images : File[]) {
  return Promise.all(images.map(image => uploadImage(image)));
}


