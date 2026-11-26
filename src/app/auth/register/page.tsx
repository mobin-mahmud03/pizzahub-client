'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Pizza, Mail, Lock, User as UserIcon, Store, ShoppingBag, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const redirectByRole = (targetRole: 'customer' | 'vendor') => {
    if (redirectParam && redirectParam.startsWith('/')) {
      router.push(redirectParam);
    } else if (targetRole === 'vendor') {
      router.push('/dashboard/vendor');
    } else {
      router.push('/dashboard/customer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Password validation rule check
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter and one lowercase letter.');
      return;
    }

    if (role === 'vendor' && !businessName) {
      toast.error('Please enter your restaurant/pizzeria business name.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: image.trim() || undefined,
        role,
        businessName: role === 'vendor' ? businessName.trim() : undefined,
      } as any);

      if (res.error) {
        toast.error(res.error.message || 'Failed to register. Please try again.');
        return;
      }

      toast.success('Account created successfully!');
      redirectByRole(role);
    } catch (err: any) {
      const msg = err?.message || 'Failed to register. Please try again.';
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
        : role === 'vendor'
        ? '/dashboard/vendor'
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

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/20 mb-2">
            <Pizza className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join PizzaHub as a customer or partner pizzeria restaurant
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">
                Or register with email
              </span>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Select Account Role *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-3 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'customer'
                    ? 'border-red-500 bg-red-50/80 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-3 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'vendor'
                    ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Restaurant Vendor</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name *
              </Label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-muted-foreground absolute left-3.5 top-2.5 z-10" />
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mario Rossi"
                  className="h-10 pl-11 pr-4 rounded-xl border-input bg-background text-foreground text-sm focus-visible:ring-2 focus-visible:ring-red-500 transition-all"
                />
              </div>
            </div>

            {role === 'vendor' && (
              <div className="space-y-1.5">
                <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Restaurant / Business Name *
                </Label>
                <div className="relative">
                  <Store className="w-5 h-5 text-muted-foreground absolute left-3.5 top-2.5 z-10" />
                  <Input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Mario's Authentic Pizzeria"
                    className="h-10 pl-11 pr-4 rounded-xl border-input bg-background text-foreground text-sm focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address *
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
                Password * (min 6 chars, 1 uppercase, 1 lowercase)
              </Label>
              <div className="relative">
                <Lock className="w-5 h-5 text-muted-foreground absolute left-3.5 top-2.5 z-10" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars with Uppercase & lowercase"
                  className="h-10 pl-11 pr-4 rounded-xl border-input bg-background text-foreground text-sm focus-visible:ring-2 focus-visible:ring-red-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Profile Image URL (Optional)
              </Label>
              <div className="relative">
                <ImageIcon className="w-5 h-5 text-muted-foreground absolute left-3.5 top-2.5 z-10" />
                <Input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-10 pl-11 pr-4 rounded-xl border-input bg-background text-foreground text-sm focus-visible:ring-2 focus-visible:ring-red-500 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-11 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create {role === 'vendor' ? 'Vendor' : 'Customer'} Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-red-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
