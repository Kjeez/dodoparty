export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";

export interface Order {
  id: string;
  user_id: string | null;
  firebase_uid: string;
  package_id: string;
  package_name: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  dodo_payment_id: string | null;
  party_date: string | null;
  webhook_received_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRecord {
  id: string;
  firebase_uid: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
}

export const PACKAGES: Package[] = [
  { id: "standard", name: "Standard Glow", price: 49.99 },
  { id: "premium", name: "Premium Sparkle", price: 99.99 },
  { id: "vip", name: "VIP Extravaganza", price: 199.99 },
];
