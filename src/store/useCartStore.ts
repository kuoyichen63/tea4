import { create } from 'zustand';

export type CartItem = {
  cartItemId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  sweetness: string;
  ice: string;
};

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(
      (i) => i.menuItemId === item.menuItemId && i.sweetness === item.sweetness && i.ice === item.ice
    );
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.cartItemId === existingItem.cartItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      };
    }
    return {
      items: [...state.items, { ...item, cartItemId: crypto.randomUUID() }],
    };
  }),
  removeItem: (cartItemId) => set((state) => ({
    items: state.items.filter((i) => i.cartItemId !== cartItemId),
  })),
  updateQuantity: (cartItemId, quantity) => set((state) => ({
    items: state.items.map((i) =>
      i.cartItemId === cartItemId ? { ...i, quantity: Math.max(1, quantity) } : i
    ),
  })),
  clearCart: () => set({ items: [] }),
  totalAmount: () => {
    const items = get().items;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
