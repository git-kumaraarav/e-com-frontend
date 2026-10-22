"use client";
import { Product } from "@/types/backend";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartItem = Product & { quantity: number };
type User = { name?: string; email: string };
type StoreContextValue = {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: number) => boolean;
  setUser: (user: User | null) => void;
  clearUserData: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Storage is only available after mount, so hydrate the deterministic server state here.
    /* eslint-disable react-hooks/set-state-in-effect */
    setCart(readStorage("user-cart", []));
    setWishlist(readStorage("user-wishlist", []));
    setUser(readStorage("user", null));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(
    () => {
      if (hydrated) localStorage.setItem("user-cart", JSON.stringify(cart));
    },
    [cart, hydrated],
  );

  useEffect(
    () => {
      if (hydrated)
        localStorage.setItem("user-wishlist", JSON.stringify(wishlist));
    },
    [hydrated, wishlist],
  );

  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [hydrated, user]);

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      user,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      addToCart: (product) =>
        setCart((items) => {
          const existing = items.find((item) => item.id === product.id);
          return existing
            ? items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              )
            : [...items, { ...product, quantity: 1 }];
        }),
      updateQuantity: (id, quantity) =>
        setCart((items) =>
          quantity > 0
            ? items.map((item) =>
                item.id === id ? { ...item, quantity } : item,
              )
            : items.filter((item) => item.id !== id),
        ),
      removeFromCart: (id) =>
        setCart((items) => items.filter((item) => item.id !== id)),
      toggleWishlist: (product) =>
        setWishlist((items) =>
          items.some((item) => item.id === product.id)
            ? items.filter((item) => item.id !== product.id)
            : [...items, product],
        ),
      isWishlisted: (id) => wishlist.some((item) => item.id === id),
      setUser,
      clearUserData: () => {
        setCart([]);
        setWishlist([]);
        setUser(null);
      },
    }),
    [cart, user, wishlist],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
