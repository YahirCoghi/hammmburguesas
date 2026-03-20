import type { InventoryStatus } from "@/lib/store-types";

export function getInventoryLabel(
  status: InventoryStatus,
  stock: number,
  isAvailable: boolean,
) {
  if (!isAvailable || status === "sold-out" || stock <= 0) {
    return "Agotado";
  }

  if (status === "low-stock") {
    return `Quedan ${stock}`;
  }

  return `${stock} disponibles`;
}

export function getInventoryClasses(status: InventoryStatus) {
  if (status === "sold-out") {
    return "border-white/10 bg-white/5 text-white/55";
  }

  if (status === "low-stock") {
    return "border-[#f5c200]/30 bg-[#f5c200]/12 text-[#f5c200]";
  }

  return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
}
