import React, { useState } from 'react';
import { Cake, Sparkles, Send, CheckCircle2, MessageCircle, Calendar, Plus, Check } from 'lucide-react';
import { Product } from '../types.ts';
import { createCakeInquiry } from '../services/api.ts';
import { useCart } from '../context/CartContext.tsx';

interface CakesSectionProps {
  products: Product[];
}

export const CakesSection: React.FC<CakesSectionProps> = ({ products }) => {
  const { addToCart } = useCart();
  const cakeProducts = products.filter((p) => p.category === 'cakes');

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Inquiry form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formFlavor, setFormFlavor] = useState('Belgian Chocolate Fudge');
  const [formSize, setFormSize] = useState('2.0 lbs');
  const [formDesign, setFormDesign] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSizeChange = (productId: string, sizeName: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: sizeName }));
  };

  const handleAddCakeToCart = (product: Product) => {
    const selectedSizeName = selectedSizes[product.id] || (product.sizes ? product.sizes[0]?.name : undefined);
    addToCart(product, selectedSizeName);
    setJustAddedId(`${product.id}-${selectedSizeName || 'default'}`);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formDate) {
      setErrorMessage('Please provide your name, phone number, and event date.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const inquiry = await createCakeInquiry({
        customerName: formName,
        phone: formPhone,
        preferredFlavor: formFlavor,
        sizeWeight: formSize,
        preferredDesign: formDesign || 'Custom bakery design',
        eventDate: formDate,
        specialInstructions: formNotes
      });
      setSubmittedInquiry(inquiry);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again or WhatsApp us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppInquiryUrl = () => {
    const text = `*New Custom Cake Inquiry - Pizza Lounge & Cakes Bhakkar*
• Customer Name: ${formName || 'Customer'}
• Contact Phone: ${formPhone}
• Flavor: ${formFlavor}
• Weight/Size: ${formSize}
• Event Date: ${formDate}
• Design Theme: ${formDesign || 'Standard celebration'}
• Special Instructions: ${formNotes || 'None'}`;
    return `https://wa.me/923218865050?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="cakes" className="py-16 sm:py-20 bg-[#0A0A0A] relative overflow-hidden border-t border-zinc-800">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#FF6321]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Featured Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left image showcase */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="group relative rounded-2xl overflow-hidden bg-zinc-900/60 border border-zinc-800 hover:border-[#FF6321] shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="aspect-square relative overflow-hidden bg-zinc-950 flex items-center justify-center p-2">
                <img
                  src="/src/assets/images/bakery_chocolate_celebration_cake_1793035848067.jpg"
                  alt="Pizza Lounge & Cakes custom celebration cakes in Bhakkar"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FF6321] text-black font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Cake className="w-3 h-3" />
                  <span>Freshly Baked in Bhakkar</span>
                </div>

                <div className="absolute bottom-3 inset-x-3 text-center p-2.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                  <span className="text-[10px] uppercase tracking-widest text-[#FF6321] font-bold block">
                    Signature Bakery Collection
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Pre-order your personalized party cake
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right info */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Handcrafted Celebration Bakery</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-cinzel leading-tight">
              Custom Birthday &amp; Celebration Cakes
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed">
              From our famous Gur-Wala sweet specialty and velvety Belgian Chocolate Fudge to bespoke tiered fondant celebration cakes, Pizza Lounge &amp; Cakes crafts every cake with 100% pure dairy butter, rich cocoa, and artisanal care in Bhakkar.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2 text-xs">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase tracking-wider font-bold">Butter</span>
                <span className="font-bold text-white">Pure Dairy Butter</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase tracking-wider font-bold">Notice Time</span>
                <span className="font-bold text-white">4–6 Hours Same Day</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 col-span-2 sm:col-span-1">
                <span className="text-zinc-500 block text-[10px] uppercase tracking-wider font-bold">Starting At</span>
                <span className="font-bold text-[#FF6321] font-mono">PKR 1,400 (1.5 lbs)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#cake-inquiry-box"
                className="px-6 py-3 rounded-full bg-[#FF6321] hover:bg-[#e5591e] text-black font-black text-xs sm:text-sm tracking-wide uppercase transition-all shadow-xl shadow-[#FF6321]/20 inline-flex items-center gap-2 cursor-pointer"
              >
                <Cake className="w-4 h-4" />
                <span>BOOK CUSTOM DESIGN</span>
              </a>

              <a
                href="https://wa.me/923218865050?text=Hi%20Pizza%20Lounge%20%26%20Cakes,%20I%20would%20like%20to%20order%20a%20cake."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WHATSAPP CAKE ORDER</span>
              </a>
            </div>
          </div>
        </div>

        {/* Ready Cakes Catalog Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF6321] font-bold">Fresh Daily</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-white">
                Signature Cake Flavors
              </h3>
            </div>
            <span className="text-xs text-zinc-500 hidden sm:inline-block">Baked fresh on Jhang Road</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cakeProducts.map((cake) => {
              const selectedSize = selectedSizes[cake.id] || (cake.sizes ? cake.sizes[0]?.name : '2.0 lbs');
              let currentPrice = cake.price;
              if (selectedSize && cake.sizes) {
                const matched = cake.sizes.find((s) => s.name === selectedSize);
                if (matched) currentPrice = matched.price;
              }
              const isAdded = justAddedId === `${cake.id}-${selectedSize}`;

              return (
                <div
                  key={cake.id}
                  className="bg-zinc-900/60 border border-zinc-800 hover:border-[#FF6321]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group hover:-translate-y-1 shadow-xl"
                >
                  <div>
                    <div className="h-44 w-full bg-zinc-950 overflow-hidden relative">
                      <img
                        src={cake.image}
                        alt={`${cake.name} at Pizza Lounge & Cakes Bhakkar`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent pointer-events-none" />
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-cinzel font-bold text-sm sm:text-base text-white group-hover:text-[#FF6321] transition-colors leading-snug">
                        {cake.name}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {cake.description}
                      </p>

                      {cake.sizes && cake.sizes.length > 0 && (
                        <div className="pt-1">
                          <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">
                            Weight:
                          </span>
                          <div className="flex items-center gap-1">
                            {cake.sizes.map((s) => (
                              <button
                                key={s.name}
                                onClick={() => handleSizeChange(cake.id, s.name)}
                                className={`flex-1 py-1 px-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                                  selectedSize === s.name
                                    ? 'bg-[#FF6321] border-[#FF6321] text-black'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                }`}
                              >
                                {s.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 mt-2 border-t border-zinc-800/80 pt-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Price</span>
                      <div className="text-base font-bold text-[#FF6321] font-mono tabular-nums">
                        PKR {currentPrice.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddCakeToCart(cake)}
                      className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#FF6321] hover:bg-[#e5591e] text-black active:scale-95 shadow-md shadow-[#FF6321]/20'
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
                          <span>Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Cake Inquiry Form */}
        <div id="cake-inquiry-box" className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-10 scroll-mt-24 shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF6321] font-bold">
                Special Occasions &amp; Themes
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-white">
                Customize Your Celebration Cake
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Submit your customized cake request below. Our master cake decorators will confirm availability and quote within minutes.
              </p>
            </div>

            {submittedInquiry ? (
              <div className="bg-zinc-950 border border-emerald-500/40 rounded-xl p-6 sm:p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-bold font-cinzel text-white">
                  Inquiry Logged! Ref: #{submittedInquiry.id}
                </h4>
                <p className="text-sm text-zinc-300 max-w-lg mx-auto">
                  Thank you, <strong className="text-white">{submittedInquiry.customerName}</strong>. We received your cake inquiry for <span className="text-[#FF6321]">{submittedInquiry.eventDate}</span>.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <a
                    href={getWhatsAppInquiryUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send to WhatsApp for Fast Confirmation</span>
                  </a>
                  <button
                    onClick={() => setSubmittedInquiry(null)}
                    className="px-4 py-2.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. 0321 8865050"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Flavor Choice
                    </label>
                    <select
                      value={formFlavor}
                      onChange={(e) => setFormFlavor(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none cursor-pointer"
                    >
                      <option value="Belgian Chocolate Fudge">Belgian Chocolate Fudge</option>
                      <option value="Gur Wala Special Cake">Gur Wala Signature Cake</option>
                      <option value="Classic Red Velvet Cream Cheese">Red Velvet Cream Cheese</option>
                      <option value="Lotus Biscoff Caramel">Lotus Biscoff Caramel</option>
                      <option value="Black Forest Cherry">Black Forest Cherry</option>
                      <option value="Vanilla Fruit Cocktail">Vanilla Fruit Cocktail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Weight / Size
                    </label>
                    <select
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none cursor-pointer"
                    >
                      <option value="2.0 lbs">2.0 lbs (Standard Family Size)</option>
                      <option value="3.0 lbs">3.0 lbs (Celebration Size)</option>
                      <option value="4.0 lbs (2 Tier)">4.0 lbs (2-Tier Party Cake)</option>
                      <option value="5.0+ lbs (Custom Tier)">5.0+ lbs (Grand Celebration)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#FF6321]" />
                      <span>Event Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Design Theme or Reference Style
                  </label>
                  <input
                    type="text"
                    value={formDesign}
                    onChange={(e) => setFormDesign(e.target.value)}
                    placeholder="e.g. Gold marble with chocolate drips, Spider-Man theme, 25th Silver Jubilee..."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Special Instructions / Name to Write on Cake
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Write 'Happy Birthday Ayan', deliver near Gulshan-e-Madina around 8:00 PM."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-600 outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-[#e5591e] text-black px-7 py-3 rounded-full text-xs font-black tracking-wide uppercase transition-all cursor-pointer shadow-lg shadow-[#FF6321]/20 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Send Cake Inquiry'}</span>
                  </button>

                  <a
                    href="https://wa.me/923218865050?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20a%20customized%20cake%20at%20Pizza%20Lounge%20%26%20Cakes%20Bhakkar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire via WhatsApp (0321 8865050)</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
