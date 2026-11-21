import React from 'react';
import { Pizza } from 'lucide-react';

export default function LoadingSpinner({ text = 'Preparing fresh oven specials...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-red-500/20 border-t-red-600 animate-spin" />
        <Pizza className="w-5 h-5 text-red-600 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="text-xs font-semibold text-muted-foreground">{text}</p>
    </div>
  );
}
