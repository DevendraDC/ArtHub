const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

async function getFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const uploadImage = async (image: File) => {
  return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: image,
  }).then((res) => res.json());
};

export async function uploadMultipleImages(files: File[]) {
  try {
    const uploads = files.map(async (file) => {
      const hash = await getFileHash(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", `${presetName}`);
      formData.append("public_id", hash);

      return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => {
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        return res.json();
      });
    });

    const results = await Promise.all(uploads);

    return { success: true, data: results };
  } catch (err) {
    return { success: false, data: null };
  }
}
