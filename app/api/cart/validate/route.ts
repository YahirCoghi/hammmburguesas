import { NextResponse } from "next/server";

import { validateCheckoutCart } from "@/lib/store-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = await validateCheckoutCart(body);

    return NextResponse.json(validation, {
      status: validation.ok ? 200 : 409,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        issues: ["No pudimos validar tu pedido en este momento."],
      },
      { status: 500 },
    );
  }
}
