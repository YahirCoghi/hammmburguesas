# HaMMburguesas

Tienda web en Next.js 16 + Tailwind CSS con:

- inventario conectado a una base libSQL
- extras configurables por producto
- validacion de stock antes del checkout
- confirmacion final por WhatsApp
- panel interno en `/admin`

## Desarrollo local

1. Crea `.env.local` a partir de `.env.example`.
2. Configura al menos:
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `ADMIN_PASSWORD`
3. Inicia la app:

```bash
npm install
npm run dev
```

La base local usa por defecto `file:./data/hammmburguesas.db`.

## Produccion en Vercel

Configura estas variables de entorno en Vercel:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN` si tu proveedor lo requiere
- `ADMIN_PASSWORD`

La app esta preparada para usar una base libSQL remota en produccion. Si usas Turso, coloca su URL y token en `DATABASE_URL` y `DATABASE_AUTH_TOKEN`.
Si `DATABASE_URL` no existe en Vercel, la app levanta una base temporal en `/tmp` para no romper el sitio, pero ese inventario no es persistente.

## Panel de inventario

- Ruta: `/admin`
- Requiere `ADMIN_PASSWORD`
- Permite actualizar stock, disponibilidad y tiempos de preparacion
- Los cambios se reflejan en la tienda y en la validacion del carrito
