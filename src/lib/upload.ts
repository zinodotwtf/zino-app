import { toast } from 'sonner';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export async function uploadImage(file: File): Promise<string | null> {
  if (!IMGBB_API_KEY) {
    toast.error('Image upload is not configured');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
    return null;
  }
}
