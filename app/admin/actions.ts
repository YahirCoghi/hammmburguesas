"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminSession,
  destroyAdminSession,
  isAdminConfigured,
} from "@/lib/admin-auth";
import { updateExtraInventory, updateProductInventory } from "@/lib/store-service";

function toInteger(value: FormDataEntryValue | null, fallback: number) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.max(0, Math.round(parsedValue));
}

export async function loginAdminAction(formData: FormData) {
  if (!isAdminConfigured()) {
    redirect("/admin?error=not-configured");
  }

  const password = String(formData.get("password") ?? "");
  const didLogin = await createAdminSession(password);

  if (!didLogin) {
    redirect("/admin?error=invalid-password");
  }

  redirect("/admin");
}

export async function logoutAdminAction() {
  await destroyAdminSession();
  redirect("/admin");
}

export async function updateProductInventoryAction(formData: FormData) {
  await updateProductInventory({
    productId: String(formData.get("productId") ?? ""),
    stock: toInteger(formData.get("stock"), 0),
    prepMinutes: toInteger(formData.get("prepMinutes"), 10),
    available: formData.get("available") === "on",
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=product");
}

export async function updateExtraInventoryAction(formData: FormData) {
  await updateExtraInventory({
    optionId: String(formData.get("optionId") ?? ""),
    stock: toInteger(formData.get("stock"), 0),
    available: formData.get("available") === "on",
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=extra");
}
