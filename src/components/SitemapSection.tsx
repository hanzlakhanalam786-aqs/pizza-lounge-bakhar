import React, { useState } from 'react';
import {
  Map,
  ExternalLink,
  Compass,
  ArrowRight,
  UtensilsCrossed,
  Cake,
  Tag,
  Star,
  MapPin,
  Phone,
  ShieldCheck,
  Globe,
  FileCode,
  Layers,
  Sparkles,
  Maximize2,
  RefreshCw,
  Copy,
  Check,
  Code
} from 'lucide-react';

interface SitemapSectionProps {
  onNavigate: (view: string) => void;
  onOpenTrackOrder: () => void;
  onOpenAdmin: () => void;
}

export const SitemapSection: React.FC<SitemapSectionProps> = ({
  onNavigate,
  onOpenTrackOrder,
  onOpenAdmin,
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [showEmbed, setShowEmbed] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const netlifyUrl = 'https://idyllic-marshmallow-afab6e.netlify.app/';
  const netlifySitemapUrl = 'https://idyllic-marshmallow-afab6e.netlify.app/sitemap.xml';

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const pages = [
    {
      title: 'Home Page',
      path: '/',
      view: 'home',
      desc: 'Hero banner, quick order options, signature highlights, and featured fast food & bakery items.',
      badge: 'Main Hub'
    },
    {
      title: 'Fast Food Menu',
      path: '/menu',
      view: 'menu',
      desc: 'Crown crust pizzas, zinger burgers, stuffed crust specialties, crispy wings, loaded fries, and shakes.',
      badge: 'Order Online'
    },
    {
      title: 'Best Pizza in Bhakkar',
      path: '/pizza-in-bhakkar',
      view: 'pizza-in-bhakkar',
      desc: 'Specialty pizzas, cheese lover supreme, tikka, fajita, and authentic kabab stuffed crust.',
      badge: 'Top Rated'
    },
    {
      title: 'Cakes & Bakery Bhakkar',
      path: '/cakes-in-bhakkar',
      view: 'cakes-in-bhakkar',
      desc: 'Handcrafted celebration cakes, Belgian chocolate fudge, Gur Wala cake, and custom order booking.',
      badge: 'Fresh Bakery'
    },
    {
      title: 'Special Fast Food Deals',
      path: '/deals',
      view: 'deals',
      desc: 'Combo meals, couple offers, family feast packages with free delivery on qualifying orders.',
      badge: 'Best Value'
    },
    {
      title: 'Customer Reviews',
      path: '/reviews',
      view: 'reviews',
      desc: 'Genuine dining feedback, ratings, and customer testimonials from Bhakkar food lovers.',
      badge: 'Verified'
    },
    {
      title: 'About Us & Contact',
      path: '/contact',
      view: 'contact',
      desc: 'Full address on Jhang Road near Gulshan-e-Madina, verified opening hours, and phone directory.',
      badge: 'Location & Hours'
    },
  ];

  const menuCategories = [
    { name: 'Pizza & Crown Crust', count: '10+ Flavors', category: 'pizza' },
    { name: 'Stuffed Crust Pizzas', count: 'Kabab & Cheese', category: 'stuffed-pizza' },
    { name: 'Zinger & Crispy Burgers', count: 'Double Patty & Jalapeno', category: 'burgers' },
    { name: 'Crispy Wings & Bites', count: 'Honey Mustard & Spicy', category: 'wings' },
    { name: 'Loaded Fries & Appetizers', count: 'Cheese Fries & Garlic Mayo', category: 'fries' },
    { name: 'Fresh Bakery Cakes', count: 'Chocolate, Red Velvet, Gur', category: 'cakes' },
    { name: 'Thick Milkshakes', count: 'Oreo, Mango, Chocolate', category: 'shakes' },
    { name: 'Combo Fast Food Deals', count: 'Student & Family Packs', category: 'deals' },
  ];

  const deliveryAreas = [
    'Gulshan-e-Madina, Bhakkar',
    'Jhang Road Commercial & Residential',
    'City Center & Main Bazar Bhakkar',
    'Railway Road & Station Area',
    'Mandi Town & Civil Lines',
    'Chisti Nagar & Surrounding Sectors',
  ];

  return (
    <section className="py-12 sm:py-20 bg-[#0A0A0A] text-zinc-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#FF6321] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#FF6321]">Site Map</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider mb-2">
                <Map className="w-3.5 h-3.5" />
                <span>Complete Directory &amp; Navigation</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-cinzel text-white tracking-tight">
                PIZZA LOUNGE &amp; CAKES <span className="text-[#FF6321]">SITE MAP</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                Explore the complete structure of Pizza Lounge &amp; Cakes Bhakkar. Access all menu categories, bakery showcases, delivery coverage areas, and external sitemap portals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => copyToClipboard(netlifySitemapUrl)}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-full transition-all inline-flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                title="Copy Netlify XML Sitemap URL for Google Search Console"
              >
                {copiedUrl === netlifySitemapUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied XML URL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#FF6321]" />
                    <span>Copy Sitemap.xml URL</span>
                  </>
                )}
              </button>

              <a
                href={netlifySitemapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-[#FF6321] text-xs font-bold uppercase tracking-wider rounded-full transition-all inline-flex items-center gap-1.5 border border-[#FF6321]/40 cursor-pointer shadow-md"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>XML Sitemap</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <a
                href={netlifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all inline-flex items-center gap-2 shadow-lg shadow-[#FF6321]/20 cursor-pointer"
              >
                <span>Open Netlify Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Dedicated Netlify XML Sitemap Highlight Card */}
        <div className="rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-900/90 border border-[#FF6321]/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6321]/20 text-[#FF6321] border border-[#FF6321]/40">
                  Google Search Console Feed
                </span>
                <span className="text-xs text-zinc-400 font-mono">Netlify Machine Index</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#FF6321]" />
                <span>Netlify XML Sitemap URL</span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono break-all selection:bg-[#FF6321] selection:text-black">
                {netlifySitemapUrl}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyToClipboard(netlifySitemapUrl)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
              >
                {copiedUrl === netlifySitemapUrl ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">URL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#FF6321]" />
                    <span>Copy for Search Console</span>
                  </>
                )}
              </button>

              <a
                href={netlifySitemapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md shadow-[#FF6321]/20 cursor-pointer"
              >
                <span>Open XML</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Featured Netlify Site Map Embed Section */}
        <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6321]/15 border border-[#FF6321]/30 flex items-center justify-center text-[#FF6321] shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold font-cinzel text-white">
                    Integrated Netlify Site Map
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Live Portal
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                  {netlifyUrl}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIframeKey((prev) => prev + 1)}
                className="px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
                title="Reload Iframe"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reload</span>
              </button>
              <button
                onClick={() => setShowEmbed(!showEmbed)}
                className="px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
              >
                <Maximize2 className="w-3 h-3" />
                <span>{showEmbed ? 'Collapse View' : 'Expand View'}</span>
              </button>
              <a
                href={netlifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors inline-flex items-center gap-1.5 shadow-md shadow-[#FF6321]/20"
              >
                <span>Launch Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {showEmbed && (
            <div className="space-y-3">
              <div className="w-full h-[450px] sm:h-[550px] rounded-2xl overflow-hidden border border-zinc-800 bg-[#000] relative">
                <iframe
                  key={iframeKey}
                  title="Netlify Site Map Portal"
                  src={netlifyUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                />
              </div>
              <p className="text-[11px] text-zinc-500 flex items-center justify-between">
                <span>
                  💡 If the Netlify access page prompts for a login or credentials, click <strong>Launch Portal</strong> to access it in your authorized browser session.
                </span>
                <a
                  href={netlifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF6321] hover:underline font-semibold"
                >
                  Direct link: {netlifyUrl}
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Directory Grid: Main Pages */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#FF6321]" />
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
              Primary Website Sections &amp; Routes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((p) => (
              <div
                key={p.path}
                className="bg-zinc-900/60 border border-zinc-800 hover:border-[#FF6321]/50 rounded-2xl p-5 space-y-3 transition-all hover:bg-zinc-900/90 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#FF6321] font-bold">
                    {p.path}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {p.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-cinzel text-white group-hover:text-[#FF6321] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(p.view)}
                    className="text-xs font-bold text-white hover:text-[#FF6321] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Visit Page</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF6321]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fast Food & Bakery Categories Sitemap */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-[#FF6321]" />
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
              Menu &amp; Food Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {menuCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(cat.category === 'cakes' ? 'cakes-in-bhakkar' : 'menu')}
                className="text-left bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 p-4 rounded-xl space-y-1 transition-all cursor-pointer group"
              >
                <span className="text-xs font-bold text-white group-hover:text-[#FF6321] transition-colors block font-cinzel">
                  {cat.name}
                </span>
                <span className="text-[11px] text-zinc-400 block font-sans">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bhakkar Delivery Coverage Areas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF6321]" />
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
              Local Delivery Coverage in Bhakkar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deliveryAreas.map((area, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-300"
              >
                <div className="w-2 h-2 rounded-full bg-[#FF6321]" />
                <span className="font-medium text-white">{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational & Administrative Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold font-cinzel">
              <Compass className="w-4 h-4 text-[#FF6321]" />
              <span>Real-Time Order Tracking</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track live kitchen status from oven baking to rider delivery in Bhakkar.
            </p>
            <button
              onClick={onOpenTrackOrder}
              className="text-xs text-[#FF6321] hover:underline font-bold inline-flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>Open Tracking Modal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold font-cinzel">
              <ShieldCheck className="w-4 h-4 text-[#FF6321]" />
              <span>Staff Management Portal</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Authorized admin console for order processing, menu pricing, and bakery orders.
            </p>
            <button
              onClick={onOpenAdmin}
              className="text-xs text-[#FF6321] hover:underline font-bold inline-flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>Access Staff Portal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold font-cinzel">
              <FileCode className="w-4 h-4 text-[#FF6321]" />
              <span>Machine XML Feeds</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Search engine index feeds for Googlebot, Bing, and Search Console.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6321] hover:underline font-mono bg-zinc-800/80 px-2 py-0.5 rounded"
              >
                /sitemap.xml
              </a>
              <a
                href="/sitemap_index.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white font-mono bg-zinc-800/80 px-2 py-0.5 rounded"
              >
                /sitemap_index.xml
              </a>
              <a
                href={netlifySitemapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded inline-flex items-center gap-1"
              >
                <span>Netlify sitemap.xml</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
