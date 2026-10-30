/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { HighlightsSection } from './components/HighlightsSection.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { CakesSection } from './components/CakesSection.tsx';
import { DealsSection } from './components/DealsSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { AboutContactSection } from './components/AboutContactSection.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { TrackOrderModal } from './components/TrackOrderModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { SeoFaq } from './components/SeoFaq.tsx';
import { SitemapSection } from './components/SitemapSection.tsx';
import { Footer } from './components/Footer.tsx';
import { fetchProducts, fetchReviews, fetchSettings } from './services/api.ts';
import { Product, CustomerReview, BusinessSettings, Order } from './types.ts';
import { Check } from 'lucide-react';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | undefined>(undefined);

  const { toastMessage } = useCart();

  // Load initial store data
  const loadData = async () => {
    try {
      const [prods, revs, setts] = await Promise.all([
        fetchProducts(),
        fetchReviews(),
        fetchSettings().catch(() => undefined)
      ]);
      setProducts(prods);
      setReviews(revs);
      if (setts) setSettings(setts);
    } catch (err) {
      console.error('Error fetching app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Support browser path routing
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '') || 'home';
      if (path === 'admin') {
        setIsAdminOpen(true);
      } else {
        setCurrentView(path);
      }
    };

    const initialPath = window.location.pathname.replace('/', '') || 'home';
    if (initialPath === 'admin') {
      setIsAdminOpen(true);
    } else if (['menu', 'pizza-in-bhakkar', 'cakes-in-bhakkar', 'deals', 'reviews', 'contact', 'sitemap'].includes(initialPath)) {
      setCurrentView(initialPath);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    const newPath = view === 'home' ? '/' : `/${view}`;
    window.history.pushState({}, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (order: Order) => {
    setActiveTrackingOrderId(order.id);
  };

  const pizzaProducts = products.filter((p) => p.category === 'pizza' || p.category === 'stuffed-pizza');
  const dealProducts = products.filter((p) => p.category === 'deals');

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1015] text-[#f3f4f6]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-zinc-900 border border-[#FF6321] text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Check className="w-4 h-4 text-[#FF6321]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenTrackOrder={() => {
          setActiveTrackingOrderId(undefined);
          setIsTrackOpen(true);
        }}
      />

      {/* Views Orchestration */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero onNavigate={handleNavigate} />
            <HighlightsSection />
            <MenuSection products={products} initialCategory="all" />
            <CakesSection products={products} />
            {dealProducts.length > 0 && <DealsSection deals={dealProducts} />}
            <ReviewsSection
              reviews={reviews}
              onReviewAdded={(newRev) => setReviews((prev) => [newRev, ...prev])}
            />
            <AboutContactSection settings={settings} />
            <SeoFaq />
          </>
        )}

        {currentView === 'menu' && (
          <div className="py-8 space-y-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <span className="text-xs text-zinc-500">Home / Menu</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white mt-2">
                Fast Food &amp; Pizza Menu
              </h1>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                Explore our full selection of pizzas, stuffed crust creations, juicy zinger burgers, seasoned wings, loaded fries, and refreshing shakes in Bhakkar.
              </p>
            </div>
            <MenuSection products={products} initialCategory="all" />
            <SeoFaq />
          </div>
        )}

        {currentView === 'pizza-in-bhakkar' && (
          <div className="py-8 space-y-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <span className="text-xs text-zinc-500">Home / Pizza in Bhakkar</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white mt-2">
                Best Pizza in Bhakkar – Crown Crust &amp; Stuffed Pizzas
              </h1>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                Freshly hand-tossed artisan dough, melted whole mozzarella, and signature kabab and cheese stuffed crown crust. Baked fresh on Jhang Road, Bhakkar.
              </p>
            </div>
            <MenuSection products={pizzaProducts} initialCategory="pizza" />
            <SeoFaq />
          </div>
        )}

        {currentView === 'cakes-in-bhakkar' && (
          <div className="py-8 space-y-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <span className="text-xs text-zinc-500">Home / Cakes in Bhakkar</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white mt-2">
                Cakes &amp; Bakery in Bhakkar – Birthday, Chocolate &amp; Custom Cakes
              </h1>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                Premium celebration cakes crafted with Belgian cocoa, cream cheese frosting, and handcrafted fondant artistry.
              </p>
            </div>
            <CakesSection products={products} />
            <SeoFaq />
          </div>
        )}

        {currentView === 'deals' && (
          <div className="py-8 space-y-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <span className="text-xs text-zinc-500">Home / Deals</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white mt-2">
                Special Fast Food &amp; Pizza Deals in Bhakkar
              </h1>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                Save on combo meals for students, couples, and family feasts. Order online with free delivery over PKR 2,000.
              </p>
            </div>
            <DealsSection deals={dealProducts} />
            <SeoFaq />
          </div>
        )}

        {currentView === 'reviews' && (
          <div className="py-8 space-y-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <span className="text-xs text-zinc-500">Home / Customer Reviews</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white mt-2">
                Customer Reviews &amp; Ratings
              </h1>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                Real feedback from customers in Bhakkar about our crown crust pizza, zinger burgers, cakes, and delivery service.
              </p>
            </div>
            <ReviewsSection
              reviews={reviews}
              onReviewAdded={(newRev) => setReviews((prev) => [newRev, ...prev])}
            />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="py-8 space-y-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <span className="text-xs text-zinc-500">Home / About &amp; Contact</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white mt-2">
                About Pizza Lounge &amp; Cakes Bhakkar &amp; Contact Information
              </h1>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                Visit our family restaurant on Jhang Road near Gulshan-e-Madina, Bhakkar, or call us directly at 0321 8865050.
              </p>
            </div>
            <AboutContactSection settings={settings} />
            <SeoFaq />
          </div>
        )}

        {currentView === 'sitemap' && (
          <SitemapSection
            onNavigate={handleNavigate}
            onOpenTrackOrder={() => {
              setActiveTrackingOrderId(undefined);
              setIsTrackOpen(true);
            }}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}
      </main>

      {/* Cart & Checkout Slide-Out Drawer */}
      <CartDrawer onOrderPlaced={handleOrderPlaced} />

      {/* Track Order Live Modal */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        defaultOrderId={activeTrackingOrderId}
      />

      {/* Secure Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          products={products}
          onProductsUpdated={loadData}
        />
      )}

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTrackOrder={() => {
          setActiveTrackingOrderId(undefined);
          setIsTrackOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
