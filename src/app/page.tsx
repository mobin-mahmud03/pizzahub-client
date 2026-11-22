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
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-600/10 via-orange-500/5 to-transparent pt-12 md:pt-20 pb-16 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-current animate-bounce" />
                <span>Wood-Fired & Delivered Hot</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground font-serif tracking-tight leading-[1.1]">
                Hot & Fresh Pizza <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">
                  Delivered to Your Door
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect with neighborhood artisan pizzerias. From authentic Neapolitan wood-fired pies to hearty deep dishes, discover your next favorite slice in minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-xl shadow-red-500/25 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore Pizza Menu</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-7 py-4 rounded-full font-semibold text-base text-foreground border border-border hover:bg-muted transition-all text-center"
                >
                  Partner as Restaurant
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/80">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-red-600">30 Min</span>
                  <span className="text-xs text-muted-foreground">Average Delivery</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-orange-500">100%</span>
                  <span className="text-xs text-muted-foreground">Fresh Dough & Sauce</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-amber-500">4.9 ★</span>
                  <span className="text-xs text-muted-foreground">Customer Satisfaction</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto w-72 h-72 sm:w-96 sm:h-96 rounded-full p-3 bg-gradient-to-tr from-red-500 to-amber-400 shadow-2xl shadow-orange-500/20">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800"
                  alt="Delicious Hot Pizza"
                  className="w-full h-full object-cover rounded-full shadow-inner animate-[spin_60s_linear_infinite]"
                />
              </div>

              {/* Floating review card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 -left-4 sm:left-4 bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 font-bold">
                  🍕
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-xs font-bold text-foreground">Best Crust in New York!</p>
                  <p className="text-[10px] text-muted-foreground">Over 1,200+ Reviews</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: FEATURED MENU ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Specials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-serif tracking-tight">
              Featured Menu Items
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Top-rated oven specials from our certified artisan kitchens
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 mt-4 md:mt-0 transition-colors"
          >
            <span>View All Items</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-3xl border border-border bg-card p-4 space-y-4 animate-pulse">
                <div className="w-full h-48 rounded-2xl bg-muted" />
                <div className="h-5 bg-muted rounded-md w-3/4" />
                <div className="h-4 bg-muted rounded-md w-1/2" />
                <div className="h-10 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
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

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      {item.vendorId && (
                        <div className="truncate font-medium text-foreground/80">
                          by {item.vendorId.businessName || item.vendorId.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/menu/${item._id}`}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-center text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/20 hover:shadow-lg transition-all"
                  >
                    View Details & Order
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 3. DYNAMIC SECTION 2: PIZZA CATEGORIES */}
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
