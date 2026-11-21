'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  MapPin,
  Star,
  Award,
  Store,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  averageRating: number;
  numReviews: number;
  vendorId: {
    _id: string;
    name: string;
    businessName: string;
    image?: string;
    email: string;
    subscriptionPlan?: string;
  };
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerId: {
    _id: string;
    name: string;
    image?: string;
  };
}

export default function ItemDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    // If not logged in and auth finished checking, redirect to login
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/menu/${id}`);
      return;
    }

    const fetchItemDetails = async () => {
      try {
        const res = await api.get(`/menu/${id}`);
        if (res.data.success) {
          setItem(res.data.data);
          setSelectedImage(res.data.data.images[0] || '');
        }
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Invalid menu item ID or item not found.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${id}`);
        if (res.data.success) {
          setReviews(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };

    if (id) {
      fetchItemDetails();
      fetchReviews();
    }
  }, [id, user, authLoading, router]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryDate || !deliveryAddress) {
      toast.error('Please provide a delivery date and address.');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const res = await api.post('/orders', {
        itemId: item?._id,
        deliveryDate,
        deliveryAddress,
        message,
      });

      if (res.data.success) {
        toast.success('Pizza order submitted successfully! You can track it in your dashboard.');
        setIsOrderModalOpen(false);
        router.push('/dashboard/customer');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to place order.';
      toast.error(msg);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewComment.trim()) {
      toast.error('Please enter your review feedback.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        itemId: item?._id,
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res.data.success) {
        toast.success('Review posted successfully!');
        setReviewComment('');
        // Refresh reviews and item rating
        const refreshedReviews = await api.get(`/reviews/${id}`);
        setReviews(refreshedReviews.data.data || []);
        if (item) {
          setItem({
            ...item,
            averageRating: res.data.data.averageRating,
            numReviews: res.data.data.numReviews,
          });
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading oven special...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !item) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Item Unavailable</h2>
        <p className="text-sm text-muted-foreground">{errorMsg || 'Menu item could not be found.'}</p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-red-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>
    );
  }

  // Business restrictions checks
  const isVendorSelfItem = user?.role === 'vendor' && item.vendorId._id === user?.id;
  const isAdminUser = user?.role === 'admin';
  const canOrder = !isVendorSelfItem && !isAdminUser && item.status === 'approved';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
      {/* Back button */}
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-red-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Browse Menu</span>
      </Link>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Multi-Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-80 sm:h-96 md:h-[460px] w-full rounded-3xl overflow-hidden border border-border shadow-md bg-muted">
            <img
              src={selectedImage || item.images[0]}
              alt={item.itemName}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {item.vendorId.subscriptionPlan === 'premium' && (
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Premium Artisan Kitchen</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {item.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {item.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImage === img ? 'border-red-600 ring-2 ring-red-500/20' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Ordering Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{item.averageRating > 0 ? item.averageRating : '4.8'}</span>
                <span className="text-xs text-muted-foreground font-normal">({item.numReviews || reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-foreground font-serif tracking-tight">
              {item.itemName}
            </h1>

            <div className="text-3xl font-black text-red-600">
              {formatCurrency(item.price)}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>

            {/* Vendor Profile Card */}
            <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-3">
              {item.vendorId.image ? (
                <img
                  src={item.vendorId.image}
                  alt={item.vendorId.name}
                  className="w-12 h-12 rounded-full object-cover border border-red-500/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Store className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pizzeria Kitchen</p>
                <p className="text-sm font-bold text-foreground truncate">{item.vendorId.businessName || item.vendorId.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>

            {/* Business Rule Warnings */}
            {isVendorSelfItem && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>You are the vendor of this item. Vendors cannot order their own items.</span>
              </div>
            )}

            {isAdminUser && (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/30 text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>You are logged in as Administrator. Food orders are for customer accounts.</span>
              </div>
            )}
          </div>

          {/* Order Action Button */}
          <div>
            <button
              onClick={() => setIsOrderModalOpen(true)}
              disabled={!canOrder}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-xl shadow-red-500/25 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Order Now for {formatCurrency(item.price)}</span>
            </button>
            <p className="text-[11px] text-center text-muted-foreground mt-2">
              Direct checkout — No payment card required for pizza orders
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section (Optional Requirement #1) */}
      <section className="pt-8 border-t border-border/80 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground font-serif">
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-muted-foreground">Authentic verified feedback from pizza lovers</p>
          </div>
        </div>

        {/* Leave Review Form (Customer only) */}
        {user?.role === 'customer' && (
          <form onSubmit={handleReviewSubmit} className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-500" />
              <span>Leave Your Review</span>
            </h3>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-muted-foreground">Rating:</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was the crust, sauce, and delivery speed?"
                className="w-full p-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
            >
              {isSubmittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No reviews yet for this pizza. Be the first to leave one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-card border border-border p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                      {rev.customerId?.name?.charAt(0) || 'C'}
                    </div>
                    <span className="text-xs font-bold text-foreground">{rev.customerId?.name || 'Customer'}</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CUSTOMER ORDER MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-2xl font-black text-foreground font-serif tracking-tight">
                Complete Your Food Order
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Ordering <span className="font-bold text-red-600">{item.itemName}</span> from{' '}
                <span className="font-semibold text-foreground">{item.vendorId.businessName || item.vendorId.name}</span>
              </p>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Delivery Date *
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Delivery Address *
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. 742 Little Italy Way, Apt 3B, Brooklyn, NY"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Special Instructions / Additional Message
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Extra parmesan cheese, please ring doorbell upon arrival"
                  className="w-full p-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-muted border border-border/80 flex items-center justify-between text-sm">
                <span className="font-semibold text-muted-foreground">Total Price:</span>
                <span className="text-xl font-black text-red-600">{formatCurrency(item.price)}</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="w-1/2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingOrder ? 'Submitting...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
