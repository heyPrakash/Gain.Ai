
"use client";

import type { GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Info, Copy, Check, Leaf } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DietPlanDisplayProps {
  dietPlanOutput: GenerateDietPlanOutput;
}

const renderSectionContent = (content: string): (JSX.Element | null)[] => {
  if (!content || content.trim() === '') return [];
  
  // Split by list items, but keep the delimiter for context
  const lines = content.split(/(\n\s*[-*]\s+)/).filter(line => line.trim() !== '');

  const elements: (JSX.Element | null)[] = [];
  let buffer = '';

  for (const line of lines) {
    if (line.match(/^\n\s*[-*]\s+/)) {
      if (buffer.trim()) {
        elements.push(<p key={`p-${elements.length}`} className="text-sm my-2 leading-relaxed">{buffer.trim()}</p>);
      }
      buffer = line;
    } else {
      buffer += line;
    }
  }
  if (buffer.trim()) {
      if (buffer.match(/^\n\s*[-*]\s+/)) {
           // It's a list item
            const itemText = buffer.replace(/^\n\s*[-*]\s+/, '').trim();
            const titleDescMatch = itemText.match(/^([A-Za-z\s()0-9.-]+):\s*(.*)/s);
            if (titleDescMatch) {
                 elements.push(
                    <div key={`item-${elements.length}`} className="bg-card p-3 rounded-lg shadow-sm">
                       <p className="font-bold text-md text-primary">{titleDescMatch[1].trim()}</p>
                       <p className="text-sm text-muted-foreground">{titleDescMatch[2].trim()}</p>
                    </div>
                 );
            } else {
                 elements.push(
                    <div key={`item-${elements.length}`} className="bg-card p-3 rounded-lg shadow-sm">
                       <p className="text-md text-foreground">{itemText}</p>
                    </div>
                 );
            }
      } else {
          // It's a paragraph
          elements.push(<p key={`p-${elements.length}`} className="text-sm my-2 leading-relaxed">{buffer.trim()}</p>);
      }
  }

  return elements.filter(el => el !== null);
};

export default function DietPlanDisplay({ dietPlanOutput }: DietPlanDisplayProps) {
  const { dietPlan } = dietPlanOutput;
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const formatDietPlanForCopy = (rawPlan: string): string => {
    let text = rawPlan;
    text = text.replace(/\*\*/g, '');
    text = text.replace(/^#+\s*/gm, '');
    text = text.replace(/^\s*[*-]\s+/gm, '  - ');
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\n\s*\n/g, '\n\n');
    return text.trim();
  };

  const handleCopyToClipboard = async () => {
    const planText = formatDietPlanForCopy(dietPlan);
    try {
      await navigator.clipboard.writeText(planText);
      toast({
        title: "Copied to Clipboard!",
        description: "The diet plan has been copied.",
      });
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy the diet plan to your clipboard.",
        variant: "destructive",
      });
      setIsCopied(false);
    }
  };

   useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // Regex to split by the main sections, but keep the delimiter
  const majorHeadingsRegex = /(\n?(?=\*\*(?:🌅|🌞|🌙|snacks|shopping list|important considerations).*?:\*\*))/i;
  const sections = dietPlan.split(majorHeadingsRegex).filter(s => s && s.trim() !== '');
  
  // The first section might be an introduction before any major headings.
  const introSection = sections.length > 0 && !sections[0].startsWith('**') ? sections.shift() : null;

  const firstMealSection = sections.find(s => s.toLowerCase().includes('breakfast'))?.split('\n')[0] || sections[0]?.split('\n')[0] || 'intro';

  return (
    <Card id="dietPlanCardPrintable" className="mt-8 w-full max-w-3xl mx-auto shadow-xl border-0 bg-transparent">
      <CardHeader className="text-center px-2">
         <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4 mx-auto w-fit">
            <UtensilsCrossed className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">
          Your Personalized Diet Plan
        </CardTitle>
        <CardDescription className="text-md max-w-lg mx-auto">
          Here is your AI-generated diet plan. Remember to consult with a healthcare professional before making significant dietary changes.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
         {introSection && (
            <div className="bg-card p-4 rounded-lg shadow-sm mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-primary mb-2">
                    <Leaf className="w-5 h-5" />
                    General Advice
                </h3>
                <div className="text-sm whitespace-pre-line leading-relaxed text-muted-foreground">
                    {renderSectionContent(introSection)}
                </div>
            </div>
         )}

         <Accordion type="single" collapsible defaultValue={firstMealSection.trim()} className="w-full">
            {sections.map((sectionText, index) => {
                 const sectionLines = sectionText.trim().split('\n');
                 const titleLine = sectionLines.shift()?.replace(/\*\*/g, '').replace(/:$/, '') || '';
                 const content = sectionLines.join('\n');
                 const renderedContent = renderSectionContent(content);

                 if (!titleLine) return null;

                 return (
                    <AccordionItem value={titleLine} key={`${index}-${titleLine}`} className="border-b-0 mb-2">
                        <AccordionTrigger className="py-3 px-4 rounded-lg bg-card text-foreground shadow-sm hover:no-underline data-[state=open]:bg-primary/10 data-[state=open]:shadow-md">
                            <div className="flex items-center justify-between w-full">
                                <h4 className="font-bold text-lg">{titleLine}</h4>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-0">
                             <div className="space-y-2 pt-2">
                               {renderedContent}
                             </div>
                        </AccordionContent>
                    </AccordionItem>
                 );
            })}
         </Accordion>
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-4 px-2">
         <Alert variant="default" className="w-full">
            <Info className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
                This diet plan is AI-generated. Always consult with a healthcare professional before making significant dietary changes.
            </AlertDescription>
         </Alert>
         <Button onClick={handleCopyToClipboard} variant="outline" className="w-full print-hide-button">
          {isCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
          {isCopied ? 'Copied!' : 'Copy Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}
