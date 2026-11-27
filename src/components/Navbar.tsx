'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
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
  const { resolvedTheme, setTheme } = useTheme(); const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []);
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0d0c0a]/90 border-b border-[#282420] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Styled like ODDAWORLD PIZZA CO. */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-black font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Pizza className="w-5 h-5 fill-black stroke-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-widest uppercase text-white font-serif leading-none">
              PIZZAHUB
            </span>
            <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#9a9085] mt-1">
              PIZZA CO.
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links - Styled exactly like the pill container in reference */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#181613] border border-[#2c2722]">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
              isActive('/')
                ? 'bg-amber-500 text-black shadow-xs font-black'
                : 'text-[#9a9085] hover:text-white'
            }`}
          >
            <span>🏠 Home</span>
          </Link>
          <Link
            href="/menu"
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
              isActive('/menu')
                ? 'bg-amber-500 text-black shadow-xs font-black'
                : 'text-[#9a9085] hover:text-white'
            }`}
          >
            Menu
          </Link>
          {/* Role specific link if logged in */}
          {user && (
            <Link
              href={getDashboardLink()}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                pathname.startsWith('/dashboard')
                  ? 'bg-amber-500 text-black shadow-xs font-black'
                  : 'text-[#9a9085] hover:text-white'
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right actions: Search icon, Cart badge, User Account */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/menu"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#9a9085] hover:text-white hover:bg-[#1f1b17] transition-all"
            title="Search menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* User Logged In state */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-full border border-[#2c2722] bg-[#181613] hover:bg-[#221e1a] transition-all cursor-pointer outline-none">
                <Avatar className="w-8 h-8 border border-amber-500/40">
                  {user.image && <AvatarImage src={user.image} alt={user.name} />}
                  <AvatarFallback className="bg-amber-500 text-black font-black text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3.5 h-3.5 text-[#9a9085] mr-1" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 rounded-2xl bg-[#151311] border border-[#282420] shadow-2xl p-2 z-50 text-white">
                <div className="px-3 py-2 border-b border-[#282420]">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-[#9a9085] truncate">{user.email}</p>
                  <Badge className="mt-1.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-400 border-amber-500/30">
                    {user.role}
                  </Badge>
                </div>

                <DropdownMenuItem
                  onClick={() => router.push(getDashboardLink())}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#9a9085] hover:text-white hover:bg-[#201c18] rounded-xl transition-colors cursor-pointer w-full mt-1"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-500" />
                  <span>Dashboard</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#9a9085] hover:text-white hover:bg-[#201c18] rounded-xl transition-colors cursor-pointer w-full"
                >
                  <Settings className="w-4 h-4 text-stone-400" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="border-t border-[#282420] my-1" />

                <DropdownMenuItem
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#9a9085] hover:text-white hover:bg-[#1f1b17] transition-all"
                title="Sign In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-foreground/80"
          >
            {mounted ? (resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />) : <span className="block w-5 h-5" />}
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
