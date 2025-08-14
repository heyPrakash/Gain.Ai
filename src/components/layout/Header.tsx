import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
      <div className="md:hidden"> {/* SidebarTrigger for mobile */}
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        {/* Future elements like page title or breadcrumbs can go here */}
      </div>
    </header>
  );
}
