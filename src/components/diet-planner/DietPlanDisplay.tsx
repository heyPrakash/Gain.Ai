
import type { GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Download } from 'lucide-react';

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

    // Preserve completely blank lines for spacing between paragraphs if they were intentional (multiple newlines)
    if (line.length === 0 && i > 0 && lines[i-1].length === 0) {
        // This handles consecutive empty lines as a single break,
        // or could be used to add more space if desired.
        // For now, simple <br> or let the paragraph margins handle it.
        // No specific element for a single empty line if paragraphs have margins.
    }


    if (trimmedLine === '') {
      // Skip single empty lines if they don't have semantic meaning for spacing
      // elements.push(<br key={`br-empty-${i}`} />); // Option: add a line break
      continue;
    }

    // **Bold headings:**
    if (trimmedLine.startsWith('**') && (trimmedLine.endsWith('**') || trimmedLine.endsWith('**:'))) {
      const headingText = trimmedLine.replace(/\*\*/g, '').replace(/:$/, '');
      elements.push(<h4 key={`h4-${i}-${headingText}`} className="text-md font-semibold mt-3 mb-1.5 text-secondary-foreground">{headingText}</h4>);
      continue;
    }
    
    // Matches list items with indentation: "* item", "  * item", "    * item"
    // Captures content after "* "
    const listItemMatch = line.match(/^(\s*)(\*\s+)(.*)/);
    if (listItemMatch) {
      const indentSpaces = listItemMatch[1].length;
      let itemContent = listItemMatch[3]; // Not trimming here to preserve internal formatting like *italic*

      // Calculate margin based on indentSpaces. Assume 2 spaces per level for typical markdown.
      const indentLevel = Math.floor(indentSpaces / 2); 
      const marginLeft = `${indentLevel * 1.25}rem`; // e.g., 0, 1.25rem, 2.5rem

      // *   *Nutritional Information:* (special italicized list item)
      if (itemContent.startsWith('*') && itemContent.endsWith('*') && itemContent.includes('Approximate Nutritional Information:')) {
        const nutritionalText = itemContent.substring(1, itemContent.length - 1);
        elements.push(<p key={`nutri-${i}-${nutritionalText.slice(0,10)}`} style={{ marginLeft }} className="text-xs italic text-muted-foreground my-0.5">{nutritionalText}</p>);
        continue;
      }
      
      // *   **List item with bold title:** Description
      const boldPartMatch = itemContent.match(/^\*\*(.*?)\*\*:\s*(.*)/s); // Use /s for multiline description potential
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

      // Regular list item
      elements.push(
        <div key={`li-reg-${i}-${itemContent.slice(0,10)}`} style={{ marginLeft }} className="flex items-start text-sm my-1">
          <span className="text-primary mr-2 mt-1 shrink-0">&#8226;</span>
          <span className="flex-1">{itemContent}</span>
        </div>
      );
      continue;
    }
    
    // Default paragraph (use original line to preserve any meaningful leading/trailing spaces if not a list item)
    elements.push(<p key={`p-${i}-${line.slice(0,10)}`} className="text-sm my-1.5 leading-relaxed">{line}</p>);
  }
  return elements.filter(Boolean); // Remove any nulls if added
};


export default function DietPlanDisplay({ dietPlanOutput }: DietPlanDisplayProps) {
  const { dietPlan } = dietPlanOutput;

  // Heuristic to split plan into major sections
  const sections = dietPlan.split(/\n(?=Day\s\d+:|Meal\s\d+:|Breakfast:|Lunch:|Dinner:|Snack:|Important Notes and Adjustments:|Important Considerations:|Sample Meal Plan:)/i);

  const handleDownload = () => {
    const blob = new Blob([dietPlan], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cortex-fit-diet-plan.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-8 w-full max-w-3xl mx-auto shadow-xl">
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
        <ScrollArea className="h-[500px] w-full p-4 border rounded-md bg-card"> {/* Increased height slightly */}
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
                <div className="space-y-0.5"> {/* Controls spacing between parsed elements like p, h4, div list items */}
                  {renderDietPlanContent(contentForRenderer)}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleDownload} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Plan (.txt)
        </Button>
      </CardFooter>
    </Card>
  );
}
