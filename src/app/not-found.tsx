import Link from 'next/link';
import { Pizza, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shadow-lg shadow-red-500/10">
        <Pizza className="w-12 h-12 animate-bounce" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-5xl font-black text-foreground font-serif tracking-tight">
          404
        </h1>
        <h2 className="text-2xl font-bold text-foreground">
          Slice Not Found
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The pizza page or menu item you are looking for has been eaten or does not exist. Let&apos;s get you back to the fresh oven!
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-lg shadow-red-500/25 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
