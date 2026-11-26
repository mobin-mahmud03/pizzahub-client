'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Pizza, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminItemsPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemSearch, setItemSearch] = useState('');
  const [itemStatusFilter, setItemStatusFilter] = useState('All');

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (itemSearch) params.append('search', itemSearch);
      if (itemStatusFilter !== 'All') params.append('status', itemStatusFilter);

      const res = await api.get(`/admin/menu-items?${params.toString()}`);
      if (res.data.success) {
        setMenuItems(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load menu items', err);
      toast.error('Failed to load menu items.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [itemStatusFilter]);

  const handleItemStatus = async (itemId: string, status: string) => {
    try {
      const res = await api.patch(`/admin/menu-items/${itemId}/status`, { status });
      if (res.data.success) {
        toast.success(`Item status updated to ${status}.`);
        fetchMenuItems();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update item status.');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    toast('Are you sure you want to permanently delete this menu item?', {
      action: {
        label: 'Delete Item',
        onClick: async () => {
          try {
            const res = await api.delete(`/admin/menu-items/${itemId}`);
            if (res.data.success) {
              toast.success('Menu item deleted successfully.');
              fetchMenuItems();
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete item.');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Pizza className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
            Menu Item Moderation
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Approve newly submitted vendor pizzas, reject low-quality listings, or manage existing menu items
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 z-10" />
          <Input
            type="text"
            value={itemSearch}
            onChange={(e) => setItemSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMenuItems()}
            placeholder="Search items by name, description, or vendor..."
            className="h-10 pl-10 pr-4 rounded-xl text-xs"
          />
        </div>

        <select
          value={itemStatusFilter}
          onChange={(e) => setItemStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-input bg-card text-xs text-foreground focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved & Live</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>

        <Button
          onClick={fetchMenuItems}
          className="h-10 px-4 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white"
        >
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border text-sm text-muted-foreground">
          No menu items found for the current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-card border border-border rounded-2xl p-4 shadow-xs flex flex-col justify-between gap-3 hover:border-red-500/20 transition-all"
            >
              <div>
                <img
                  src={item.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'}
                  alt={item.itemName}
                  className="w-full h-40 rounded-xl object-cover"
                />
                <div className="flex items-center justify-between pt-2">
                  <h3 className="font-bold text-foreground text-sm truncate">{item.itemName}</h3>
                  <span className="font-black text-red-600 text-sm">{formatCurrency(item.price)}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                <div className="text-[11px] text-muted-foreground pt-1">
                  Vendor: <span className="font-semibold text-foreground">{item.vendorId?.businessName || item.vendorId?.name}</span>
                </div>
                <div className="pt-1">
                  <Badge variant="outline" className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-muted text-foreground">
                    Status: {item.status}
                  </Badge>
                </div>
              </div>

              {/* Moderation Actions */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                {item.status === 'pending' ? (
                  <>
                    <Button
                      onClick={() => handleItemStatus(item._id, 'approved')}
                      className="w-1/2 h-8 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleItemStatus(item._id, 'rejected')}
                      className="w-1/2 h-8 rounded-lg text-xs font-bold text-red-600 border border-red-500/30 hover:bg-red-50 cursor-pointer"
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleItemStatus(item._id, item.status === 'approved' ? 'inactive' : 'approved')}
                      className="h-8 px-2.5 rounded-lg text-xs font-semibold"
                    >
                      {item.status === 'approved' ? 'Set Inactive' : 'Set Approved'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteItem(item._id)}
                      className="h-8 text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
