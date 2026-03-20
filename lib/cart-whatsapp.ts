import type { CheckoutValidationResult, ServiceMode } from "@/lib/store-types";

import { formatPrice } from "@/lib/format";

type BuildWhatsAppMessageInput = {
  customerName: string;
  reference: string;
  note: string;
  serviceMode: ServiceMode;
  validation: Extract<CheckoutValidationResult, { ok: true }>;
};

export function buildWhatsAppMessage(input: BuildWhatsAppMessageInput) {
  const serviceLabel = input.serviceMode === "pickup" ? "Pickup" : "Delivery";

  const lines = input.validation.summary.lines.flatMap((line) => {
    const detailLines = [
      `- ${line.quantity}x ${line.productName} (${formatPrice(line.lineSubtotal)})`,
    ];

    if (line.extras.length > 0) {
      detailLines.push(
        `  Extras: ${line.extras.map((extra) => extra.optionName).join(", ")}`,
      );
    }

    if (line.note.trim()) {
      detailLines.push(`  Nota del item: ${line.note.trim()}`);
    }

    return detailLines;
  });

  const sections = [
    "Hola HaMMburguesas, quiero confirmar este pedido:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatPrice(input.validation.summary.subtotal)}`,
    `Servicio: ${serviceLabel}`,
    `Tiempo estimado: ${input.validation.summary.estimatedReadyIn} min`,
  ];

  if (input.customerName.trim()) {
    sections.push(`Nombre: ${input.customerName.trim()}`);
  }

  if (input.reference.trim()) {
    sections.push(`Referencia: ${input.reference.trim()}`);
  }

  if (input.note.trim()) {
    sections.push(`Nota general: ${input.note.trim()}`);
  }

  sections.push("", "Quedo atento a la confirmacion. Gracias.");

  return sections.join("\n");
}
