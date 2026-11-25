'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Award, ArrowRight, RotateCcw } from 'lucide-react';

function PaymentSuccessContent() {
  const { user, refreshUser } = useAuth();
  const isPremium = user?.subscriptionPlan === 'premium';
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (isPremium) return;

    let count = 0;
    const interval = setInterval(async () => {
      count += 1;
      setAttempts(count);
      await refreshUser();

      if (count >= 10) {
        clearInterval(interval);
      }
    }, 2000);

    refreshUser();

    return () => clearInterval(interval);
  }, [isPremium]);

  if (isPremium) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
            <Award className="w-3.5 h-3.5" />
            <span>Premium Activated</span>
          </div>
          <h1 className="text-3xl font-black text-foreground font-serif tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-sm text-muted-foreground">
            Thank you for upgrading! Your vendor subscription is now verified and active. You now have unlimited menu items and the Premium Artisan badge.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/dashboard/vendor"
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 to-red-600 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <span>Go to Vendor Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (attempts >= 10) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <RotateCcw className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground font-serif tracking-tight">
            Payment Processing
          </h1>
          <p className="text-sm text-muted-foreground">
            Payment received, but confirmation is taking a moment. Please refresh later or check your vendor dashboard.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => {
              setAttempts(0);
              refreshUser();
            }}
            className="w-full py-3 px-6 rounded-2xl font-bold text-sm text-foreground bg-muted hover:bg-muted/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Check Again</span>
          </button>
          <Link
            href="/dashboard/vendor"
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 to-red-600 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <span>Go to Vendor Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-foreground font-serif tracking-tight">
          Payment received, activating your plan...
        </h1>
        <p className="text-sm text-muted-foreground">
          Waiting for confirmation from Stripe. This usually takes just a few seconds...
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading payment status...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </React.Suspense>
  );
}
