import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  ShoppingBag,
  TrendingUp,
  Package,
  Cake,
  Star,
  Settings as SettingsIcon,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Trash2,
  Edit,
  Save,
  Check
} from 'lucide-react';
import { Order, Product, CakeInquiry, CustomerReview, BusinessSettings, ProductCategory, OrderStatus } from '../types.ts';
import {
  adminLogin,
  fetchAdminOrders,
  updateOrderStatus,
  fetchAdminInquiries,
  updateInquiryStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchReviews,
  fetchSettings,
  updateSettings,
  fetchAnalytics
} from '../services/api.ts';

interface AdminDashboardProps {
  onClose: () => void;
  products: Product[];
  onProductsUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, products, onProductsUpdated }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('plc_admin_token'));
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'menu' | 'cakes' | 'reviews' | 'settings'>('orders');

  // Admin Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<CakeInquiry[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Order filter
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Product modal / edit state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    if (token) {
      loadAllAdminData();
    }
  }, [token]);

  const loadAllAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [ordList, inqList, revList, stats, setts] = await Promise.all([
        fetchAdminOrders(token),
        fetchAdminInquiries(token),
        fetchReviews(),
        fetchAnalytics(token),
        fetchSettings()
      ]);
      setOrders(ordList);
      setInquiries(inqList);
      setReviews(revList);
      setAnalytics(stats);
      setSettings(setts);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await adminLogin(pinInput);
      setToken(res.token);
      localStorage.setItem('plc_admin_token', res.token);
      setPinInput('');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid PIN. (Default: pizzalounge2026)');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('plc_admin_token');
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    try {
      const updated = await updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setFeedbackMsg(`Order #${orderId} marked as "${newStatus}"`);
      setTimeout(() => setFeedbackMsg(''), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    if (!token) return;
    try {
      const updated = await updateInquiryStatus(inquiryId, newStatus, token);
      setInquiries((prev) => prev.map((i) => (i.id === inquiryId ? updated : i)));
    } catch (err: any) {
      alert(err.message || 'Failed to update inquiry');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProduct) return;

    try {
      if (editingProduct.id) {
        await updateProduct(editingProduct.id, editingProduct, token);
        setFeedbackMsg(`Updated product "${editingProduct.name}"`);
      } else {
        await createProduct(editingProduct, token);
        setFeedbackMsg(`Created new product "${editingProduct.name}"`);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      onProductsUpdated();
      setTimeout(() => setFeedbackMsg(''), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to remove "${name}" from the menu?`)) return;

    try {
      await deleteProduct(id, token);
      onProductsUpdated();
      setFeedbackMsg(`Removed "${name}"`);
      setTimeout(() => setFeedbackMsg(''), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !settings) return;

    try {
      await updateSettings(settings, token);
      setFeedbackMsg('Business settings updated successfully!');
      setTimeout(() => setFeedbackMsg(''), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // If not authenticated, render Login Modal
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="w-full max-w-md bg-[#0D0E12] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#FF6321]/15 border border-[#FF6321]/30 rounded-full flex items-center justify-center mx-auto text-[#FF6321]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-cinzel text-white">Staff Management Portal</h2>
            <p className="text-xs text-zinc-400">
              Pizza Lounge &amp; Cakes Bhakkar administrative access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Admin Passcode / PIN
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
              />
              <span className="block text-[11px] text-zinc-500 mt-1.5">
                Default authorization code: <code className="text-[#FF6321] font-mono">pizzalounge2026</code>
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-full cursor-pointer transition-colors border border-zinc-800"
              >
                Return to Website
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors shadow-lg shadow-[#FF6321]/20"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0A] text-zinc-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-20 bg-[#0D0E12]/95 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
            <span className="text-[#FF6321]">PLC</span>
            <span className="text-zinc-400 text-xs font-sans">/ Admin Console</span>
          </div>
          <span className="hidden sm:inline-block text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
            Live Bhakkar Server
          </span>
        </div>

        {feedbackMsg && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-700 px-3 py-1 rounded-full">
            <Check className="w-3.5 h-3.5" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllAdminData}
            disabled={loading}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 cursor-pointer transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FF6321]' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium rounded-full text-zinc-300 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors shadow-md shadow-[#FF6321]/20"
          >
            Close Dashboard
          </button>
        </div>
      </header>

      {/* Admin Subnav Tabs */}
      <div className="bg-[#0D0E12] border-b border-zinc-800 px-4 sm:px-8 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'orders', label: 'Customer Orders', count: orders.length, icon: ShoppingBag },
          { id: 'analytics', label: 'Sales & KPIs', icon: TrendingUp },
          { id: 'menu', label: 'Menu & Pricing', count: products.length, icon: Package },
          { id: 'cakes', label: 'Cake Inquiries', count: inquiries.length, icon: Cake },
          { id: 'reviews', label: 'Reviews', count: reviews.length, icon: Star },
          { id: 'settings', label: 'Store Settings', icon: SettingsIcon },
        ].map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                active
                  ? 'border-[#FF6321] text-[#FF6321]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="bg-zinc-800 text-white px-2 py-0.5 rounded-full text-[10px] tabular-nums font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold font-cinzel text-white">Live Kitchen Orders</h3>
                <p className="text-xs text-[#a1a1aa]">
                  Manage order verification, cooking progression, and dispatch to Bhakkar addresses.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer border transition-colors ${
                      orderFilter === st
                        ? 'bg-[#FF6321] border-[#FF6321] text-white shadow-sm shadow-[#FF6321]/20'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-[#18181c] rounded-xl border border-[#27272f] text-sm text-[#a1a1aa]">
                No orders found under "{orderFilter}".
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#18181c] border border-[#27272f] rounded-xl p-5 space-y-4 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222228] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-mono font-bold text-[#FF6321]">#{ord.id}</span>
                        <span className="text-xs text-[#a1a1aa]">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs bg-[#27272f] text-white px-2 py-0.5 rounded uppercase font-medium">
                          {ord.paymentMethod}
                        </span>
                        <span className="text-xs bg-[#222228] text-white px-2 py-0.5 rounded capitalize">
                          {ord.deliveryType}
                        </span>
                      </div>

                      {/* Status Dropdown control */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#71717a]">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer border ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                              : ord.status === 'preparing'
                              ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                              : ord.status === 'out_for_delivery'
                              ? 'bg-blue-950/80 border-blue-700 text-blue-300'
                              : 'bg-red-950/80 border-red-700 text-red-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">In Kitchen / Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[#71717a] block">Customer Details</span>
                        <div className="text-sm font-semibold text-white">{ord.customerName}</div>
                        <a
                          href={`tel:${ord.phone}`}
                          className="text-[#FF6321] font-mono hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{ord.phone}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-[#71717a] block">Delivery Location</span>
                        <div className="text-white">
                          {ord.deliveryType === 'pickup' ? (
                            <span className="text-[#FF6321]">Customer Pickup at Jhang Road Lounge</span>
                          ) : (
                            ord.address || 'Address not specified'
                          )}
                        </div>
                        {ord.notes && (
                          <div className="text-[#d4d4d8] mt-1 bg-[#121214] p-1.5 rounded">
                            <strong>Note:</strong> {ord.notes}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[#71717a] block">Order Bill</span>
                        <div className="text-sm font-mono font-bold text-white tabular-nums">
                          PKR {ord.total.toLocaleString()}
                        </div>
                        <span className="text-[11px] text-[#a1a1aa]">
                          Subtotal: PKR {ord.subtotal.toLocaleString()} · Delivery: PKR {ord.deliveryFee.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items summary list */}
                    <div className="bg-[#121214] rounded-lg p-3 text-xs space-y-1">
                      <span className="font-semibold text-[#a1a1aa] block text-[11px]">Items in Order:</span>
                      <div className="divide-y divide-[#222228]">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="py-1 flex justify-between">
                            <span className="text-white">
                              {it.quantity}x {it.name}
                            </span>
                            <span className="font-mono text-[#a1a1aa] tabular-nums">
                              PKR {it.total.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Analytics & KPIs */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-cinzel text-white">Sales &amp; Kitchen Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#18181c] border border-[#27272f] p-5 rounded-xl space-y-1">
                <span className="text-xs text-[#a1a1aa]">Total Orders Logged</span>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  {analytics?.totalOrders ?? orders.length}
                </div>
              </div>
              <div className="bg-[#18181c] border border-[#27272f] p-5 rounded-xl space-y-1">
                <span className="text-xs text-[#a1a1aa]">Gross Sales Volume</span>
                <div className="text-2xl font-bold font-mono text-[#FF6321] tabular-nums">
                  PKR {(analytics?.totalRevenue ?? orders.reduce((s, o) => s + o.total, 0)).toLocaleString()}
                </div>
              </div>
              <div className="bg-[#18181c] border border-[#27272f] p-5 rounded-xl space-y-1">
                <span className="text-xs text-[#a1a1aa]">Pending Kitchen Orders</span>
                <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {orders.filter((o) => o.status === 'pending' || o.status === 'preparing').length}
                </div>
              </div>
              <div className="bg-[#18181c] border border-[#27272f] p-5 rounded-xl space-y-1">
                <span className="text-xs text-[#a1a1aa]">Cake Inquiries</span>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {inquiries.length}
                </div>
              </div>
            </div>

            <div className="bg-[#18181c] border border-[#27272f] p-6 rounded-xl space-y-4">
              <h4 className="text-base font-semibold text-white">Recent Transactions</h4>
              <div className="divide-y divide-[#222228] text-xs">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-[#FF6321]">#{o.id}</span>
                      <span className="ml-2 text-white">{o.customerName}</span>
                      <span className="ml-2 text-[#71717a]">({o.items.length} items)</span>
                    </div>
                    <div className="text-right font-mono font-bold text-white tabular-nums">
                      PKR {o.total.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Menu & Pricing */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-cinzel text-white">Menu &amp; Product Management</h3>
                <p className="text-xs text-[#a1a1aa]">
                  Adjust item prices, toggle out-of-stock items, or introduce new seasonal deals.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    category: 'pizza',
                    description: '',
                    price: 1200,
                    image: '/src/assets/images/pizza_special_crown_crust_1793035847816.jpg',
                    isAvailable: true,
                    isFeatured: false,
                    prepTime: '20 mins'
                  });
                  setShowProductModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            <div className="bg-[#18181c] border border-[#27272f] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121214] text-[#a1a1aa] uppercase tracking-wider border-b border-[#27272f]">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (PKR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222228]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#1f1f25]">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded object-cover bg-[#27272f]"
                            />
                            <div>
                              <span className="font-semibold text-white block">{p.name}</span>
                              <span className="text-[11px] text-[#71717a] line-clamp-1">{p.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#d4d4d8] capitalize">
                          {p.category.replace(/-/g, ' ')}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                          PKR {p.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              p.isAvailable
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-red-950 text-red-300 border border-red-800'
                            }`}
                          >
                            {p.isAvailable ? 'Available' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setShowProductModal(true);
                            }}
                            className="p-1.5 text-[#FF6321] hover:bg-[#27272f] rounded cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-red-400 hover:bg-[#27272f] rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Cake Inquiries */}
        {activeTab === 'cakes' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-cinzel text-white">Custom Cake Orders &amp; Inquiries</h3>
            <p className="text-xs text-[#a1a1aa]">
              Inquiries submitted by customers for custom birthday cakes, anniversaries, and fondant styles in Bhakkar.
            </p>

            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-[#18181c] border border-[#27272f] rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#222228] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#FF6321]">#{inq.id}</span>
                      <span className="text-white font-semibold">{inq.customerName}</span>
                    </div>
                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                      className="bg-[#121214] border border-[#27272f] text-xs text-white rounded px-2 py-1 outline-none"
                    >
                      <option value="new">New Inquiry</option>
                      <option value="contacted">Customer Contacted</option>
                      <option value="booked">Booked &amp; Baking</option>
                      <option value="completed">Delivered / Completed</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[#71717a] block">Phone / WhatsApp</span>
                      <a href={`tel:${inq.phone}`} className="text-white font-mono hover:text-[#FF6321]">
                        {inq.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-[#71717a] block">Required Date</span>
                      <span className="text-[#FF6321] font-medium">{inq.eventDate}</span>
                    </div>
                    <div>
                      <span className="text-[#71717a] block">Flavor &amp; Size</span>
                      <span className="text-white">{inq.preferredFlavor} ({inq.sizeWeight})</span>
                    </div>
                    <div>
                      <span className="text-[#71717a] block">Design Requested</span>
                      <span className="text-[#d4d4d8]">{inq.preferredDesign}</span>
                    </div>
                  </div>

                  {inq.specialInstructions && (
                    <div className="text-xs bg-[#121214] p-2 rounded text-[#a1a1aa]">
                      <strong>Instructions:</strong> {inq.specialInstructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Reviews Moderation */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-cinzel text-white">Customer Reviews Moderation</h3>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-[#18181c] border border-[#27272f] rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{r.name}</span>
                      <span className="text-[#FF6321]">★ {r.rating}/5</span>
                      <span className="text-[#71717a]">{r.date}</span>
                    </div>
                    <p className="text-[#d4d4d8] italic">"{r.comment}"</p>
                    {r.orderedItem && <span className="text-[11px] text-[#a1a1aa]">Item: {r.orderedItem}</span>}
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Published
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Settings */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleSaveSettings} className="bg-[#18181c] border border-[#27272f] rounded-xl p-6 space-y-4 max-w-2xl">
            <h3 className="text-xl font-bold font-cinzel text-white">Restaurant Details &amp; Hours</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a1a1aa] mb-1">Business Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1">Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a1a1aa] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#a1a1aa] mb-1">WhatsApp Hotline</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a1a1aa] mb-1">Delivery Fee (PKR)</label>
                  <input
                    type="number"
                    value={settings.deliveryFee}
                    onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                    className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#a1a1aa] mb-1">Free Delivery Threshold (PKR)</label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 px-5 py-2.5 bg-[#FF6321] hover:bg-[#e05316] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Product Add / Edit Modal */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#18181c] border border-[#27272f] rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272f] pb-3">
              <h3 className="text-lg font-bold font-cinzel text-white">
                {editingProduct.id ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-[#a1a1aa] hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a1a1aa] mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a1a1aa] mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'pizza'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none"
                  >
                    <option value="pizza">Pizza</option>
                    <option value="stuffed-pizza">Stuffed Pizza</option>
                    <option value="burgers">Burgers &amp; Zingers</option>
                    <option value="wings">Wings &amp; Appetizers</option>
                    <option value="fries">Loaded Fries</option>
                    <option value="deals">Fast Food Deals</option>
                    <option value="cakes">Cakes &amp; Bakery</option>
                    <option value="shakes-icecream">Shakes &amp; Ice Cream</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a1a1aa] mb-1">Base Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="/src/assets/images/..."
                  className="w-full bg-[#121214] border border-[#27272f] rounded px-3 py-2 text-white outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                    className="rounded border-[#27272f]"
                  />
                  <span className="text-white">In Stock &amp; Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded border-[#27272f]"
                  />
                  <span className="text-white">Featured Showcase</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#27272f]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-[#27272f] text-white rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6321] hover:bg-[#e05316] text-white rounded cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
