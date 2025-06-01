import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeartPulse, Dumbbell, MessageSquareHeart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-2 sm:px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Welcome to Cortex Fit!</CardTitle>
          <CardDescription className="text-lg md:text-xl text-muted-foreground pt-2">
            Your personalized AI fitness companion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-md text-foreground">
            Navigate using the sidebar or the quick links below to access our powerful AI-driven tools:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <Button asChild variant="outline" size="lg" className="h-auto py-4 flex flex-col items-center justify-center gap-2 group hover:bg-primary/5 hover:border-primary transition-all duration-200">
              <Link href="/diet-planner" className="flex flex-col items-center gap-2">
                <HeartPulse className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-md font-medium">Diet Planner</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto py-4 flex flex-col items-center justify-center gap-2 group hover:bg-primary/5 hover:border-primary transition-all duration-200">
              <Link href="/workout-planner" className="flex flex-col items-center gap-2">
                <Dumbbell className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-md font-medium">Workout Planner</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto py-4 flex flex-col items-center justify-center gap-2 group hover:bg-primary/5 hover:border-primary transition-all duration-200">
              <Link href="/ai-coach" className="flex flex-col items-center gap-2">
                <MessageSquareHeart className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-md font-medium">AI Coach</span>
              </Link>
            </Button>
          </div>
           <p className="text-sm text-muted-foreground pt-4">
            Let Cortex Fit guide you on your journey to a healthier, stronger you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
