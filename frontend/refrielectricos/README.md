# Refrielectricos Frontend 🛍️

Este es el frontend de la tienda **Refrielectricos**, una aplicación moderna de comercio electrónico construida con **Next.js 16 (App Router)**, diseñada para ser rápida, accesible y fácil de mantener.

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components).
- **Lenguaje:** TypeScript.
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) (Utility-first CSS).
- **Estado Global:**
    - [Zustand](https://github.com/pmndrs/zustand): Para estado cliente ligero (Carrito, Auth).
    - [TanStack Query (React Query)](https://tanstack.com/query/latest): Para estado asíncrono y caché de servidor.
- **Cliente HTTP:** Axios (con interceptores para manejo de tokens).
- **Iconos:** Lucide React.
- **Formularios:** React Hook Form (en desarrollo).

## 📂 Estructura del Proyecto

La estructura sigue las convenciones del **App Router** de Next.js, separando la lógica de negocio de la interfaz de usuario.

```bash
frontend/refrielectricos/
├── app/                 # Rutas y Páginas (File-system routing)
│   ├── (auth)/          # Grupo de rutas de autenticación (Login, Register)
│   ├── (shop)/          # Rutas públicas de la tienda (Home, Products, Cart, Checkout)
│   ├── admin/           # Panel de Administración (Protegido)
│   ├── layout.tsx       # Layout raíz (Providers, Fuentes)
│   └── page.tsx         # Página de inicio
├── components/
│   ├── ui/              # Componentes base reutilizables (Button, Input, Modal, Card)
│   ├── layout/          # Componentes estructurales (Navbar, Footer)
│   └── features/        # Componentes específicos de negocio (ProductCard, CartItem)
├── hooks/               # Custom Hooks (Lógica encapsulada)
│   ├── useAuth.ts       # Manejo de sesión
│   ├── useCart.ts       # Lógica del carrito
│   └── useWishlist.ts   # Lógica de favoritos
├── lib/                 # Utilidades y configuración
│   ├── api.ts           # Instancia de Axios configurada
│   └── utils.ts         # Helpers (formato de moneda, cn para clases)
├── store/               # Estado global con Zustand
│   ├── authStore.ts     # Persistencia de sesión
│   └── cartStore.ts     # Estado local del carrito
└── types/               # Definiciones de TypeScript (Interfaces compartidas)
```

## 🧠 Decisiones de Arquitectura

### 1. App Router & Server Components
Utilizamos el App Router para aprovechar las últimas características de Next.js.
*   **Server Components:** Por defecto, los componentes son del servidor (mejor SEO, menor JS al cliente).
*   **Client Components:** Usamos `'use client'` solo cuando necesitamos interactividad (hooks, eventos de click, estado).

### 2. Separación de UI y Features
*   `components/ui`: Contiene "átomos" de diseño que no saben nada del negocio (ej. un Botón azul). Son puramente visuales.
*   `components/features`: Contiene componentes que conectan la UI con la lógica (ej. `ProductCard` usa `useCart` para añadir productos).

### 3. Gestión de Estado Híbrida
*   **Zustand:** Lo usamos para el estado global que debe persistir o compartirse en toda la app (ej. si el usuario está logueado, qué items tiene en el carrito localmente).
*   **React Query:** Lo usamos para todo lo que viene del servidor (productos, listas de deseos). Maneja el caché, la carga (loading) y los errores automáticamente, evitando `useEffect` innecesarios.

### 4. Interceptores de Axios (`lib/api.ts`)
Centralizamos las peticiones HTTP. El interceptor:
1.  Inyecta automáticamente el Token JWT en cada petición.
2.  Detecta errores 401 (Token expirado) y maneja el cierre de sesión o redirección de forma inteligente, sin que cada componente tenga que preocuparse por ello.

### 5. Rutas Agrupadas
Usamos grupos de rutas como `(shop)` y `(auth)` para organizar los archivos sin afectar la URL final. Esto nos permite tener layouts específicos (ej. el Login no tiene el mismo Navbar que la Tienda).

## 🚀 Instalación y Ejecución

1.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```

2.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` con:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:4000
    ```

3.  **Ejecutar en desarrollo:**
    ```bash
    pnpm dev
    ```

4.  **Abrir en el navegador:**
    Visita `http://localhost:3000`.
