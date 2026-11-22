import React, { ReactNode } from 'react';
import { Pizza } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-card border border-border p-12 rounded-3xl text-center space-y-3">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
        <Pizza className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
