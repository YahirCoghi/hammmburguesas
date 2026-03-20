import type { CartLine, CartLineExtra } from "@/lib/store-types";

export function getExtrasTotal(extras: CartLineExtra[]) {
  return extras.reduce((sum, extra) => sum + extra.price, 0);
}

export function getLineUnitPrice(line: Pick<CartLine, "basePrice" | "extras">) {
  return line.basePrice + getExtrasTotal(line.extras);
}

export function getLineSubtotal(line: Pick<CartLine, "basePrice" | "extras" | "quantity">) {
  return getLineUnitPrice(line) * line.quantity;
}
