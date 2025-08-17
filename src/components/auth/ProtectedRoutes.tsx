
'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRoutesProps {
  children: ReactNode;
}

const publicPaths = ['/login', '/signup'];

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth state is still loading, do nothing.
    if (loading.auth) return;

    const isPublicPath = publicPaths.includes(pathname);

    // If there's a user, they should not be able to access login/signup pages.
    // Redirect them to the home page.
    if (user && isPublicPath) {
      router.push('/');
    }

    // If there is no user and the path is not public, redirect to login.
    if (!user && !isPublicPath) {
      router.push('/login');
    }
  }, [user, loading.auth, router, pathname]);

  // While loading, show a full-screen loader.
  if (loading.auth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is logged in, or if it's a public path, show the children.
  if (user || publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  // This will be shown briefly during the redirect for unauthenticated users on protected routes.
  // Or if something goes wrong with the redirect logic.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
