
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Dumbbell } from 'lucide-react';

import type { GenerateWorkoutScheduleOutput } from '@/ai/flows/generate-workout-schedule-types';
import { workoutScheduleFormSchema, type WorkoutScheduleFormValues, bodyParts, fitnessLevels, workoutLocations } from './schemas';
import { handleGenerateWorkoutScheduleAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from '@/components/ui/input';
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
      bodyPart: undefined,
      timeAvailable: 30,
      fitnessLevel: 'intermediate',
      workoutLocation: undefined,
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
        title: "Workout Generated!",
        description: "Your personalized workout session is ready.",
        variant: "default",
      });
    },
    onError: (error) => {
      setError(error.message || "An unexpected error occurred.");
      toast({
        title: "Error Generating Workout",
        description: error.message || "Could not generate workout. Please try again.",
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
          Tell us what you want to train today, and we'll generate a targeted workout session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bodyPart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Part to Train</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a body part" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bodyParts.map(part => (
                            <SelectItem key={part} value={part} className="capitalize">
                              {part.charAt(0).toUpperCase() + part.slice(1)}
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
                  name="timeAvailable"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Time Available (minutes)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 45" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="fitnessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your current fitness level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fitnessLevels.map(level => (
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

            <Button type="submit" disabled={mutation.isPending} className="w-full md:w-auto">
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Workout...
                </>
              ) : (
                "Generate My Workout"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
