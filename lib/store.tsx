"use client";
import { Product } from "@/types/backend";
import type { CartItem as BackendCartItem, WishlistItem as BackendWishlistItem } from "@/types/backend";
import {
  createRemoteCartItem,
  createRemoteWishlistItem,
  deleteRemoteCartItem,
  deleteRemoteWishlistItem,
  loadCollections,
  updateRemoteCartItem,
} from "@/components/actions/collections";
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartItem = Product & { quantity: number; backendId?: number };
type WishlistItem = Product & { backendId?: number };
type User = { name?: string; email: string };
type StoreContextValue = {
  cart: CartItem[];
  wishlist: WishlistItem[];
  user: User | null;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (id: number) => boolean;
  setUser: (user: User | null) => void;
  setCart: (items?: BackendCartItem[]) => void;
  setWishlist: (items?: BackendWishlistItem[]) => void;
  clearUserData: () => void;
  collectionError: string | null;
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
  const [cart, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlistItems] = useState<WishlistItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [collectionError, setCollectionError] = useState<string | null>(null);

  useEffect(() => {
    // Storage is only available after mount, so hydrate the deterministic server state here.
    /* eslint-disable react-hooks/set-state-in-effect */
    setCartItems(readStorage("user-cart", []));
    setWishlistItems(readStorage("user-wishlist", []));
    setUser(readStorage("user", null));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated || !user) return;
    loadCollections()
      .then(({ cart: remoteCart, wishlist: remoteWishlist, authenticated }) => {
        if (!authenticated) {
          setCartItems([]);
          setWishlistItems([]);
          setUser(null);
          setCollectionError("Your session expired. Please log in again.");
          return;
        }
        setCartItems(
          remoteCart.map((item) => ({
            ...item.product,
            quantity: item.quantity,
            backendId: item.id,
          })),
        );
        setWishlistItems(
          remoteWishlist.map((item) => ({
            ...item.product,
            backendId: item.id,
          })),
        );
        setCollectionError(null);
      })
      .catch((error) => {
        console.error("Unable to synchronize cart and wishlist:", error);
        setCollectionError("Unable to synchronize your cart and wishlist.");
      });
  }, [hydrated, user]);

  const setCart = useCallback((items: BackendCartItem[] = []) => {
    setCartItems(
      items.map((item) => ({
        ...(typeof item.product === "number"
          ? {
              id: item.product,
              title: "Product",
              price: 0,
              description: "",
              category: "products",
              image: "/images/hero1.jpg",
            }
          : item.product),
        quantity: item.quantity,
        backendId: item.id,
      })),
    );
  }, []);

  const setWishlist = useCallback((items: BackendWishlistItem[] = []) => {
    setWishlistItems(
      items.map((item) => ({
        ...(typeof item.product === "number"
          ? {
              id: item.product,
              title: "Product",
              price: 0,
              description: "",
              category: "products",
              image: "/images/hero1.jpg",
            }
          : item.product),
        backendId: item.id,
      })),
    );
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
      addToCart: async (product) => {
        const existing = cart.find((item) => item.id === product.id);
        if (user) {
          try {
            const quantity = existing ? existing.quantity + 1 : 1;
            const remote = existing?.backendId
              ? await updateRemoteCartItem(existing.backendId, quantity)
              : await createRemoteCartItem(product.id, quantity);
            setCartItems((items) =>
              existing
                ? items.map((item) =>
                    item.id === product.id
                      ? { ...item, quantity, backendId: remote.id }
                      : item,
                  )
                : [...items, { ...product, quantity: 1, backendId: remote.id }],
            );
            setCollectionError(null);
            return;
          } catch (error) {
            console.error("Unable to add item to cart:", error);
            setCollectionError("Unable to update your cart.");
            return;
          }
        }
        setCartItems((items) =>
          existing
            ? items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              )
            : [...items, { ...product, quantity: 1 }],
        );
      },
      updateQuantity: async (id, quantity) => {
        const item = cart.find((entry) => entry.id === id);
        if (user && item?.backendId) {
          try {
            if (quantity > 0) await updateRemoteCartItem(item.backendId, quantity);
            else await deleteRemoteCartItem(item.backendId);
            setCollectionError(null);
          } catch (error) {
            console.error("Unable to update cart item:", error);
            setCollectionError("Unable to update your cart.");
            return;
          }
        }
        setCartItems((items) =>
          quantity > 0
            ? items.map((entry) =>
                entry.id === id ? { ...entry, quantity } : entry,
              )
            : items.filter((entry) => entry.id !== id),
        );
      },
      removeFromCart: async (id) => {
        const item = cart.find((entry) => entry.id === id);
        if (user && item?.backendId) {
          try {
            await deleteRemoteCartItem(item.backendId);
            setCollectionError(null);
          } catch (error) {
            console.error("Unable to remove cart item:", error);
            setCollectionError("Unable to update your cart.");
            return;
          }
        }
        setCartItems((items) => items.filter((entry) => entry.id !== id));
      },
      toggleWishlist: async (product) => {
        const existing = wishlist.find((item) => item.id === product.id);
        if (user) {
          try {
            if (existing?.backendId) await deleteRemoteWishlistItem(existing.backendId);
            else {
              const remote = await createRemoteWishlistItem(product.id);
              setWishlistItems((items) => [
                ...items,
                { ...product, backendId: remote.id },
              ]);
              setCollectionError(null);
              return;
            }
            setCollectionError(null);
          } catch (error) {
            console.error("Unable to update wishlist:", error);
            setCollectionError("Unable to update your wishlist.");
            return;
          }
        }
        setWishlistItems((items) =>
          existing
            ? items.filter((item) => item.id !== product.id)
            : [...items, product],
        );
      },
      isWishlisted: (id) => wishlist.some((item) => item.id === id),
      setUser,
      setCart,
      setWishlist,
      clearUserData: () => {
        setCartItems([]);
        setWishlistItems([]);
        setUser(null);
        setCollectionError(null);
      },
      collectionError,
    }),
    [cart, collectionError, setCart, setWishlist, user, wishlist],
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
