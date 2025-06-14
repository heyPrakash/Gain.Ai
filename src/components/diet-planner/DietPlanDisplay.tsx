
"use client";

import type { GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Info, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DietPlanDisplayProps {
  dietPlanOutput: GenerateDietPlanOutput;
}

const renderDietPlanContent = (content: string): (JSX.Element | null)[] => {
  if (!content || content.trim() === '') return [];
  
  const lines = content.split('\n');
  const elements: (JSX.Element | null)[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let trimmedLine = line.trim().replace(/\*\*/g, ''); // Remove all **

    if (trimmedLine === '') {
      continue; 
    }

    // Match main headings like "Breakfast:", "Lunch:", "Example Meals:", "Goal:" (after ** removal)
    // The regex looks for words followed by a colon, which were originally bolded.
    const headingMatch = trimmedLine.match(/^([A-Za-z\s()]+(?: \(\d+-\d+ calories\))?):$/);
    const commonHeadings = ["breakfast", "lunch", "dinner", "snack", "snacks", "example meal", "example meals", "meal examples", "goal", "calorie target", "general meal structure", "meal examples", "important advice", "important considerations", "sample shopping list", "key recommendations", "shopping list"];

    if (headingMatch && commonHeadings.some(keyword => headingMatch[1].toLowerCase().includes(keyword))) {
      const headingText = headingMatch[1].trim();
      let titleFontWeight = "font-semibold"; 
      const lowerHeadingText = headingText.toLowerCase();

      // Specific keywords for bold and primary color
      if (commonHeadings.some(keyword => lowerHeadingText.includes(keyword))) {
        titleFontWeight = "font-bold";
      }
      if (headingText) {
        elements.push(<h4 key={`h4-${i}-${headingText.slice(0,10)}`} className={`text-md ${titleFontWeight} mt-3 mb-1.5 text-primary`}>{headingText}</h4>);
      }
      trimmedLine = trimmedLine.substring(headingMatch[0].length).trim(); // Remove heading part if it was processed
      if (trimmedLine === '') continue; // If nothing left after heading, continue
    }
    
    // Match list items: "* Item content" or "* Title: Description" (after ** removal)
    const listItemMatch = trimmedLine.match(/^(\s*)(\*\s+)(.*)/);
    if (listItemMatch) {
      const indentSpaces = listItemMatch[1].length;
      let itemContent = listItemMatch[3].trim(); 
      const indentLevel = Math.floor(indentSpaces / 2); 
      const marginLeft = `${indentLevel * 1.25}rem`; 

      if (itemContent.startsWith('*') && itemContent.endsWith('*') && itemContent.toLowerCase().includes('approximate nutritional information')) {
        const nutritionalText = itemContent.substring(1, itemContent.length - 1).trim();
        if (nutritionalText) {
            elements.push(<p key={`nutri-${i}-${nutritionalText.slice(0,10)}`} style={{ marginLeft }} className="text-xs italic text-muted-foreground my-0.5">{nutritionalText}</p>);
        }
        continue;
      }
      
      const titleDescMatch = itemContent.match(/^([A-Za-z\s()0-9.-]+):\s*(.*)/s); 
      if (titleDescMatch) {
        const title = titleDescMatch[1].trim(); 
        const description = titleDescMatch[2].trim(); 
        
        let titleFontWeight = "font-semibold"; 
        const lowerTitle = title.toLowerCase();
        
        if (commonHeadings.some(keyword => lowerTitle.includes(keyword))) {
            titleFontWeight = "font-bold"; 
        }

        if (title) {
            elements.push(
              <div key={`li-bold-${i}-${title.slice(0,10)}`} style={{ marginLeft }} className="flex text-sm my-1">
                 <span className="text-primary mr-2 mt-1 shrink-0">&#8226;</span>
                <div>
                    <span className={`${titleFontWeight} text-primary`}>{title}:</span>
                    {description && <span> {description}</span>}
                </div>
              </div>
            );
        }
        continue;
      }

      // Regular list items "* Content"
      const regularItemText = itemContent.trim();
      if (regularItemText) {
        elements.push(
          <div key={`li-reg-${i}-${regularItemText.slice(0,10)}`} style={{ marginLeft }} className="flex items-start text-sm my-1">
            <span className="text-primary mr-2 mt-1 shrink-0">&#8226;</span>
            <span className="flex-1">{regularItemText}</span>
          </div>
        );
      }
      continue;
    }
    
    // Default: render as a paragraph
    if (trimmedLine) {
        elements.push(<p key={`p-${i}-${trimmedLine.slice(0,10)}`} className="text-sm my-1.5 leading-relaxed">{trimmedLine}</p>);
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
    // Remove markdown-like formatting
    text = text.replace(/\*\*/g, ''); // Remove bold markers
    text = text.replace(/^#+\s*/gm, ''); // Remove markdown headers (e.g., ## Title)
    text = text.replace(/^\s*\*\s+/gm, '  - '); // Convert markdown list items
    text = text.replace(/^\s*-\s+/gm, '  - '); // Convert markdown list items (alternative)
    // Ensure consistent line breaks
    text = text.replace(/\r\n/g, '\n');
    // Remove excessive blank lines, keeping at most one
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
        variant: "default",
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
      }, 2500); // Reset after 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // Section splitting logic (simplified for clarity, can be enhanced)
   const sections = dietPlan.split(/\n(?=Day\s\d+:|Meal\s\d+:|Breakfast:|Lunch:|Dinner:|Snack:|Important Notes and Adjustments:|Important Considerations:|Sample Meal Plan:|Example Meals:|Meal Examples:|Shopping List:|Key Recommendations:|Overall Goal:|Goal:|Calorie Target:)/i);


  return (
    <Card id="dietPlanCardPrintable" className="mt-8 w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <UtensilsCrossed className="text-primary" />
          Your Personalized Diet Plan
        </CardTitle>
        <CardDescription>
          Here is the diet plan generated by our AI based on your profile. Remember to consult with a healthcare professional before making significant dietary changes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full p-4 border rounded-md bg-card print-expandable-scroll-area">
          {sections.map((sectionText, sectionIndex) => {
            const trimmedSectionText = sectionText.trim();
            if (!trimmedSectionText) return null;

            const sectionLines = trimmedSectionText.split('\n');
            let sectionTitle = '';
            let contentForRenderer = trimmedSectionText;

            const firstLine = sectionLines[0].trim().replace(/\*\*/g, ''); // Remove ** for title matching
            const majorTitleRegex = /^(Day\s\d+:|Meal\s\d+:|Breakfast:|Lunch:|Dinner:|Snack:|Important Notes and Adjustments:|Important Considerations:|Sample Meal Plan:|Example Meals:|Meal Examples:|Shopping List:|Key Recommendations:|Overall Goal:|Goal:|Calorie Target:)/i;
            
            if (majorTitleRegex.test(firstLine)) {
              sectionTitle = firstLine;
              if (sectionLines.length > 1) {
                contentForRenderer = sectionLines.slice(1).join('\n');
              } else {
                contentForRenderer = ''; 
              }
            }
            
            const renderedContent = renderDietPlanContent(contentForRenderer);

            if (!sectionTitle && renderedContent.length === 0) {
                return null;
            }

            return (
              <div key={`${sectionIndex}-${sectionTitle.slice(0,10)}`} className="mb-5 last:mb-0">
                {sectionTitle && (
                  <h3 className="font-semibold text-lg md:text-xl text-primary mb-2.5 mt-4 first:mt-0">
                    {sectionTitle}
                  </h3>
                )}
                <div className="space-y-0.5"> 
                  {renderedContent}
                </div>
              </div>
            );
          })}
        </ScrollArea>
        <Alert variant="default" className="mt-6 bg-primary/10 border-primary/30 text-primary">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle>Pro Tip!</AlertTitle>
          <AlertDescription className="text-primary/90">
            We recommend writing down your diet plan or making notes for easy reference. This can help you stay on track with your meals and goals!
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="justify-end pt-4">
         <Button onClick={handleCopyToClipboard} variant="outline" className="print-hide-button">
          {isCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
          {isCopied ? 'Copied!' : 'Copy Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}

