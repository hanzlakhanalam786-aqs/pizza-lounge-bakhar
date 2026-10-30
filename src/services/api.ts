import { Product, Order, CakeInquiry, CustomerReview, BusinessSettings, ProductCategory } from '../types.ts';

const API_BASE = '/api';

export async function fetchSettings(): Promise<BusinessSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch settings');
  return data.settings;
}

export async function updateSettings(settings: Partial<BusinessSettings>, token: string): Promise<BusinessSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to update settings');
  return data.settings;
}

export async function fetchProducts(params?: { category?: ProductCategory; search?: string; featured?: boolean }): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'all') query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.featured) query.set('featured', 'true');

  const res = await fetch(`${API_BASE}/products?${query.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch products');
  return data.products;
}

export async function createProduct(product: Partial<Product>, token: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to create product');
  return data.product;
}

export async function updateProduct(id: string, updates: Partial<Product>, token: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to update product');
  return data.product;
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to delete product');
}

export async function createOrder(payload: {
  customerName: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  deliveryArea?: string;
  notes?: string;
  items: any[];
  paymentMethod: 'COD' | 'whatsapp';
}): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to create order');
  return data.order;
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const res = await fetch(`${API_BASE}/orders?id=${encodeURIComponent(id)}`);
  const data = await res.json();
  if (data.success && data.orders && data.orders.length > 0) {
    return data.orders[0];
  }
  return null;
}

export async function fetchAdminOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch admin orders');
  return data.orders;
}

export async function updateOrderStatus(orderId: string, status: string, token: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to update order status');
  return data.order;
}

export async function createCakeInquiry(inquiry: {
  customerName: string;
  phone: string;
  preferredFlavor: string;
  sizeWeight: string;
  preferredDesign: string;
  eventDate: string;
  specialInstructions?: string;
}): Promise<CakeInquiry> {
  const res = await fetch(`${API_BASE}/cake-inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to submit inquiry');
  return data.inquiry;
}

export async function fetchAdminInquiries(token: string): Promise<CakeInquiry[]> {
  const res = await fetch(`${API_BASE}/cake-inquiries`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch cake inquiries');
  return data.inquiries;
}

export async function updateInquiryStatus(id: string, status: string, token: string): Promise<CakeInquiry> {
  const res = await fetch(`${API_BASE}/cake-inquiries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to update inquiry');
  return data.inquiry;
}

export async function fetchReviews(): Promise<CustomerReview[]> {
  const res = await fetch(`${API_BASE}/reviews`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch reviews');
  return data.reviews;
}

export async function submitReview(review: {
  name: string;
  rating: number;
  comment: string;
  orderedItem?: string;
}): Promise<CustomerReview> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to submit review');
  return data.review;
}

export async function adminLogin(pin: string): Promise<{ token: string; user: { role: string; name: string } }> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Invalid credentials');
  return { token: data.token, user: data.user };
}

export async function fetchAnalytics(token: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/analytics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to load analytics');
  return data.analytics;
}
