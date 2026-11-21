import React, { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  subtext?: string;
  highlightColor?: string;
}

export default function StatsCard({ label, value, icon, subtext, highlightColor }: StatsCardProps) {
  return (
    <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        {icon && <div className="text-foreground/70">{icon}</div>}
      </div>
      <div className={`text-3xl font-black ${highlightColor || 'text-foreground'}`}>{value}</div>
      {subtext && <p className="text-[11px] text-muted-foreground">{subtext}</p>}
    </div>
  );
}
