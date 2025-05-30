
"use client";

import { useState } from 'react';
import type { GenerateWorkoutScheduleOutput } from '@/ai/flows/generate-workout-schedule';
import WorkoutScheduleForm from '@/components/workout-planner/WorkoutScheduleForm';
import WorkoutScheduleDisplay from '@/components/workout-planner/WorkoutScheduleDisplay';
import { Loader2, Dumbbell } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WorkoutPlannerSection() {
  const [workoutSchedule, setWorkoutSchedule] = useState<GenerateWorkoutScheduleOutput | null>(null);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  return (
    <section id="workout-planner" className="space-y-8 py-8 md:py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Dumbbell className="w-8 h-8 md:w-10 md:h-10" />
          AI Workout Schedule Generator
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Define your goals, and let our AI design a weekly workout plan just for you.
        </p>
      </div>
      
      <WorkoutScheduleForm
        onScheduleGenerated={setWorkoutSchedule}
        setIsLoading={setIsLoadingSchedule}
        setError={setScheduleError}
      />

      {isLoadingSchedule && (
        <div className="flex justify-center items-center space-x-2 text-lg text-primary mt-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Generating your personalized workout schedule...</span>
        </div>
      )}

      {scheduleError && !isLoadingSchedule && (
         <Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
          <AlertTitle>Error Generating Schedule</AlertTitle>
          <AlertDescription>{scheduleError}</AlertDescription>
        </Alert>
      )}

      {workoutSchedule && !isLoadingSchedule && !scheduleError && (
        <WorkoutScheduleDisplay scheduleOutput={workoutSchedule} />
      )}
    </section>
  );
}
