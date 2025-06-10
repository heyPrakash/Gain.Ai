
"use client";

import type { GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UtensilsCrossed, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DietPlanDisplayProps {
  dietPlanOutput: GenerateDietPlanOutput;
}

const renderDietPlanContent = (content: string): (JSX.Element | null)[] => {
  if (!content || content.trim() === '') return [];
  
  const lines = content.split('\n');
  const elements: (JSX.Element | null)[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine === '') {
      continue; 
    }

    // Match main headings like "**Breakfast:**", "**Lunch:**", "**Example Meals:**", "**Goal:**"
    if (trimmedLine.startsWith('**') && (trimmedLine.endsWith('**') || trimmedLine.endsWith('**:'))) {
      const headingText = trimmedLine.replace(/\*\*/g, '').replace(/:$/, '').trim();
      let titleFontWeight = "font-semibold"; // Default for other headings like "**Goal:**"
      const lowerHeadingText = headingText.toLowerCase();

      // Specific keywords for bold and primary color
      const boldKeywords = ["breakfast", "lunch", "dinner", "snack", "snacks", "example meals", "meal examples"];
      if (boldKeywords.some(keyword => lowerHeadingText.includes(keyword))) {
        titleFontWeight = "font-bold";
      }
      if (headingText) {
        elements.push(<h4 key={`h4-${i}-${headingText.slice(0,10)}`} className={`text-md ${titleFontWeight} mt-3 mb-1.5 text-primary`}>{headingText}</h4>);
      }
      continue;
    }
    
    // Match list items: "* Item content" or "* **Title:** Description"
    const listItemMatch = line.match(/^(\s*)(\*\s+)(.*)/);
    if (listItemMatch) {
      const indentSpaces = listItemMatch[1].length;
      let itemContent = listItemMatch[3]; 
      const indentLevel = Math.floor(indentSpaces / 2); 
      const marginLeft = `${indentLevel * 1.25}rem`; 

      // Special handling for "*Approximate Nutritional Information:*"
      if (itemContent.startsWith('*') && itemContent.endsWith('*') && itemContent.toLowerCase().includes('approximate nutritional information')) {
        const nutritionalText = itemContent.substring(1, itemContent.length - 1).replace(/\*\*/g, '').trim();
        if (nutritionalText) {
            elements.push(<p key={`nutri-${i}-${nutritionalText.slice(0,10)}`} style={{ marginLeft }} className="text-xs italic text-muted-foreground my-0.5">{nutritionalText}</p>);
        }
        continue;
      }
      
      // Match list items like "* **Title:** Description"
      const boldPartMatch = itemContent.match(/^\*\*(.*?)\*\*:\s*(.*)/s); 
      if (boldPartMatch) {
        const title = boldPartMatch[1].trim(); 
        const description = boldPartMatch[2].replace(/\*\*/g, '').trim(); 
        
        let titleFontWeight = "font-semibold"; 
        const lowerTitle = title.toLowerCase();
        const boldListTitleKeywords = ["breakfast", "lunch", "dinner", "snack", "snacks", "example meal", "example meals"];
        
        if (boldListTitleKeywords.some(keyword => lowerTitle.includes(keyword))) {
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
      const regularItemText = itemContent.replace(/\*\*/g, '').trim();
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
    
    // Default: render as a paragraph, removing any **
    const paragraphText = line.replace(/\*\*/g, '').trim();
    if (paragraphText) {
        elements.push(<p key={`p-${i}-${paragraphText.slice(0,10)}`} className="text-sm my-1.5 leading-relaxed">{paragraphText}</p>);
    }
  }
  return elements.filter(el => el !== null); // Filter out any nulls if branches resulted in no element pushed
};


export default function DietPlanDisplay({ dietPlanOutput }: DietPlanDisplayProps) {
  const { dietPlan } = dietPlanOutput;

  const sections = dietPlan.split(/\n(?=Day\s\d+:|Meal\s\d+:|Breakfast:|Lunch:|Dinner:|Snack:|Important Notes and Adjustments:|Important Considerations:|Sample Meal Plan:|Example Meals:|Meal Examples:)/i);

  const handlePrint = () => {
    window.print();
  };

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

            const firstLine = sectionLines[0].trim();
            const majorTitleRegex = /^(Day\s\d+:|Meal\s\d+:|Breakfast:|Lunch:|Dinner:|Snack:|Important Notes and Adjustments:|Important Considerations:|Sample Meal Plan:|Example Meals:|Meal Examples:)/i;
            
            if (majorTitleRegex.test(firstLine)) {
              sectionTitle = firstLine.replace(/\*\*/g, '').trim(); // Remove ** from section titles too
              if (sectionLines.length > 1) {
                contentForRenderer = sectionLines.slice(1).join('\n');
              } else {
                contentForRenderer = ''; 
              }
            }
            
            const renderedContent = renderDietPlanContent(contentForRenderer);

            // Only render the section if it has a title or actual content
            if (!sectionTitle && renderedContent.length === 0) {
                return null;
            }

            return (
              <div key={`${sectionIndex}-${sectionTitle.slice(0,5)}`} className="mb-5 last:mb-0">
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
        {/* Button removed as per user request */}
      </CardFooter>
    </Card>
  );
}

