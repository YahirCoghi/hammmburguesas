import { loginAdminAction, logoutAdminAction, updateExtraInventoryAction, updateProductInventoryAction } from "@/app/admin/actions";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { getInventoryDashboardData } from "@/lib/store-service";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getMessage(searchParamValue: string | string[] | undefined) {
  return Array.isArray(searchParamValue) ? searchParamValue[0] : searchParamValue;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = (await searchParams) ?? {};
  const error = getMessage(params.error);
  const saved = getMessage(params.saved);
  const adminConfigured = isAdminConfigured();
  const authenticated = await isAdminAuthenticated();

  if (!adminConfigured) {
    return (
      <main className="min-h-screen bg-[#0f1011] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f5c200]">
            Admin
          </p>
          <h1 className="mt-4 font-display text-5xl font-black italic uppercase">
            Configura tu acceso
          </h1>
          <p className="mt-6 text-base leading-8 text-white/70">
            Define <code>ADMIN_PASSWORD</code> en tus variables de entorno para activar
            este panel de inventario.
          </p>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0f1011] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.25)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f5c200]">
            Admin
          </p>
          <h1 className="mt-4 font-display text-5xl font-black italic uppercase">
            Inventario
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Entra con la clave interna para actualizar stock, disponibilidad y tiempos
            de cocina.
          </p>

          {error === "invalid-password" ? (
            <div className="mt-6 rounded-[24px] border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              La clave no coincide. Intenta de nuevo.
            </div>
          ) : null}

          <form action={loginAdminAction} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/75">Clave</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#f5c200]"
                name="password"
                placeholder="Clave del panel"
                type="password"
              />
            </label>
            <button
              className="w-full rounded-full bg-[#f5c200] px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-[#111111] transition hover:-translate-y-0.5"
              type="submit"
            >
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  const data = await getInventoryDashboardData();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#101111_0%,_#181819_100%)] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 rounded-[36px] border border-white/10 bg-white/5 p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f5c200]">
              Admin
            </p>
            <h1 className="mt-4 font-display text-5xl font-black italic uppercase">
              Control de inventario
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
              Ajusta stock, disponibilidad y tiempos de preparacion. Cada cambio se
              refleja en la tienda y en la validacion previa al checkout.
            </p>
          </div>

          <form action={logoutAdminAction}>
            <button
              className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/75 transition hover:border-[#f5c200] hover:text-[#f5c200]"
              type="submit"
            >
              Cerrar sesion
            </button>
          </form>
        </div>

        {saved ? (
          <div className="mt-6 rounded-[24px] border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            Se guardo el cambio del {saved === "product" ? "producto" : "extra"}.
          </div>
        ) : null}

        <div className="mt-10 space-y-8">
          {data.categories.map((category) => {
            const categoryProducts = data.products.filter(
              (product) => product.categoryId === category.id,
            );

            return (
              <section
                className="rounded-[32px] border border-white/10 bg-white/5 p-6"
                key={category.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                      Categoria
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-black italic uppercase">
                      {category.name}
                    </h2>
                  </div>
                  <p className="max-w-3xl text-sm leading-7 text-white/65">
                    {category.blurb}
                  </p>
                </div>

                <div className="mt-8 grid gap-6">
                  {categoryProducts.map((product) => (
                    <article
                      className="rounded-[28px] border border-white/10 bg-black/20 p-5"
                      key={product.id}
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="max-w-2xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-display text-3xl font-black italic uppercase">
                              {product.name}
                            </h3>
                            {product.badge ? (
                              <span className="rounded-full border border-[#f5c200]/30 bg-[#f5c200]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#f5c200]">
                                {product.badge}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-3 text-sm leading-7 text-white/68">
                            {product.description}
                          </p>
                        </div>

                        <form
                          action={updateProductInventoryAction}
                          className="grid gap-3 sm:grid-cols-4 xl:min-w-[470px]"
                        >
                          <input name="productId" type="hidden" value={product.id} />
                          <label className="block">
                            <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/45">
                              Stock
                            </span>
                            <input
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#f5c200]"
                              defaultValue={product.stock}
                              min={0}
                              name="stock"
                              type="number"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/45">
                              Prep min
                            </span>
                            <input
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#f5c200]"
                              defaultValue={product.prepMinutes}
                              min={1}
                              name="prepMinutes"
                              type="number"
                            />
                          </label>
                          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                            <input
                              className="size-4 accent-[#f5c200]"
                              defaultChecked={product.isAvailable}
                              name="available"
                              type="checkbox"
                            />
                            Disponible
                          </label>
                          <button
                            className="rounded-full bg-[#f5c200] px-4 py-3 text-sm font-black uppercase tracking-[0.22em] text-[#111111] transition hover:-translate-y-0.5"
                            type="submit"
                          >
                            Guardar
                          </button>
                        </form>
                      </div>

                      {product.extraGroups.length > 0 ? (
                        <div className="mt-6 space-y-4">
                          {product.extraGroups.map((group) => (
                            <div
                              className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                              key={group.id}
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                                    Extra group
                                  </p>
                                  <h4 className="mt-1 font-semibold text-white">{group.name}</h4>
                                </div>
                                <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                                  {group.selectionType === "single"
                                    ? "Seleccion unica"
                                    : `Hasta ${group.maxSelect}`}
                                </p>
                              </div>

                              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                {group.options.map((option) => (
                                  <form
                                    action={updateExtraInventoryAction}
                                    className="grid gap-3 rounded-[20px] border border-white/10 bg-black/20 p-4 sm:grid-cols-[1.5fr_0.8fr_0.9fr_auto]"
                                    key={option.id}
                                  >
                                    <input
                                      name="optionId"
                                      type="hidden"
                                      value={option.id}
                                    />
                                    <div>
                                      <p className="font-semibold text-white">{option.name}</p>
                                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/40">
                                        {option.price > 0 ? `+CRC ${option.price}` : "Incluido"}
                                      </p>
                                    </div>
                                    <label className="block">
                                      <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/45">
                                        Stock
                                      </span>
                                      <input
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#f5c200]"
                                        defaultValue={option.stock}
                                        min={0}
                                        name="stock"
                                        type="number"
                                      />
                                    </label>
                                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                      <input
                                        className="size-4 accent-[#f5c200]"
                                        defaultChecked={option.isAvailable}
                                        name="available"
                                        type="checkbox"
                                      />
                                      Activo
                                    </label>
                                    <button
                                      className="rounded-full border border-white/15 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:border-[#f5c200] hover:text-[#f5c200]"
                                      type="submit"
                                    >
                                      Guardar
                                    </button>
                                  </form>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
