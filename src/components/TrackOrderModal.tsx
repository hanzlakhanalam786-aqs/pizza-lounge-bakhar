import React, { useState, useEffect } from 'react';
import { X, Search, Clock, CheckCircle2, Flame, Bike, Check, Phone } from 'lucide-react';
import { fetchOrderById } from '../services/api.ts';
import { Order, OrderStatus } from '../types.ts';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOrderId?: string;
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'pending', label: 'Order Received', desc: 'Received at Pizza Lounge kitchen' },
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Chef reviewed & ticket confirmed' },
  { key: 'preparing', label: 'In the Oven', desc: 'Baking pizza & frying zingers fresh' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is on the way in Bhakkar' },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy your warm food!' },
];

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose, defaultOrderId }) => {
  const [searchId, setSearchId] = useState(defaultOrderId || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (defaultOrderId) {
      setSearchId(defaultOrderId);
      handleTrack(defaultOrderId);
    }
  }, [defaultOrderId]);

  if (!isOpen) return null;

  const handleTrack = async (orderIdToSearch?: string) => {
    const targetId = orderIdToSearch || searchId;
    if (!targetId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const found = await fetchOrderById(targetId.trim());
      if (found) {
        setOrder(found);
      } else {
        setOrder(null);
        setErrorMsg(`No active order found with ID "${targetId}". Please verify your order number (e.g. PLC-1082) or call 0321 8865050.`);
      }
    } catch (err: any) {
      setErrorMsg('Failed to check order status. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepKey: OrderStatus) => {
    if (!order) return 'upcoming';
    const orderIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
    const stepIndex = STATUS_STEPS.findIndex((s) => s.key === stepKey);

    if (order.status === 'cancelled') return 'cancelled';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xs" />

      <div className="relative w-full max-w-lg bg-[#0D0E12] border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-xl font-bold font-cinzel text-white">Track Your Order</h3>
            <span className="text-xs text-zinc-400">Live kitchen &amp; delivery updates in Bhakkar</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/60 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order ID (e.g. PLC-1082)"
            className="flex-1 bg-zinc-900/90 border border-zinc-800 focus:border-[#FF6321] rounded-full px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none font-mono transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-[#FF6321]/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Tracking...' : 'Track'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="space-y-6 pt-2">
            {/* Header info */}
            <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-500 block">Order Tracking ID</span>
                <span className="text-lg font-mono font-bold text-[#FF6321]">{order.id}</span>
                <span className="text-xs text-zinc-400 block mt-0.5">Customer: {order.customerName}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-zinc-500 block">Amount to Pay (COD)</span>
                <span className="text-base font-mono font-bold text-white tabular-nums">
                  PKR {order.total.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-400 capitalize block">{order.deliveryType}</span>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-zinc-400 block">
                Live Kitchen &amp; Delivery Progress
              </span>

              <div className="space-y-4 relative pl-6 border-l-2 border-zinc-800">
                {STATUS_STEPS.map((step) => {
                  const state = getStepStatus(step.key);
                  return (
                    <div key={step.key} className="relative">
                      {/* Indicator dot */}
                      <span
                        className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          state === 'completed'
                            ? 'bg-emerald-500 text-white'
                            : state === 'current'
                            ? 'bg-[#FF6321] text-white font-bold ring-4 ring-[#FF6321]/20'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {state === 'completed' ? '✓' : ''}
                      </span>

                      <div>
                        <h4
                          className={`text-sm font-semibold font-cinzel ${
                            state === 'current'
                              ? 'text-[#FF6321]'
                              : state === 'completed'
                              ? 'text-white'
                              : 'text-zinc-500'
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p className="text-xs text-zinc-400">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items summary */}
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs">
              <span className="text-xs font-semibold text-white block font-cinzel">Order Summary</span>
              <div className="divide-y divide-zinc-800">
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between text-zinc-300">
                    <span>
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-mono tabular-nums text-white">PKR {it.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              {order.address && (
                <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
                  <strong className="text-white">Delivery Address:</strong> {order.address}
                </div>
              )}
            </div>

            {/* Contact kitchen helpline */}
            <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
              <span>Need help with your order?</span>
              <a
                href="tel:03218865050"
                className="flex items-center gap-1.5 text-[#FF6321] font-semibold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>0321 8865050</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
