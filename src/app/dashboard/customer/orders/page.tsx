'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  Pizza,
  ChevronRight,
  Store,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export interface OrderItem {
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

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

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

  const handleCancelOrder = (orderId: string) => {
    toast('Are you sure you want to cancel this pending order?', {
      action: {
        label: 'Cancel Order',
        onClick: async () => {
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
        },
      },
      cancel: {
        label: 'Keep Order',
        onClick: () => {},
      },
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your pizza orders, scheduled deliveries, and live order status
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          <span>Order Another Pizza</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
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
                    <StatusBadge status={order.status} />
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

              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                <div className="text-right">
                  <div className="text-sm font-black text-red-600">
                    {formatCurrency(order.itemId?.price || 0)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                    className="h-9 px-3.5 rounded-xl text-xs font-semibold"
                  >
                    View Timeline
                  </Button>

                  {order.status === 'pending' && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelOrder(order._id)}
                      className="h-9 px-3.5 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Status Timeline Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        {selectedOrder && (
          <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8 border-border bg-card shadow-2xl">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-xl font-bold text-foreground">
                    Order Status Timeline
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Order #{selectedOrder._id.slice(-6)} • {selectedOrder.itemId?.itemName}
                  </DialogDescription>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>
            </DialogHeader>

            {/* Timeline Steps */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border my-2">
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

            <Button
              variant="outline"
              onClick={() => setSelectedOrder(null)}
              className="w-full h-10 rounded-xl text-xs font-bold"
            >
              Close
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
