
import { AnthoraLogo } from '@/components/icons/AnthoraLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 px-6 mt-auto bg-card border-t">
      <div className="container mx-auto text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} Gain. All rights reserved.</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span>Powered by</span>
          <a href="https://anthora0.framer.website/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold text-foreground hover:text-primary transition-colors">
            <AnthoraLogo className="h-4 w-4" />
            <span>Anthora</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

    