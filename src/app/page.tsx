
import UserProfileSection from '@/components/sections/UserProfileSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ChatCoachSection from '@/components/sections/ChatCoachSection';
import WorkoutPlannerSection from '@/components/sections/WorkoutPlannerSection';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="container mx-auto px-2 sm:px-4">
      <UserProfileSection />
      <Separator className="my-8 md:my-16" />
      <WorkoutPlannerSection />
      <Separator className="my-8 md:my-16" />
      <HowItWorksSection />
      <Separator className="my-8 md:my-16" />
      <ChatCoachSection />
    </div>
  );
}
