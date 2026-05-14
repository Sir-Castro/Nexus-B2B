import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('wh_cart').then(stored => {
      if (stored) {
        try { setItems(JSON.parse(stored)); } catch {}
      }
    });
  }, []);

  const save = async (newItems: CartItem[]) => {
    setItems(newItems);
    await AsyncStorage.setItem('wh_cart', JSON.stringify(newItems));
  };

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.productId === item.productId);
      let next: CartItem[];
      if (exists) {
        next = prev.map(i => i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i);
      } else {
        next = [...prev, item];
      }
      AsyncStorage.setItem('wh_cart', JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.productId !== productId);
      AsyncStorage.setItem('wh_cart', JSON.stringify(next));
      return next;
    });
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeItem(productId); return; }
    setItems(prev => {
      const next = prev.map(i => i.productId === productId ? { ...i, qty } : i);
      AsyncStorage.setItem('wh_cart', JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    save([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
