
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

          <Separator className="my-8" />

          <div className="text-left space-y-4 px-2 md:px-6">
            <h3 className="text-2xl font-semibold text-primary flex items-center gap-2">
              <Info className="w-6 h-6" />
              About Cortex Fit
            </h3>
            <p className="text-md text-foreground leading-relaxed">
              CortexFit is the first innovative release under Anthos, a digital health initiative by Cortex, a software company committed to building intelligent web applications and AI assistants that empower users. CortexFit is an all-in-one AI-powered fitness companion designed to help you achieve your health and wellness goals smarter and faster. Whether you're a beginner or a seasoned gym enthusiast, CortexFit offers personalized diet plans, workout routines, and 24/7 virtual coaching tailored to your body type, fitness level, and goals.
            </p>
            <p className="text-md text-foreground leading-relaxed">
              We believe that personalized support is key to sustainable fitness. Cortex Fit aims to make expert-level fitness advice accessible and adaptable to your unique needs, preferences, and lifestyle.
            </p>
          </div>

          <Separator className="my-8" />

          <div className="text-left space-y-3 px-2 md:px-6">
            <h3 className="text-2xl font-semibold text-primary flex items-center gap-2">
              <UserCircle className="w-6 h-6" />
              Developed By
            </h3>
            <p className="text-md text-foreground">
              Cortex Fit is proudly developed by <strong className="text-primary">Prakash Jadhav</strong>.
            </p>
            <p className="text-md text-foreground">
              Prakash is the developer of <strong className="text-primary">Anthos</strong>, a company passionate about harnessing the power of artificial intelligence to create impactful and user-centric solutions.
            </p>
          </div>
           <p className="text-sm text-muted-foreground pt-8">
            Let Cortex Fit guide you on your journey to a healthier, stronger you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
