
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeartPulse, Dumbbell, MessageSquareHeart, BrainCircuit, Info, UserCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import HowItWorksSection from '@/components/sections/HowItWorksSection';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
          <Dumbbell className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to Gain!</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
          Your AI partner for achieving fitness goals through personalized diet and workout plans.
        </p>
      </section>

      <section>
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>Choose a feature to begin your personalized fitness journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button asChild variant="outline" size="lg" className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary transition-all duration-300">
                <Link href="/diet-planner" className="flex flex-col items-center gap-2">
                  <HeartPulse className="w-8 h-8 text-primary" />
                  <span className="text-md font-medium">AI Diet Planner</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary transition-all duration-300">
                <Link href="/workout-planner" className="flex flex-col items-center gap-2">
                  <Dumbbell className="w-8 h-8 text-primary" />
                  <span className="text-md font-medium">Workout Planner</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary transition-all duration-300">
                <Link href="/ai-coach" className="flex flex-col items-center gap-2">
                  <MessageSquareHeart className="w-8 h-8 text-primary" />
                  <span className="text-md font-medium">AI Chat Coach</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <Separator />

      <section>
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                    <UserCircle className="w-8 h-8 text-primary" />
                    About Gain
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-md text-foreground leading-relaxed">
                  Gain is the first AI-powered product developed by Anthora, an AI startup founded by Prakash Jadhav. Designed to transform how people approach fitness and nutrition, Gain is your intelligent fitness partner — available 24/7, fully personalized, and always evolving. With the help of artificial intelligence, Gain delivers customized diet plans, workout routines, and virtual coaching based on your body type, fitness goals, and preferences. Whether you're aiming to lose weight, gain muscle, or simply maintain a healthier lifestyle, Gain adapts to your needs — making your fitness journey smarter, simpler, and more effective.
                </p>
            </CardContent>
          </Card>
      </section>

      <Separator />

      <HowItWorksSection />
      
    </div>
  );
}
