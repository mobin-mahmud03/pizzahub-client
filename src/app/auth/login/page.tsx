'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Pizza, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const redirectByRole = (role?: string) => {
    if (redirectParam && redirectParam.startsWith('/')) {
      router.push(redirectParam);
    } else if (role === 'admin') {
      router.push('/dashboard/admin');
    } else if (role === 'vendor') {
      router.push('/dashboard/vendor');
    } else {
      router.push('/dashboard/customer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || 'Failed to sign in. Please check your credentials.');
        return;
      }

      toast.success('Signed in successfully!');
      const userRole = (res.data?.user as any)?.role;
      redirectByRole(userRole);
    } catch (err: any) {
      // Surface the actual Better Auth error message when available
      const msg =
        err?.body?.message ||
        err?.message ||
        'Failed to sign in. Please check your credentials.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const targetUrl = redirectParam && redirectParam.startsWith('/')
        ? redirectParam
        : '/dashboard/customer';

      await authClient.signIn.social({
        provider: 'google',
        callbackURL: targetUrl,
      });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to sign in with Google.');
      setIsGoogleLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail: string, rolePass: string, roleName: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    toast.info(`Loaded demo credentials for ${roleName}`);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/20 mb-2">
            <Pizza className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your orders, menu, or restaurant dashboard
          </p>
        </div>

        <div className="bg-card border border-border p-8 rounded-3xl shadow-xl space-y-6">
          {/* Continue with Google button */}
          <Button
            type="button"
            variant="outline"
            disabled={isGoogleLoading || isLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-11 rounded-xl font-semibold border-border bg-background hover:bg-muted text-foreground flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </Button>

          <div className="flex items-center gap-3" aria-label="Divider">
            <span className="h-px flex-1 bg-border" />
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Or continue with email
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="w-5 h-5 text-muted-foreground absolute left-3.5 top-2.5 z-10" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-10 pl-11 pr-4 rounded-xl border-input bg-background text-foreground text-sm focus-visible:ring-2 focus-visible:ring-red-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="w-5 h-5 text-muted-foreground absolute left-3.5 top-2.5 z-10" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 pl-11 pr-4 rounded-xl border-input bg-background text-foreground text-sm focus-visible:ring-2 focus-visible:ring-red-500 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-11 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Credentials pill buttons */}
          <div className="pt-4 border-t border-border/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Access (Click to Fill):</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@pizzahub.com', 'Admin@123456', 'Admin')}
                className="py-2 px-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-muted/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-foreground font-semibold transition-all cursor-pointer text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('mario@pizzahub.com', 'Vendor@123456', 'Vendor')}
                className="py-2 px-2.5 rounded-xl border border-orange-500/20 bg-orange-50/60 dark:bg-orange-950/30 hover:bg-orange-100/80 text-orange-700 dark:text-orange-400 font-semibold transition-all cursor-pointer text-center"
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('customer@pizzahub.com', 'Customer@123456', 'Customer')}
                className="py-2 px-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/80 text-emerald-700 dark:text-emerald-400 font-semibold transition-all cursor-pointer text-center"
              >
                Customer
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold text-red-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
