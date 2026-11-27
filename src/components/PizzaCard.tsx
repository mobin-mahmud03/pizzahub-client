import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Star, Award, MapPin, Store } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PizzaCardProps {
  item: {
    _id: string;
    itemName: string;
    category: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    averageRating: number;
    vendorId?: {
      name: string;
      businessName: string;
      subscriptionPlan?: string;
    };
  };
  onActionClick?: () => void;
  actionLabel?: string;
}

export default function PizzaCard({ item, onActionClick, actionLabel = 'Order Now' }: PizzaCardProps) {
  return (
    <Card className="group flex flex-col justify-between rounded-2xl border border-[#282420] bg-[#151311] overflow-hidden shadow-card-dark hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 h-full p-0 gap-0">
      {/* Pizza Image container with round top */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-[#1c1917] p-2.5">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <img
            src={item.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'}
            alt={item.itemName}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Badge in top-left like BESTSELLER / NEW in reference */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          {item.vendorId?.subscriptionPlan === 'premium' ? (
            <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
              BESTSELLER
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md">
              HOT
            </span>
          )}
        </div>
      </div>

      {/* Card Content exactly matching reference layout */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate font-sans">
            {item.itemName}
          </h3>

          <p className="text-[11px] text-[#9a9085] line-clamp-2 leading-snug mt-1 font-normal">
            {item.description}
          </p>
        </div>

        {/* Bottom Row: Price on left, Round Golden (+) Add/Order Button on right */}
        <div className="flex items-center justify-between pt-2 border-t border-[#221e1a] mt-auto">
          <span className="text-base font-black text-white font-sans">
            {formatCurrency(item.price)}
          </span>

          {onActionClick ? (
            <button
              onClick={onActionClick}
              className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-black flex items-center justify-center text-lg leading-none shadow-amber-glow hover:scale-110 transition-all cursor-pointer"
              title="Add to order"
            >
              +
            </button>
          ) : (
            <Link
              href={`/menu/${item._id}`}
              className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-black flex items-center justify-center text-lg leading-none shadow-amber-glow hover:scale-110 transition-all cursor-pointer"
              title="View & order"
            >
              +
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
