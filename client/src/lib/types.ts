import { GuidelineResult, ImageAnalysisResult } from "@shared/schema";

export interface FileWithPreview extends File {
  preview: string;
}

export interface UploadAreaProps {
  onFileChange: (file: FileWithPreview | null) => void;
  isProcessing: boolean;
}

export interface ImagePreviewProps {
  file: FileWithPreview | null;
  isProcessing: boolean;
  onRemove: () => void;
}

export interface ValidationResultsProps {
  results: ImageAnalysisResult | null;
  isVisible: boolean;
}

export interface ScreenshotValidatorProps {}
