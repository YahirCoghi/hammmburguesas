import { z } from "zod";

import { getDbClient } from "@/lib/db";
import type {
  CheckoutValidationResult,
  InventoryStatus,
  SelectionType,
  StorefrontData,
  StorefrontExtraGroup,
  StorefrontExtraOption,
  StorefrontProduct,
} from "@/lib/store-types";

type CategoryRow = {
  id: string;
  name: string;
  blurb: string;
};

type ProductRow = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  badge: string | null;
  is_spicy: number;
  image: string | null;
  is_featured: number;
  featured_eyebrow: string | null;
  featured_accent_class: string | null;
  stock: number;
  available: number;
  prep_minutes: number;
};

type ExtraGroupRow = {
  id: string;
  product_id: string;
  name: string;
  selection_type: SelectionType;
  min_select: number;
  max_select: number;
  required: number;
};

type ExtraOptionRow = {
  id: string;
  group_id: string;
  name: string;
  price: number;
  stock: number;
  available: number;
};

const cartValidationSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
        note: z.string().max(220).default(""),
        selections: z
          .array(
            z.object({
              groupId: z.string().min(1),
              optionIds: z.array(z.string().min(1)).max(6),
            }),
          )
          .default([]),
      }),
    )
    .min(1),
});

function getInventoryStatus(stock: number, isAvailable: boolean): InventoryStatus {
  if (!isAvailable || stock <= 0) {
    return "sold-out";
  }

  if (stock <= 4) {
    return "low-stock";
  }

  return "in-stock";
}

function toStorefrontOption(row: ExtraOptionRow): StorefrontExtraOption {
  const isAvailable = Boolean(row.available) && Number(row.stock) > 0;

  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    stock: Number(row.stock),
    isAvailable,
    inventoryStatus: getInventoryStatus(Number(row.stock), isAvailable),
  };
}

function buildStorefrontProduct(
  row: ProductRow,
  groupsByProductId: Map<string, StorefrontExtraGroup[]>,
): StorefrontProduct {
  const stock = Number(row.stock);
  const isAvailable = Boolean(row.available) && stock > 0;

  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    badge: row.badge ?? undefined,
    isSpicy: Boolean(row.is_spicy),
    image: row.image ?? undefined,
    isFeatured: Boolean(row.is_featured),
    featuredEyebrow: row.featured_eyebrow ?? undefined,
    featuredAccentClass: row.featured_accent_class ?? undefined,
    stock,
    isAvailable,
    inventoryStatus: getInventoryStatus(stock, isAvailable),
    prepMinutes: Number(row.prep_minutes),
    extraGroups: groupsByProductId.get(row.id) ?? [],
  };
}

async function getCatalogRows() {
  const db = await getDbClient();

  const [categoryResult, productResult, groupResult, optionResult] = await Promise.all([
    db.execute("SELECT id, name, blurb FROM categories ORDER BY sort_order ASC"),
    db.execute(`
      SELECT
        id,
        category_id,
        name,
        description,
        price,
        badge,
        is_spicy,
        image,
        is_featured,
        featured_eyebrow,
        featured_accent_class,
        stock,
        available,
        prep_minutes
      FROM products
      ORDER BY sort_order ASC
    `),
    db.execute(`
      SELECT
        id,
        product_id,
        name,
        selection_type,
        min_select,
        max_select,
        required
      FROM extra_groups
      ORDER BY sort_order ASC
    `),
    db.execute(`
      SELECT
        id,
        group_id,
        name,
        price,
        stock,
        available
      FROM extra_options
      ORDER BY sort_order ASC
    `),
  ]);

  return {
    categories: categoryResult.rows as unknown as CategoryRow[],
    products: productResult.rows as unknown as ProductRow[],
    extraGroups: groupResult.rows as unknown as ExtraGroupRow[],
    extraOptions: optionResult.rows as unknown as ExtraOptionRow[],
  };
}

function composeStorefrontData(rows: Awaited<ReturnType<typeof getCatalogRows>>): StorefrontData {
  const optionsByGroupId = new Map<string, StorefrontExtraOption[]>();

  for (const optionRow of rows.extraOptions) {
    const currentOptions = optionsByGroupId.get(optionRow.group_id) ?? [];
    currentOptions.push(toStorefrontOption(optionRow));
    optionsByGroupId.set(optionRow.group_id, currentOptions);
  }

  const groupsByProductId = new Map<string, StorefrontExtraGroup[]>();

  for (const groupRow of rows.extraGroups) {
    const currentGroups = groupsByProductId.get(groupRow.product_id) ?? [];

    currentGroups.push({
      id: groupRow.id,
      name: groupRow.name,
      selectionType: groupRow.selection_type,
      minSelect: Number(groupRow.min_select),
      maxSelect: Number(groupRow.max_select),
      required: Boolean(groupRow.required),
      options: optionsByGroupId.get(groupRow.id) ?? [],
    });

    groupsByProductId.set(groupRow.product_id, currentGroups);
  }

  const products = rows.products.map((row) =>
    buildStorefrontProduct(row, groupsByProductId),
  );

  return {
    categories: rows.categories.map((category) => ({
      id: category.id,
      name: category.name,
      blurb: category.blurb,
    })),
    products,
    featuredProducts: products.filter((product) => product.isFeatured),
  };
}

export async function getStorefrontData() {
  const rows = await getCatalogRows();

  return composeStorefrontData(rows);
}

export async function getInventoryDashboardData() {
  return getStorefrontData();
}

export async function validateCheckoutCart(
  payload: unknown,
): Promise<CheckoutValidationResult> {
  const parsed = cartValidationSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      issues: ["No pudimos validar el carrito. Revisa los datos e intenta de nuevo."],
    };
  }

  const storefrontData = await getStorefrontData();
  const productMap = new Map(
    storefrontData.products.map((product) => [product.id, product]),
  );
  const requestedProductCount = new Map<string, number>();
  const requestedExtraCount = new Map<string, number>();

  for (const line of parsed.data.items) {
    requestedProductCount.set(
      line.productId,
      (requestedProductCount.get(line.productId) ?? 0) + line.quantity,
    );

    for (const selection of line.selections) {
      for (const optionId of selection.optionIds) {
        requestedExtraCount.set(
          optionId,
          (requestedExtraCount.get(optionId) ?? 0) + line.quantity,
        );
      }
    }
  }

  const issues: string[] = [];
  const summaryLines = [];
  let subtotal = 0;
  let itemCount = 0;
  let estimatedReadyIn = 0;

  for (const line of parsed.data.items) {
    const product = productMap.get(line.productId);

    if (!product) {
      issues.push("Uno de los productos ya no esta disponible en el menu.");
      continue;
    }

    if (!product.isAvailable || product.stock <= 0) {
      issues.push(`${product.name} ya no esta disponible por el momento.`);
      continue;
    }

    const requestedProductQuantity = requestedProductCount.get(product.id) ?? 0;

    if (requestedProductQuantity > product.stock) {
      issues.push(
        `${product.name} solo tiene ${product.stock} unidades disponibles en inventario.`,
      );
      continue;
    }

    const groupsById = new Map(product.extraGroups.map((group) => [group.id, group]));
    const lineExtras = [];
    let extrasTotal = 0;

    for (const group of product.extraGroups) {
      const selection = line.selections.find((item) => item.groupId === group.id);
      const selectedOptionIds = [...new Set(selection?.optionIds ?? [])];
      const selectedOptions = selectedOptionIds
        .map((optionId) => group.options.find((option) => option.id === optionId))
        .filter(Boolean);

      if (selectedOptions.length < group.minSelect) {
        issues.push(
          `${product.name} necesita al menos ${group.minSelect} opcion(es) en ${group.name}.`,
        );
      }

      if (selectedOptions.length > group.maxSelect) {
        issues.push(
          `${product.name} permite maximo ${group.maxSelect} opcion(es) en ${group.name}.`,
        );
      }

      for (const optionId of selectedOptionIds) {
        const option = group.options.find((groupOption) => groupOption.id === optionId);

        if (!option) {
          issues.push(`Una seleccion de ${product.name} ya no existe.`);
          continue;
        }

        if (!option.isAvailable || option.stock <= 0) {
          issues.push(
            `${option.name} ya no esta disponible como extra para ${product.name}.`,
          );
          continue;
        }

        const requestedExtraQuantity = requestedExtraCount.get(option.id) ?? 0;

        if (requestedExtraQuantity > option.stock) {
          issues.push(
            `${option.name} solo tiene ${option.stock} unidades disponibles como extra.`,
          );
          continue;
        }

        lineExtras.push({
          groupName: group.name,
          optionName: option.name,
          price: option.price,
        });
        extrasTotal += option.price;
      }
    }

    for (const selection of line.selections) {
      if (!groupsById.has(selection.groupId)) {
        issues.push(`Una personalizacion de ${product.name} ya no aplica al producto.`);
      }
    }

    const lineSubtotal = (product.price + extrasTotal) * line.quantity;

    summaryLines.push({
      lineId: line.id,
      productId: product.id,
      productName: product.name,
      quantity: line.quantity,
      lineSubtotal,
      note: line.note,
      extras: lineExtras,
    });

    subtotal += lineSubtotal;
    itemCount += line.quantity;
    estimatedReadyIn = Math.max(estimatedReadyIn, product.prepMinutes);
  }

  if (issues.length > 0) {
    return {
      ok: false,
      issues: [...new Set(issues)],
    };
  }

  return {
    ok: true,
    issues: [],
    summary: {
      itemCount,
      subtotal,
      estimatedReadyIn,
      lines: summaryLines,
    },
  };
}

type UpdateProductInventoryInput = {
  productId: string;
  stock: number;
  prepMinutes: number;
  available: boolean;
};

export async function updateProductInventory(input: UpdateProductInventoryInput) {
  const db = await getDbClient();

  await db.execute({
    sql: `
      UPDATE products
      SET stock = ?, available = ?, prep_minutes = ?
      WHERE id = ?
    `,
    args: [
      input.stock,
      input.available && input.stock > 0 ? 1 : 0,
      input.prepMinutes,
      input.productId,
    ],
  });
}

type UpdateExtraInventoryInput = {
  optionId: string;
  stock: number;
  available: boolean;
};

export async function updateExtraInventory(input: UpdateExtraInventoryInput) {
  const db = await getDbClient();

  await db.execute({
    sql: `
      UPDATE extra_options
      SET stock = ?, available = ?
      WHERE id = ?
    `,
    args: [input.stock, input.available && input.stock > 0 ? 1 : 0, input.optionId],
  });
}
