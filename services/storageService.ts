import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { compressImage } from "@/utils/imageUtils";

/**
 * Uploads a user avatar to Firebase Storage.
 * Compresses the image before upload.
 * Returns the download URL.
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
    try {
        const compressedFile = await compressImage(file);
        const storageRef = ref(storage, `avatars/${userId}/${compressedFile.name}`);
        await uploadBytes(storageRef, compressedFile);
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
}
