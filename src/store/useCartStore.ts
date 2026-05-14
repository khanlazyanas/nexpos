import { create } from 'zustand';
import { IProduct, ICartItem } from '@/types';

interface CartStore {
  cart: ICartItem[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  // Cart me naya item daalna
  addToCart: (product) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      // Agar pehle se hai, toh sirf quantity badha do
      set({
        cart: cart.map(item => 
          item._id === product._id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 } 
            : item
        )
      });
    } else {
      // Agar naya hai, toh cartQuantity: 1 ke sath add kar do
      set({ cart: [...cart, { ...product, cartQuantity: 1 }] });
    }
  },

  // Cart se item nikalna
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(item => item._id !== productId) });
  },

  // Item ki quantity manual update karna (+ / - buttons ke liye)
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map(item => 
        item._id === productId ? { ...item, cartQuantity: quantity } : item
      )
    });
  },

  // Bill banne ke baad cart khali karna
  clearCart: () => set({ cart: [] }),

  // Total amount calculate karna
  cartTotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  }
}));