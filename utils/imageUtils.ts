import imageCompression from "browser-image-compression";

export const compressImage = async (file: File): Promise<File> => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: "image/webp",
    };

    try {
        const compressedFile = await imageCompression(file, options);
        const newFileName = file.name.replace(/\.[^.]+$/, "") + ".webp";
        return new File([compressedFile], newFileName, { type: "image/webp" });
    } catch (error) {
        console.error("Image compression error:", error);
        throw error;
    }
};
