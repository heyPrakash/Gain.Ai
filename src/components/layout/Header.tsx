
'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export default function Header() {
  const { user, signOut, loading } = useAuth();
  const userInitials = user?.email?.charAt(0).toUpperCase() || <User className="h-5 w-5" />;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {user.photoURL && <AvatarImage src={user.photoURL} alt={user.email || 'User'} />}
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">My Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null }
      </div>
    </header>
  );
}
