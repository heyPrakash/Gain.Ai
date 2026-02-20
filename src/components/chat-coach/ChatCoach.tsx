
"use client";

import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, User, Sparkles, Loader2, ArrowUp } from 'lucide-react';

import { handleAiChatCoachAction } from '@/lib/actions';
import type { AiChatCoachInput } from '@/ai/flows/ai-chat-coach-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getActionErrorMessage } from '@/lib/action-errors';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
    "How can I improve my deadlift form?",
    "Give me a quick 15-minute home workout.",
    "What are some healthy post-workout snacks?",
];

export default function ChatCoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (chatInput: AiChatCoachInput) => handleAiChatCoachAction(chatInput),
    onSuccess: (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: String(Date.now()), role: 'assistant', content: data.response },
      ]);
    },
    onError: (error) => {
      const errorMessage = getActionErrorMessage(
        error,
        'The AI coach is currently unavailable. Please try again later.'
      );
      toast({
        title: "AI Coach Error",
        description: errorMessage,
        variant: "destructive",
      });
      // Remove the optimistic user message if the API call fails
      setMessages(prev => prev.slice(0, -1));
    },
  });

  const handleSendMessage = (messageContent: string) => {
    if (!messageContent.trim()) return;

    const newUserMessage: Message = { id: String(Date.now()), role: 'user', content: messageContent };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const chatHistoryForAI = [...messages, newUserMessage].map(msg => ({ role: msg.role, content: msg.content }));
    
    mutation.mutate({ message: messageContent, chatHistory: chatHistoryForAI });
    setInput('');
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(input);
  };
  
  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    // Automatically send the message
    handleSendMessage(prompt);
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div data-page="chat" className="flex flex-col h-full w-full">
      <div className="flex-1 flex flex-col items-center overflow-hidden">
        <ScrollArea className="flex-1 w-full max-w-3xl p-4" ref={scrollAreaRef}>
             <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-sm shadow-sm",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none" 
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {mutation.isPending && (
              <div className="flex items-end gap-3 justify-start">
                 <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                <div className="max-w-[75%] rounded-2xl p-3 text-sm shadow-sm bg-muted text-muted-foreground rounded-bl-none">
                  <Loader2 className="h-4 w-4 animate-spin inline-block" /> Typing...
                </div>
              </div>
            )}
             {messages.length === 0 && !mutation.isPending && (
                <div className="text-center text-muted-foreground pt-8 sm:pt-16">
                    <Sparkles className="mx-auto h-12 w-12 text-primary/30" />
                    <h3 className="text-lg font-semibold mt-4">Ask me anything about fitness!</h3>
                    <p className="text-sm sm:text-base">I can help you with workout routines, nutrition advice, and more.</p>
                </div>
             )}
          </div>
        </ScrollArea>
      </div>
        <div className="p-4 bg-background/50 backdrop-blur-sm w-full max-w-3xl mx-auto">
             {messages.length === 0 && !mutation.isPending && (
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                     {suggestedPrompts.map((prompt, i) => (
                         <Button
                            key={i}
                            variant="outline"
                            className="text-left h-auto py-2 text-sm sm:text-base"
                            onClick={() => handlePromptClick(prompt)}
                         >
                            {prompt}
                         </Button>
                     ))}
                 </div>
             )}
             <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 relative">
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 rounded-full pr-12 h-12"
                    disabled={mutation.isPending}
                />
                <Button 
                    type="submit" 
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-9 h-9"
                    disabled={mutation.isPending || !input.trim()}>
                    {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                    <span className="sr-only">Send message</span>
                </Button>
            </form>
        </div>
    </div>
  );
}
