import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, Clock, Utensils, Phone, ShoppingBag, Sparkles } from 'lucide-react';
import { Product, ProductCategory } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface MenuSectionProps {
  products: Product[];
  initialCategory?: ProductCategory;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'pizza', label: 'Pizzas' },
  { id: 'stuffed-pizza', label: 'Stuffed Crust' },
  { id: 'burgers', label: 'Burgers & Zingers' },
  { id: 'wings', label: 'Wings & Appetizers' },
  { id: 'fries', label: 'Loaded Fries' },
  { id: 'deals', label: 'Fast Food Deals' },
  { id: 'shakes-icecream', label: 'Shakes & Ice Cream' },
];

export const MenuSection: React.FC<MenuSectionProps> = ({ products, initialCategory = 'all' }) => {
  const { addToCart, items: cartItems, openCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory === 'all' && p.category === 'cakes') return false;
      const matchCategory = selectedCategory === 'all' ? true : p.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleSizeChange = (productId: string, sizeName: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: sizeName }));
  };

  const handleAddToCart = (product: Product) => {
    const selectedSizeName = selectedSizes[product.id] || (product.sizes ? product.sizes[0]?.name : undefined);
    addToCart(product, selectedSizeName);

    setJustAddedId(`${product.id}-${selectedSizeName || 'default'}`);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1500);
  };

  const getItemCartQuantity = (productId: string, sizeName?: string) => {
    const cartItemId = `${productId}-${sizeName || 'standard'}`;
    const found = cartItems.find((it) => it.id === cartItemId);
    return found ? found.quantity : 0;
  };

  return (
    <section id="menu" className="py-16 sm:py-20 bg-[#0A0A0A] relative">
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-[#FF6321]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header matching reference */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider mb-2">
              <Utensils className="w-3 h-3" />
              <span>Full Dining &amp; Takeaway Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-cinzel">
              Our Fast Food Menu
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Explore our delicious menu featuring authentic stuffed pizzas, crispy burgers, fiery hot wings, and combo platters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              id="menu-quick-call-btn"
              href="tel:03218865050"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>CALL TO ORDER</span>
            </a>
            <button
              id="menu-order-now-btn"
              onClick={openCart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF6321] hover:bg-[#e5591e] text-black font-black text-xs transition-all shadow-md shadow-[#FF6321]/20 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ORDER DELIVERY</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Category Navigation */}
        <div className="space-y-4 mb-10">
          {/* Search Box */}
          <div className="max-w-md relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pizza, zinger, wings, fries..."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#FF6321] rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Rounded-full Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    active
                      ? 'bg-[#FF6321] border-[#FF6321] text-black shadow-lg shadow-[#FF6321]/20'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">No items found matching your filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-[#FF6321] underline hover:text-white cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const selectedSize = selectedSizes[product.id] || (product.sizes ? product.sizes[0]?.name : undefined);
              let currentPrice = product.price;
              if (selectedSize && product.sizes) {
                const s = product.sizes.find((x) => x.name === selectedSize);
                if (s) currentPrice = s.price;
              }

              const addedKey = `${product.id}-${selectedSize || 'default'}`;
              const isJustAdded = justAddedId === addedKey;
              const cartQty = getItemCartQuantity(product.id, selectedSize);

              return (
                <div
                  key={product.id}
                  className="bg-zinc-900/60 border border-zinc-800 hover:border-[#FF6321]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl"
                >
                  <div>
                    {/* Image & Badge */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={product.image}
                        alt={`${product.name} at Pizza Lounge & Cakes Bhakkar`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-transparent to-transparent pointer-events-none" />

                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-[#FF6321] text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                          {product.badge}
                        </div>
                      )}

                      {product.prepTime && (
                        <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[11px] text-zinc-200 bg-black/75 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/10">
                          <Clock className="w-3 h-3 text-[#FF6321]" />
                          <span>{product.prepTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2.5">
                      <h3 className="font-cinzel font-bold text-base sm:text-lg text-white group-hover:text-[#FF6321] transition-colors leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Size Selector for Pizzas */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="pt-2">
                          <span className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                            Choose Size:
                          </span>
                          <div className="flex items-center gap-1.5">
                            {product.sizes.map((s) => (
                              <button
                                key={s.name}
                                onClick={() => handleSizeChange(product.id, s.name)}
                                className={`flex-1 py-1 px-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                                  selectedSize === s.name
                                    ? 'bg-[#FF6321] border-[#FF6321] text-black shadow-sm'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                }`}
                              >
                                {s.name.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Price & Add to Cart button */}
                  <div className="p-5 pt-0 mt-2 border-t border-zinc-800/80 pt-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                        Price
                      </span>
                      <div className="text-base sm:text-lg font-bold text-[#FF6321] font-mono tabular-nums">
                        PKR {currentPrice.toLocaleString()}
                        {product.originalPrice && (
                          <span className="ml-2 text-xs line-through text-zinc-500">
                            PKR {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.isAvailable}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-md ${
                        isJustAdded
                          ? 'bg-emerald-500 text-white'
                          : product.isAvailable
                          ? 'bg-[#FF6321] hover:bg-[#e5591e] text-black shadow-[#FF6321]/20 active:scale-95'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                          {cartQty > 0 && (
                            <span className="ml-1 bg-black text-white px-1.5 py-0.2 rounded-full text-[10px]">
                              {cartQty}
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
        )}
      </div>
    </section>
  );
};
