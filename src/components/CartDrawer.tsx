import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, CheckCircle, ShieldCheck, Truck, Store, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { createOrder } from '../services/api.ts';
import { Order } from '../types.ts';

interface CartDrawerProps {
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOrderPlaced }) => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    total
  } = useCart();

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('Gulshan-e-Madina, Bhakkar');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handlePlaceOrder = async (paymentMethod: 'COD' | 'whatsapp') => {
    if (!customerName.trim() || !phone.trim()) {
      setErrorMsg('Please enter your full name and phone number.');
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      setErrorMsg('Please enter your delivery street address or house number.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName,
        phone,
        deliveryType,
        deliveryArea: deliveryType === 'delivery' ? deliveryArea : undefined,
        address: deliveryType === 'delivery' ? `${address}, ${deliveryArea}` : undefined,
        notes,
        paymentMethod,
        items: items.map((it) => ({
          productId: it.productId,
          name: it.selectedSize ? `${it.name} (${it.selectedSize})` : it.name,
          quantity: it.quantity,
          selectedSize: it.selectedSize,
          price: it.price,
          total: it.price * it.quantity,
          notes: it.notes
        }))
      };

      const placedOrder = await createOrder(orderPayload);
      setConfirmedOrder(placedOrder);
      clearCart();
      onOrderPlaced(placedOrder);

      // If WhatsApp order, open formatted WhatsApp message
      if (paymentMethod === 'whatsapp') {
        const itemsList = placedOrder.items
          .map((i) => `• ${i.quantity}x ${i.name} - PKR ${i.total.toLocaleString()}`)
          .join('\n');

        const waText = `*New Order - Pizza Lounge & Cakes Bhakkar*
*Order ID:* ${placedOrder.id}
*Customer:* ${placedOrder.customerName}
*Phone:* ${placedOrder.phone}
*Type:* ${placedOrder.deliveryType === 'delivery' ? 'Home Delivery' : 'Pickup at Jhang Road'}
${placedOrder.address ? `*Address:* ${placedOrder.address}\n` : ''}*Items:*
${itemsList}

*Subtotal:* PKR ${placedOrder.subtotal.toLocaleString()}
*Delivery:* PKR ${placedOrder.deliveryFee.toLocaleString()}
*Total Amount:* PKR ${placedOrder.total.toLocaleString()}
*Payment:* Cash on Delivery

*Notes:* ${placedOrder.notes || 'None'}`;

        const waUrl = `https://wa.me/923218865050?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0D0E12] border-l border-zinc-800/80 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FF6321]/15 border border-[#FF6321]/30 flex items-center justify-center text-[#FF6321]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold font-cinzel text-white tracking-wide">Your Order Bag</h2>
                <span className="text-[11px] text-zinc-400">Pizza Lounge &amp; Cakes Bhakkar</span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {confirmedOrder ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-cinzel text-white">Order Confirmed!</h3>
                <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl inline-block">
                  <span className="text-xs text-zinc-400 block">Order Tracking ID:</span>
                  <span className="text-xl font-mono font-bold text-[#FF6321]">{confirmedOrder.id}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xs mx-auto">
                  Thank you, <strong className="text-white">{confirmedOrder.customerName}</strong>! Your order is being prepared fresh in our Bhakkar kitchen.
                </p>
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Order Type:</span>
                    <span className="text-white font-medium capitalize">{confirmedOrder.deliveryType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Estimated Delivery:</span>
                    <span className="text-[#FF6321] font-medium">30–45 mins</span>
                  </div>
                  <div className="flex justify-between font-mono font-bold text-sm pt-2 border-t border-zinc-800">
                    <span className="text-white">Amount Due (COD):</span>
                    <span className="text-[#FF6321]">PKR {confirmedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setConfirmedOrder(null);
                      closeCart();
                    }}
                    className="w-full py-3 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors shadow-lg shadow-[#FF6321]/20"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-zinc-400">Your order bag is currently empty.</p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors shadow-lg shadow-[#FF6321]/20"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Free delivery threshold indicator */}
                <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
                  {subtotal >= freeDeliveryThreshold ? (
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                      <Truck className="w-4 h-4" />
                      <span>Congratulations! You qualify for FREE delivery in Bhakkar.</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-zinc-300">
                        <span>Add PKR {(freeDeliveryThreshold - subtotal).toLocaleString()} for Free Delivery</span>
                        <span className="text-[#FF6321] font-mono tabular-nums font-bold">
                          {Math.round((subtotal / freeDeliveryThreshold) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#FF6321] h-full transition-all"
                          style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">
                    Selected Items ({items.length})
                  </span>
                  <div className="space-y-2.5 divide-y divide-zinc-800/80">
                    {items.map((item) => (
                      <div key={item.id} className="pt-2.5 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white leading-tight font-cinzel">
                            {item.name}
                          </h4>
                          {item.selectedSize && (
                            <span className="text-xs text-[#FF6321] block mt-0.5">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          <span className="text-xs font-mono text-zinc-400 tabular-nums block mt-1">
                            PKR {item.price.toLocaleString()} × {item.quantity} = PKR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-zinc-800 rounded-full bg-zinc-900/90 px-1 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono text-white tabular-nums font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 cursor-pointer rounded-full hover:bg-zinc-800/50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery vs Pickup Selector */}
                <div className="space-y-2 pt-3 border-t border-zinc-800/80">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 block">
                    Fulfilment Preference
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'bg-[#FF6321] border-[#FF6321] text-white shadow-md shadow-[#FF6321]/20'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Home Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'bg-[#FF6321] border-[#FF6321] text-white shadow-md shadow-[#FF6321]/20'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Takeaway Pickup</span>
                    </button>
                  </div>
                </div>

                {/* Customer Checkout Information */}
                <div className="space-y-3 pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 block">
                    Contact &amp; Delivery Details
                  </span>

                  {errorMsg && (
                    <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <div>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your Full Name *"
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Mobile / WhatsApp Number (03xx xxxxxxx) *"
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none font-mono transition-colors"
                      />
                    </div>

                    {deliveryType === 'delivery' && (
                      <>
                        <div>
                          <select
                            value={deliveryArea}
                            onChange={(e) => setDeliveryArea(e.target.value)}
                            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer transition-colors"
                          >
                            <option value="Gulshan-e-Madina, Bhakkar">Gulshan-e-Madina, Bhakkar</option>
                            <option value="Jhang Road Area, Bhakkar">Jhang Road Area, Bhakkar</option>
                            <option value="City Center & Main Bazar, Bhakkar">City Center &amp; Main Bazar, Bhakkar</option>
                            <option value="Railway Road, Bhakkar">Railway Road, Bhakkar</option>
                            <option value="Mandi Town, Bhakkar">Mandi Town, Bhakkar</option>
                            <option value="Chisti Nagar, Bhakkar">Chisti Nagar, Bhakkar</option>
                            <option value="Other Bhakkar Area">Other Bhakkar Area (Specify below)</option>
                          </select>
                        </div>

                        <div>
                          <textarea
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="House No, Street, Landmark near your location *"
                            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Special instructions (e.g. extra spicy, bring change)"
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Totals & Checkout Buttons */}
          {!confirmedOrder && items.length > 0 && (
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/80 space-y-3">
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white tabular-nums">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-mono text-white tabular-nums">
                    {deliveryType === 'pickup'
                      ? 'Free (Pickup)'
                      : deliveryFee === 0
                      ? 'FREE'
                      : `PKR ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span className="font-cinzel">Total Due</span>
                  <span className="text-[#FF6321] font-mono tabular-nums">
                    PKR {(deliveryType === 'pickup' ? subtotal : total).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handlePlaceOrder('COD')}
                  className="flex items-center justify-center gap-1.5 bg-[#FF6321] hover:bg-[#e05316] text-white py-3 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF6321]/20 active:scale-95 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming...' : 'Place Order'}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handlePlaceOrder('whatsapp')}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-zinc-500">
                Cash on Delivery (COD) available across Bhakkar city.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
