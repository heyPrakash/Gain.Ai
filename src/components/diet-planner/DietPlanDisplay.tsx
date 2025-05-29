
"use client";

import type { GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, FileDown, Loader2 } from 'lucide-react';
// html2pdf.js is dynamically imported below
import { useState } from 'react';
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
    const trimmedLine = line.trim();

    if (line.length === 0 && i > 0 && lines[i-1].length === 0) {
        // No specific element for a single empty line if paragraphs have margins.
    }

    if (trimmedLine === '') {
      continue;
    }

    if (trimmedLine.startsWith('**') && (trimmedLine.endsWith('**') || trimmedLine.endsWith('**:'))) {
      const headingText = trimmedLine.replace(/\*\*/g, '').replace(/:$/, '');
      elements.push(<h4 key={`h4-${i}-${headingText}`} className="text-md font-semibold mt-3 mb-1.5 text-secondary-foreground">{headingText}</h4>);
      continue;
    }
    
    const listItemMatch = line.match(/^(\s*)(\*\s+)(.*)/);
    if (listItemMatch) {
      const indentSpaces = listItemMatch[1].length;
      let itemContent = listItemMatch[3]; 

      const indentLevel = Math.floor(indentSpaces / 2); 
      const marginLeft = `${indentLevel * 1.25}rem`; 

      if (itemContent.startsWith('*') && itemContent.endsWith('*') && itemContent.includes('Approximate Nutritional Information:')) {
        const nutritionalText = itemContent.substring(1, itemContent.length - 1);
        elements.push(<p key={`nutri-${i}-${nutritionalText.slice(0,10)}`} style={{ marginLeft }} className="text-xs italic text-muted-foreground my-0.5">{nutritionalText}</p>);
        continue;
      }
      
      const boldPartMatch = itemContent.match(/^\*\*(.*?)\*\*:\s*(.*)/s); 
      if (boldPartMatch) {
        const title = boldPartMatch[1];
        const description = boldPartMatch[2];
        elements.push(
          <div key={`li-bold-${i}-${title}`} style={{ marginLeft }} className="flex text-sm my-1">
             <span className="text-primary mr-2 mt-1 shrink-0">&#8226;</span>
            <div>
                <span className="font-semibold text-foreground">{title}:</span>
                <span> {description}</span>
            </div>
          </div>
        );
        continue;
      }

      elements.push(
        <div key={`li-reg-${i}-${itemContent.slice(0,10)}`} style={{ marginLeft }} className="flex items-start text-sm my-1">
          <span className="text-primary mr-2 mt-1 shrink-0">&#8226;</span>
          <span className="flex-1">{itemContent}</span>
        </div>
      );
      continue;
    }
    
    elements.push(<p key={`p-${i}-${line.slice(0,10)}`} className="text-sm my-1.5 leading-relaxed">{line}</p>);
  }
  return elements.filter(Boolean); 
};


export default function DietPlanDisplay({ dietPlanOutput }: DietPlanDisplayProps) {
  const { dietPlan } = dietPlanOutput;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const sections = dietPlan.split(/\n(?=Day\s\d+:|Meal\s\d+:|Breakfast:|Lunch:|Dinner:|Snack:|Important Notes and Adjustments:|Important Considerations:|Sample Meal Plan:)/i);

  const handleSaveAsPdf = async () => {
    const element = document.getElementById('dietPlanCardPrintable');
    if (!element) {
      toast({
        title: "Error",
        description: "Could not find diet plan content to generate PDF.",
        variant: "destructive",
      });
      console.error("PDF Generation Error: 'dietPlanCardPrintable' element not found.");
      return;
    }

    setIsGeneratingPdf(true);
    toast({
      title: "Generating PDF...",
      description: "Your diet plan PDF is being created. This may take a moment.",
    });
    console.log("Attempting to generate PDF for element:", element);

    try {
      // Dynamically import html2pdf.js
      const html2pdfModule = await import('html2pdf.js/dist/html2pdf.bundle.min.js');
      const html2pdf = html2pdfModule.default || html2pdfModule; // Handles if it's default export or not
      console.log("html2pdf.js module loaded:", html2pdf);

      const opt = {
        margin: 0.5, // inches
        filename: 'cortex-fit-diet-plan.pdf',
        image: { type: 'jpeg', quality: 0.98 }, // For images within the HTML
        html2canvas: { 
          scale: 2, // Higher scale for better quality
          useCORS: true, // Important if your card includes external images (like placeholders)
          logging: true, // << ENABLED html2canvas LOGGING
          // Removing potentially problematic scroll/window options:
          // scrollX: 0, 
          // scrollY: -window.scrollY, 
          // windowWidth: element.scrollWidth, 
          // windowHeight: element.scrollHeight 
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Try to avoid breaking elements
      };
      console.log("html2pdf options:", opt);

      await html2pdf().from(element).set(opt).save();
      console.log("PDF generation process .save() called and awaited.");

      toast({
        title: "PDF Generated!",
        description: "Your diet plan has been saved as a PDF.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error generating PDF with html2pdf.js:", error);
      toast({
        title: "PDF Generation Failed",
        description: `An error occurred: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
      console.log("PDF generation process finished (or errored).");
    }
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
            const majorTitleRegex = /^(Day\s\d+:|Meal\s\d+:|Breakfast:|Lunch:|Dinner:|Snack:|Important Notes and Adjustments:|Important Considerations:|Sample Meal Plan:)/i;
            
            if (majorTitleRegex.test(firstLine)) {
              sectionTitle = firstLine;
              if (sectionLines.length > 1) {
                contentForRenderer = sectionLines.slice(1).join('\n');
              } else {
                contentForRenderer = ''; 
              }
            }
            
            return (
              <div key={`${sectionIndex}-${sectionTitle.slice(0,5)}`} className="mb-5 last:mb-0">
                {sectionTitle && (
                  <h3 className="font-semibold text-lg md:text-xl text-primary mb-2.5 mt-4 first:mt-0">
                    {sectionTitle}
                  </h3>
                )}
                <div className="space-y-0.5"> 
                  {renderDietPlanContent(contentForRenderer)}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          variant="outline" 
          onClick={handleSaveAsPdf}
          disabled={isGeneratingPdf}
          className="print-hide-button w-full md:w-auto" // Responsive width
        >
          {isGeneratingPdf ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-4 w-4" />
          )}
          {isGeneratingPdf ? "Generating..." : "Save as PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
}

