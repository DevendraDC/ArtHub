
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

async function getFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}


export async function uploadImage(image: File) {
  const formData = new FormData();

  formData.append("file", image);
  formData.append(
    "upload_preset",
    presetName!
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json();
}

export async function uploadMultipleImages(images: File[]) {
  try {
    const uploaded = await Promise.all(
      images.map((img) => uploadImage(img))
    );

    return {
      success: true,
      data: uploaded,
    };
  } catch (e) {
    console.error(e);

    return {
      success: false,
      data: null,
    };
  }
}
