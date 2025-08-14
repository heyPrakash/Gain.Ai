// src/components/auth/SignupForm.tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { GainAppIcon } from '@/components/icons/GainAppIcon';
import GoogleIcon from '@/components/icons/GoogleIcon';


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupForm() {
  const { signup, googleSignIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signup(values.email, values.password);
      toast({ title: "Account Created", description: "Welcome! You have been successfully signed up." });
      router.push('/');
    } catch (error: any) {
      console.error("Signup Error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
    const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
        await googleSignIn();
        toast({ title: "Account Created", description: "Welcome!" });
        router.push('/');
    } catch (error: any) {
        console.error("Google Sign-In Error:", error);
        toast({
            title: "Google Sign-In Failed",
            description: error.message || "Could not sign in with Google. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsGoogleLoading(false);
    }
  }


  return (
    <Card className="w-full max-w-sm sm:max-w-md shadow-xl">
        <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-bold text-primary mb-2">
                <GainAppIcon className="h-8 w-8" />
                <span>Gain</span>
            </Link>
            <CardTitle className="text-xl sm:text-2xl">Create an Account</CardTitle>
            <CardDescription className="text-sm sm:text-base">Join Gain today to start your fitness journey.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : <UserPlus />}
                Sign Up
                </Button>
            </form>
            </Form>
            <Separator className="my-4 sm:my-6" />
            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isGoogleLoading || isLoading}>
                {isGoogleLoading ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
                Sign up with Google
            </Button>
        </CardContent>
        <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
                Log In
            </Link>
            </p>
        </CardFooter>
    </Card>
  );
}
