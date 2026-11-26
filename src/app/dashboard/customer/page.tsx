'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Pizza,
  ChevronRight,
  Store,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface OrderItem {
  _id: string;
  itemId: {
    _id: string;
    itemName: string;
    price: number;
    images: string[];
    category: string;
  };
  vendorId: {
    _id: string;
    name: string;
    businessName: string;
    image?: string;
  };
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load customer orders', err);
      toast.error('Failed to load customer orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const acceptedCount = orders.filter((o) => o.status === 'accepted').length;
  const rejectedCount = orders.filter((o) => o.status === 'rejected').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
          Customer Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome to your customer dashboard. View order stats and quick activity.
        </p>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{totalCount}</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-500">{pendingCount}</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Accepted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-500">{acceptedCount}</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-black text-red-500">{rejectedCount}</div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
          <Link
            href="/dashboard/customer/orders"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-center justify-between gap-5">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48 rounded-md" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card border border-border p-12 rounded-3xl text-center space-y-3">
            <Pizza className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <h3 className="text-lg font-bold text-foreground">No orders placed yet</h3>
            <p className="text-xs text-muted-foreground">
              You haven&apos;t placed any pizza orders yet. Check out our menu to order hot slices!
            </p>
            <Link
              href="/menu"
              className="inline-block px-6 py-2.5 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order._id}
                className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-red-500/20 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'}
                    alt={order.itemId?.itemName || 'Pizza'}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-border"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground truncate">
                        {order.itemId?.itemName || 'Gourmet Pizza'}
                      </h3>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Store className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">
                        {order.vendorId?.businessName || order.vendorId?.name || 'Local Pizzeria'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-red-500" />
                        {formatDate(order.deliveryDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-sm font-black text-red-600">
                      {formatCurrency(order.itemId?.price || 0)}
                    </div>
                  </div>
                  <Link href="/dashboard/customer/orders">
                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-xl text-xs font-semibold">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
