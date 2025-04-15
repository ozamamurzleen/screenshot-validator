import { useState, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { UploadArea } from "./upload-area";
import { ImagePreview } from "./image-preview";
import { ValidationResults } from "./validation-results";
import { FileWithPreview } from "@/lib/types";
import { fileToBase64 } from "@/lib/validators";
import { apiRequest } from "@/lib/queryClient";
import { ImageAnalysisResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function ScreenshotValidator() {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ImageAnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleFileChange = useCallback((newFile: FileWithPreview | null) => {
    setFile(newFile);
    setResults(null);
    setShowResults(false);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setFile(null);
    setResults(null);
    setShowResults(false);
  }, []);

  const handleTryAgain = useCallback(() => {
    setFile(null);
    setResults(null);
    setShowResults(false);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file || isProcessing) return;
    
    setIsProcessing(true);
    setShowResults(false);
    
    try {
      const base64 = await fileToBase64(file);
      
      const response = await apiRequest("POST", "/api/screenshots/analyze", {
        base64,
        filename: file.name,
        mimetype: file.type,
        size: file.size
      });
      
      const analysisResult = await response.json();
      setResults(analysisResult);
      setShowResults(true);
    } catch (error) {
      console.error("Error analyzing screenshot:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze screenshot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, toast]);

  return (
    <Card className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h1 className="text-xl font-semibold text-gray-800">Screenshot Validator</h1>
          <p className="text-gray-600 mt-1">Upload and validate your screenshot against our guidelines</p>
        </div>

        {!file && <UploadArea onFileChange={handleFileChange} isProcessing={isProcessing} />}
        
        {file && <ImagePreview file={file} isProcessing={isProcessing} onRemove={handleRemoveImage} />}
        
        <ValidationResults results={results} isVisible={showResults} />

        {/* Action buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          {showResults && (
            <Button
              variant="outline"
              onClick={handleTryAgain}
            >
              Try Again
            </Button>
          )}
          {file && !showResults && (
            <Button
              className="ml-auto"
              onClick={handleAnalyze}
              disabled={isProcessing || !file}
            >
              Analyze Screenshot
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
