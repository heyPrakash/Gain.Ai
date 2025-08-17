

import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Home, HeartPulse, Dumbbell, MessageSquareHeart, Camera } from 'lucide-react';
import { GainAppIcon } from '@/components/icons/GainAppIcon';
import Link from 'next/link';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <title>Gain - AI Powered Fitness</title>
        <meta name="description" content="Personalized AI diet plans, workout schedules, and 24/7 fitness coaching." />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SidebarProvider defaultOpen>
              <Sidebar collapsible="icon" className="border-r border-sidebar-border">
                <SidebarHeader className="p-4">
                  <Link href="/" className="flex items-center gap-2 text-xl font-bold text-sidebar-primary hover:opacity-80 transition-opacity">
                    <GainAppIcon className="h-7 w-7" />
                    <span className="group-data-[collapsible=icon]:hidden">Gain</span>
                  </Link>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={{content: "Home", side: "right", align: "center"}}>
                        <Link href="/"><Home /> <span className="group-data-[collapsible=icon]:hidden">Home</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                      <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={{content: "Nutrition Snap", side: "right", align: "center"}}>
                        <Link href="/food-analyzer"><Camera /> <span className="group-data-[collapsible=icon]:hidden">Nutrition Snap</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={{content: "Diet Planner", side: "right", align: "center"}}>
                        <Link href="/diet-planner"><HeartPulse /> <span className="group-data-[collapsible=icon]:hidden">Diet Planner</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={{content: "Workout Planner", side: "right", align: "center"}}>
                        <Link href="/workout-planner"><Dumbbell /> <span className="group-data-[collapsible=icon]:hidden">Workout Planner</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={{content: "AI Coach", side: "right", align: "center"}}>
                        <Link href="/ai-coach"><MessageSquareHeart /> <span className="group-data-[collapsible=icon]:hidden">AI Coach</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarContent>
              </Sidebar>

              <SidebarInset className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 has-[[data-page=chat]]:p-0">
                  {children}
                </main>
                <Footer />
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
