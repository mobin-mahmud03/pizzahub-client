import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'approved' | 'inactive';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="gap-1 px-2.5 py-1 rounded-full text-xs font-bold border-amber-200 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="capitalize">{status}</span>
        </Badge>
      );
    case 'accepted':
    case 'approved':
      return (
        <Badge variant="outline" className="gap-1 px-2.5 py-1 rounded-full text-xs font-bold border-emerald-200 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="capitalize">{status}</span>
        </Badge>
      );
    case 'rejected':
    case 'cancelled':
      return (
        <Badge variant="outline" className="gap-1 px-2.5 py-1 rounded-full text-xs font-bold border-red-200 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400">
          <XCircle className="w-3.5 h-3.5" />
          <span className="capitalize">{status}</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1 px-2.5 py-1 rounded-full text-xs font-bold border-zinc-200 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="capitalize">{status}</span>
        </Badge>
      );
  }
}
