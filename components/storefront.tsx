"use client";

import { startTransition, useDeferredValue, useState } from "react";
import Image from "next/image";

import { CartProvider, useCart } from "@/components/cart-provider";
import { CartSheet } from "@/components/cart-sheet";
import { ProductConfigurator } from "@/components/product-configurator";
import { experienceHighlights, testimonials } from "@/lib/catalog-content";
import { formatPrice } from "@/lib/format";
import { getInventoryClasses, getInventoryLabel } from "@/lib/inventory";
import { siteConfig } from "@/lib/site-config";
import type { AddCartLineInput, StorefrontData, StorefrontProduct } from "@/lib/store-types";

type StorefrontProps = {
  data: StorefrontData;
};

function StorefrontBody({ data }: StorefrontProps) {
  const { addItem, itemCount, openCart, subtotal } = useCart();
  const [activeCategory, setActiveCategory] = useState(data.categories[0]?.id ?? "");
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
  const deferredCategory = useDeferredValue(activeCategory);

  const activeCategoryMeta = data.categories.find(
    (category) => category.id === deferredCategory,
  );
  const visibleItems = data.products.filter(
    (item) => item.categoryId === deferredCategory,
  );

  const handleOpenProduct = (product: StorefrontProduct) => {
    setSelectedProduct(product);
  };

  const handleAddConfiguredItem = (item: AddCartLineInput) => {
    addItem(item);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,194,0,0.16),_transparent_36%),linear-gradient(180deg,_#f7f2ea_0%,_#f5efe6_48%,_#131313_48%,_#0f0f10_100%)] text-[#111111]">
      <CartSheet />
      <ProductConfigurator
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleAddConfiguredItem}
        product={selectedProduct}
      />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#111111]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a
            className="font-display text-2xl font-black italic uppercase tracking-tight text-white"
            href="#inicio"
          >
            HaMMburguesas
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/75 md:flex">
            <a className="transition hover:text-[#f5c200]" href="#inicio">
              Inicio
            </a>
            <a className="transition hover:text-[#f5c200]" href="#menu">
              Menu
            </a>
            <a className="transition hover:text-[#f5c200]" href="#drops">
              Destacados
            </a>
            <a className="transition hover:text-[#f5c200]" href="#experiencia">
              Experiencia
            </a>
          </nav>

          <button
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#f5c200] hover:text-[#f5c200]"
            onClick={openCart}
            type="button"
          >
            <span>Cart</span>
            <span className="rounded-full bg-[#f5c200] px-2 py-1 text-xs font-black text-[#111111]">
              {itemCount}
            </span>
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pb-24 pt-16 text-white" id="inicio">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="relative z-10">
              <p className="inline-flex rounded-full border border-[#f5c200]/40 bg-[#f5c200]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#f5c200]">
                Inventario real + checkout por WhatsApp
              </p>
              <h1 className="mt-8 max-w-4xl font-display text-[clamp(4rem,13vw,9rem)] font-black italic uppercase leading-[0.84] tracking-[-0.05em]">
                HaMM
                <span className="block text-[#f5c200]">burguesas</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
                Burgers bien pesadas, extras configurables y un carrito que valida
                stock real antes de mandar el pedido a WhatsApp.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-[#f5c200] px-8 py-4 text-sm font-black uppercase tracking-[0.3em] text-[#111111] transition hover:-translate-y-0.5"
                  href="#menu"
                >
                  Ver menu
                </a>
                <button
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-black uppercase tracking-[0.3em] text-white transition hover:border-[#f5c200] hover:text-[#f5c200]"
                  onClick={openCart}
                  type="button"
                >
                  Pedir ahora
                </button>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Horario
                  </p>
                  <p className="mt-3 font-semibold text-white/90">{siteConfig.hours}</p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Tiempo real
                  </p>
                  <p className="mt-3 font-semibold text-white/90">
                    Cocina activa todo el dia
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Ciudad
                  </p>
                  <p className="mt-3 font-semibold text-white/90">
                    {siteConfig.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(245,194,0,0.44),_transparent_55%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-black shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <Image
                  alt="Hero burger"
                  className="h-[680px] w-full object-cover"
                  height={1360}
                  priority
                  src="/images/hero-burger.jpg"
                  width={1080}
                />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                      Top visual
                    </p>
                    <p className="mt-2 font-display text-3xl font-black italic uppercase text-white">
                      Burger culture
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                    Confirma por WhatsApp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="overflow-hidden border-y-2 border-[#111111] bg-[#f5c200] py-4 text-[#111111]">
          <div className="ticker-track whitespace-nowrap text-lg font-black uppercase tracking-[0.35em]">
            <span className="mr-10 inline-block">
              Stock en vivo | personaliza tus extras | checkout por WhatsApp |
            </span>
            <span className="mr-10 inline-block">
              Stock en vivo | personaliza tus extras | checkout por WhatsApp |
            </span>
          </div>
        </div>

        <section className="px-4 py-24 sm:px-6 lg:px-8" id="drops">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-kicker text-[#755b00]">Hot drops</p>
                <h2 className="section-title mt-4 text-[#111111]">
                  Lo que sale
                  <span className="block text-[#755b00]">primero hoy</span>
                </h2>
              </div>
              <p className="max-w-xl text-base leading-8 text-[#111111]/70">
                El home combina producto estrella, disponibilidad real y un CTA directo
                para personalizar sin friccion.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {data.featuredProducts.map((item) => (
                <article
                  className={[
                    "overflow-hidden rounded-[36px] border border-black/5 shadow-[0_18px_80px_rgba(17,17,17,0.08)]",
                    item.featuredAccentClass ?? "bg-white text-[#111111]",
                  ].join(" ")}
                  key={item.id}
                >
                  <div className="relative min-h-[360px] overflow-hidden">
                    {item.image ? (
                      <Image
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        height={900}
                        src={item.image}
                        width={900}
                      />
                    ) : null}
                    <div className="absolute left-5 top-5 rounded-full bg-black/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                      {item.featuredEyebrow ?? "Featured"}
                    </div>
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-3xl font-black italic uppercase">
                        {item.name}
                      </h3>
                      <span className="rounded-full border border-current/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]">
                        {item.badge ?? "Top"}
                      </span>
                    </div>
                    <p className="leading-7 opacity-75">{item.description}</p>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-display text-3xl font-black italic">
                          {formatPrice(item.price)}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.22em] opacity-70">
                          {getInventoryLabel(
                            item.inventoryStatus,
                            item.stock,
                            item.isAvailable,
                          )}
                        </p>
                      </div>
                      <button
                        className="rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
                        onClick={() => handleOpenProduct(item)}
                        type="button"
                      >
                        Personalizar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-4 py-24 text-white sm:px-6 lg:px-8" id="menu">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="section-kicker text-[#f5c200]">Menu board</p>
                <h2 className="section-title mt-4 text-white">
                  Todo el menu,
                  <span className="block text-[#f5c200]">con stock real</span>
                </h2>
                <p className="mt-6 max-w-lg text-base leading-8 text-white/68">
                  Cada categoria muestra disponibilidad actual, tiempos de cocina y
                  personalizaciones para que el pedido salga bien desde la primera.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                  {data.categories.map((category) => (
                    <button
                      className={[
                        "rounded-full border px-5 py-3 text-sm font-black uppercase tracking-[0.24em] transition",
                        activeCategory === category.id
                          ? "border-[#f5c200] bg-[#f5c200] text-[#111111]"
                          : "border-white/10 bg-white/5 text-white/80 hover:border-white/25",
                      ].join(" ")}
                      key={category.id}
                      onClick={() =>
                        startTransition(() => setActiveCategory(category.id))
                      }
                      type="button"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Categoria activa
                  </p>
                  <p className="mt-3 font-display text-3xl font-black italic uppercase text-white">
                    {activeCategoryMeta?.name}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    {activeCategoryMeta?.blurb}
                  </p>
                </div>
              </div>

              <div className="grid gap-5">
                {visibleItems.map((item) => (
                  <article
                    className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6"
                    key={item.id}
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-display text-3xl font-black italic uppercase text-white">
                            {item.name}
                          </h3>
                          {item.badge ? (
                            <span className="rounded-full border border-[#f5c200]/30 bg-[#f5c200]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f5c200]">
                              {item.badge}
                            </span>
                          ) : null}
                          {item.isSpicy ? (
                            <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                              Picante
                            </span>
                          ) : null}
                          <span
                            className={[
                              "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em]",
                              getInventoryClasses(item.inventoryStatus),
                            ].join(" ")}
                          >
                            {getInventoryLabel(
                              item.inventoryStatus,
                              item.stock,
                              item.isAvailable,
                            )}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-white/68 sm:text-base">
                          {item.description}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/45">
                          <span>{item.prepMinutes} min aprox</span>
                          <span>{item.extraGroups.length} grupo(s) de extras</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-4 lg:items-end">
                        <p className="font-display text-3xl font-black italic text-[#f5c200]">
                          {formatPrice(item.price)}
                        </p>
                        <button
                          className={[
                            "rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.3em] transition",
                            item.isAvailable
                              ? "border-[#f5c200] bg-[#f5c200] text-[#111111] hover:-translate-y-0.5"
                              : "cursor-not-allowed border-white/10 bg-white/5 text-white/35",
                          ].join(" ")}
                          disabled={!item.isAvailable}
                          onClick={() => handleOpenProduct(item)}
                          type="button"
                        >
                          {item.isAvailable ? "Personalizar" : "Agotado"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8" id="experiencia">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <p className="section-kicker text-[#755b00]">Por que funciona</p>
                <h2 className="section-title mt-4 text-[#111111]">
                  Una web lista
                  <span className="block text-[#755b00]">para vender</span>
                </h2>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {experienceHighlights.map((item) => (
                    <article
                      className="rounded-[28px] border border-black/6 bg-white/80 p-5 shadow-[0_20px_80px_rgba(17,17,17,0.05)]"
                      key={item.title}
                    >
                      <h3 className="font-display text-2xl font-black italic uppercase text-[#111111]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#111111]/70">
                        {item.copy}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {testimonials.map((item) => (
                  <article
                    className="rounded-[32px] border border-black/6 bg-[#111111] p-6 text-white shadow-[0_20px_80px_rgba(17,17,17,0.16)]"
                    key={item.author}
                  >
                    <p className="text-lg leading-8 text-white/80">
                      &quot;{item.quote}&quot;
                    </p>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#f5c200]">
                      {item.author}
                    </p>
                  </article>
                ))}

                <article className="overflow-hidden rounded-[32px] border border-black/6 bg-white shadow-[0_20px_80px_rgba(17,17,17,0.08)]">
                  <div className="relative h-[360px]">
                    <Image
                      alt="Urban lifestyle"
                      className="h-full w-full object-cover"
                      fill
                      src="/images/urban-lifestyle.jpg"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#755b00]">
                      Friendly flow
                    </p>
                    <p className="mt-3 text-base leading-8 text-[#111111]/70">
                      La combinacion entre visual fuerte, inventario real y checkout
                      conversacional hace que el sitio se sienta moderno y confiable.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-28 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto overflow-hidden rounded-[40px] border border-white/10 bg-[#111111] px-6 py-12 text-white shadow-[0_30px_120px_rgba(0,0,0,0.35)] sm:px-10 lg:px-14">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="section-kicker text-[#f5c200]">Final CTA</p>
                <h2 className="section-title mt-4 text-white">
                  Cierra el pedido
                  <span className="block text-[#f5c200]">por WhatsApp</span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
                  El carrito resume items, extras, cantidades y notas. Antes de salir a
                  WhatsApp vuelve a validar existencias para mantener la experiencia
                  limpia.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <button
                  className="rounded-full bg-[#f5c200] px-6 py-4 text-sm font-black uppercase tracking-[0.3em] text-[#111111] transition hover:-translate-y-0.5"
                  onClick={openCart}
                  type="button"
                >
                  Abrir carrito
                </button>
                <a
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.3em] text-white transition hover:border-[#f5c200] hover:text-[#f5c200]"
                  href={siteConfig.instagramUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Seguir en IG
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-4 left-1/2 z-20 w-[min(92vw,720px)] -translate-x-1/2">
        <button
          className="flex w-full items-center justify-between rounded-full border border-white/10 bg-[#111111]/92 px-5 py-3 text-left text-white shadow-[0_18px_80px_rgba(0,0,0,0.35)] backdrop-blur"
          onClick={openCart}
          type="button"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Checkout</p>
            <p className="mt-1 font-display text-2xl font-black italic uppercase">
              {itemCount > 0 ? `${itemCount} items listos` : "Arma tu pedido"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Subtotal</p>
            <p className="mt-1 font-display text-2xl font-black italic text-[#f5c200]">
              {formatPrice(subtotal)}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

export function Storefront({ data }: StorefrontProps) {
  return (
    <CartProvider>
      <StorefrontBody data={data} />
    </CartProvider>
  );
}
