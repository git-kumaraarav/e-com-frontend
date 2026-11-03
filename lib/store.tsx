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
import { getSession } from "next-auth/react";
import { getAuthenticatedState } from "@/components/actions/authenticatedState";
import {
  clearPersistedUserData,
  mapCartItem,
  mapWishlistItem,
  readStorage,
  STORAGE_KEYS,
  type CartState,
  type User,
  type WishlistState,
} from "@/lib/store-utils";
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCartItems] = useState<CartState[]>([]);
  const [wishlist, setWishlistItems] = useState<WishlistState[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [collectionError, setCollectionError] = useState<string | null>(null);

  const lastSyncedUserRef = useRef<string | null | undefined>(undefined);
  const authSyncPromiseRef = useRef<Promise<void> | null>(null);

  const clearUserData = useCallback(() => {
    clearPersistedUserData();
    setCartItems([]);
    setWishlistItems([]);
    setUser(null);
    setCollectionError(null);
  }, []);

  const setCollections = useCallback(
    (remoteCart: BackendCartItem[], remoteWishlist: BackendWishlistItem[]) => {
      setCartItems(remoteCart.map(mapCartItem));
      setWishlistItems(remoteWishlist.map(mapWishlistItem));
    },
    [],
  );

  // 1. Set/Unset user data
  useEffect(() => {
    let cancelled = false;

    getSession()
      .then((session) => {
        if (cancelled) return;

        if (!session?.user?.email) {
          clearUserData();
        } else {
          setCartItems(readStorage(STORAGE_KEYS.cart, []));
          setWishlistItems(readStorage(STORAGE_KEYS.wishlist, []));
          setUser({
            name: session.user.name ?? session.user.email,
            email: session.user.email,
          });
        }
        setHydrated(true);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Unable to verify the authentication session:", error);
        clearUserData();
        setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [clearUserData]);

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
        if (state.error || !state.user) {
          clearUserData();
          return;
        }
        lastSyncedUserRef.current = state.user.email;
        setUser(state.user);
        setCollections(state.cart, state.wishlist);
      })
      .finally(() => {
        authSyncPromiseRef.current = null;
      });

    authSyncPromiseRef.current = sync;
    return sync;
  }, [clearUserData, setCollections]);

  useEffect(() => {
    if (!hydrated) return;

    const userKey = user?.email ?? null;
    if (lastSyncedUserRef.current === userKey) return;
    if (!user) return;

    let cancelled = false;
    loadCollections()
      .then(({ cart: remoteCart, wishlist: remoteWishlist, authenticated }) => {
        if (cancelled) return;
        if (!authenticated) {
          clearUserData();
          lastSyncedUserRef.current = null;
          setCollectionError("Your session expired. Please log in again.");
          return;
        }
        lastSyncedUserRef.current = userKey;
        setCollections(remoteCart, remoteWishlist);
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
  }, [clearUserData, hydrated, setCollections, user]);

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
      clearUserData,
      collectionError,
    }),
    [
      cart,
      collectionError,
      reportCollectionError,
      clearUserData,
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
