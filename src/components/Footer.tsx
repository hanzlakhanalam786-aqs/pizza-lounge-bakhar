import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAdmin: () => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin, onOpenTrackOrder }) => {
  return (
    <footer className="bg-[#050505] border-t border-zinc-800 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6321] rounded-full flex items-center justify-center font-black text-black text-xl shadow-lg shadow-[#FF6321]/20 font-cinzel">
                P
              </div>
              <div>
                <span className="font-cinzel font-black tracking-wider text-lg text-white block">
                  PIZZA LOUNGE
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF6321] font-bold block">
                  &amp; CAKES • BHAKKAR
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Freshly prepared pizzas, crispy zinger burgers, stuffed crust creations, thick milkshakes, and handcrafted birthday cakes on Jhang Road, near Gulshan-e-Madina, Bhakkar.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://web.facebook.com/p/Pizza-Lounge-61565505575384/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2]/15 text-[#1877F2] border border-[#1877F2]/30 text-xs font-bold hover:bg-[#1877F2]/25 transition-colors"
              >
                <span>Facebook</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://www.instagram.com/pizzalounge_01/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30 text-xs font-bold hover:bg-pink-500/25 transition-colors"
              >
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://wa.me/923218865050?text=Hello%20Pizza%20Lounge%20%26%20Cakes%20Bhakkar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/25 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#FF6321] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#FF6321] transition-colors cursor-pointer"
                >
                  Fast Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cakes-in-bhakkar')}
                  className="hover:text-[#FF6321] transition-colors cursor-pointer"
                >
                  Cakes &amp; Bakery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deals')}
                  className="hover:text-[#FF6321] transition-colors cursor-pointer"
                >
                  Special Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-[#FF6321] transition-colors cursor-pointer"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrackOrder}
                  className="text-[#FF6321] hover:underline transition-colors cursor-pointer font-bold"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Hours & Helpline */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">Opening Hours</h4>
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Mon – Thu:</span>
                <span className="text-white font-mono">11:00 AM – 1:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Friday:</span>
                <span className="text-[#FF6321] font-mono font-bold">10:00 AM – 1:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Sat – Sun:</span>
                <span className="text-white font-mono">11:00 AM – 1:30 AM</span>
              </div>
              <p className="text-[11px] text-zinc-500 pt-1">
                Open 7 days a week till 1:30 AM for dine-in &amp; delivery.
              </p>
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">Location</h4>
            <div className="space-y-2 text-xs">
              <p className="text-zinc-300">
                J34R+JX6 Pizza Lounge, Jhang Rd, near Gulshan-e-Madina, Bhakkar, 30000, Punjab, Pakistan.
              </p>
              <div className="pt-1">
                <a
                  href="https://www.google.com/search?q=pizza+lounge+and+cakes+bhakkar+address"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF6321] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            &copy; 2026 PIZZA LOUNGE &amp; CAKES Bhakkar. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact Us
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-zinc-400 hover:text-[#FF6321] transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
