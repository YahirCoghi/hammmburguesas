import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { createClient, type Client } from "@libsql/client";

import { seedCategories, seedProducts } from "@/lib/catalog-seed";

const LOCAL_DATABASE_URL = "file:./data/hammmburguesas.db";
const VERCEL_FALLBACK_DATABASE_URL = "file:/tmp/hammmburguesas.db";

declare global {
  var __hammDbPromise: Promise<Client> | undefined;
}

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (process.env.VERCEL === "1") {
    return VERCEL_FALLBACK_DATABASE_URL;
  }

  return LOCAL_DATABASE_URL;
}

function ensureLocalDirectory(databaseUrl: string) {
  if (databaseUrl !== LOCAL_DATABASE_URL) {
    return;
  }

  mkdirSync(join(process.cwd(), "data"), { recursive: true });
}

function createDatabaseClient() {
  const url = resolveDatabaseUrl();

  ensureLocalDirectory(url);

  return createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
}

async function createSchema(client: Client) {
  await client.batch(
    [
      "PRAGMA foreign_keys = ON",
      `
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          blurb TEXT NOT NULL,
          sort_order INTEGER NOT NULL
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          category_id TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          price INTEGER NOT NULL,
          badge TEXT,
          is_spicy INTEGER NOT NULL DEFAULT 0,
          image TEXT,
          is_featured INTEGER NOT NULL DEFAULT 0,
          featured_eyebrow TEXT,
          featured_accent_class TEXT,
          stock INTEGER NOT NULL DEFAULT 0,
          available INTEGER NOT NULL DEFAULT 1,
          prep_minutes INTEGER NOT NULL DEFAULT 20,
          sort_order INTEGER NOT NULL,
          FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS extra_groups (
          id TEXT PRIMARY KEY,
          product_id TEXT NOT NULL,
          name TEXT NOT NULL,
          selection_type TEXT NOT NULL,
          min_select INTEGER NOT NULL DEFAULT 0,
          max_select INTEGER NOT NULL DEFAULT 1,
          required INTEGER NOT NULL DEFAULT 0,
          sort_order INTEGER NOT NULL,
          FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS extra_options (
          id TEXT PRIMARY KEY,
          group_id TEXT NOT NULL,
          name TEXT NOT NULL,
          price INTEGER NOT NULL DEFAULT 0,
          stock INTEGER NOT NULL DEFAULT 0,
          available INTEGER NOT NULL DEFAULT 1,
          sort_order INTEGER NOT NULL,
          FOREIGN KEY (group_id) REFERENCES extra_groups (id) ON DELETE CASCADE
        )
      `,
    ],
    "write",
  );
}

async function seedDatabase(client: Client) {
  const categoryCountResult = await client.execute(
    "SELECT COUNT(*) AS count FROM categories",
  );
  const categoryCount = Number(categoryCountResult.rows[0]?.count ?? 0);

  if (categoryCount > 0) {
    return;
  }

  const statements = [];

  for (const [index, category] of seedCategories.entries()) {
    statements.push({
      sql: `
        INSERT INTO categories (id, name, blurb, sort_order)
        VALUES (?, ?, ?, ?)
      `,
      args: [category.id, category.name, category.blurb, index],
    });
  }

  for (const [productIndex, product] of seedProducts.entries()) {
    statements.push({
      sql: `
        INSERT INTO products (
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
          prep_minutes,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        product.id,
        product.categoryId,
        product.name,
        product.description,
        product.price,
        product.badge ?? null,
        product.isSpicy ? 1 : 0,
        product.image ?? null,
        product.isFeatured ? 1 : 0,
        product.featuredEyebrow ?? null,
        product.featuredAccentClass ?? null,
        product.stock,
        product.isAvailable === false ? 0 : 1,
        product.prepMinutes,
        productIndex,
      ],
    });

    for (const [groupIndex, group] of product.extraGroups.entries()) {
      statements.push({
        sql: `
          INSERT INTO extra_groups (
            id,
            product_id,
            name,
            selection_type,
            min_select,
            max_select,
            required,
            sort_order
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          group.id,
          product.id,
          group.name,
          group.selectionType,
          group.minSelect,
          group.maxSelect,
          group.required ? 1 : 0,
          groupIndex,
        ],
      });

      for (const [optionIndex, option] of group.options.entries()) {
        statements.push({
          sql: `
            INSERT INTO extra_options (
              id,
              group_id,
              name,
              price,
              stock,
              available,
              sort_order
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            option.id,
            group.id,
            option.name,
            option.price,
            option.stock,
            option.isAvailable === false ? 0 : 1,
            optionIndex,
          ],
        });
      }
    }
  }

  await client.batch(statements, "write");
}

async function initializeDatabase() {
  const client = createDatabaseClient();

  await createSchema(client);
  await seedDatabase(client);

  return client;
}

export async function getDbClient() {
  if (!globalThis.__hammDbPromise) {
    globalThis.__hammDbPromise = initializeDatabase();
  }

  return globalThis.__hammDbPromise;
}
