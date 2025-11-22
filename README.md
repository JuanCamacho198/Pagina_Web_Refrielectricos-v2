# Refrielectricos G&E S.A.S - eCommerce Platform

![Refrielectricos Banner](https://via.placeholder.com/1200x300?text=Refrielectricos+G%26E+S.A.S)

Plataforma de comercio electrónico profesional desarrollada para **Refrielectricos G&E S.A.S**, especializada en la venta de repuestos y equipos de refrigeración y electricidad. Este proyecto es un monorepo fullstack construido con tecnologías modernas para garantizar escalabilidad, rendimiento y una excelente experiencia de usuario.

---

## 🚀 Tecnologías

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Estado Global:** React Context API
- **Cliente HTTP:** Axios
- **Validación:** Zod + React Hook Form

### Backend
- **Framework:** [NestJS](https://nestjs.com/)
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL (Neon Tech)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autenticación:** JWT (JSON Web Tokens) + Passport
- **Almacenamiento de Imágenes:** Cloudinary
- **Validación:** class-validator + class-transformer

### Infraestructura & Herramientas
- **Monorepo:** pnpm workspaces
- **Despliegue Frontend:** Vercel
- **Despliegue Backend:** Render / Railway
- **CI/CD:** GitHub Actions
- **Linter/Formatter:** ESLint + Prettier

---

## 📂 Estructura del Proyecto

```bash
REFRI_V2/
├── backend/                 # API RESTful con NestJS
│   ├── prisma/              # Esquema de base de datos y migraciones
│   ├── src/                 # Código fuente del backend
│   │   ├── auth/            # Módulo de autenticación
│   │   ├── products/        # Gestión de productos
│   │   ├── orders/          # Gestión de pedidos
│   │   ├── users/           # Gestión de usuarios
│   │   ├── files/           # Carga de archivos (Cloudinary)
│   │   └── ...
│   └── ...
├── frontend/                # Aplicación Next.js
│   └── refrielectricos/
│       ├── app/             # Rutas y páginas (App Router)
│       ├── components/      # Componentes UI reutilizables
│       ├── context/         # Estados globales (Auth, Cart, Toast)
│       ├── lib/             # Utilidades y configuración de API
│       └── ...
├── infra/                   # Scripts de infraestructura
└── ...
```

---

## ✨ Características Principales

### 🛒 Tienda (Cliente)
- **Catálogo de Productos:** Búsqueda avanzada, filtros por categoría, marca y precio.
- **Detalle de Producto:** Galería de imágenes con zoom, descripción detallada y productos relacionados.
- **Carrito de Compras:** Gestión de items, cálculo de totales y persistencia local.
- **Checkout:** Proceso de compra optimizado con validación de direcciones.
- **Perfil de Usuario:** Historial de pedidos, gestión de direcciones y listas de deseos (Wishlist).
- **Autenticación:** Registro e inicio de sesión seguro.

### 🛡️ Panel de Administración
- **Dashboard:** Métricas clave (Ventas, Pedidos, Productos Top).
- **Gestión de Productos:** CRUD completo con soporte para múltiples imágenes y slugs automáticos.
- **Gestión de Pedidos:** Visualización y cambio de estado de las órdenes.
- **Gestión de Usuarios:** Administración de roles y permisos.

---

## 🛠️ Configuración e Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- pnpm (recomendado)
- PostgreSQL (local o remoto)
- Cuenta en Cloudinary (para imágenes)

### 1. Clonar el repositorio
```bash
git clone https://github.com/JuanCamacho198/Refirlectricos-v2.git
cd REFRI_V2
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` y `.env.local` en `frontend/refrielectricos/` basándote en los ejemplos proporcionados.

**Backend (`backend/.env`):**
```env
DATABASE_URL="postgresql://user:password@host:port/db?schema=public"
JWT_SECRET="tu_secreto_super_seguro"
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
PORT=4000
```

**Frontend (`frontend/refrielectricos/.env.local`):**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 4. Inicializar Base de Datos
```bash
cd backend
npx prisma migrate dev
npx prisma db seed # (Opcional) Cargar datos de prueba
```

### 5. Ejecutar en Desarrollo

**Backend:**
```bash
cd backend
pnpm start:dev
```

**Frontend:**
```bash
cd frontend/refrielectricos
pnpm dev
```

---

## 🤝 Contribución

1. Haz un Fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto es propiedad de **Refrielectricos G&E S.A.S**. Todos los derechos reservados.

---

**Desarrollado por:** Juan Camacho
