
"use client";

import { useState } from 'react';
import type { AnalyzeFoodImageOutput } from '@/ai/flows/analyze-food-image-types';
import FoodImageForm from '@/components/food-analyzer/FoodImageForm';
import FoodAnalysisDisplay from '@/components/food-analyzer/FoodAnalysisDisplay';
import { Loader2, Camera } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FoodAnalyzerSection() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeFoodImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section id="food-analyzer" className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
          <Camera className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          Nutrition Snap AI
        </h2>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Snap a photo of your meal, and our AI will provide a detailed nutritional breakdown.
        </p>
      </div>
      
      <FoodImageForm
        onAnalysisComplete={setAnalysisResult}
        setIsLoading={setIsLoading}
        setError={setError}
      />

      {isLoading && (
        <div className="flex justify-center items-center space-x-2 text-lg text-primary mt-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Analyzing your meal... This may take a moment.</span>
        </div>
      )}

      {error && !isLoading && (
         <Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
          <AlertTitle>Error Analyzing Image</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && !isLoading && !error && (
        <FoodAnalysisDisplay analysisOutput={analysisResult} />
      )}
    </section>
  );
}
