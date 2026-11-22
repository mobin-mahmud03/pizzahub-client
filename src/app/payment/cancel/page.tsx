'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, Store } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-foreground font-serif tracking-tight">
          Checkout Cancelled
        </h1>
        <p className="text-sm text-muted-foreground">
          Your payment session was cancelled. No charges were made. You can continue on the Free Plan or upgrade whenever you’re ready.
        </p>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <Link
          href="/dashboard/vendor"
          className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-700 shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Store className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
        <Link
          href="/menu"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          Browse Pizza Menu
        </Link>
      </div>
    </div>
  );
}
