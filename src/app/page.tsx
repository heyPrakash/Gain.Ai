
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeartPulse, Dumbbell, MessageSquareHeart, BrainCircuit, Info, UserCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="px-2 sm:px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <BrainCircuit className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Welcome to Gain!</CardTitle>
          <CardDescription className="text-lg md:text-xl text-muted-foreground pt-2">
            Unlock your peak fitness with AI-driven diet and workout plans, plus 24/7 coaching.
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

          <Separator className="my-8" />

          <div className="text-left space-y-4 px-2 md:px-6">
            <h3 className="text-2xl font-semibold text-primary flex items-center gap-2">
              <Info className="w-6 h-6" />
              About Gain
            </h3>
            <p className="text-md text-foreground leading-relaxed">
              Gain is the first AI-powered product developed by Anthos, an AI startup founded by Prakash Jadhav. Designed to transform how people approach fitness and nutrition, Gain is your intelligent fitness partner — available 24/7, fully personalized, and always evolving.  With the help of artificial intelligence, Gain delivers customized diet plans, workout routines, and virtual coaching based on your body type, fitness goals, and preferences. Whether you're aiming to lose weight, gain muscle, or simply maintain a healthier lifestyle, Gain adapts to your needs — making your fitness journey smarter, simpler, and more effective.
            </p>
          </div>

          <Separator className="my-8" />

          <div className="text-left space-y-3 px-2 md:px-6">
            <h3 className="text-2xl font-semibold text-primary flex items-center gap-2">
              <UserCircle className="w-6 h-6" />
              Developed By
            </h3>
            <p className="text-md text-foreground">
              Gain is proudly developed by <strong className="text-primary">Prakash Jadhav</strong>.
            </p>
            <p className="text-md text-foreground">
              Prakash Jadhav is the founder of Anthos, an AI startup on a mission to simplify and enhance everyday life through intelligent software. With a strong passion for technology, fitness, and problem-solving, Prakash built Gain as the first product under the Anthos brand — combining the power of artificial intelligence with real-world health and wellness needs.
            </p>
          </div>
           <p className="text-sm text-muted-foreground pt-8">
            Let Gain guide you on your journey to a healthier, stronger you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
