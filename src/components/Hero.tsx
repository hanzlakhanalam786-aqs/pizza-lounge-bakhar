import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Phone, MapPin, Star, Bike, Clock, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface HeroProps {
  onNavigate: (view: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { openCart } = useCart();
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    const checkOpen = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const pkt = new Date(utc + 3600000 * 5);
      const day = pkt.getDay();
      const hour = pkt.getHours() + pkt.getMinutes() / 60;
      const openHour = day === 5 ? 10.0 : 11.0;
      setIsOpenNow(hour >= openHour || hour < 1.5);
    };
    checkOpen();
    const interval = setInterval(checkOpen, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-[85vh] lg:min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0A0A]">
      {/* Background Ambience & Lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FF6321]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-[#FF6321]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Subtle background image overlay with dark gradient */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/hero_pizza_cakes_spread_1793035847578.jpg"
          alt="Pizza Lounge & Cakes Hero spread"
          className="w-full h-full object-cover filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/90" />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 text-center space-y-6 sm:space-y-7">
        {/* Live Open Status + Bhakkar Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-zinc-300 shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOpenNow ? 'bg-emerald-400' : 'bg-[#FF6321]'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOpenNow ? 'bg-emerald-500' : 'bg-[#FF6321]'
                }`}
              />
            </span>
            <span>{isOpenNow ? 'Open Now' : 'Opens 11:00 AM'}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[#FF6321] font-mono">Till 1:30 AM</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF6321]/15 border border-[#FF6321]/40 text-xs font-bold text-[#FF6321] backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>Bhakkar, Punjab</span>
          </div>
        </div>

        {/* Grand Headline: PIZZA LOUNGE & CAKES */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-white leading-tight drop-shadow-2xl">
            PIZZA LOUNGE <br />
            <span className="text-[#FF6321] not-italic tracking-normal font-extrabold font-cinzel">
              &amp; CAKES
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl font-bold text-[#FF6321] tracking-widest uppercase pt-1">
            Pizza • Fast Food • Cakes • Shakes • Bakery
          </p>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto font-normal drop-shadow">
          &ldquo;Delicious food, freshly prepared cakes and an unforgettable dining experience in Bhakkar.&rdquo;
        </p>

        {/* 3 Prominent Action Buttons matching reference */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <a
            id="hero-whatsapp-btn"
            href="https://wa.me/923218865050?text=Hi%20Pizza%20Lounge%20%26%20Cakes,%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all shadow-xl shadow-emerald-950/50 transform hover:scale-[1.03] border border-emerald-400/40"
          >
            <span className="font-bold">WHATSAPP ORDER</span>
          </a>

          <button
            id="hero-order-now-btn"
            onClick={openCart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#FF6321] hover:bg-[#e5591e] text-black font-black text-sm sm:text-base tracking-wide uppercase transition-all shadow-xl shadow-[#FF6321]/30 transform hover:scale-[1.03] cursor-pointer"
          >
            <span>ORDER NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            id="hero-call-now-btn"
            href="tel:03218865050"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 hover:border-[#FF6321]/40 font-bold text-sm sm:text-base transition-all shadow-lg backdrop-blur-sm"
          >
            <Phone className="w-4 h-4 text-[#FF6321]" />
            <span className="font-mono">0321 8865050</span>
          </a>
        </div>

        {/* 3 KPI Feature Cards directly beneath buttons */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-6 border-t border-zinc-800/80 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-zinc-800 text-[#FF6321] shrink-0">
              <Star className="w-4 h-4 fill-[#FF6321]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white leading-tight">Top Rated</div>
              <div className="text-[10px] sm:text-xs text-zinc-400">In Bhakkar</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-zinc-800 text-[#FF6321] shrink-0">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white leading-tight">Fast Delivery</div>
              <div className="text-[10px] sm:text-xs text-zinc-400">Rain or Fog</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-zinc-800 text-[#FF6321] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white leading-tight">Late Night</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 font-mono">Till 1:30 AM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
