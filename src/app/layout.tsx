
import type { Metadata } from 'next';
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
import { Home, HeartPulse, Dumbbell, MessageSquareHeart } from 'lucide-react';
import { CortexAppIcon } from '@/components/icons/CortexAppIcon';
import Link from 'next/link';
import ClientOnly from '@/components/layout/ClientOnly';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cortex Fit - AI Powered Fitness Dashboard',
  description: 'Personalized AI diet plans, workout schedules, and 24/7 fitness coaching by Cortex Fit.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <QueryProvider>
          <ClientOnly>
            <SidebarProvider defaultOpen>
              <Sidebar collapsible="icon" className="border-r border-sidebar-border">
                <SidebarHeader className="p-4">
                  <Link href="/" className="flex items-center gap-2 text-xl font-bold text-sidebar-primary hover:opacity-80 transition-opacity">
                    <CortexAppIcon className="h-7 w-7" />
                    <span className="group-data-[collapsible=icon]:hidden">Cortex Fit</span>
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
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </SidebarInset>
            </SidebarProvider>
          </ClientOnly>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
