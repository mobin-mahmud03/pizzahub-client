'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { FALLBACK_MENU_ITEMS } from '@/data/mockData';
import {
  Pizza,
  ArrowRight,
  Flame,
  Star,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles,
  MapPin,
  ChevronRight,
  HeartHandshake,
  UtensilsCrossed,
  Award,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import PizzaCard from '@/components/PizzaCard';

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
    name: string;
    businessName: string;
    image?: string;
    subscriptionPlan?: string;
  };
}

const CATEGORIES = [
  {
    name: 'Classic Pizzas',
    icon: '🍕',
    desc: 'Timeless Italian recipes with San Marzano tomatoes & pure mozzarella',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600',
  },
  {
    name: 'Vegetarian Pizzas',
    icon: '🌿',
    desc: 'Loaded with fire-roasted veggies, herbs, and gourmet artisanal cheeses',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
  },
  {
    name: 'Meat Lovers',
    icon: '🥩',
    desc: 'Sausage, hand-cut pepperoni, crispy bacon, and smoky barbecue beef',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600',
  },
  {
    name: 'Specialty / Gourmet Pizzas',
    icon: '✨',
    desc: 'Truffle mushrooms, prosciutto di Parma, and chef-curated toppings',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600',
  },
  {
    name: 'Sides & Appetizers',
    icon: '🥖',
    desc: 'Garlic herb dough knots, crispy buffalo wings, and melted dips',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600',
  },
  {
    name: 'Beverages & Desserts',
    icon: '🍰',
    desc: 'Classic Italian tiramisu, artisan sparkling sodas, and sweet treats',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600',
  },
];

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>(FALLBACK_MENU_ITEMS.slice(0, 6) as any);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/menu/featured');
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setFeaturedItems(res.data.data);
        } else {
          setFeaturedItems(FALLBACK_MENU_ITEMS.slice(0, 6) as any);
        }
      } catch (err) {
        setFeaturedItems(FALLBACK_MENU_ITEMS.slice(0, 6) as any);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* 1. HERO BANNER SECTION - ODDAWORLD THEME */}
      <section className="relative overflow-hidden bg-[#0d0c0a] pt-8 md:pt-16 pb-20 border-b border-[#282420]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              {/* Tagline: HOT. FRESH. DELICIOUS. */}
              <div className="text-xs font-black tracking-[0.25em] text-[#9a9085] uppercase">
                HOT. FRESH. <span className="text-red-500">DELICIOUS.</span>
              </div>

              {/* Bold Condensed Headline: FEEL THE PERFECT SLICE */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-[0.95] font-sans">
                FEEL THE <br />
                <span className="text-amber-500">PERFECT</span> SLICE
              </h1>

              <p className="text-sm sm:text-base text-[#9a9085] max-w-md leading-relaxed font-normal">
                Handcrafted pizzas made with premium ingredients and baked to perfection in authentic wood-fired ovens.
              </p>

              {/* Action Buttons: ORDER NOW -> & Watch Our Story */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <Link
                  href="/menu"
                  className="px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-black bg-amber-500 hover:bg-amber-400 shadow-amber-glow hover:scale-105 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>ORDER NOW</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/menu"
                  className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 transition-all shadow-md">
                    <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black tracking-wide uppercase">Watch Our Story</span>
                    <span className="text-[10px] text-[#9a9085]">Play video</span>
                  </div>
                </Link>
              </div>

              {/* 4 Feature Badges from Reference: Fresh Ingredients, Wood Fired, Fast Delivery, Best Quality */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#221e1a]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                    <span>🍃</span>
                    <span className="text-white text-xs font-bold">Fresh Ingredients</span>
                  </div>
                  <span className="text-[10px] text-[#9a9085]">Premium & Natural</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                    <span>🔥</span>
                    <span className="text-white text-xs font-bold">Wood Fired</span>
                  </div>
                  <span className="text-[10px] text-[#9a9085]">Authentic Taste</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                    <span>🛵</span>
                    <span className="text-white text-xs font-bold">Fast Delivery</span>
                  </div>
                  <span className="text-[10px] text-[#9a9085]">30 Min. Guarantee</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                    <span>⚙️</span>
                    <span className="text-white text-xs font-bold">Best Quality</span>
                  </div>
                  <span className="text-[10px] text-[#9a9085]">Always Fresh</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Image - Cheese Pull Pizza on Wooden Board */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-6 relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[520px]">
                {/* 100% Satisfaction Guarantee Stamp from reference */}
                <div className="absolute top-4 right-4 z-10 w-20 h-20 rounded-full border border-dashed border-amber-500/70 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-1.5 shadow-xl">
                  <span className="text-[8px] uppercase tracking-widest text-[#9a9085]">PREMIUM QUALITY</span>
                  <span className="text-xs font-black text-amber-400 leading-none my-0.5">100%</span>
                  <span className="text-[8px] uppercase tracking-widest text-[#9a9085]">SATISFACTION</span>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000"
                  alt="Delicious Hot Pizza Slice Cheese Pull"
                  className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] rounded-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: OUR TOP PICKS (Exact match to reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#221e1a]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#9a9085]">
              HANDCRAFTED SPECIALS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans mt-0.5">
              OUR TOP PICKS
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-wider transition-colors"
          >
            <span>View All Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl border border-[#282420] bg-[#151311] p-4 space-y-4">
                <Skeleton className="w-full h-44 rounded-2xl bg-[#221e1a]" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4 rounded-md bg-[#221e1a]" />
                  <Skeleton className="h-4 w-1/2 rounded-md bg-[#221e1a]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {featuredItems.slice(0, 4).map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="h-full"
              >
                <PizzaCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 3. SPECIAL DEAL FOR YOU BANNER (From reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3e0f13] via-[#240c0f] to-[#120a0b] border border-red-950/60 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <span className="text-2xl font-black">%</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-white uppercase tracking-tight block">
                SPECIAL DEAL FOR YOU!
              </span>
              <p className="text-xs sm:text-sm text-[#d4b5b7] mt-0.5">
                Get <span className="text-amber-400 font-bold">20% OFF</span> on your first order
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 rounded-full border border-dashed border-amber-500/80 bg-black/40 text-amber-400 text-xs font-black tracking-widest uppercase">
              USE CODE: PIZZA20
            </div>
            <Link
              href="/menu"
              className="px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider text-black bg-amber-500 hover:bg-amber-400 transition-all cursor-pointer"
            >
              CLAIM NOW →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC SECTION 2: PIZZA CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Discover Every Style</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-serif tracking-tight">
            Explore by Category
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            From crispy crusts to gourmet truffles and sweet Italian desserts
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                href={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="group block relative rounded-3xl overflow-hidden border border-border bg-card p-6 shadow-sm hover:shadow-xl hover:border-red-500/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{cat.icon}</span>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/80 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-red-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cat.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. EXTRA SECTION: WHY CHOOSE PIZZAHUB? (Required) */}
      <section className="bg-gradient-to-r from-red-600/5 via-orange-500/5 to-amber-500/5 py-16 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>The PizzaHub Promise</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-serif tracking-tight">
              Why Choose PizzaHub?
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              We connect you directly to authentic neighborhood pizzaiolos who care about craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Rapid Hot Delivery</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Insulated pizza bags and optimized dispatch ensure your crust stays crispy and mozzarella stays piping hot.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Artisan Quality</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every vendor is verified. Real Italian olive oil, slow-fermented 72-hour sourdough, and San Marzano tomatoes.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Support Local Pizzerias</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We empower family-owned restaurants with vendor dashboard tools and fair terms, keeping local pizza culture thriving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXTRA SECTION: HOW PIZZAHUB WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4" />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-serif tracking-tight">
            How PizzaHub Works
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            From craving to doorbell in three easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="relative bg-card border border-border p-8 rounded-3xl shadow-sm space-y-3">
            <span className="text-5xl font-black text-red-500/20 absolute top-4 right-6">01</span>
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-foreground">Browse & Filter</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore authentic menus, filter by area/city, pizza styles, and dietary preferences.
            </p>
          </div>

          <div className="relative bg-card border border-border p-8 rounded-3xl shadow-sm space-y-3">
            <span className="text-5xl font-black text-orange-500/20 absolute top-4 right-6">02</span>
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-foreground">Schedule Delivery</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pick your preferred delivery date, address, and special crust/topping instructions.
            </p>
          </div>

          <div className="relative bg-card border border-border p-8 rounded-3xl shadow-sm space-y-3">
            <span className="text-5xl font-black text-amber-500/20 absolute top-4 right-6">03</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-foreground">Track & Enjoy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Watch your order progress from prep to oven, and enjoy fresh steaming slices.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white p-8 md:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black font-serif tracking-tight">
              Hungry For Real Pizza?
            </h2>
            <p className="text-white/80 text-sm md:text-base max-w-lg">
              Explore hundreds of handcrafted pizzas from top local vendors and have them delivered piping hot today!
            </p>
          </div>
          <Link
            href="/menu"
            className="px-8 py-4 rounded-full bg-white text-red-600 hover:bg-neutral-100 font-extrabold text-base shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            Order Pizza Now
          </Link>
        </div>
      </section>
    </div>
  );
}
