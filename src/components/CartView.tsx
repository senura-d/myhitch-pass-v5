"use client";

import { ShoppingCart, Trash2, Minus, Plus, Zap, Calendar, MapPin, PlusCircle } from "lucide-react";
import Link from "next/link";
import { CartItem } from "../types";

interface CartViewProps {
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: (id: string) => void;
  onClearAll: () => void;
  onBrowseEvents: () => void;
}

export default function CartView({
  cartItems,
  onRemove,
  onUpdateQty,
  onCheckout,
  onClearAll,
  onBrowseEvents,
}: CartViewProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-soft-bg flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="p-6 bg-white rounded-full border border-border-gray shadow-sm mb-6">
          <ShoppingCart className="h-12 w-12 text-brand-blue" />
        </div>
        <h2 className="text-2xl font-black text-dark-text mb-2">
          Your cart is empty
        </h2>
        <p className="text-neutral-500 text-sm font-semibold mb-8">
          Browse events and add tickets to get started.
        </p>
        <button
          onClick={onBrowseEvents}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white font-black uppercase tracking-wider text-xs px-8 py-3.5 rounded-full shadow-md shadow-brand-blue/20 cursor-pointer transition-all"
        >
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-bg py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-dark-text tracking-tight">
              Your Cart
            </h1>
            <p className="text-neutral-500 text-sm font-semibold mt-1">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} —
              checkout each event below
            </p>
          </div>
          <button
            onClick={onClearAll}
            className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-full border border-red-100 hover:bg-red-50 transition-all cursor-pointer"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items list */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-border-gray rounded-[32px] overflow-hidden shadow-sm"
              >
                <div className="flex gap-4 p-5">
                  <img
                    src={item.eventImage}
                    alt={item.eventTitle}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-dark-text text-sm leading-tight line-clamp-2 mb-1">
                      {item.eventTitle}
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500 font-semibold mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-brand-blue" />
                        {item.eventDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-brand-blue" />
                        {item.eventLocation}
                      </span>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 bg-light-tint border border-brand-blue/15 text-brand-blue text-[10px] font-black rounded-full uppercase tracking-wider">
                      {item.seatType}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    title="Remove from cart"
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex-shrink-0 self-start"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="border-t border-border-gray px-5 py-4 flex flex-wrap items-center justify-between gap-3 bg-soft-bg rounded-b-[32px]">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 rounded-full bg-white border border-border-gray text-dark-text hover:text-brand-blue flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-black text-dark-text">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="h-8 w-8 rounded-full bg-white border border-border-gray text-dark-text hover:text-brand-blue flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs text-neutral-400 font-semibold ml-1">
                      × ${item.unitPrice} ea
                    </span>
                  </div>

                  {/* Subtotal + checkout button */}
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-dark-text">
                      ${item.unitPrice * item.quantity}
                    </span>
                    <button
                      onClick={() => onCheckout(item.id)}
                      className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-sm shadow-brand-blue/20 cursor-pointer transition-all"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border-gray rounded-[32px] p-6 lg:sticky lg:top-24 shadow-md">
              <h3 className="font-black text-xs tracking-wider uppercase text-neutral-400 mb-4 pb-2 border-b border-border-gray font-mono">
                Order Summary
              </h3>
              <div className="space-y-2.5 text-xs font-semibold mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-neutral-500"
                  >
                    <span className="line-clamp-1 flex-1 mr-2">
                      {item.eventTitle}
                      <span className="block text-[10px] text-neutral-400">
                        {item.seatType} × {item.quantity}
                      </span>
                    </span>
                    <span className="flex-shrink-0 font-black text-dark-text">
                      ${item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border-gray pt-3 flex justify-between items-baseline font-black">
                <span className="text-dark-text text-sm">Total</span>
                <span className="text-2xl text-brand-blue">${subtotal}</span>
              </div>
              <p className="text-[10px] text-neutral-400 font-semibold mt-3 text-center leading-relaxed">
                Checkout each event individually using the buttons above.
              </p>
              <button
                onClick={onBrowseEvents}
                className="mt-4 w-full bg-soft-bg hover:bg-neutral-100 text-dark-text font-bold uppercase tracking-wider text-xs py-3 rounded-full border border-border-gray cursor-pointer transition-all"
              >
                + Add More Tickets
              </button>

              <div className="mt-3 border-t border-border-gray pt-4">
                <p className="text-[10px] text-neutral-400 font-semibold text-center mb-3">
                  Are you an event organiser?
                </p>
                <Link
                  href="/organiser/signup"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-blue to-sky-400 hover:from-sky-400 hover:to-brand-blue text-white font-black uppercase tracking-wider text-xs py-3 rounded-full shadow-md shadow-brand-blue/20 transition-all"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Post an Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
