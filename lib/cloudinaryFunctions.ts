const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

export const uploadImage = async (image: File) => {
  return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: image,
  }).then((res) => res.json());
};

export async function uploadMultipleImages(files: File[]) {
  try {
    const uploads = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", `${presetName}`);

      return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    });

    const results = await Promise.all(uploads);

    return { success: true, data: results };
  } catch (err) {
    return { success: false, data: null };
  }
}
