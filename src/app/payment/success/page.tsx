'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { CheckCircle2, Award, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refreshUser } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (sessionId) {
          // Dev / local testing verification endpoint call to ensure plan is active
          await api.post('/stripe/verify-test-payment', { sessionId });
        }
        await refreshUser();
      } catch (err) {
        console.warn('Webhook will process confirmation.', err);
      } finally {
        setIsVerifying(false);
      }
    };
    confirmPayment();
  }, [sessionId]);

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

export default function PaymentSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Confirming transaction...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </React.Suspense>
  );
}
