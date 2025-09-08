
"use client";

import { useState } from 'react';
import type { AnalyzeBodyScanOutput } from '@/ai/flows/analyze-body-scan-types';
import BodyScanForm from '@/components/body-scanner/BodyScanForm';
import BodyScanAnalysisDisplay from '@/components/body-scanner/BodyScanAnalysisDisplay';
import { Loader2, Scan } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BodyScannerSection() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeBodyScanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section id="body-scanner" className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
          <Scan className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          AI Body Scanner
        </h2>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a full-body photo to get a detailed physique analysis and personalized recommendations.
        </p>
      </div>
      
      <BodyScanForm
        onAnalysisComplete={setAnalysisResult}
        setIsLoading={setIsLoading}
        setError={setError}
      />

      {isLoading && (
        <div className="flex justify-center items-center space-x-2 text-lg text-primary mt-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Analyzing your physique... This might take a moment.</span>
        </div>
      )}

      {error && !isLoading && (
         <Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
          <AlertTitle>Error Analyzing Photo</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && !isLoading && !error && (
        <BodyScanAnalysisDisplay analysisOutput={analysisResult} />
      )}
    </section>
  );
}
