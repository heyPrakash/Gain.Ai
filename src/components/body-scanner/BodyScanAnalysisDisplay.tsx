
"use client";

import type { AnalyzeBodyScanOutput } from '@/ai/flows/analyze-body-scan-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { List, CheckCircle, BarChart, Percent, Activity, Dumbbell, Utensils, Target, Info } from 'lucide-react';

interface BodyScanAnalysisDisplayProps {
  analysisOutput: AnalyzeBodyScanOutput;
}

const MetricDisplay = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number | React.ReactNode, unit?: string }) => (
    <div className="p-3 bg-muted rounded-lg shadow-sm text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
            {icon}
            <h4 className="text-sm font-semibold">{label}</h4>
        </div>
        <p className="text-xl font-bold">{value}{unit}</p>
    </div>
);


export default function BodyScanAnalysisDisplay({ analysisOutput }: BodyScanAnalysisDisplayProps) {
  const { 
    bodyShape, 
    estimatedBmi, 
    estimatedBodyFatPercentage, 
    muscleDefinition, 
    fitnessCategory, 
    physiqueAnalysis, 
    improvementPlan 
  } = analysisOutput;

  return (
    <Card className="mt-8 w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CheckCircle className="text-primary" />
          Physique Analysis Complete
        </CardTitle>
        <CardDescription>
          Here is your AI-generated physique analysis. Use this as a motivational guide on your fitness journey.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <MetricDisplay icon={<BarChart className="w-5 h-5 text-primary" />} label="Est. BMI" value={estimatedBmi.toFixed(1)} />
            <MetricDisplay icon={<Percent className="w-5 h-5 text-primary" />} label="Est. Body Fat" value={estimatedBodyFatPercentage.toFixed(1)} unit="%" />
            <MetricDisplay icon={<Activity className="w-5 h-5 text-primary" />} label="Muscle" value={<span className="capitalize">{muscleDefinition}</span>} />
            <MetricDisplay icon={<Target className="w-5 h-5 text-primary" />} label="Shape" value={bodyShape} />
        </div>

        <div className="p-4 bg-muted rounded-lg shadow-sm text-center">
            <h4 className="text-md font-semibold mb-1">Fitness Category</h4>
            <Badge variant="secondary" className="text-lg px-4 py-1">{fitnessCategory}</Badge>
        </div>

        <Alert variant="default" className="bg-primary/5 border-primary/20">
          <Dumbbell className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Physique Analysis</AlertTitle>
          <AlertDescription>
            {physiqueAnalysis}
          </AlertDescription>
        </Alert>

        <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-primary mb-2">
                <List className="w-5 h-5" />
                Your Improvement Plan
            </h3>
            <div className="space-y-2">
                {improvementPlan.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-card rounded-md shadow-sm">
                        {item.toLowerCase().includes('diet') || item.toLowerCase().includes('eat') || item.toLowerCase().includes('nutrition') || item.toLowerCase().includes('protein') ? 
                         <Utensils className="w-4 h-4 mt-1 text-primary/80 flex-shrink-0" /> : 
                         <Dumbbell className="w-4 h-4 mt-1 text-primary/80 flex-shrink-0" />
                        }
                        <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                ))}
            </div>
        </div>

      </CardContent>
       <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
        <Alert variant="default" className="w-full">
            <Info className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
                This analysis is an AI-powered estimate and not a medical diagnosis. For health concerns, please consult a healthcare professional.
            </AlertDescription>
         </Alert>
      </CardFooter>
    </Card>
  );
}
