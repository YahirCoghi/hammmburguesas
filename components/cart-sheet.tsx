"use client";

import { useState } from "react";

import { getLineSubtotal, getLineUnitPrice } from "@/lib/cart-pricing";
import { buildWhatsAppMessage } from "@/lib/cart-whatsapp";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import type { CheckoutValidationResult } from "@/lib/store-types";

import { useCart } from "./cart-provider";

export function CartSheet() {
  const {
    state,
    subtotal,
    itemCount,
    closeCart,
    clearCart,
    removeItem,
    updateQuantity,
    setCustomerName,
    setReference,
    setNote,
    setServiceMode,
  } = useCart();
  const [issues, setIssues] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const canAttemptCheckout = Boolean(siteConfig.whatsappNumber && state.items.length > 0);

  const handleCheckout = async () => {
    if (!canAttemptCheckout || isValidating) {
      return;
    }

    setIsValidating(true);
    setIssues([]);

    try {
      const response = await fetch("/api/cart/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items.map((line) => ({
            id: line.id,
            productId: line.productId,
            quantity: line.quantity,
            note: line.note,
            selections: line.selections,
          })),
        }),
      });

      const validation = (await response.json()) as CheckoutValidationResult;

      if (!response.ok || !validation.ok) {
        setIssues(validation.issues);
        return;
      }

      const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
        buildWhatsAppMessage({
          customerName: state.customerName,
          reference: state.reference,
          note: state.note,
          serviceMode: state.serviceMode,
          validation,
        }),
      )}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch {
      setIssues([
        "No pudimos validar tu pedido en este momento. Intenta de nuevo en unos segundos.",
      ]);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <div
        aria-hidden={!state.isOpen}
        className={[
          "fixed inset-0 z-40 bg-black/65 backdrop-blur-sm transition-opacity duration-300",
          state.isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={closeCart}
      />

      <aside
        aria-hidden={!state.isOpen}
        className={[
          "fixed right-0 top-0 z-50 flex h-dvh w-full max-w-xl flex-col border-l border-white/10 bg-[#111111] text-white shadow-2xl transition-transform duration-300",
          state.isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f5c200]">
              Cart
            </p>
            <h2 className="mt-2 font-display text-3xl font-black italic uppercase">
              Tu pedido
            </h2>
          </div>
          <button
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-[#f5c200] hover:text-[#f5c200]"
            onClick={closeCart}
            type="button"
          >
            Cerrar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {state.items.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center">
              <p className="text-lg font-semibold text-white">Tu carrito esta vacio.</p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Agrega productos desde el menu y deja listo el mensaje de WhatsApp.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((line) => (
                <div
                  className="rounded-[28px] border border-white/10 bg-white/5 p-4"
                  key={line.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl font-black italic uppercase">
                        {line.productName}
                      </p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-white/70">
                        {line.productDescription}
                      </p>
                    </div>
                    <button
                      className="text-sm font-semibold text-white/60 transition hover:text-[#f5c200]"
                      onClick={() => removeItem(line.id)}
                      type="button"
                    >
                      Quitar
                    </button>
                  </div>

                  {line.extras.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {line.extras.map((extra) => (
                        <span
                          className="rounded-full border border-[#f5c200]/20 bg-[#f5c200]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f5c200]"
                          key={`${line.id}-${extra.optionId}`}
                        >
                          {extra.optionName}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {line.note ? (
                    <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/65">
                      {line.note}
                    </p>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                        Unitario
                      </p>
                      <p className="mt-1 font-semibold text-white/75">
                        {formatPrice(getLineUnitPrice(line))}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-2 py-2">
                      <button
                        className="size-9 rounded-full bg-white/5 text-lg font-semibold transition hover:bg-white/10"
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        type="button"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold">
                        {line.quantity}
                      </span>
                      <button
                        className="size-9 rounded-full bg-white/5 text-lg font-semibold transition hover:bg-white/10"
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-lg font-black text-[#f5c200]">
                      {formatPrice(getLineSubtotal(line))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 space-y-5 rounded-[32px] border border-white/10 bg-white/5 p-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Checkout
              </p>
              <h3 className="mt-2 font-display text-2xl font-black italic uppercase">
                Confirma por WhatsApp
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Antes de abrir WhatsApp validamos existencias para no prometer algo sin
                stock.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className={[
                  "rounded-full border px-4 py-3 text-sm font-semibold transition",
                  state.serviceMode === "pickup"
                    ? "border-[#f5c200] bg-[#f5c200] text-[#111111]"
                    : "border-white/10 bg-black/30 text-white/75 hover:border-white/25",
                ].join(" ")}
                onClick={() => setServiceMode("pickup")}
                type="button"
              >
                Pickup
              </button>
              <button
                className={[
                  "rounded-full border px-4 py-3 text-sm font-semibold transition",
                  state.serviceMode === "delivery"
                    ? "border-[#f5c200] bg-[#f5c200] text-[#111111]"
                    : "border-white/10 bg-black/30 text-white/75 hover:border-white/25",
                ].join(" ")}
                onClick={() => setServiceMode("delivery")}
                type="button"
              >
                Delivery
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/75">Nombre</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#f5c200]"
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Como te llamas"
                type="text"
                value={state.customerName}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/75">
                Referencia
              </span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#f5c200]"
                onChange={(event) => setReference(event.target.value)}
                placeholder="Mesa, direccion o punto de entrega"
                type="text"
                value={state.reference}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/75">
                Nota general
              </span>
              <textarea
                className="min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#f5c200]"
                onChange={(event) => setNote(event.target.value)}
                placeholder="Sin cubiertos, pago en efectivo, dejar en porton, etc."
                value={state.note}
              />
            </label>

            {issues.length > 0 ? (
              <div className="rounded-[24px] border border-rose-400/30 bg-rose-400/10 px-4 py-4 text-sm leading-6 text-rose-100">
                {issues.map((issue) => (
                  <p key={issue}>{issue}</p>
                ))}
              </div>
            ) : null}

            {!siteConfig.whatsappNumber ? (
              <div className="rounded-2xl border border-dashed border-[#f5c200]/40 bg-[#f5c200]/10 px-4 py-3 text-sm leading-6 text-white/80">
                Configura <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code> para activar la
                confirmacion de compra por WhatsApp.
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#111111] px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-sm text-white/60">
            <span>{itemCount} items en el pedido</span>
            <button
              className="font-semibold text-white/75 transition hover:text-[#f5c200]"
              onClick={clearCart}
              type="button"
            >
              Limpiar
            </button>
          </div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.3em] text-white/45">Subtotal</p>
            <p className="font-display text-3xl font-black italic text-[#f5c200]">
              {formatPrice(subtotal)}
            </p>
          </div>

          <button
            className={[
              "flex w-full items-center justify-center rounded-full px-5 py-4 text-sm font-black uppercase tracking-[0.25em] transition",
              canAttemptCheckout
                ? "bg-[#f5c200] text-[#111111] hover:translate-y-[-1px]"
                : "cursor-not-allowed bg-white/10 text-white/35",
            ].join(" ")}
            disabled={!canAttemptCheckout || isValidating}
            onClick={handleCheckout}
            type="button"
          >
            {isValidating ? "Validando stock..." : "Confirmar compra"}
          </button>
        </div>
      </aside>
    </>
  );
}
