import { useState, useRef, useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { Card } from "./ui/card";
import { isValidScreenshotFormat, createFileWithPreview } from "@/lib/validators";
import { UploadAreaProps, FileWithPreview } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function UploadArea({ onFileChange, isProcessing }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragging(true);
  }, [isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing && !isDragging) setIsDragging(true);
  }, [isProcessing, isDragging]);

  const processFile = useCallback(async (file: File) => {
    if (!isValidScreenshotFormat(file)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PNG or JPG file",
        variant: "destructive"
      });
      return;
    }

    try {
      const fileWithPreview = await createFileWithPreview(file);
      onFileChange(fileWithPreview);
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      });
    }
  }, [onFileChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isProcessing) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [isProcessing, processFile]);

  const handleUploadClick = useCallback(() => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isProcessing]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  return (
    <Card 
      onClick={handleUploadClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`p-8 border-2 border-dashed border-gray-300 rounded-lg m-6 transition-all duration-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 ${
        isDragging ? "border-blue-500 bg-blue-50" : ""
      } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".png,.jpg,.jpeg"
        onChange={handleFileChange}
        disabled={isProcessing}
      />
      
      <div className="w-16 h-16 mb-4 text-blue-500">
        <UploadCloud className="w-16 h-16" />
      </div>

      <h3 className="text-lg font-medium text-gray-700">
        Drag and drop your screenshot here
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">or click to browse</p>
      <p className="text-xs text-gray-400">Supported formats: PNG, JPG</p>
    </Card>
  );
}
