import { createHash } from "node:crypto";

import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "hamm_admin_session";

function buildSessionValue(password: string) {
  return createHash("sha256").update(`hamm-admin:${password}`).digest("hex");
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export async function isAdminAuthenticated() {
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!configuredPassword) {
    return false;
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return sessionCookie === buildSessionValue(configuredPassword);
}

export async function createAdminSession(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!configuredPassword || password !== configuredPassword) {
    return false;
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, buildSessionValue(configuredPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return true;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
