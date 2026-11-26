'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { User as UserIcon, Mail, Store, Image as ImageIcon, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ProfileSettingsForm() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
      setBusinessName(user.businessName || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        image,
        businessName: user?.role === 'vendor' ? businessName : undefined,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Profile updated successfully!');
        updateUser(res.data.user);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
          Profile Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal details, profile picture, and pizzeria brand info
        </p>
      </div>

      <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-5 pb-6 border-b border-border/80">
          <Avatar className="w-20 h-20 border-2 border-red-500/30">
            {image && <AvatarImage src={image} alt={name} className="object-cover" />}
            <AvatarFallback className="bg-red-100 dark:bg-red-950 text-red-600 font-bold text-2xl">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-lg">{name || 'Your Name'}</h3>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <Badge variant="outline" className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-transparent">
              Role: {user?.role}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name *
            </Label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 z-10" />
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-xl border-input bg-background text-sm text-foreground focus-visible:ring-2 focus-visible:ring-red-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address (Protected)
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 z-10" />
              <Input
                type="email"
                disabled
                value={user?.email || ''}
                className="h-10 pl-10 pr-4 rounded-xl border-input bg-muted/60 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {user?.role === 'vendor' && (
            <div className="space-y-1.5">
              <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Restaurant / Business Name
              </Label>
              <div className="relative">
                <Store className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 z-10" />
                <Input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="h-10 pl-10 pr-4 rounded-xl border-input bg-background text-sm text-foreground focus-visible:ring-2 focus-visible:ring-orange-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profile Image URL (Optional)
            </Label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 z-10" />
              <Input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-10 pl-10 pr-4 rounded-xl border-input bg-background text-sm text-foreground focus-visible:ring-2 focus-visible:ring-red-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
