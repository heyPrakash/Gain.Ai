
"use client";

import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Upload, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

import type { AnalyzeFoodImageOutput } from '@/ai/flows/analyze-food-image-types';
import { handleAnalyzeFoodImageAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FoodImageFormProps {
  onAnalysisComplete: Dispatch<SetStateAction<AnalyzeFoodImageOutput | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function FoodImageForm({ onAnalysisComplete, setIsLoading, setError }: FoodImageFormProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: handleAnalyzeFoodImageAction,
    onMutate: () => {
      setIsLoading(true);
      setError(null);
      setFileError(null);
      onAnalysisComplete(null);
    },
    onSuccess: (data) => {
      if (data.foodItems.length === 0) {
         setError("The AI could not identify any food items in the image. Please try a clearer photo or a different meal.");
         toast({
            title: "Analysis Incomplete",
            description: "No food items were identified. Try another image.",
            variant: "destructive",
         });
      } else {
        onAnalysisComplete(data);
        toast({
            title: "Analysis Complete!",
            description: "Your meal's nutritional information is ready.",
            variant: "default",
        });
      }
    },
    onError: (error) => {
      setError(error.message || "An unexpected error occurred during analysis.");
      toast({
        title: "Error Analyzing Image",
        description: error.message || "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File is too large. Please select a file smaller than ${MAX_FILE_SIZE_MB}MB.`);
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
       if (!file.type.startsWith('image/')) {
        setFileError('Invalid file type. Please select an image (JPEG, PNG, WEBP).');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setFileError(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  async function onSubmit() {
    if (!selectedFile) {
        setFileError("Please select an image file first.");
        return;
    }
    const photoDataUri = await fileToDataUri(selectedFile);
    mutation.mutate({ photoDataUri });
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Upload className="text-primary" />
          Upload Your Meal Photo
        </CardTitle>
        <CardDescription>
          Select an image from your device to get started. Max file size: {MAX_FILE_SIZE_MB}MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <div 
                className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <div className="relative w-full h-full">
                        <Image src={previewUrl} alt="Selected meal" layout="fill" objectFit="contain" className="rounded-md"/>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 z-10"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                            aria-label="Remove image"
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ) : (
                    <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12"/>
                        <p>Click to browse or drag & drop</p>
                    </div>
                )}
            </div>

             <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                disabled={mutation.isPending}
            />
        </div>
        
        {fileError && (
             <Alert variant="destructive">
              <AlertTitle>File Error</AlertTitle>
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
        )}

        <Button onClick={onSubmit} disabled={mutation.isPending || !selectedFile} className="w-full">
            {mutation.isPending ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Image...
            </>
            ) : (
            "Analyze My Meal"
            )}
        </Button>
      </CardContent>
    </Card>
  );
}
