import React from 'react';
import Link from 'next/link';
import { Pizza, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white">
                <Pizza className="w-5 h-5" />
              </div>
              <span className="text-xl font-black font-serif">
                Pizza<span className="text-red-600">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your neighborhood pizza ordering & delivery destination. Connecting artisan local pizzerias with pizza lovers everywhere. Fresh dough, melted mozzarella, lightning delivery.
            </p>
            {/* Social Icons with the New X Logo */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground/80 hover:bg-red-600 hover:text-white transition-all"
                title="X (formerly Twitter)"
                aria-label="X"
              >
                {/* Modern X logo SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground/80 hover:bg-red-600 hover:text-white transition-all"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground/80 hover:bg-red-600 hover:text-white transition-all"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground/80 hover:bg-red-600 hover:text-white transition-all"
                title="YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-red-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-red-600 transition-colors">
                  Browse Pizza Menu
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Classic+Pizzas" className="text-muted-foreground hover:text-red-600 transition-colors">
                  Classic Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Vegetarian+Pizzas" className="text-muted-foreground hover:text-red-600 transition-colors">
                  Vegetarian Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Meat+Lovers" className="text-muted-foreground hover:text-red-600 transition-colors">
                  Meat Lovers
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendors & Partners */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground mb-4">
              For Restaurants
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/auth/register" className="text-muted-foreground hover:text-red-600 transition-colors">
                  Become a Partner Vendor
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/subscription" className="text-muted-foreground hover:text-red-600 transition-colors">
                  Vendor Premium Plan
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-muted-foreground hover:text-red-600 transition-colors">
                  Vendor Portal
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-red-600 transition-colors">
                  Partner Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground mb-4">
              Contact & Support
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>742 Little Italy Way, Brooklyn, NY 11201</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+1 (800) 555-PIZZA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>support@pizzahub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} PizzaHub Inc. All rights reserved. Built with passion for pizza.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-red-600 transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-red-600 transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
