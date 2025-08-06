
"use client";

import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Upload, Image as ImageIcon, X, Camera as CameraIcon, CircleDot, Video, VideoOff } from 'lucide-react';
import Image from 'next/image';

import type { AnalyzeFoodImageOutput } from '@/ai/flows/analyze-food-image-types';
import { handleAnalyzeFoodImageAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

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

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


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

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    const getCameraPermission = async () => {
      if (isCameraOpen) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setHasCameraPermission(false);
            console.error('Camera API not supported in this browser.');
            toast({ variant: 'destructive', title: 'Camera Not Supported', description: 'Your browser does not support camera access.' });
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setHasCameraPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
                variant: 'destructive',
                title: 'Camera Access Denied',
                description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
        }
      } else {
        stopCameraStream();
      }
    };
    getCameraPermission();
    
    return () => {
        stopCameraStream();
    };
  }, [isCameraOpen, toast]);


  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error("Invalid data URL");
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        const capturedFile = dataURLtoFile(dataUri, `capture-${Date.now()}.jpg`);
        
        setSelectedFile(capturedFile);
        setPreviewUrl(dataUri);
        setFileError(null);
        setIsCameraOpen(false); // Close dialog on capture
      }
    }
  };

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
          <ImageIcon className="text-primary" />
          Analyze Your Meal
        </CardTitle>
        <CardDescription>
          Upload a photo or take a picture of your meal to get a nutritional breakdown. Max file size: {MAX_FILE_SIZE_MB}MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
            className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground transition-colors relative"
        >
            {previewUrl ? (
                <>
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
                </>
            ) : (
                <div className="text-center p-4">
                    <ImageIcon className="mx-auto h-12 w-12 text-primary/50"/>
                    <p>Your selected image will appear here</p>
                </div>
            )}
        </div>
        
        {fileError && (
             <Alert variant="destructive">
              <AlertTitle>File Error</AlertTitle>
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
        )}
        
        <canvas ref={canvasRef} className="hidden"></canvas>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
         <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full sm:w-auto" disabled={mutation.isPending}>
            <Upload className="mr-2" />
            Upload Photo
         </Button>
         <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto" disabled={mutation.isPending}>
                  <CameraIcon className="mr-2" />
                  Take Photo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                 <DialogHeader>
                    <DialogTitle>Take a Photo</DialogTitle>
                    <DialogDescription>
                        Center your meal in the frame and capture a clear image.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative aspect-video bg-black rounded-md overflow-hidden mt-4">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
                            <VideoOff className="w-12 h-12 mb-4" />
                            <h3 className="text-xl font-semibold">Camera Access Denied</h3>
                            <p className="text-center text-sm">Please allow camera access in your browser's settings to use this feature.</p>
                        </div>
                    )}
                    {hasCameraPermission === null && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleCapture} disabled={!hasCameraPermission || mutation.isPending}>
                        <CircleDot className="mr-2"/>
                        Capture
                    </Button>
                </DialogFooter>
            </DialogContent>
         </Dialog>

         <Button onClick={onSubmit} disabled={mutation.isPending || !selectedFile} className="w-full sm:flex-1">
            {mutation.isPending ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
            </>
            ) : (
            "Analyze Meal"
            )}
        </Button>
        <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            disabled={mutation.isPending}
        />
      </CardFooter>
    </Card>
  );
}
