'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Pizza, Mail, Lock, User as UserIcon, Store, ShoppingBag, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function RegisterPage() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        image,
        role,
        businessName: role === 'vendor' ? businessName : undefined,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Account created successfully!');
        login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to register. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
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
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mario Rossi"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            {role === 'vendor' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Restaurant / Business Name *
                </label>
                <div className="relative">
                  <Store className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Mario's Authentic Pizzeria"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Password * (min 6 chars, 1 uppercase, 1 lowercase)
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars with Uppercase & lowercase"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Profile Image URL (Optional)
              </label>
              <div className="relative">
                <ImageIcon className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create {role === 'vendor' ? 'Vendor' : 'Customer'} Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
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
