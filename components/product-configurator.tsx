"use client";

import { useState } from "react";

import { formatPrice } from "@/lib/format";
import { getInventoryClasses, getInventoryLabel } from "@/lib/inventory";
import type { AddCartLineInput, CartLineExtra, StorefrontProduct } from "@/lib/store-types";

type ProductConfiguratorProps = {
  product: StorefrontProduct | null;
  onClose: () => void;
  onConfirm: (item: AddCartLineInput) => void;
};

type SelectionState = Record<string, string[]>;

function buildDefaultSelections(product: StorefrontProduct) {
  const initialState: SelectionState = {};

  for (const group of product.extraGroups) {
    const availableOptions = group.options.filter((option) => option.isAvailable);

    if (group.required && group.selectionType === "single" && availableOptions[0]) {
      initialState[group.id] = [availableOptions[0].id];
      continue;
    }

    if (group.required && group.selectionType === "multiple") {
      initialState[group.id] = availableOptions
        .slice(0, group.minSelect)
        .map((option) => option.id);
    }
  }

  return initialState;
}

function flattenExtras(product: StorefrontProduct, selections: SelectionState) {
  const extras: CartLineExtra[] = [];

  for (const group of product.extraGroups) {
    const selectedOptionIds = selections[group.id] ?? [];

    for (const optionId of selectedOptionIds) {
      const option = group.options.find((item) => item.id === optionId);

      if (!option) {
        continue;
      }

      extras.push({
        groupId: group.id,
        groupName: group.name,
        optionId: option.id,
        optionName: option.name,
        price: option.price,
      });
    }
  }

  return extras;
}

function hasValidSelections(product: StorefrontProduct, selections: SelectionState) {
  return product.extraGroups.every((group) => {
    const selectedCount = (selections[group.id] ?? []).length;

    return selectedCount >= group.minSelect && selectedCount <= group.maxSelect;
  });
}

function getMaxQuantity(product: StorefrontProduct, selections: SelectionState) {
  let maxQuantity = product.stock;

  for (const group of product.extraGroups) {
    for (const optionId of selections[group.id] ?? []) {
      const option = group.options.find((item) => item.id === optionId);

      if (!option) {
        continue;
      }

      maxQuantity = Math.min(maxQuantity, option.stock);
    }
  }

  return Math.max(maxQuantity, 1);
}

function toggleSelection(
  groupId: string,
  optionId: string,
  isSelected: boolean,
  selectionType: "single" | "multiple",
  maxSelect: number,
  currentState: SelectionState,
) {
  const currentSelection = currentState[groupId] ?? [];

  if (selectionType === "single") {
    return {
      ...currentState,
      [groupId]: isSelected ? [] : [optionId],
    };
  }

  if (isSelected) {
    return {
      ...currentState,
      [groupId]: currentSelection.filter((item) => item !== optionId),
    };
  }

  if (currentSelection.length >= maxSelect) {
    return currentState;
  }

  return {
    ...currentState,
    [groupId]: [...currentSelection, optionId],
  };
}

export function ProductConfigurator({
  product,
  onClose,
  onConfirm,
}: ProductConfiguratorProps) {
  if (!product) {
    return null;
  }

  return (
    <ConfiguratorPanel
      key={product.id}
      onClose={onClose}
      onConfirm={onConfirm}
      product={product}
    />
  );
}

function ConfiguratorPanel({
  product,
  onClose,
  onConfirm,
}: Omit<ProductConfiguratorProps, "product"> & { product: StorefrontProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [itemNote, setItemNote] = useState("");
  const [selections, setSelections] = useState<SelectionState>(() =>
    buildDefaultSelections(product),
  );

  const extras = flattenExtras(product, selections);
  const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
  const unitPrice = product.price + extrasTotal;
  const maxQuantity = getMaxQuantity(product, selections);
  const canAdd =
    product.isAvailable && product.stock > 0 && hasValidSelections(product, selections);

  const handleConfirm = () => {
    if (!canAdd) {
      return;
    }

    onConfirm({
      productId: product.id,
      productName: product.name,
      productDescription: product.description,
      productImage: product.image,
      basePrice: product.price,
      quantity,
      note: itemNote.trim(),
      prepMinutes: product.prepMinutes,
      selections: Object.entries(selections)
        .filter(([, optionIds]) => optionIds.length > 0)
        .map(([groupId, optionIds]) => ({
          groupId,
          optionIds,
        })),
      extras,
    });

    onClose();
  };

  const handleToggleSelection = (
    groupId: string,
    optionId: string,
    isSelected: boolean,
    selectionType: "single" | "multiple",
    maxSelect: number,
  ) => {
    const nextSelections = toggleSelection(
      groupId,
      optionId,
      isSelected,
      selectionType,
      maxSelect,
      selections,
    );

    setSelections(nextSelections);
    setQuantity((current) => Math.min(current, getMaxQuantity(product, nextSelections)));
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92vh] w-[min(96vw,900px)] overflow-hidden rounded-t-[36px] border border-white/10 bg-[#111111] text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)] lg:bottom-6 lg:rounded-[36px]">
        <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f5c200]">
              Personaliza tu pedido
            </p>
            <h2 className="mt-2 font-display text-3xl font-black italic uppercase">
              {product.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
              {product.description}
            </p>
          </div>

          <button
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-[#f5c200] hover:text-[#f5c200]"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </div>

        <div className="grid max-h-[calc(92vh-194px)] gap-8 overflow-y-auto px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={[
                  "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em]",
                  getInventoryClasses(product.inventoryStatus),
                ].join(" ")}
              >
                {getInventoryLabel(
                  product.inventoryStatus,
                  product.stock,
                  product.isAvailable,
                )}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                {product.prepMinutes} min aprox
              </span>
            </div>

            {product.extraGroups.map((group) => (
              <section
                className="rounded-[28px] border border-white/10 bg-white/5 p-5"
                key={group.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-black italic uppercase">
                      {group.name}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.26em] text-white/45">
                      {group.required ? "Obligatorio" : "Opcional"} |{" "}
                      {group.selectionType === "single"
                        ? "elige 1"
                        : `hasta ${group.maxSelect}`}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {group.options.map((option) => {
                    const selected = (selections[group.id] ?? []).includes(option.id);
                    const disabled = !option.isAvailable;

                    return (
                      <button
                        className={[
                          "flex items-center justify-between rounded-[22px] border px-4 py-4 text-left transition",
                          selected
                            ? "border-[#f5c200] bg-[#f5c200]/12 text-white"
                            : "border-white/10 bg-black/20 text-white/75",
                          disabled
                            ? "cursor-not-allowed border-white/8 bg-white/5 text-white/30"
                            : "hover:border-white/25",
                        ].join(" ")}
                        disabled={disabled}
                        key={option.id}
                        onClick={() =>
                          handleToggleSelection(
                            group.id,
                            option.id,
                            selected,
                            group.selectionType,
                            group.maxSelect,
                          )
                        }
                        type="button"
                      >
                        <div>
                          <p className="font-semibold">{option.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/40">
                            {getInventoryLabel(
                              option.inventoryStatus,
                              option.stock,
                              option.isAvailable,
                            )}
                          </p>
                        </div>
                        <span className="text-sm font-black text-[#f5c200]">
                          {option.price > 0 ? `+${formatPrice(option.price)}` : "Incluido"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/75">
                Nota para este item
              </span>
              <textarea
                className="min-h-28 w-full rounded-[24px] border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#f5c200]"
                onChange={(event) => setItemNote(event.target.value)}
                placeholder="Sin cebolla, queso bien fundido, salsa aparte..."
                value={itemNote}
              />
            </label>
          </div>

          <div className="space-y-5">
            <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                Tu configuracion
              </p>
              <p className="mt-4 font-display text-4xl font-black italic text-[#f5c200]">
                {formatPrice(unitPrice)}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Cada cambio impacta el total y se valida contra inventario real antes
                de enviarlo a WhatsApp.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-2 py-2">
                <button
                  className="size-10 rounded-full bg-white/5 text-lg font-semibold transition hover:bg-white/10"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  type="button"
                >
                  -
                </button>
                <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  className="size-10 rounded-full bg-white/5 text-lg font-semibold transition hover:bg-white/10"
                  onClick={() =>
                    setQuantity((current) => Math.min(maxQuantity, current + 1))
                  }
                  type="button"
                >
                  +
                </button>
              </div>

              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/45">
                Maximo disponible para esta configuracion: {maxQuantity}
              </p>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                Resumen
              </p>
              <div className="mt-4 space-y-3">
                {extras.length > 0 ? (
                  extras.map((extra) => (
                    <div
                      className="flex items-center justify-between gap-4 text-sm"
                      key={extra.optionId}
                    >
                      <div>
                        <p className="font-semibold text-white">{extra.optionName}</p>
                        <p className="text-white/45">{extra.groupName}</p>
                      </div>
                      <p className="font-semibold text-[#f5c200]">
                        {extra.price > 0 ? `+${formatPrice(extra.price)}` : "Incluido"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-white/60">
                    Sin extras adicionales por ahora.
                  </p>
                )}
              </div>
            </section>

            <button
              className={[
                "flex w-full items-center justify-center rounded-full px-5 py-4 text-sm font-black uppercase tracking-[0.28em] transition",
                canAdd
                  ? "bg-[#f5c200] text-[#111111] hover:-translate-y-0.5"
                  : "cursor-not-allowed bg-white/10 text-white/35",
              ].join(" ")}
              onClick={handleConfirm}
              type="button"
            >
              {product.isAvailable ? "Agregar al carrito" : "No disponible"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
