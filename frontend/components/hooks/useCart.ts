import { create } from "zustand";
import { useEffect } from "react";
import { openDB } from "idb";
import { Item } from "../ItemCard";

export interface CartItem {
  sku: string;
  title: string;
  price: number;
  imageSrc?: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (sku: string) => void;
  setCart: (cart: CartItem[]) => void;
}

const DB_NAME = "cart-db";
const STORE_NAME = "cart-store";
const CART_KEY = "cart";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

async function getCartFromDB(): Promise<CartItem[]> {
  try {
    const db = await getDB();
    const cart = await db.get(STORE_NAME, CART_KEY);
    return cart || [];
  } catch {
    return [];
  }
}

async function setCartToDB(cart: CartItem[]) {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, cart, CART_KEY);
  } catch {
    // Optionally handle error
  }
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const newCart = [
        ...state.cart,
        {
          sku: item["Variant SKU"],
          title: item.Title,
          price: item["Variant Price"],
          imageSrc: item["Image Src"]
        }
      ];
      setCartToDB(newCart);
      return { cart: newCart };
    }),
  removeFromCart: (sku) =>
    set((state) => {
      const newCart = state.cart.filter((item) => item.sku !== sku);
      setCartToDB(newCart);
      return { cart: newCart };
    }),
  setCart: (cart) => {
    setCartToDB(cart);
    set({ cart });
  }
}));

// Custom hook to initialize Zustand cart state from IndexedDB on mount
export function useCartPersistence() {
  const setCart = useCartStore((state) => state.setCart);
  useEffect(() => {
    getCartFromDB().then((cart) => {
      setCart(cart);
    });
    // No dependency to run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cart = useCartStore((state) => state.cart);
  useEffect(() => {
    setCartToDB(cart);
  }, [cart]);
}

export function useCartActions() {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const setCart = useCartStore((state) => state.setCart);
  return { addToCart, removeFromCart, setCart };
}
