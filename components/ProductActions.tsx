"use client";

import { useStore } from "@/lib/store";
import { Product } from "@/types/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faHeart,
  faMinus,
  faPlus,
  faShoppingCart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart, updateQuantity, toggleWishlist, isWishlisted, cart } =
    useStore();
  const [isCartPending, setIsCartPending] = useState(false);
  const [isWishlistPending, setIsWishlistPending] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(false);
  const [wishlistFeedback, setWishlistFeedback] = useState(false);
  const feedbackTimers = useRef<Set<number>>(new Set());
  const wishlisted = isWishlisted(product.id);
  const cartItem = cart.find((item) => item.id === product.id);

  useEffect(() => {
    const timers = feedbackTimers.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const clearFeedbackAfterDelay = (setFeedback: (value: boolean) => void) => {
    const timer = window.setTimeout(() => {
      feedbackTimers.current.delete(timer);
      setFeedback(false);
    }, 700);
    feedbackTimers.current.add(timer);
  };

  const changeQuantity = async (quantity: number) => {
    setIsCartPending(true);
    try {
      await updateQuantity(product.id, quantity);
      setCartFeedback(true);
      clearFeedbackAfterDelay(setCartFeedback);
    } finally {
      setIsCartPending(false);
    }
  };

  const addProduct = async () => {
    setIsCartPending(true);
    try {
      await addToCart(product);
      setCartFeedback(true);
      clearFeedbackAfterDelay(setCartFeedback);
    } finally {
      setIsCartPending(false);
    }
  };

  const changeWishlist = async () => {
    setIsWishlistPending(true);
    try {
      await toggleWishlist(product);
      setWishlistFeedback(true);
      clearFeedbackAfterDelay(setWishlistFeedback);
    } finally {
      setIsWishlistPending(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {cartItem ? (
        <div
          className="flex min-w-44 flex-1 items-center justify-between rounded-md border border-input bg-background"
          aria-label={`Quantity for ${product.title}`}
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              cartItem.quantity === 1 ? "Remove from cart" : "Decrease quantity"
            }
            disabled={isCartPending}
            onClick={() => changeQuantity(cartItem.quantity - 1)}
          >
            {cartItem.quantity === 1 ? (
              <FontAwesomeIcon icon={faTrash} className="size-4 text-destructive" />
            ) : (
              <FontAwesomeIcon icon={faMinus} className="size-4" />
            )}
          </Button>
          <span className="inline-flex items-center justify-center gap-1">
            {cartFeedback && (
              <FontAwesomeIcon
                icon={faCheck}
                className="size-4 animate-bounce text-primary"
                aria-hidden="true"
              />
            )}
            <Input
              className="h-8 w-14 border-0 text-center font-semibold focus-visible:ring-1"
              type="number"
              min="1"
              value={cartItem.quantity}
              disabled={isCartPending}
              onChange={(event) =>
                changeQuantity(Math.max(1, Number(event.target.value) || 1))
              }
              aria-label={`Quantity for ${product.title}`}
            />
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            disabled={isCartPending}
            onClick={() => changeQuantity(cartItem.quantity + 1)}
          >
            <FontAwesomeIcon icon={faPlus} className="size-4" />
          </Button>
        </div>
      ) : (
        <Button
          className="flex-1"
          disabled={isCartPending}
          onClick={addProduct}
        >
          <FontAwesomeIcon
            icon={faShoppingCart}
            className={`size-4 ${isCartPending ? "animate-bounce" : ""}`}
            aria-hidden="true"
          />
          Add to cart
        </Button>
      )}
      <Button
        variant={wishlisted ? "secondary" : "outline"}
        disabled={isWishlistPending}
        onClick={changeWishlist}
      >
        {wishlistFeedback ? (
          <FontAwesomeIcon
            icon={faCheck}
            className="size-4 animate-bounce text-primary"
            aria-hidden="true"
          />
        ) : (
          <FontAwesomeIcon
            icon={faHeart}
            className={`size-4 transition-transform ${
              wishlisted ? "fill-current" : ""
            } ${isWishlistPending ? "animate-pulse" : ""}`}
            aria-hidden="true"
          />
        )}
        <span>{wishlisted ? "Saved" : "Wishlist"}</span>
      </Button>
    </div>
  );
}
