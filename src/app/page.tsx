
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeartPulse, Dumbbell, MessageSquareHeart, BrainCircuit, Info, UserCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import HowItWorksSection from '@/components/sections/HowItWorksSection';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center pt-12">
        <div className="inline-flex items-center justify-center mb-4">
          <BrainCircuit className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Welcome to Cortex Fit!</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
          Unlock your peak fitness with AI-driven diet and workout plans, plus 24/7 coaching.
        </p>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto">
            <Button asChild variant="outline" size="lg" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Link href="/diet-planner" className="flex flex-col items-center gap-2">
                <HeartPulse className="w-8 h-8 text-primary" />
                <span className="text-md font-medium">AI Diet Planner</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Link href="/workout-planner" className="flex flex-col items-center gap-2">
                <Dumbbell className="w-8 h-8 text-primary" />
                <span className="text-md font-medium">Workout Planner</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Link href="/ai-coach" className="flex flex-col items-center gap-2">
                <MessageSquareHeart className="w-8 h-8 text-primary" />
                <span className="text-md font-medium">AI Chat Coach</span>
              </Link>
            </Button>
          </div>
      </section>

      <HowItWorksSection />
      
    </div>
  );
}
