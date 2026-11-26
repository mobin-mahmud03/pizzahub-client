'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import {
  Pizza,
  Sun,
  Moon,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'vendor') return '/dashboard/vendor';
    return '/dashboard/customer';
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/90 border-b border-border shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
            <Pizza className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground font-serif">
            Pizza<span className="text-red-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-red-600 ${
              isActive('/') ? 'text-red-600 font-semibold' : 'text-foreground/80'
            }`}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className={`text-sm font-medium transition-colors hover:text-red-600 ${
              isActive('/menu') ? 'text-red-600 font-semibold' : 'text-foreground/80'
            }`}
          >
            Browse Menu
          </Link>

          {/* Role specific links in header if logged in */}
          {user && (
            <Link
              href={getDashboardLink()}
              className={`text-sm font-medium transition-colors hover:text-red-600 ${
                pathname.startsWith('/dashboard') ? 'text-red-600 font-semibold' : 'text-foreground/80'
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right actions: Theme toggle + Auth */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark / Light Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-full hover:bg-muted text-foreground/80 transition-colors cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* User Logged In state */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-border hover:bg-muted/80 transition-all cursor-pointer outline-none">
                <Avatar className="w-8 h-8 border border-red-500/30">
                  {user.image && <AvatarImage src={user.image} alt={user.name} />}
                  <AvatarFallback className="bg-red-100 dark:bg-red-950 text-red-600 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-xs font-semibold text-foreground leading-tight">{user.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-muted-foreground capitalize">{user.role}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 rounded-2xl bg-card border border-border shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-border/60">
                  <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <Badge variant="outline" className="mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-transparent">
                    {user.role}
                  </Badge>
                </div>

                <DropdownMenuItem
                  onClick={() => router.push(getDashboardLink())}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:bg-muted rounded-md transition-colors cursor-pointer w-full mt-1"
                >
                  <LayoutDashboard className="w-4 h-4 text-red-500" />
                  <span>Dashboard</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:bg-muted rounded-md transition-colors cursor-pointer w-full"
                >
                  <Settings className="w-4 h-4 text-orange-500" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="border-t border-border/60 my-1" />

                <DropdownMenuItem
                  onClick={() => logout()}
                  variant="destructive"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Logged Out state */
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-red-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-red-500/20 hover:from-red-700 hover:to-orange-600 hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-foreground/80"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-foreground hover:text-red-600"
          >
            Home
          </Link>
          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-foreground hover:text-red-600"
          >
            Browse Menu
          </Link>
          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-foreground hover:text-red-600"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-foreground hover:text-red-600"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left py-2 text-base font-medium text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-border text-foreground font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
