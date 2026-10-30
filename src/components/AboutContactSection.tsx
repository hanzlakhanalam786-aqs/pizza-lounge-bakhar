import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, MessageCircle, Navigation, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BusinessSettings } from '../types.ts';

interface AboutContactProps {
  settings?: BusinessSettings;
}

export const AboutContactSection: React.FC<AboutContactProps> = ({ settings }) => {
  const address = settings?.address || 'J34R+JX6 Pizza Lounge, Jhang Rd, near Gulshan-e-Madina, Bhakkar, 30000, Pakistan';
  const phone = settings?.phone || '0321 8865050';
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

  const schedule = [
    { day: 'Monday', hours: '11:00 AM – 1:30 AM' },
    { day: 'Tuesday', hours: '11:00 AM – 1:30 AM' },
    { day: 'Wednesday', hours: '11:00 AM – 1:30 AM' },
    { day: 'Thursday', hours: '11:00 AM – 1:30 AM' },
    { day: 'Friday', hours: '10:00 AM – 1:30 AM', note: 'Early Opening' },
    { day: 'Saturday', hours: '11:00 AM – 1:30 AM' },
    { day: 'Sunday', hours: '11:00 AM – 1:30 AM' },
  ];

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#0A0A0A] border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* About Us Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider">
              <span>About Pizza Lounge &amp; Cakes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white tracking-tight">
              A Welcoming Dining Destination on Jhang Road, Bhakkar
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Founded to elevate the culinary culture of Bhakkar, PIZZA LOUNGE &amp; CAKES provides a warm, modern environment where families, friends, and foodies can gather over freshly prepared meals. From celebration cakes crafted for birthdays to late-night pizza cravings, we prepare every item with dedication to quality.
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Whether you are dining in our comfortable air-conditioned family hall, grabbing takeaway, or having food delivered anywhere in Bhakkar, our kitchen is open late till 1:30 AM.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#FF6321]" />
                <span className="font-bold text-white block">100% Halal &amp; Fresh</span>
                <span className="text-zinc-400">Handmade artisan dough and fresh chicken daily.</span>
              </div>
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                <HeartHandshake className="w-4 h-4 text-[#FF6321]" />
                <span className="font-bold text-white block">Family Dining Hall</span>
                <span className="text-zinc-400">Comfortable private booths on Jhang Road.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <img
              src="/src/assets/images/restaurant_ambiance_bhakkar_1793035849076.jpg"
              alt="Pizza Lounge & Cakes Bhakkar dining hall ambiance on Jhang Road"
              className="w-full h-[380px] sm:h-[420px] object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs">
              <span className="font-bold text-white block text-sm font-cinzel">Family Hall &amp; Cake Lounge</span>
              <span className="text-zinc-400">Jhang Road, near Gulshan-e-Madina, Bhakkar</span>
            </div>
          </div>
        </div>

        {/* Location & Opening Hours Section */}
        <div className="space-y-6 pt-6 border-t border-zinc-800">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3 h-3" />
              <span>Visit Us or Order Delivery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-cinzel">
              Location &amp; Opening Hours
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Conveniently situated on Jhang Road near Gulshan-e-Madina in Bhakkar. Dine in, takeaway, or call for home delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Address, Phone, WhatsApp */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-xl space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#FF6321] font-bold">
                    Restaurant &amp; Bakery
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-cinzel mt-0.5">
                    PIZZA LOUNGE &amp; CAKES
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Pizza • Fast Food • Cakes • Shakes • Bakery
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Address */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <MapPin className="w-5 h-5 text-[#FF6321] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-zinc-500 block uppercase font-bold">Address</span>
                      <p className="text-sm font-medium text-white">{address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#FF6321] shrink-0" />
                      <div>
                        <span className="text-[11px] text-zinc-500 block uppercase font-bold">Call Hotline</span>
                        <a href="tel:03218865050" className="text-base font-bold text-white hover:text-[#FF6321] font-mono">
                          {phone}
                        </a>
                      </div>
                    </div>
                    <a
                      href="tel:03218865050"
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-full transition-colors"
                    >
                      CALL NOW
                    </a>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[11px] text-zinc-500 block uppercase font-bold">WhatsApp Hotline</span>
                        <span className="text-sm font-bold text-white font-mono">0321 8865050</span>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/923218865050?text=Hello%20Pizza%20Lounge%20%26%20Cakes%20Bhakkar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full transition-colors"
                    >
                      WHATSAPP
                    </a>
                  </div>
                </div>
              </div>

              {/* Verified Hours Table */}
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF6321]" />
                    <span className="font-bold text-white text-sm font-cinzel">Opening Hours</span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      isOpenNow ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isOpenNow ? 'Open Now' : 'Closed Now'}
                  </span>
                </div>

                <div className="divide-y divide-zinc-800/80 text-xs">
                  {schedule.map((item) => (
                    <div key={item.day} className="py-2.5 flex items-center justify-between">
                      <span className="text-zinc-300 font-medium">{item.day}</span>
                      <div className="text-right">
                        <span className="font-mono text-white tabular-nums font-bold">{item.hours}</span>
                        {item.note && (
                          <span className="ml-2 text-[10px] text-[#FF6321] font-bold uppercase">({item.note})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Google Maps Embed */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative h-full min-h-[380px] shadow-2xl">
                <iframe
                  title="Pizza Lounge & Cakes Bhakkar Map Location"
                  src="https://maps.google.com/maps?q=Pizza+Lounge+Jhang+Road+Bhakkar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 grayscale-[15%] contrast-110"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-white block font-cinzel">Pizza Lounge &amp; Cakes</span>
                    <span className="text-zinc-400 text-[11px]">Jhang Road, near Gulshan-e-Madina, Bhakkar</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Pizza+Lounge+Jhang+Road+Bhakkar+Pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6321] hover:bg-[#e5591e] text-black text-xs font-black rounded-full transition-all whitespace-nowrap shrink-0 shadow-lg"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>DIRECTIONS</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
