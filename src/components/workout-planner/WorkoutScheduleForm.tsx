
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Dumbbell } from 'lucide-react';

import type { GenerateWorkoutScheduleOutput } from '@/ai/flows/generate-workout-schedule-types';
import { workoutScheduleFormSchema, type WorkoutScheduleFormValues, fitnessGoals, strengthLevels, workoutLocations, daysAvailable } from './schemas';
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
      goal: undefined,
      strengthLevel: 'intermediate',
      location: undefined,
      gender: undefined,
      daysAvailable: '4',
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
        description: "Your personalized weekly workout plan is ready.",
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
          Tell us about your goals, and we'll generate a personalized weekly workout schedule for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="goal"
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
                            {goal}
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workout Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your workout location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workoutLocations.map(location => (
                            <SelectItem key={location} value={location} className="capitalize">
                              {location}
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
                name="strengthLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strength Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your current strength level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {strengthLevels.map(level => (
                          <SelectItem key={level} value={level} className="capitalize">
                            {level}
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
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                     <FormControl>
                       <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4 pt-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="daysAvailable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days Available for Workout (per week)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select how many days you can train" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {daysAvailable.map(day => (
                        <SelectItem key={day} value={day}>
                          {`${day} days`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
