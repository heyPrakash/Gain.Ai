import {Zap} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 px-6 mt-auto bg-card border-t">
      <div className="container mx-auto text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} Cortex Fit. All rights reserved.</p>
        <p>Developed by Prakash Jadhav</p>
        <p className="flex items-center justify-center gap-1 mt-1">
          Powered by <Zap className="w-4 h-4 text-primary" /> DecoAI
        </p>
      </div>
    </footer>
  );
}
