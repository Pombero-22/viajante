# ATR Ciclismo — Tienda online

Sitio de e-commerce para vender remeras, con checkout integrado a **Mercado
Pago (Checkout Pro)** y un **CRM interno** para llevar registro de visitas y
ventas cerradas.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind CSS 4
- **PostgreSQL** + **Prisma ORM**
- **Mercado Pago SDK** (Checkout Pro: preferencias + webhooks)
- **Zustand** para el carrito (persistido en `localStorage`)
- Autenticación de administrador con cookie firmada (`jose`), sin librerías
  externas de auth

## Estructura

```
src/
  app/
    (site)/              → sitio público (home, productos, carrito, checkout)
    admin/(protected)/    → panel CRM (resumen, visitas, ventas)
    admin/login/          → login del panel
    api/                  → rutas de API (checkout, webhook de MP, tracking, admin)
  components/
  lib/                    → Prisma client, Mercado Pago client, auth, stats
prisma/
  schema.prisma           → modelos: Product, ProductVariant, Order, OrderItem, Visit
  seed.ts                 → productos de ejemplo (placeholders)
```

Los productos incluidos en el seed usan **imágenes placeholder** (SVG
generados) porque todavía no hay fotos reales de las remeras. Reemplazalas
subiendo las fotos reales a `public/products/` y actualizando el campo
`images` de cada producto (por DB, por el seed, o agregando un panel de
carga en el admin más adelante).

## Desarrollo local

### 1. Base de datos

Necesitás una instancia de PostgreSQL. La forma más simple es con Docker:

```bash
docker compose up -d db
```

(Si no tenés Docker, cualquier PostgreSQL local o remoto sirve — solo
ajustá `DATABASE_URL`.)

### 2. Variables de entorno

```bash
cp .env.example .env
```

Completá al menos:

- `DATABASE_URL`: ya viene lista para el `docker-compose.yml` incluido.
- `ADMIN_USER` / `ADMIN_PASSWORD`: credenciales del panel de administración.
- `AUTH_SECRET`: generalo con `openssl rand -base64 32`.
- `MERCADOPAGO_ACCESS_TOKEN` / `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`: podés
  dejar los valores `TEST-...` de ejemplo para desarrollar sin pagos reales,
  pero el checkout no va a poder crear preferencias hasta que pongas
  credenciales válidas (ver sección de Mercado Pago más abajo).

> ⚠️ **Importante:** Next.js interpreta `$algo` dentro de los archivos
> `.env` como si fuera una variable de entorno a expandir. Esto rompe
> cualquier valor que contenga el caracter `$` (por ejemplo, un hash
> bcrypt). Por eso `ADMIN_PASSWORD` se guarda en texto plano en el `.env`
> del servidor (nunca se commitea ni se expone al cliente) en vez de un
> hash. Si generás `AUTH_SECRET` y por casualidad contiene un `$`, generá
> otro valor.

### 3. Instalar dependencias y preparar la base

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Correr el sitio

```bash
npm run dev
```

- Sitio: http://localhost:3000
- Panel admin: http://localhost:3000/admin (redirige a `/admin/login`)

## Configurar Mercado Pago

1. Entrá a tu [panel de desarrolladores de Mercado Pago](https://www.mercadopago.com.ar/developers/panel/app).
2. Creá una aplicación y copiá las credenciales:
   - **Access Token** → `MERCADOPAGO_ACCESS_TOKEN`
   - **Public Key** → `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
   - Usá las credenciales de **prueba** mientras desarrollás, y las de
     **producción** recién cuando el sitio esté en vivo con tu dominio real.
3. Configurá `NEXT_PUBLIC_SITE_URL` con la URL pública del sitio (por
   ejemplo `https://atrciclismo.com` en producción). Se usa para armar:
   - Las `back_urls` de éxito/pendiente/rechazado.
   - La `notification_url` del webhook: `NEXT_PUBLIC_SITE_URL/api/webhooks/mercadopago`.
4. Mercado Pago va a llamar a esa URL cada vez que cambie el estado de un
   pago. **Tiene que ser una URL pública** (no funciona con `localhost`) —
   para probar el webhook en desarrollo podés usar un túnel como
   [ngrok](https://ngrok.com/) y actualizar `NEXT_PUBLIC_SITE_URL`
   temporalmente.
5. El flujo de pago:
   - El comprador completa sus datos en `/checkout`.
   - `POST /api/checkout/create-preference` valida stock, crea la `Order`
     en estado `PENDING` y crea la preferencia en Mercado Pago.
   - El comprador es redirigido al Checkout Pro de Mercado Pago.
   - Al confirmarse el pago, Mercado Pago llama al webhook
     (`/api/webhooks/mercadopago`), que consulta el pago por su ID, actualiza
     el estado de la orden (`APPROVED` / `REJECTED` / `PENDING`) y —solo la
     primera vez que se aprueba— descuenta el stock de cada variante.
   - El comprador vuelve al sitio en `/checkout/success`, `/pending` o
     `/failure` según el resultado.

## Panel de administración (CRM)

- **Resumen** (`/admin`): visitas, ventas, monto facturado y tasa de
  conversión del mes en curso.
- **Visitas** (`/admin/visitas`): total de visitas por rango de fechas,
  visitas por día, páginas más visitadas y origen del tráfico (Instagram,
  Google, directo, etc., inferido del `referrer` o de `utm_source`).
- **Ventas** (`/admin/ventas`): listado de órdenes con comprador, productos,
  monto, estado de pago y estado de envío editable (pendiente / enviado /
  entregado).

El tracking de visitas se hace con un beacon liviano desde el navegador
(`/api/track-visit`) que ignora las rutas `/admin/*`.

## Deploy en producción

### Opción recomendada: Vercel + Postgres administrado

1. **Base de datos**: creá una base PostgreSQL administrada — por ejemplo
   [Neon](https://neon.tech) o [Supabase](https://supabase.com) (ambos
   tienen planes gratuitos que alcanzan para empezar). Copiá la connection
   string como `DATABASE_URL`.
2. **Repositorio**: subí este proyecto a GitHub/GitLab.
3. **Importar en Vercel**: [vercel.com/new](https://vercel.com/new),
   seleccioná el repo (si el proyecto vive en una subcarpeta, configurá el
   "Root Directory" del proyecto en Vercel).
4. **Variables de entorno** en Vercel (Project Settings → Environment
   Variables), las mismas que en `.env.example`:
   - `DATABASE_URL`
   - `MERCADOPAGO_ACCESS_TOKEN`
   - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
   - `NEXT_PUBLIC_SITE_URL` (el dominio final, con `https://`)
   - `ADMIN_USER`, `ADMIN_PASSWORD`, `AUTH_SECRET`
5. **Migraciones**: la primera vez (y cada vez que cambie el schema), corré
   contra la base de producción:
   ```bash
   DATABASE_URL="<tu-connection-string-de-produccion>" npx prisma migrate deploy
   DATABASE_URL="<tu-connection-string-de-produccion>" npm run db:seed
   ```
6. **Deploy**. Vercel corre automáticamente `npm run build`, que incluye
   `prisma generate`.
7. Actualizá en Mercado Pago (o simplemente en tus variables de entorno) la
   URL de notificaciones para que apunte a
   `https://tu-dominio.com/api/webhooks/mercadopago`.

### Alternativa: cualquier hosting con Node.js

El proyecto es un Next.js estándar (`npm run build` + `npm run start`), así
que también funciona en Railway, Render, un VPS con PM2/Docker, etc.
Solo necesitás:

- Node.js 20.9+
- Una base PostgreSQL accesible desde el servidor
- Las mismas variables de entorno de arriba
- Correr `npx prisma migrate deploy` contra la base antes del primer arranque

## Notas de seguridad

- Las credenciales de Mercado Pago y del panel admin viven **solo** en
  variables de entorno del servidor — nunca se commitean (`.env*` está en
  `.gitignore`).
- La sesión de admin es una cookie `httpOnly`, firmada con `AUTH_SECRET` y
  con expiración de 12 horas.
- El webhook de Mercado Pago vuelve a consultar el pago por su ID contra la
  API de Mercado Pago (no confía en el contenido del POST) antes de
  actualizar cualquier orden.
- El precio de cada ítem en el checkout se recalcula en el servidor a
  partir de la base de datos — nunca se confía en un precio enviado desde
  el navegador.
