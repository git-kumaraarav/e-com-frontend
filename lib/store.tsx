"use client";
import type {
  CartItem as BackendCartItem,
  Product,
  WishlistItem as BackendWishlistItem,
} from "@/types/backend";
import {
  createRemoteCartItem,
  createRemoteWishlistItem,
  deleteRemoteCartItem,
  deleteRemoteWishlistItem,
  loadCollections,
  updateRemoteCartItem,
} from "@/components/actions/collections";
import { getAuthenticatedState } from "@/components/actions/authenticatedState";
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type User = { name?: string; email: string };
type ProductWithBackendId = Product & { backendId?: number };
type CartState = ProductWithBackendId & { quantity: number };
type WishlistState = ProductWithBackendId;

type StoreContextValue = {
  cart: CartState[];
  wishlist: WishlistState[];
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
  syncAuthenticatedState: () => Promise<void>;
  clearUserData: () => void;
  collectionError: string | null;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEYS = {
  cart: "user-cart",
  wishlist: "user-wishlist",
  user: "user",
} as const;

const FALLBACK_PRODUCT: Product = {
  id: 0,
  title: "Product",
  price: 0,
  description: "",
  category: "products",
  image: "/images/hero1.jpg",
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function productFromBackend(product: number | Product): Product {
  return typeof product === "number"
    ? { ...FALLBACK_PRODUCT, id: product }
    : product;
}

function mapCartItem(item: BackendCartItem): CartState {
  return {
    ...productFromBackend(item.product),
    quantity: item.quantity,
    backendId: item.id,
  };
}

function mapWishlistItem(item: BackendWishlistItem): WishlistState {
  return {
    ...productFromBackend(item.product),
    backendId: item.id,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCartItems] = useState<CartState[]>([]);
  const [wishlist, setWishlistItems] = useState<WishlistState[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [collectionError, setCollectionError] = useState<string | null>(null);

  
  const lastSyncedUserRef = useRef<string | null | undefined>(undefined);
  const authSyncPromiseRef = useRef<Promise<void> | null>(null);

  // Store 
  useEffect(() => {
    // Storage is only available after mount, so hydrate the deterministic server state here.
    /* eslint-disable react-hooks/set-state-in-effect */
    setCartItems(readStorage(STORAGE_KEYS.cart, []));
    setWishlistItems(readStorage(STORAGE_KEYS.wishlist, []));
    setUser(readStorage(STORAGE_KEYS.user, null));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setCart = useCallback((items: BackendCartItem[] = []) => {
    setCartItems(items.map(mapCartItem));
  }, []);

  const setWishlist = useCallback((items: BackendWishlistItem[] = []) => {
    setWishlistItems(items.map(mapWishlistItem));
  }, []);

  const syncAuthenticatedState = useCallback(async () => {
    if (authSyncPromiseRef.current) return authSyncPromiseRef.current;

    const sync = getAuthenticatedState()
      .then((state) => {
        if (state.error || !state.user) return;
        lastSyncedUserRef.current = state.user.email;
        setUser(state.user);
        setCartItems(state.cart.map(mapCartItem));
        setWishlistItems(state.wishlist.map(mapWishlistItem));
      })
      .finally(() => {
        authSyncPromiseRef.current = null;
      });

    authSyncPromiseRef.current = sync;
    return sync;
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const userKey = user?.email ?? null;
    if (lastSyncedUserRef.current === userKey) return;

    if (!user) {
      lastSyncedUserRef.current = userKey;
      syncAuthenticatedState().catch((error) => {
        lastSyncedUserRef.current = undefined;
        console.error("Unable to hydrate the authenticated store:", error);
      });
      return;
    }

    let cancelled = false;
    loadCollections()
      .then(({ cart: remoteCart, wishlist: remoteWishlist, authenticated }) => {
        if (cancelled) return;
        if (!authenticated) {
          setCartItems([]);
          setWishlistItems([]);
          setUser(null);
          lastSyncedUserRef.current = null;
          setCollectionError("Your session expired. Please log in again.");
          return;
        }
        lastSyncedUserRef.current = userKey;
        setCartItems(remoteCart.map(mapCartItem));
        setWishlistItems(remoteWishlist.map(mapWishlistItem));
        setCollectionError(null);
      })
      .catch((error) => {
        if (cancelled) return;
        lastSyncedUserRef.current = undefined;
        console.error("Unable to synchronize cart and wishlist:", error);
        setCollectionError("Unable to synchronize your cart and wishlist.");
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, syncAuthenticatedState, user]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated)
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  }, [hydrated, wishlist]);

  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.user);
  }, [hydrated, user]);

  const reportCollectionError = useCallback(
    (message: string, userMessage: string, error: unknown) => {
      console.error(message, error);
      setCollectionError(userMessage);
    },
    [],
  );

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
            reportCollectionError(
              "Unable to add item to cart:",
              "Unable to update your cart.",
              error,
            );
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
            if (quantity > 0)
              await updateRemoteCartItem(item.backendId, quantity);
            else await deleteRemoteCartItem(item.backendId);
            setCollectionError(null);
          } catch (error) {
            reportCollectionError(
              "Unable to update cart item:",
              "Unable to update your cart.",
              error,
            );
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
            reportCollectionError(
              "Unable to remove cart item:",
              "Unable to update your cart.",
              error,
            );
            return;
          }
        }
        setCartItems((items) => items.filter((entry) => entry.id !== id));
      },
      toggleWishlist: async (product) => {
        const existing = wishlist.find((item) => item.id === product.id);
        if (user) {
          try {
            if (existing?.backendId)
              await deleteRemoteWishlistItem(existing.backendId);
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
            reportCollectionError(
              "Unable to update wishlist:",
              "Unable to update your wishlist.",
              error,
            );
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
      syncAuthenticatedState,
      clearUserData: () => {
        setCartItems([]);
        setWishlistItems([]);
        setUser(null);
        setCollectionError(null);
      },
      collectionError,
    }),
    [
      cart,
      collectionError,
      reportCollectionError,
      setCart,
      setWishlist,
      syncAuthenticatedState,
      user,
      wishlist,
    ],
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
