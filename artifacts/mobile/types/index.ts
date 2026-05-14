export type UserRole = 'retailer' | 'supplier' | 'logistics' | 'admin';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type PaymentTerm = 'NET7' | 'NET30' | 'NET60' | 'immediate';

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  verified: boolean;
  creditLimit: number;
  creditUsed: number;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  description: string;
  yearsInBusiness: number;
  minOrderValue: number;
  responseTime: string;
  fulfillmentRate: number;
  tags: string[];
  productsCount: number;
  featured: boolean;
}

export interface PricingTier {
  minQty: number;
  price: number;
  label: string;
}

export interface Product {
  id: string;
  supplierId: string;
  supplierName: string;
  name: string;
  category: string;
  description: string;
  sku: string;
  moq: number;
  price: number;
  pricingTiers: PricingTier[];
  unit: string;
  stock: number;
  status: ProductStatus;
  specs: Record<string, string>;
  featured: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  supplierId: string;
  supplierName: string;
  total: number;
  createdAt: string;
  expectedDelivery: string;
  paymentStatus: PaymentStatus;
  paymentTerm: PaymentTerm;
  trackingNumber?: string;
  notes?: string;
  tracking: TrackingEvent[];
}

export interface Conversation {
  id: string;
  supplierId: string;
  supplierName: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'quote';
}

export interface CartItem {
  productId: string;
  supplierId: string;
  supplierName: string;
  productName: string;
  qty: number;
  unit: string;
  unitPrice: number;
  moq: number;
}

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'message' | 'delivery' | 'quote';
  title: string;
  body: string;
  time: string;
  read: boolean;
}
