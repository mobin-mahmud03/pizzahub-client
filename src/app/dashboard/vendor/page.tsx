'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Store,
  Pizza,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Edit,
  Trash2,
  Award,
  CreditCard,
  Upload,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  createdAt: string;
}

interface VendorOrder {
  _id: string;
  itemId: {
    _id: string;
    itemName: string;
    price: number;
    images: string[];
  };
  customerId: {
    _id: string;
    name: string;
    email: string;
  };
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
}

const CATEGORIES = [
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

export default function VendorDashboardPage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'orders' | 'subscription'>('overview');

  const [items, setItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Item Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);

  // Edit Item modal
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const fetchVendorData = async () => {
    setIsLoading(true);
    try {
      const [itemsRes, ordersRes] = await Promise.all([
        api.get('/menu/vendor/my-items'),
        api.get('/orders/vendor-orders'),
      ]);

      if (itemsRes.data.success) setItems(itemsRes.data.data || []);
      if (ordersRes.data.success) setOrders(ordersRes.data.data || []);
    } catch (err) {
      console.error('Failed to load vendor data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  // Handle ImgBB image upload simulation / upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'placeholder_imgbb_key';

    try {
      if (imgbbKey && imgbbKey !== 'placeholder_imgbb_key') {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.data?.url) {
          setImageUrl(data.data.url);
          toast.success('Image uploaded to ImgBB!');
        } else {
          throw new Error('Upload error');
        }
      } else {
        // Fallback realistic placeholder for dev preview
        setImageUrl('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800');
        toast.info('Using high-definition Unsplash pizza preview image for testing.');
      }
    } catch (err) {
      // Fallback preview
      setImageUrl('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800');
      toast.info('Using high-definition Unsplash preview image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Add Item Submit
  const handleAddItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName || !category || !description || !price || !location || !imageUrl) {
      toast.error('All fields including image are required.');
      return;
    }

    setIsSubmittingItem(true);
    try {
      const res = await api.post('/menu', {
        itemName,
        category,
        description,
        price: Number(price),
        location,
        images: [imageUrl],
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Menu item submitted for Admin approval!');
        setIsAddModalOpen(false);
        resetForm();
        fetchVendorData();
      }
    } catch (err: any) {
      if (err.response?.data?.code === 'UPGRADE_REQUIRED') {
        toast.error('Free plan limit (3 items) reached! Please upgrade to Premium.');
        setActiveTab('subscription');
      } else {
        toast.error(err.response?.data?.message || 'Failed to add menu item.');
      }
    } finally {
      setIsSubmittingItem(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const res = await api.delete(`/menu/${itemId}`);
      if (res.data.success) {
        toast.success('Menu item deleted.');
        fetchVendorData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete item.');
    }
  };

  // Toggle availability (active/inactive)
  const handleToggleStatus = async (item: MenuItem) => {
    const nextStatus = item.status === 'approved' ? 'inactive' : 'approved';
    try {
      const res = await api.put(`/menu/${item._id}`, { status: nextStatus });
      if (res.data.success) {
        toast.success(`Item marked as ${nextStatus}.`);
        fetchVendorData();
      }
    } catch (err: any) {
      toast.error('Failed to change status.');
    }
  };

  // Vendor accept/reject order (only pending orders, once only)
  const handleOrderStatusUpdate = async (orderId: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status });
      if (res.data.success) {
        toast.success(`Order ${status} successfully.`);
        fetchVendorData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  // Stripe Checkout Session Trigger
  const handleUpgradeSubscription = async () => {
    try {
      const res = await api.post('/stripe/create-checkout-session');
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        // Fallback test activation
        const verifyRes = await api.post('/stripe/verify-test-payment', {
          sessionId: res.data.sessionId,
        });
        if (verifyRes.data.success) {
          toast.success('Subscription upgraded to Premium!');
          refreshUser();
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate checkout.');
    }
  };

  const resetForm = () => {
    setItemName('');
    setCategory(CATEGORIES[0]);
    setDescription('');
    setPrice('');
    setLocation('');
    setImageUrl('');
  };

  // Metrics
  const totalItems = items.length;
  const activeItems = items.filter((i) => i.status === 'approved').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header with Title and Subscription Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
              {user?.businessName || "Vendor's Pizzeria"}
            </h1>
            {user?.subscriptionPlan === 'premium' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                <Award className="w-3.5 h-3.5" />
                <span>Premium Partner</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <span>Free Plan (Max 3 Items)</span>
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your oven menu items, incoming customer orders, and subscription benefits
          </p>
        </div>

        {user?.subscriptionPlan !== 'premium' && (
          <button
            onClick={() => setActiveTab('subscription')}
            className="px-5 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Upgrade to Premium</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'items'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          My Menu Items ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'subscription'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Subscription Plan
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">Total Menu Items</span>
              <div className="text-3xl font-black text-foreground">{totalItems}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">Active on Menu</span>
              <div className="text-3xl font-black text-emerald-500">{activeItems}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">Pending Orders</span>
              <div className="text-3xl font-black text-amber-500">{pendingOrders}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">Accepted Orders</span>
              <div className="text-3xl font-black text-emerald-600">{acceptedOrders}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1 col-span-2 lg:col-span-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">Plan Status</span>
              <div className="text-xl font-black text-orange-600 capitalize">
                {user?.subscriptionPlan || 'Free'}
              </div>
            </div>
          </div>

          {/* Quick Add CTA */}
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Want to add a new pizza specialty?</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.subscriptionPlan === 'premium'
                  ? 'You have unlimited menu items on the Premium Plan.'
                  : `Free Plan allows up to 3 active items. Currently using ${activeItems}/3.`}
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Menu Item</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MY MENU ITEMS TAB */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Published & Pending Menu Items</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-700 flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="bg-card border border-border p-12 rounded-3xl text-center space-y-3">
              <Pizza className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <h3 className="text-lg font-bold text-foreground">No menu items published yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Add your first pizza or beverage item. Submitted items are reviewed by Admin before going live.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-orange-600"
              >
                Create Item Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-muted">
                    <img
                      src={item.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      {item.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                          Approved & Active
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                          Pending Admin Review
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-xs">
                          Rejected
                        </span>
                      )}
                      {item.status === 'inactive' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-600 text-white shadow-xs">
                          Inactive / Paused
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-foreground text-base truncate">{item.itemName}</h3>
                        <span className="font-black text-orange-600 shrink-0">{formatCurrency(item.price)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                      <span className="inline-block mt-2 text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs">
                      {/* Availability toggle */}
                      {item.status !== 'pending' && item.status !== 'rejected' && (
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className="font-semibold text-foreground/80 hover:text-orange-600 cursor-pointer"
                        >
                          {item.status === 'approved' ? 'Pause Item' : 'Resume Item'}
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-red-500 hover:text-red-700 ml-auto flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. CUSTOMER ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Incoming Customer Orders</h2>

          {orders.length === 0 ? (
            <div className="bg-card border border-border p-12 rounded-3xl text-center space-y-2">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <h3 className="text-lg font-bold text-foreground">No customer orders yet</h3>
              <p className="text-xs text-muted-foreground">New orders from customers will appear here in real-time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'}
                      alt="Pizza"
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">{order.itemId?.itemName}</h3>
                        <span className="text-xs text-orange-600 font-bold">{formatCurrency(order.itemId?.price || 0)}</span>
                      </div>
                      <p className="text-xs text-foreground/80">
                        Customer: <span className="font-semibold">{order.customerId?.name}</span> ({order.customerId?.email})
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-red-500" />
                          Delivery Date: {formatDate(order.deliveryDate)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {order.deliveryAddress}
                        </span>
                      </div>
                      {order.message && (
                        <p className="text-xs text-muted-foreground italic pt-1">
                          Note: &quot;{order.message}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: Accept or Reject (Only pending, once only) */}
                  <div className="flex items-center gap-2 shrink-0">
                    {order.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleOrderStatusUpdate(order._id, 'accepted')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => handleOrderStatusUpdate(order._id, 'rejected')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-500/30 flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-muted capitalize text-foreground">
                        Status: {order.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. SUBSCRIPTION TAB (Free vs Premium) */}
      {activeTab === 'subscription' && (
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
              Restaurant Subscription Plans
            </h2>
            <p className="text-sm text-muted-foreground">
              Upgrade your pizzeria to unlock unlimited menu items and high-visibility featured placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan Card */}
            <div className="bg-card border border-border p-8 rounded-3xl shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground uppercase tracking-wider">
                  Basic Plan
                </span>
                <h3 className="text-2xl font-bold text-foreground">Free Tier</h3>
                <div className="text-3xl font-black text-foreground">$0 <span className="text-sm font-normal text-muted-foreground">/ month</span></div>

                <ul className="space-y-3 text-sm text-muted-foreground pt-4 border-t border-border">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Max 3 active menu items</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Basic vendor dashboard & analytics</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Customer order accept / reject</span>
                  </li>
                </ul>
              </div>

              {user?.subscriptionPlan === 'free' ? (
                <div className="w-full py-3 rounded-xl border border-border text-center text-xs font-bold text-muted-foreground bg-muted">
                  Current Active Plan
                </div>
              ) : null}
            </div>

            {/* Premium Plan Card */}
            <div className="bg-gradient-to-b from-orange-500/10 via-card to-card border-2 border-orange-500 p-8 rounded-3xl shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white">
                Recommended
              </div>

              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Pro Pizzeria
                </span>
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <span>Premium Tier</span>
                  <Award className="w-5 h-5 text-amber-500" />
                </h3>
                <div className="text-3xl font-black text-orange-600">$29.99 <span className="text-sm font-normal text-muted-foreground">/ month</span></div>

                <ul className="space-y-3 text-sm text-foreground/90 pt-4 border-t border-orange-500/30">
                  <li className="flex items-center gap-2.5 font-semibold text-orange-700 dark:text-orange-400">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Unlimited active menu items</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Premium Artisan Vendor Badge</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Featured placement on Homepage</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Priority customer order dispatch</span>
                  </li>
                </ul>
              </div>

              {user?.subscriptionPlan === 'premium' ? (
                <div className="w-full py-3 rounded-xl border border-emerald-500/30 text-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40">
                  ✓ Premium Active (Expires: {user?.subscriptionExpiresAt ? formatDate(user.subscriptionExpiresAt) : 'Active'})
                </div>
              ) : (
                <button
                  onClick={handleUpgradeSubscription}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Upgrade to Premium (Stripe)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD MENU ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-2xl font-black text-foreground font-serif tracking-tight">
                Add New Menu Item
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Item will have status <span className="font-bold text-amber-500">Pending</span> until approved by Admin
              </p>
            </div>

            <form onSubmit={handleAddItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Truffle Mushroom Deluxe"
                  className="w-full p-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-orange-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="18.99"
                    className="w-full p-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Restaurant Location / Area *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Downtown Brooklyn, NY"
                  className="w-full p-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="San Marzano tomato sauce, fresh buffalo mozzarella, wild truffles..."
                  className="w-full p-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Image Upload using ImgBB */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Item Image (ImgBB File Upload) *
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {isUploadingImage && <p className="text-xs text-orange-600 animate-pulse">Uploading file to ImgBB...</p>}
                  {imageUrl && (
                    <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-muted border border-border">
                      <img src={imageUrl} alt="Uploaded preview" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="text-xs text-muted-foreground truncate flex-1">{imageUrl}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingItem}
                  className="w-1/2 py-2.5 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-500/20 disabled:opacity-50"
                >
                  {isSubmittingItem ? 'Submitting...' : 'Submit Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
