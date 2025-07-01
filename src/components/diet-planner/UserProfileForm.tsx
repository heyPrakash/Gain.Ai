
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Leaf } from 'lucide-react';

import type { GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan-types';
import { userProfileSchema, type UserProfileFormValues, activityLevels, planDetailLevels } from './schemas';
import { handleGenerateDietPlanAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface UserProfileFormProps {
  onPlanGenerated: Dispatch<SetStateAction<GenerateDietPlanOutput | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export default function UserProfileForm({ onPlanGenerated, setIsLoading, setError }: UserProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      weightKg: '',
      heightFt: '',
      age: '',
      gender: undefined,
      fitnessGoals: "",
      dietaryPreferences: "",
      activityLevel: undefined,
      planDetailLevel: "detailed",
    },
  });

  const mutation = useMutation({
    mutationFn: handleGenerateDietPlanAction,
    onMutate: () => {
      setIsLoading(true);
      setError(null);
      onPlanGenerated(null);
    },
    onSuccess: (data) => {
      onPlanGenerated(data);
      toast({
        title: "Diet Plan Generated!",
        description: "Your personalized diet plan is ready.",
        variant: "default",
      });
    },
    onError: (error) => {
      setError(error.message || "An unexpected error occurred.");
      toast({
        title: "Error Generating Plan",
        description: error.message || "Could not generate diet plan. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  function onSubmit(values: UserProfileFormValues) {
    mutation.mutate(values);
  }

  return (
    <Card id="user-profile-form-card" className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Leaf className="text-primary" />
          Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="weightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 70" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heightFt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5.8" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 30" {...field} value={field.value ?? ''} />
                    </FormControl>
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
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activityLevels.map(level => (
                        <SelectItem key={level} value={level} className="capitalize">
                          {level.replace(/_/g, ' ')}
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
              name="fitnessGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Lose 5kg, build muscle, run a 5k"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly describe what you want to achieve.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietaryPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preferences & Restrictions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Vegetarian, gluten-free, allergic to nuts"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    List any preferences, allergies, or restrictions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planDetailLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Plan Detail Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4 pt-2"
                    >
                      {planDetailLevels.map(level => (
                         <FormItem key={level} className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={level} />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                   <FormDescription>
                    Choose "Summary" for a brief overview, or "Detailed" for a comprehensive plan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button type="submit" disabled={mutation.isPending} className="w-full md:w-auto">
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                "Generate My Diet Plan"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
