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
  MapPin,
  Pizza,
  AlertTriangle,
  ChevronRight,
  Store,
} from 'lucide-react';

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
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load customer orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this pending order?')) return;

    try {
      const res = await api.patch(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        toast.success('Order cancelled successfully.');
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(null);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  // Overview metrics
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const acceptedCount = orders.filter((o) => o.status === 'accepted').length;
  const rejectedCount = orders.filter((o) => o.status === 'rejected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
          Customer Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your pizza orders, scheduled deliveries, and order timelines
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

      {/* Orders List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">My Orders History</h2>
          <Link
            href="/menu"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>Order Another Pizza</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card border border-border p-12 rounded-3xl text-center space-y-3">
            <Pizza className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <h3 className="text-lg font-bold text-foreground">No orders yet</h3>
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
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-red-500/20 transition-all"
              >
                {/* Item & Vendor Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'}
                    alt={order.itemId?.itemName || 'Pizza'}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-border"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground truncate">
                        {order.itemId?.itemName || 'Gourmet Pizza'}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Store className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">
                        {order.vendorId?.businessName || order.vendorId?.name || 'Local Pizzeria'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-red-500" />
                        Delivery: {formatDate(order.deliveryDate)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {order.deliveryAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status, Price & Actions */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-border/80">
                  <div className="text-left md:text-right">
                    <div className="text-lg font-black text-red-600">
                      {formatCurrency(order.itemId?.price || 0)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Requested: {formatDate(order.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
                    >
                      View Timeline
                    </button>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-500/30 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Status Timeline Modal (Optional Requirement #3) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Order Status Timeline
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Order #{selectedOrder._id.slice(-6)} • {selectedOrder.itemId?.itemName}
                </p>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Timeline Steps */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                selectedOrder.statusHistory.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-background">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                        {step.status}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.note}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {new Date(step.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-foreground">Order Placed</p>
                    <p className="text-xs text-muted-foreground">Order has been dispatched to restaurant.</p>
                  </div>
                </div>
              )}
            </div>

            {selectedOrder.message && (
              <div className="p-3.5 rounded-xl bg-muted text-xs text-foreground/80 space-y-1">
                <span className="font-bold">Special Instructions:</span>
                <p>{selectedOrder.message}</p>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
