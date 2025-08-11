
"use client";

import type { AnalyzeFoodImageOutput } from '@/ai/flows/analyze-food-image-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as TableFoot } from "@/components/ui/table";
import { PieChart, Flame, Beef, Droplets, Wheat, Info } from 'lucide-react';

interface FoodAnalysisDisplayProps {
  analysisOutput: AnalyzeFoodImageOutput;
}

export default function FoodAnalysisDisplay({ analysisOutput }: FoodAnalysisDisplayProps) {
  const { foodItems, totalCalories, totalProtein, totalFats, totalCarbohydrates, fitnessSummary } = analysisOutput;

  return (
    <Card className="mt-8 w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PieChart className="text-primary" />
          Nutritional Analysis Results
        </CardTitle>
        <CardDescription>
          Here's the AI-generated nutritional breakdown of your meal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <div className="p-3 bg-muted rounded-lg shadow-sm">
                <div className="flex items-center justify-center gap-2">
                    <Flame className="w-5 h-5 text-destructive"/>
                    <h4 className="text-sm font-semibold">Calories</h4>
                </div>
                <p className="text-xl font-bold">{Math.round(totalCalories)}</p>
            </div>
             <div className="p-3 bg-muted rounded-lg shadow-sm">
                <div className="flex items-center justify-center gap-2">
                    <Beef className="w-5 h-5 text-primary"/>
                    <h4 className="text-sm font-semibold">Protein</h4>
                </div>
                <p className="text-xl font-bold">{Math.round(totalProtein)}g</p>
            </div>
             <div className="p-3 bg-muted rounded-lg shadow-sm">
                 <div className="flex items-center justify-center gap-2">
                    <Droplets className="w-5 h-5 text-yellow-500"/>
                    <h4 className="text-sm font-semibold">Fats</h4>
                </div>
                <p className="text-xl font-bold">{Math.round(totalFats)}g</p>
            </div>
             <div className="p-3 bg-muted rounded-lg shadow-sm">
                <div className="flex items-center justify-center gap-2">
                    <Wheat className="w-5 h-5 text-orange-500"/>
                    <h4 className="text-sm font-semibold">Carbs</h4>
                </div>
                <p className="text-xl font-bold">{Math.round(totalCarbohydrates)}g</p>
            </div>
        </div>

        <ScrollArea className="h-[300px] w-full border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Item</TableHead>
                <TableHead>Portion</TableHead>
                <TableHead className="text-right">Calories</TableHead>
                <TableHead className="text-right">Protein</TableHead>
                <TableHead className="text-right">Fats</TableHead>
                <TableHead className="text-right">Carbs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foodItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium capitalize">{item.name}</TableCell>
                  <TableCell>{item.portionSize}</TableCell>
                  <TableCell className="text-right">{Math.round(item.calories)}</TableCell>
                  <TableCell className="text-right">{Math.round(item.protein)}g</TableCell>
                  <TableCell className="text-right">{Math.round(item.fats)}g</TableCell>
                  <TableCell className="text-right">{Math.round(item.carbohydrates)}g</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFoot className="bg-muted/50 font-semibold">
                <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-right">{Math.round(totalCalories)}</TableCell>
                    <TableCell className="text-right">{Math.round(totalProtein)}g</TableCell>
                    <TableCell className="text-right">{Math.round(totalFats)}g</TableCell>
                    <TableCell className="text-right">{Math.round(totalCarbohydrates)}g</TableCell>
                </TableRow>
            </TableFoot>
          </Table>
        </ScrollArea>
        
        <Alert variant="default" className="mt-6 bg-primary/10 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Fitness Summary</AlertTitle>
          <AlertDescription>
            {fitnessSummary || "A balanced meal is key to achieving your fitness goals."}
          </AlertDescription>
        </Alert>
      </CardContent>
       <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
        <p>Disclaimer: The nutritional information is an AI-powered estimate and should be used as a guideline. Actual values may vary.</p>
      </CardFooter>
    </Card>
  );
}
