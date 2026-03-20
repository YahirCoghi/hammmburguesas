"use client";

import { createContext, useContext, useReducer } from "react";

import { getLineSubtotal } from "@/lib/cart-pricing";
import { createCartSignature } from "@/lib/cart-signature";
import type { AddCartLineInput, CartLine, ServiceMode } from "@/lib/store-types";

type CartState = {
  isOpen: boolean;
  items: CartLine[];
  customerName: string;
  reference: string;
  note: string;
  serviceMode: ServiceMode;
};

type CartContextValue = {
  state: CartState;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddCartLineInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  setCustomerName: (value: string) => void;
  setReference: (value: string) => void;
  setNote: (value: string) => void;
  setServiceMode: (value: ServiceMode) => void;
  clearCart: () => void;
};

type Action =
  | { type: "open" }
  | { type: "close" }
  | { type: "add"; item: AddCartLineInput }
  | { type: "remove"; lineId: string }
  | { type: "quantity"; lineId: string; quantity: number }
  | { type: "name"; value: string }
  | { type: "reference"; value: string }
  | { type: "note"; value: string }
  | { type: "service"; value: ServiceMode }
  | { type: "clear" };

const initialState: CartState = {
  isOpen: false,
  items: [],
  customerName: "",
  reference: "",
  note: "",
  serviceMode: "pickup",
};

const CartContext = createContext<CartContextValue | null>(null);

function createLineId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `line-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "open":
      return { ...state, isOpen: true };
    case "close":
      return { ...state, isOpen: false };
    case "add": {
      const signature = createCartSignature({
        id: "pending",
        productId: action.item.productId,
        quantity: action.item.quantity,
        note: action.item.note,
        selections: action.item.selections,
      });
      const existingLine = state.items.find((line) => line.signature === signature);

      if (existingLine) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((line) =>
            line.signature === signature
              ? { ...line, quantity: line.quantity + action.item.quantity }
              : line,
          ),
        };
      }

      return {
        ...state,
        isOpen: true,
        items: [
          ...state.items,
          {
            ...action.item,
            id: createLineId(),
            signature,
          },
        ],
      };
    }
    case "remove":
      return {
        ...state,
        items: state.items.filter((line) => line.id !== action.lineId),
      };
    case "quantity":
      return {
        ...state,
        items: state.items
          .map((line) =>
            line.id === action.lineId ? { ...line, quantity: action.quantity } : line,
          )
          .filter((line) => line.quantity > 0),
      };
    case "name":
      return { ...state, customerName: action.value };
    case "reference":
      return { ...state, reference: action.value };
    case "note":
      return { ...state, note: action.value };
    case "service":
      return { ...state, serviceMode: action.value };
    case "clear":
      return {
        ...state,
        items: [],
        note: "",
        reference: "",
        customerName: "",
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const itemCount = state.items.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = state.items.reduce((sum, line) => sum + getLineSubtotal(line), 0);

  return (
    <CartContext.Provider
      value={{
        state,
        itemCount,
        subtotal,
        openCart: () => dispatch({ type: "open" }),
        closeCart: () => dispatch({ type: "close" }),
        addItem: (item) => dispatch({ type: "add", item }),
        removeItem: (lineId) => dispatch({ type: "remove", lineId }),
        updateQuantity: (lineId, quantity) =>
          dispatch({ type: "quantity", lineId, quantity }),
        setCustomerName: (value) => dispatch({ type: "name", value }),
        setReference: (value) => dispatch({ type: "reference", value }),
        setNote: (value) => dispatch({ type: "note", value }),
        setServiceMode: (value) => dispatch({ type: "service", value }),
        clearCart: () => dispatch({ type: "clear" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
