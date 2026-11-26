'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type T = 'light' | 'dark' | 'system';
const Ctx = createContext<{ resolvedTheme?: 'light' | 'dark'; setTheme: (t: T) => void }>({ setTheme: () => {} });
export const useTheme = () => useContext(Ctx);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [resolvedTheme, setResolved] = useState<'light' | 'dark'>();
  const apply = (t: T) => {
    const r = t === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t;
    document.documentElement.classList.toggle('dark', r === 'dark');
    document.documentElement.style.colorScheme = r;
    setResolved(r);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { apply((localStorage.getItem('theme') as T) || 'system'); }, []);
  const setTheme = (t: T) => { localStorage.setItem('theme', t); apply(t); };
  return <Ctx.Provider value={{ resolvedTheme, setTheme }}>{children}</Ctx.Provider>;
}