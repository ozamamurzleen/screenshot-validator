import { FileWithPreview } from "./types";

/**
 * Validates if a file is a valid screenshot format (PNG or JPG/JPEG)
 */
export function isValidScreenshotFormat(file: File): boolean {
  const acceptedTypes = ["image/png", "image/jpeg", "image/jpg"];
  return acceptedTypes.includes(file.type);
}

/**
 * Converts a file size in bytes to a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
}

/**
 * Converts a File object to a base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Creates a FileWithPreview object from a File
 */
export function createFileWithPreview(file: File): Promise<FileWithPreview> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fileWithPreview = file as FileWithPreview;
      fileWithPreview.preview = reader.result as string;
      resolve(fileWithPreview);
    };
    reader.onerror = (error) => reject(error);
  });
}
