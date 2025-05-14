import { Context } from "hono";

export async function uploadToCloudinary(
  file: File,
  folderName: string,
  c: Context
): Promise<string | null | undefined> {
  const CLOUD_NAME = c.env.CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = c.env.CLOUDINARY_PRESET;
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folderName);
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
