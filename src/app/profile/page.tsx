'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { User as UserIcon, Mail, Store, Image as ImageIcon, Shield, Save } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [isSaving, setIsSaving] = useState(false);

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
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
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
          {image ? (
            <img src={image} alt={name} className="w-20 h-20 rounded-full object-cover border-2 border-red-500/30" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950 text-red-600 font-bold text-2xl flex items-center justify-center">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-bold text-foreground text-lg">{name || 'Your Name'}</h3>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Email Address (Protected)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-muted/60 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {user?.role === 'vendor' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Restaurant / Business Name
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Profile Image URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
