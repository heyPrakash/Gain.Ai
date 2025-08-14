
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleIcon } from '@/components/icons/GoogleIcon';


const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupForm() {
  const { signUpWithEmail, signInWithGoogle, loading, error } = useAuth();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    const success = await signUpWithEmail(values.email, values.password);
    if (!success) {
      toast({
        title: "Sign Up Failed",
        description: error || "Could not create an account. Please try again.",
        variant: "destructive",
      });
    }
  };
  
   const handleGoogleSignIn = async () => {
    const success = await signInWithGoogle();
    if (!success) {
      toast({
        title: "Google Sign-In Failed",
        description: error || "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">Create an Account</CardTitle>
          <CardDescription>Join Gain today to start your fitness journey</CardDescription>
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
                      <Input placeholder="name@example.com" {...field} />
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
           <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
             Google
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
