
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

const publicPaths = ['/login', '/signup'];

export default function ProtectedRoutes({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // If loading, we don't know the auth state yet.
    if (loading.auth) {
      return;
    }

    // If user is not authenticated and is trying to access a protected page
    if (!user && !isPublicPath) {
      router.push('/login');
    }

    // If user is authenticated and is on a public page (like login/signup)
    if (user && isPublicPath) {
      router.push('/');
    }
  }, [user, loading.auth, router, isPublicPath, pathname]);


  if (loading.auth) {
     return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  // If the user is not logged in, and they are on a public path, show the page content
  if (isPublicPath) {
    return <>{children}</>;
  }
  
  // If the user is logged in, and they are on a protected path, show the page content
  if (user) {
     return <>{children}</>;
  }

  // Otherwise, the effect will handle the redirect, so we can render null or a loader.
  // Rendering the loader is better for UX to avoid flashes of content.
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
