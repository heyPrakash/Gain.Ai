
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Dumbbell } from 'lucide-react';

import type { GenerateWorkoutScheduleOutput } from '@/ai/flows/generate-workout-schedule-types';
import { workoutScheduleFormSchema, type WorkoutScheduleFormValues, fitnessGoals, experienceLevels, daysAvailableOptions, workoutLocations, genders } from './schemas';
import { handleGenerateWorkoutScheduleAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface WorkoutScheduleFormProps {
  onScheduleGenerated: Dispatch<SetStateAction<GenerateWorkoutScheduleOutput | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export default function WorkoutScheduleForm({ onScheduleGenerated, setIsLoading, setError }: WorkoutScheduleFormProps) {
  const { toast } = useToast();
  const form = useForm<WorkoutScheduleFormValues>({
    resolver: zodResolver(workoutScheduleFormSchema),
    defaultValues: {
      fitnessGoal: undefined,
      experienceLevel: undefined,
      daysAvailable: undefined,
      workoutLocation: undefined,
      gender: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: handleGenerateWorkoutScheduleAction,
    onMutate: () => {
      setIsLoading(true);
      setError(null);
      onScheduleGenerated(null);
    },
    onSuccess: (data) => {
      onScheduleGenerated(data);
      toast({
        title: "Workout Schedule Generated!",
        description: "Your personalized workout schedule is ready.",
        variant: "default",
      });
    },
    onError: (error) => {
      setError(error.message || "An unexpected error occurred.");
      toast({
        title: "Error Generating Schedule",
        description: error.message || "Could not generate workout schedule. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  function onSubmit(values: WorkoutScheduleFormValues) {
    mutation.mutate(values);
  }

  return (
    <Card id="workout-schedule-form-card" className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Dumbbell className="text-primary" />
          Your Workout Preferences
        </CardTitle>
        <CardDescription>
          Tell us about your goals and routine so we can generate a personalized workout schedule.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fitnessGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Fitness Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your main fitness goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fitnessGoals.map(goal => (
                        <SelectItem key={goal} value={goal} className="capitalize">
                          {goal.charAt(0).toUpperCase() + goal.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="workoutLocation"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Workout Location</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4 pt-2"
                    >
                      {workoutLocations.map(location => (
                        <FormItem key={location} className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={location} />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {location}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {experienceLevels.map(level => (
                        <SelectItem key={level} value={level} className="capitalize">
                           {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="daysAvailable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days Available for Workout (per week)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select how many days you can train" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {daysAvailableOptions.map(days => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} day{days > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1" 
                    >
                      {genders.map(gender => (
                        <FormItem key={gender} className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={gender} />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {gender}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending} className="w-full md:w-auto">
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Schedule...
                </>
              ) : (
                "Generate My Workout Schedule"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

