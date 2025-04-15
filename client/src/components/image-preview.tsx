import { Card } from "./ui/card";
import { X } from "lucide-react";
import { ImagePreviewProps } from "@/lib/types";
import { formatFileSize } from "@/lib/validators";

export function ImagePreview({ file, isProcessing, onRemove }: ImagePreviewProps) {
  if (!file) return null;

  return (
    <div className="mx-6 mb-6 relative">
      <Card className="relative rounded-lg overflow-hidden border border-gray-200">
        <img
          src={file.preview}
          alt="Screenshot preview"
          className="w-full h-auto max-h-80 object-contain bg-gray-100"
        />
        <button
          onClick={onRemove}
          disabled={isProcessing}
          className={`absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Remove image"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </Card>
      
      {/* Filename display */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm text-gray-600 truncate max-w-xs">{file.name}</p>
        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-blue-600 font-medium">Analyzing screenshot...</p>
        </div>
      )}
    </div>
  );
}
