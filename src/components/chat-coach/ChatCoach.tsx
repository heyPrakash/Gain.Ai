
"use client";

import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, User, Sparkles, Loader2, MessageSquareHeart } from 'lucide-react';

import { handleAiChatCoachAction } from '@/lib/actions';
import type { AiChatCoachInput } from '@/ai/flows/ai-chat-coach';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

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
       toast({
        title: "AI Coach Error",
        description: error.message || "The AI coach is currently unavailable. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = { id: String(Date.now()), role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const chatHistoryForAI = messages.map(msg => ({ role: msg.role, content: msg.content }));
    
    mutation.mutate({ message: input, chatHistory: chatHistoryForAI });
    setInput('');
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <MessageSquareHeart className="text-primary"/>
          AI Fitness Coach
        </CardTitle>
        <CardDescription>Chat with your AI coach for fitness advice, motivation, and support.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full p-4 border rounded-md" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3 text-sm shadow",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-primary" // Changed text-muted-foreground to text-primary
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {mutation.isPending && (
              <div className="flex items-end gap-2 justify-start">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                <div className="max-w-[70%] rounded-lg p-3 text-sm shadow bg-muted text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin inline-block" /> Typing...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask your AI coach..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={mutation.isPending}
          />
          <Button type="submit" size="icon" disabled={mutation.isPending || !input.trim()}>
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
