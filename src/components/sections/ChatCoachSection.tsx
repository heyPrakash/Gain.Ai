
"use client";

import ChatCoach from '@/components/chat-coach/ChatCoach';

export default function ChatCoachSection() {
  return (
    <section id="ai-chat-coach" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold">24/7 AI Fitness Coach</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions? Need motivation? Chat with your AI coach anytime for guidance and support.
        </p>
      </div>
      <ChatCoach />
    </section>
  );
}
