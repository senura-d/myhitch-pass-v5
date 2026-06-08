"use client";

import { useRouter } from "next/navigation";
import CartView from "@/src/components/CartView";
import { useAppContext } from "@/app/providers";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQty,
    checkoutCartItem,
    clearCart,
  } = useAppContext();

  const router = useRouter();

  return (
    <div className="animate-fade">
      <CartView
        cartItems={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateCartItemQty}
        onCheckout={checkoutCartItem}
        onClearAll={clearCart}
        onBrowseEvents={() => router.push("/events")}
      />
    </div>
  );
}
