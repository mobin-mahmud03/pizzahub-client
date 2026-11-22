'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  ShieldCheck,
  Pizza,
  CreditCard,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Role guarding & url alteration protection
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check role authorization on routes
      if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
        router.push('/dashboard/' + user.role);
      } else if (pathname.startsWith('/dashboard/vendor') && user.role !== 'vendor') {
        router.push('/dashboard/' + user.role);
      } else if (pathname.startsWith('/dashboard/customer') && user.role !== 'customer') {
        router.push('/dashboard/' + user.role);
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying security credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-8rem)]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* User Profile Mini Card in Sidebar */}
          <div className="p-4 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-red-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 text-red-600 font-bold flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
                {user.role}
              </span>
            </div>
          </div>

          {/* Role Navigation Links */}
          <nav className="space-y-1 text-sm font-medium">
            {user.role === 'customer' && (
              <>
                <Link
                  href="/dashboard/customer"
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    pathname === '/dashboard/customer'
                      ? 'bg-red-600 text-white font-bold shadow-md shadow-red-500/20'
                      : 'text-foreground/80 hover:bg-muted'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview & Orders</span>
                </Link>
                <Link
                  href="/menu"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-foreground/80 hover:bg-muted transition-all"
                >
                  <Pizza className="w-4 h-4" />
                  <span>Order New Pizza</span>
                </Link>
              </>
            )}

            {user.role === 'vendor' && (
              <>
                <Link
                  href="/dashboard/vendor"
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    pathname === '/dashboard/vendor'
                      ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20'
                      : 'text-foreground/80 hover:bg-muted'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Vendor Workspace</span>
                </Link>
              </>
            )}

            {user.role === 'admin' && (
              <>
                <Link
                  href="/dashboard/admin"
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    pathname === '/dashboard/admin'
                      ? 'bg-red-600 text-white font-bold shadow-md shadow-red-500/20'
                      : 'text-foreground/80 hover:bg-muted'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Control Center</span>
                </Link>
              </>
            )}

            <Link
              href="/profile"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname === '/profile'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-foreground/80 hover:bg-muted'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </Link>
          </nav>
        </div>

        {/* Logout button at bottom of sidebar */}
        <div className="pt-6 border-t border-border/80">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 bg-background overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
