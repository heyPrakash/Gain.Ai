
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Cpu, UtensilsCrossed, FileText } from 'lucide-react';

const steps = [
  {
    icon: <ListChecks className="h-10 w-10 text-primary" />,
    title: "1. Share Your Details",
    description: "Fill out a simple form with your body stats (weight, height, age, gender), fitness goals, dietary preferences, and activity level."
  },
  {
    icon: <Cpu className="h-10 w-10 text-primary" />,
    title: "2. AI Analysis",
    description: "Our advanced AI processes your information, considering your unique needs and objectives to create a tailored nutritional strategy."
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "3. Receive Your Plan",
    description: "Get a personalized diet plan complete with meal suggestions, nutritional information, and portion guidance designed to help you succeed."
  }
];

export default function HowItWorks() {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">How Gain Works</CardTitle>
        <CardDescription className="text-lg">
          Achieve your fitness goals with a plan designed just for you in three simple steps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center p-4 bg-card rounded-lg ">
              <div className="mb-4 p-3 bg-primary/10 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
