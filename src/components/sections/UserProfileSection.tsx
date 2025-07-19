
"use client";

import { useState } from 'react';
import type { GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan';
import UserProfileForm from '@/components/diet-planner/UserProfileForm';
import DietPlanDisplay from '@/components/diet-planner/DietPlanDisplay';
import { Loader2, HeartPulse } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function UserProfileSection() {
  const [dietPlan, setDietPlan] = useState<GenerateDietPlanOutput | null>(null);
  const [isLoadingDietPlan, setIsLoadingDietPlan] = useState(false);
  const [dietPlanError, setDietPlanError] = useState<string | null>(null);

  return (
    <section id="diet-planner" className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
          <HeartPulse className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          Personalized AI Diet Planner
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter your details, and our AI will craft a diet plan tailored to your unique needs and goals.
        </p>
      </div>
      
      <UserProfileForm
        onPlanGenerated={setDietPlan}
        setIsLoading={setIsLoadingDietPlan}
        setError={setDietPlanError}
      />

      {isLoadingDietPlan && (
        <div className="flex justify-center items-center space-x-2 text-lg text-primary mt-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Generating your personalized diet plan...</span>
        </div>
      )}

      {dietPlanError && !isLoadingDietPlan && (
         <Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
          <AlertTitle>Error Generating Plan</AlertTitle>
          <AlertDescription>{dietPlanError}</AlertDescription>
        </Alert>
      )}

      {dietPlan && !isLoadingDietPlan && !dietPlanError && (
        <DietPlanDisplay dietPlanOutput={dietPlan} />
      )}
    </section>
  );
}

    