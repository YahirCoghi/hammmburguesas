import type { CheckoutCartLineInput } from "@/lib/store-types";

export function createCartSignature(line: CheckoutCartLineInput) {
  const normalizedSelections = line.selections
    .map((selection) => ({
      groupId: selection.groupId,
      optionIds: [...selection.optionIds].sort(),
    }))
    .sort((left, right) => left.groupId.localeCompare(right.groupId));

  return JSON.stringify({
    productId: line.productId,
    note: line.note.trim().toLowerCase(),
    selections: normalizedSelections,
  });
}
