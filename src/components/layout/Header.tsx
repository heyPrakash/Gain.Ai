import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 px-6 shadow-md bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BrainCircuit className="h-8 w-8" />
          <span>Cortex Fit</span>
        </Link>
        {/* Future navigation links can go here */}
      </div>
    </header>
  );
}
