export type ProductCategory =
  | 'all'
  | 'pizza'
  | 'stuffed-pizza'
  | 'burgers'
  | 'wings'
  | 'fries'
  | 'deals'
  | 'cakes'
  | 'shakes-icecream';

export interface ProductSize {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  sizes?: ProductSize[];
  badge?: string;
  prepTime?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: ProductCategory;
  image: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  selectedSize?: string;
  price: number;
  total: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  deliveryArea?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'COD' | 'whatsapp';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CakeInquiry {
  id: string;
  customerName: string;
  phone: string;
  preferredFlavor: string;
  sizeWeight: string;
  preferredDesign: string;
  eventDate: string;
  specialInstructions?: string;
  status: 'new' | 'contacted' | 'booked' | 'completed';
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  orderedItem?: string;
  isApproved: boolean;
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  deliveryFee: number;
  freeDeliveryThreshold: number;
}
