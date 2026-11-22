'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async (itemId: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/users/favorites/toggle', { itemId });
      if (res.data.success) {
        setFavorites(res.data.favorites);
        toast.success(res.data.message);
      }
    } catch (err: any) {
      toast.error('Sign in as customer to save favorites.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorited = (itemId: string) => favorites.includes(itemId);

  return { favorites, toggleFavorite, isFavorited, isLoading };
}
