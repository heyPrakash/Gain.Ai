
'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { GainAppIcon } from '@/components/icons/GainAppIcon';
import { Home, HeartPulse, Dumbbell, MessageSquareHeart, Camera, Scan, LogIn, UserPlus } from 'lucide-react';


const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
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
                            <SidebarMenuButton asChild tooltip={{ content: "Home", side: "right", align: "center" }}>
                                <Link href="/"><Home /> <span className="group-data-[collapsible=icon]:hidden">Home</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ content: "Body Scanner", side: "right", align: "center" }}>
                                <Link href="/body-scanner"><Scan /> <span className="group-data-[collapsible=icon]:hidden">Body Scanner</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ content: "Nutrition Snap", side: "right", align: "center" }}>
                                <Link href="/food-analyzer"><Camera /> <span className="group-data-[collapsible=icon]:hidden">Nutrition Snap</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ content: "Diet Planner", side: "right", align: "center" }}>
                                <Link href="/diet-planner"><HeartPulse /> <span className="group-data-[collapsible=icon]:hidden">Diet Planner</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ content: "Workout Planner", side: "right", align: "center" }}>
                                <Link href="/workout-planner"><Dumbbell /> <span className="group-data-[collapsible=icon]:hidden">Workout Planner</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ content: "AI Coach", side: "right", align: "center" }}>
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
    );
};


export default function ProtectedRoutes({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!loading.auth) {
      if (!user && !isPublicRoute) {
        router.push('/login');
      } else if (user && isPublicRoute) {
        router.push('/');
      }
    }
  }, [user, loading.auth, router, isPublicRoute, pathname]);

  if (loading.auth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isPublicRoute) {
    return null; // or a loading spinner, as the redirect is happening
  }
  
  if (user && !isPublicRoute) {
    return <AppLayout>{children}</AppLayout>;
  }

  return <>{children}</>;
}
