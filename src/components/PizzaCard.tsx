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

export default function PizzaCard({ item, onActionClick, actionLabel = 'View Details & Order' }: PizzaCardProps) {
  return (
    <Card className="group flex flex-col justify-between rounded-3xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-xl hover:border-red-500/30 transition-all duration-300 h-full p-0 gap-0">
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted">
        <img
          src={item.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'}
          alt={item.itemName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="px-3 py-1 rounded-full text-xs font-bold bg-background/90 backdrop-blur-md text-foreground shadow-xs border-transparent">
            {item.category}
          </Badge>
          {item.vendorId?.subscriptionPlan === 'premium' && (
            <Badge className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1 border-transparent">
              <Award className="w-3.5 h-3.5" />
              <span>Premium</span>
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-background/90 backdrop-blur-md text-foreground shadow-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{item.averageRating > 0 ? item.averageRating : '4.8'}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-xl font-bold text-foreground group-hover:text-red-600 transition-colors truncate">
              {item.itemName}
            </h3>
            <span className="text-lg font-black text-red-600 shrink-0">
              {formatCurrency(item.price)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
            {item.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/60 mt-auto">
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

        {onActionClick ? (
          <Button
            onClick={onActionClick}
            className="w-full py-2.5 px-4 h-auto rounded-xl font-bold text-sm text-center text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/20 hover:shadow-lg transition-all cursor-pointer"
          >
            {actionLabel}
          </Button>
        ) : (
          <Link
            href={`/menu/${item._id}`}
            className="w-full"
          >
            <Button
              className="w-full py-2.5 px-4 h-auto rounded-xl font-bold text-sm text-center text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md shadow-red-500/20 hover:shadow-lg transition-all"
            >
              {actionLabel}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
