import React from 'react';
import { Tag, Plus, Check } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface DealsSectionProps {
  deals: Product[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ deals }) => {
  const { addToCart, items: cartItems } = useCart();
  const [justAddedId, setJustAddedId] = React.useState<string | null>(null);

  const handleAddDeal = (deal: Product) => {
    addToCart(deal);
    setJustAddedId(deal.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <section id="deals" className="py-16 sm:py-20 bg-[#0A0A0A] text-zinc-100 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>Value Combos &amp; Special Offers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white tracking-tight">
            Fast Food &amp; Pizza Deals in Bhakkar
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl mx-auto">
            Save on combo meals for students, friends, and family gatherings with artisan crown pizzas, crunchy zinger burgers, and chilled drinks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const isAdded = justAddedId === deal.id;
            const inCartCount = cartItems.find((it) => it.productId === deal.id)?.quantity || 0;

            return (
              <div
                key={deal.id}
                className="bg-zinc-900/60 border border-zinc-800 hover:border-[#FF6321]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <div className="h-48 w-full bg-zinc-950 relative overflow-hidden">
                    <img
                      src={deal.image}
                      alt={`${deal.name} deal at Pizza Lounge & Cakes Bhakkar`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-black/30 to-transparent" />

                    {deal.badge && (
                      <div className="absolute top-3 right-3 bg-[#FF6321] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                        {deal.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-cinzel font-bold text-lg sm:text-xl text-white group-hover:text-[#FF6321] transition-colors">
                      {deal.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {deal.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-4 border-t border-zinc-800/80 pt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                      Combo Price
                    </span>
                    <div className="text-xl font-bold text-[#FF6321] font-mono tabular-nums flex items-baseline gap-2">
                      <span>PKR {deal.price.toLocaleString()}</span>
                      {deal.originalPrice && (
                        <span className="text-xs line-through text-zinc-500">
                          PKR {deal.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddDeal(deal)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#FF6321] hover:bg-[#e5591e] text-black shadow-md shadow-[#FF6321]/20 active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>ORDER DEAL</span>
                        {inCartCount > 0 && (
                          <span className="ml-1 bg-black text-white px-1.5 py-0.2 rounded-full text-[10px]">
                            {inCartCount}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
