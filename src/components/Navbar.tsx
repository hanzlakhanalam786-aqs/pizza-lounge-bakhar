import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, Menu as MenuIcon, X, MapPin, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenTrackOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenTrackOrder }) => {
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Check if restaurant is currently open based on local Pakistan time
  useEffect(() => {
    const checkOpenStatus = () => {
      // Pakistan is UTC+5. Opening hours:
      // Mon-Thu, Sat-Sun: 11:00 AM – 1:30 AM
      // Friday: 10:00 AM – 1:30 AM
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const pkt = new Date(utc + 3600000 * 5);
      const day = pkt.getDay(); // 0 is Sunday, 5 is Friday
      const hour = pkt.getHours() + pkt.getMinutes() / 60;

      const openHour = day === 5 ? 10.0 : 11.0;
      // Open from openHour until midnight (24) OR from midnight until 1.5 (1:30 AM)
      const open = hour >= openHour || hour < 1.5;
      setIsOpenNow(open);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Menu', view: 'menu' },
    { label: 'Cakes', view: 'cakes-in-bhakkar' },
    { label: 'Deals', view: 'deals' },
    { label: 'Reviews', view: 'reviews' },
    { label: 'About & Contact', view: 'contact' },
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 bg-[#FF6321] rounded-full flex items-center justify-center font-black text-black text-xl shadow-lg shadow-[#FF6321]/20 group-hover:scale-105 transition-transform duration-200 shrink-0 font-cinzel">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel font-black tracking-wider text-lg sm:text-xl leading-none text-white group-hover:text-[#FF6321] transition-colors">
              PIZZA LOUNGE
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF6321] font-bold mt-0.5 flex items-center gap-1.5 font-sans">
              <span>&amp; CAKES • BHAKKAR</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600 hidden sm:inline-block" />
              <span
                className={`hidden sm:inline-flex items-center gap-1 ${
                  isOpenNow ? 'text-emerald-400 font-semibold tracking-normal' : 'text-zinc-400 font-semibold tracking-normal'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                {isOpenNow ? 'Open Now' : 'Opens 11AM'}
              </span>
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-[#FF6321]'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:text-[#FF6321]'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <button
            onClick={onOpenTrackOrder}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-[#FF6321] hover:bg-zinc-800/80 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-3 h-3 text-[#FF6321]" />
            <span>Track Order</span>
          </button>
        </nav>

        {/* Action Buttons (Call Now & Order Now) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <a
            href="tel:03218865050"
            className="px-4 py-2 bg-zinc-800/90 rounded-full text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-700 border border-zinc-700/60 transition-colors inline-flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-[#FF6321]" />
            <span className="font-mono">0321 8865050</span>
          </a>

          <button
            onClick={openCart}
            className="px-4 py-2 bg-[#FF6321] text-black rounded-full text-xs font-black hover:bg-[#e5591e] transition-all shadow-md shadow-[#FF6321]/20 inline-flex items-center gap-1.5 transform hover:scale-[1.02] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ORDER NOW</span>
            {itemCount > 0 && (
              <span className="ml-0.5 bg-black text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={openCart}
            className="px-3 py-1.5 rounded-full bg-[#FF6321] text-black font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ORDER {itemCount > 0 ? `(${itemCount})` : ''}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-full bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[80px] bg-[#0A0A0A]/95 border-b border-zinc-800 shadow-2xl p-6 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 z-50">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-transparent cursor-pointer ${
                  currentView === link.view
                    ? 'bg-zinc-800 text-[#FF6321] border-zinc-700'
                    : 'text-zinc-200 hover:text-[#FF6321] hover:bg-zinc-900 hover:border-zinc-800'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackOrder();
              }}
              className="text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#FF6321] hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Track Active Order</span>
            </button>

            <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-2">
              <a
                href="tel:03218865050"
                className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-zinc-800 text-zinc-200 font-bold text-xs border border-zinc-700"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>CALL NOW</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#FF6321] text-black font-black text-xs shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>VIEW BAG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
