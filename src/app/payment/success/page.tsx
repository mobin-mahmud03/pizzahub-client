'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { CheckCircle2, Award, ArrowRight, RotateCcw } from 'lucide-react';

type VerificationStatus = 'verifying' | 'active' | 'pending' | 'failed';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refreshUser, isLoading } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [attempts, setAttempts] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    let lastError = '';
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    if (isLoading) return;

    if (!sessionId) {
      setStatus('failed');
      setMessage('Checkout session ID is missing. Return to the vendor dashboard and check your plan status.');
      return;
    }

    setStatus('verifying');
    setMessage('');

    const verifySession = async () => {
      try {
        const response = await api.get(
          `/stripe/checkout-session/${encodeURIComponent(sessionId)}`,
          { timeout: 10000 }
        );
        if (cancelled) return;

        const sessionStatus = response.data?.data?.status;
        if (sessionStatus === 'active') {
          await refreshUser();
          if (!cancelled) setStatus('active');
          return;
        }
        if (sessionStatus === 'expired') {
          setStatus('failed');
          setMessage('This Checkout Session expired. Start a new subscription from your vendor dashboard.');
          return;
        }
        lastError = '';
        setMessage('');
      } catch (error: any) {
        if (cancelled) return;

        const responseStatus = error.response?.status;
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Unable to verify your payment with the server.';
        lastError = errorMessage;
        if (responseStatus && responseStatus < 500) {
          setStatus('failed');
          setMessage(errorMessage);
          return;
        }
        setMessage(errorMessage);
      }

      attempt += 1;
      setAttempts(attempt);
      if (attempt >= 15) {
        setStatus(lastError ? 'failed' : 'pending');
        return;
      }

      retryTimer = setTimeout(verifySession, 2000);
    };

    void verifySession();
    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [sessionId, retryCount, refreshUser, isLoading]);

  const retryVerification = () => {
    setAttempts(0);
    setMessage('');
    setStatus('verifying');
    setRetryCount((count) => count + 1);
  };

  if (status === 'active') {
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
            Your subscription has been verified by Stripe and your Premium plan is active.
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

  if (status === 'pending' || status === 'failed') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
          <RotateCcw className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground font-serif tracking-tight">
            {status === 'pending' ? 'Payment Processing' : 'Could Not Verify Payment'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {message ||
              'Stripe has not confirmed the subscription yet. You can check again shortly; Premium is only activated after server-side verification.'}
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={retryVerification}
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
          Verifying Checkout Session with Stripe ({attempts}/15)...
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
