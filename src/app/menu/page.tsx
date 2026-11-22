'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { FALLBACK_MENU_ITEMS } from '@/data/mockData';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Award,
  ArrowUpDown,
  Pizza,
  RotateCcw,
  Store,
} from 'lucide-react';

interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  averageRating: number;
  numReviews: number;
  vendorId?: {
    _id: string;
    name: string;
    businessName: string;
    image?: string;
    subscriptionPlan?: string;
  };
}

const CATEGORIES = [
  'All',
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [items, setItems] = useState<MenuItem[]>(FALLBACK_MENU_ITEMS as any);
  const [isLoading, setIsLoading] = useState(false);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (category && category !== 'All') params.append('category', category);
      if (location && location !== 'All') params.append('location', location);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/menu?${params.toString()}`);
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        setItems(res.data.data);
      } else {
        filterFallbackItems();
      }
    } catch (err) {
      filterFallbackItems();
    } finally {
      setIsLoading(false);
    }
  };

  const filterFallbackItems = () => {
    let result = [...FALLBACK_MENU_ITEMS] as any[];
    if (category && category !== 'All') {
      result = result.filter((i) => i.category === category);
    }
    if (location && location !== 'All') {
      result = result.filter((i) => i.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (searchTerm) {
      result = result.filter(
        (i) =>
          i.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.averageRating - a.averageRating);
    }
    setItems(result);
  };

  useEffect(() => {
    fetchMenu();
  }, [category, location, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMenu();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setLocation('All');
    setSort('newest');
  };

  // Click View Details handler
  const handleItemClick = (itemId: string) => {
    if (!user) {
      router.push(`/auth/login?redirect=/menu/${itemId}`);
    } else {
      router.push(`/menu/${itemId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground font-serif tracking-tight">
          Browse Pizza Menu
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore artisanal handcrafted pizzas, sides, and beverages freshly made to order
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border p-4 sm:p-6 rounded-3xl shadow-sm space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by pizza name, toppings, or ingredients..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/20 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filters and Sorting Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/60">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Location / Area
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="All">All Locations</option>
              <option value="Brooklyn">Brooklyn, NY</option>
              <option value="Greenwich Village">Greenwich Village, NY</option>
              <option value="Downtown">Downtown, NY</option>
            </select>
          </div>

          {/* Challenge 1: Price Sorting */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="newest">Newest Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reset Filters button if any active */}
        {(category !== 'All' || location !== 'All' || searchTerm || sort !== 'newest') && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Menu Items */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-4 space-y-4 animate-pulse">
              <div className="w-full h-52 rounded-2xl bg-muted" />
              <div className="h-5 bg-muted rounded-md w-3/4" />
              <div className="h-4 bg-muted rounded-md w-1/2" />
              <div className="h-10 bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-card rounded-3xl border border-border p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center">
            <Pizza className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No menu items found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We couldn&apos;t find any approved menu items matching your criteria. Try adjusting your search or filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-full font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-red-500/30 transition-all duration-300"
            >
              {/* Image & Badges */}
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <img
                  src={item.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'}
                  alt={item.itemName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-background/90 backdrop-blur-md text-foreground shadow-xs">
                    {item.category}
                  </span>
                  {item.vendorId?.subscriptionPlan === 'premium' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Premium</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-background/90 backdrop-blur-md text-foreground shadow-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.averageRating > 0 ? item.averageRating : '4.8'}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-red-600 transition-colors truncate">
                      {item.itemName}
                    </h3>
                    <span className="text-lg font-black text-red-600 shrink-0">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/60">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    {item.vendorId && (
                      <div className="flex items-center gap-1 truncate font-medium text-foreground/80">
                        <Store className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{item.vendorId.businessName || item.vendorId.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleItemClick(item._id)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-center text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/20 hover:shadow-lg transition-all cursor-pointer"
                >
                  View Details & Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrowseMenuPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground font-semibold">Loading artisanal menu...</p>
        </div>
      }
    >
      <MenuContent />
    </React.Suspense>
  );
}
