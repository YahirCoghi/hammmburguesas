export type SelectionType = "single" | "multiple";

export type ServiceMode = "pickup" | "delivery";

export type InventoryStatus = "in-stock" | "low-stock" | "sold-out";

export type StorefrontCategory = {
  id: string;
  name: string;
  blurb: string;
};

export type StorefrontExtraOption = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  inventoryStatus: InventoryStatus;
};

export type StorefrontExtraGroup = {
  id: string;
  name: string;
  selectionType: SelectionType;
  minSelect: number;
  maxSelect: number;
  required: boolean;
  options: StorefrontExtraOption[];
};

export type StorefrontProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
  isSpicy: boolean;
  image?: string;
  isFeatured: boolean;
  featuredEyebrow?: string;
  featuredAccentClass?: string;
  stock: number;
  isAvailable: boolean;
  inventoryStatus: InventoryStatus;
  prepMinutes: number;
  extraGroups: StorefrontExtraGroup[];
};

export type StorefrontData = {
  categories: StorefrontCategory[];
  products: StorefrontProduct[];
  featuredProducts: StorefrontProduct[];
};

export type CartSelectionGroup = {
  groupId: string;
  optionIds: string[];
};

export type CartLineExtra = {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
};

export type CartLine = {
  id: string;
  signature: string;
  productId: string;
  productName: string;
  productDescription: string;
  productImage?: string;
  basePrice: number;
  quantity: number;
  note: string;
  prepMinutes: number;
  selections: CartSelectionGroup[];
  extras: CartLineExtra[];
};

export type AddCartLineInput = Omit<CartLine, "id" | "signature">;

export type CheckoutCartLineInput = Pick<
  CartLine,
  "id" | "productId" | "quantity" | "note" | "selections"
>;

export type CheckoutSummaryLine = {
  lineId: string;
  productId: string;
  productName: string;
  quantity: number;
  lineSubtotal: number;
  note: string;
  extras: Array<{
    groupName: string;
    optionName: string;
    price: number;
  }>;
};

export type CheckoutValidationResult =
  | {
      ok: true;
      summary: {
        itemCount: number;
        subtotal: number;
        estimatedReadyIn: number;
        lines: CheckoutSummaryLine[];
      };
      issues: [];
    }
  | {
      ok: false;
      issues: string[];
    };
