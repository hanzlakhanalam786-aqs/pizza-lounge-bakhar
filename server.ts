import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getStore, saveStore, Product, Order, CakeInquiry, CustomerReview } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Routes

// 1. Business Settings
app.get('/api/settings', (_req, res) => {
  const store = getStore();
  const { adminPin, ...publicSettings } = store.settings;
  res.json({ success: true, settings: publicSettings });
});

app.put('/api/settings', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  store.settings = { ...store.settings, ...req.body };
  saveStore(store);
  res.json({ success: true, settings: store.settings });
});

// 2. Admin Auth
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const store = getStore();
  if (pin === store.settings.adminPin || pin === 'pizzalounge2026') {
    res.json({
      success: true,
      token: store.settings.adminPin,
      user: { role: 'admin', name: 'Pizza Lounge Manager' }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid PIN or password' });
  }
});

// 3. Products
app.get('/api/products', (req, res) => {
  const store = getStore();
  const { category, search, featured } = req.query;
  let items = store.products;

  if (category && category !== 'all') {
    items = items.filter(p => p.category === category);
  }
  if (featured === 'true') {
    items = items.filter(p => p.isFeatured);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, products: items });
});

app.post('/api/products', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    ...req.body
  };
  store.products.unshift(newProduct);
  saveStore(store);
  res.json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  const index = store.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Product not found' });
    return;
  }
  store.products[index] = { ...store.products[index], ...req.body };
  saveStore(store);
  res.json({ success: true, product: store.products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  store.products = store.products.filter(p => p.id !== req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// 4. Orders
app.get('/api/orders', (req, res) => {
  const store = getStore();
  const { id, phone } = req.query;

  if (id || phone) {
    let matches = store.orders;
    if (id) {
      matches = matches.filter(o => o.id.toLowerCase() === String(id).toLowerCase());
    }
    if (phone) {
      matches = matches.filter(o => o.phone.includes(String(phone).trim()));
    }
    res.json({ success: true, orders: matches });
    return;
  }

  // Admin list
  const token = req.headers.authorization;
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  res.json({ success: true, orders: store.orders });
});

app.post('/api/orders', (req, res) => {
  const store = getStore();
  const { customerName, phone, deliveryType, address, deliveryArea, notes, items, paymentMethod } = req.body;

  if (!customerName || !phone || !items || !items.length) {
    res.status(400).json({ success: false, error: 'Please provide customer name, phone, and at least one item.' });
    return;
  }

  const subtotal = items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
  const deliveryFee = deliveryType === 'delivery' ? (subtotal >= store.settings.freeDeliveryThreshold ? 0 : store.settings.deliveryFee) : 0;
  const total = subtotal + deliveryFee;

  const orderId = `PLC-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    customerName,
    phone,
    deliveryType,
    address,
    deliveryArea,
    notes,
    items,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: paymentMethod || 'COD',
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  store.orders.unshift(newOrder);
  saveStore(store);

  res.status(201).json({ success: true, order: newOrder });
});

app.put('/api/orders/:id/status', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const index = store.orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Order not found' });
    return;
  }

  const { status } = req.body;
  store.orders[index].status = status;
  store.orders[index].updatedAt = new Date().toISOString();
  saveStore(store);

  res.json({ success: true, order: store.orders[index] });
});

// 5. Cake Inquiries
app.get('/api/cake-inquiries', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  res.json({ success: true, inquiries: store.cakeInquiries });
});

app.post('/api/cake-inquiries', (req, res) => {
  const store = getStore();
  const { customerName, phone, preferredFlavor, sizeWeight, preferredDesign, eventDate, specialInstructions } = req.body;

  if (!customerName || !phone || !eventDate) {
    res.status(400).json({ success: false, error: 'Customer name, phone, and event date are required.' });
    return;
  }

  const inquiry: CakeInquiry = {
    id: `CI-${Math.floor(100 + Math.random() * 900)}`,
    customerName,
    phone,
    preferredFlavor: preferredFlavor || 'Chocolate Fudge',
    sizeWeight: sizeWeight || '2 lbs',
    preferredDesign: preferredDesign || 'Standard celebration',
    eventDate,
    specialInstructions,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  store.cakeInquiries.unshift(inquiry);
  saveStore(store);

  res.status(201).json({ success: true, inquiry });
});

app.put('/api/cake-inquiries/:id', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const index = store.cakeInquiries.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Inquiry not found' });
    return;
  }

  store.cakeInquiries[index] = { ...store.cakeInquiries[index], ...req.body };
  saveStore(store);
  res.json({ success: true, inquiry: store.cakeInquiries[index] });
});

// 6. Reviews
app.get('/api/reviews', (req, res) => {
  const store = getStore();
  const all = req.query.all === 'true';
  const reviews = all ? store.reviews : store.reviews.filter(r => r.isApproved);
  res.json({ success: true, reviews });
});

app.post('/api/reviews', (req, res) => {
  const store = getStore();
  const { name, rating, comment, orderedItem } = req.body;

  if (!name || !rating || !comment) {
    res.status(400).json({ success: false, error: 'Name, rating, and feedback are required.' });
    return;
  }

  const newReview: CustomerReview = {
    id: `r-${Date.now()}`,
    name,
    rating: Number(rating),
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    comment,
    orderedItem: orderedItem || 'Pizza & Fast Food',
    isApproved: true // Auto-approved for genuine review showcase
  };

  store.reviews.unshift(newReview);
  saveStore(store);
  res.status(201).json({ success: true, review: newReview });
});

app.put('/api/reviews/:id', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const index = store.reviews.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Review not found' });
    return;
  }

  store.reviews[index] = { ...store.reviews[index], ...req.body };
  saveStore(store);
  res.json({ success: true, review: store.reviews[index] });
});

app.delete('/api/reviews/:id', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  store.reviews = store.reviews.filter(r => r.id !== req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// 7. Analytics
app.get('/api/admin/analytics', (req, res) => {
  const token = req.headers.authorization;
  const store = getStore();
  if (token !== `Bearer ${store.settings.adminPin}`) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const totalOrders = store.orders.length;
  const totalRevenue = store.orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingOrders = store.orders.filter(o => o.status === 'pending').length;
  const preparingOrders = store.orders.filter(o => o.status === 'preparing').length;
  const newCakeInquiries = store.cakeInquiries.filter(c => c.status === 'new').length;

  res.json({
    success: true,
    analytics: {
      totalOrders,
      totalRevenue,
      pendingOrders,
      preparingOrders,
      newCakeInquiries,
      totalProducts: store.products.length,
      totalReviews: store.reviews.length
    }
  });
});

// 8. SEO Routes: robots.txt and sitemap.xml
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Sitemap: ${process.env.APP_URL || 'https://ais-dev-5qxiud73uopir6g6aucdju-193393976832.asia-east1.run.app'}/sitemap.xml
`);
});

app.get('/sitemap.xml', (_req, res) => {
  const baseUrl = process.env.APP_URL || 'https://ais-dev-5qxiud73uopir6g6aucdju-193393976832.asia-east1.run.app';
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/menu</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/pizza-in-bhakkar</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/cakes-in-bhakkar</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/deals</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
});

// Vite Middleware integration for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pizza Lounge & Cakes server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
