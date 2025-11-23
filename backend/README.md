# Refrielectricos Backend API 🚀

Este es el backend de la plataforma de comercio electrónico **Refrielectricos**, construido con **NestJS**, un framework de Node.js progresivo y robusto para construir aplicaciones del lado del servidor eficientes y escalables.

## 🛠️ Stack Tecnológico

- **Framework:** [NestJS](https://nestjs.com/) (Arquitectura modular y basada en inyección de dependencias).
- **Lenguaje:** TypeScript.
- **Base de Datos:** PostgreSQL (alojada en Neon.tech).
- **ORM:** [Prisma](https://www.prisma.io/) (Manejo de esquemas, migraciones y consultas tipadas).
- **Autenticación:** JWT (JSON Web Tokens) + Passport.
- **Validación:** `class-validator` y `class-transformer`.
- **Documentación:** Swagger (OpenAPI).
- **Almacenamiento:** Cloudinary (para imágenes de productos).

## 📂 Estructura del Proyecto

El proyecto sigue una **arquitectura modular**, donde cada funcionalidad principal tiene su propio directorio con sus controladores, servicios y DTOs. Esto facilita la escalabilidad y el mantenimiento.

```bash
backend/
├── prisma/              # Esquema de base de datos y migraciones
│   ├── schema.prisma    # Definición de modelos (User, Product, Order, etc.)
│   └── migrations/      # Historial de cambios en la DB
├── src/
│   ├── auth/            # Módulo de Autenticación (Login, Register, Guards)
│   ├── users/           # Gestión de Usuarios
│   ├── products/        # Catálogo de Productos (CRUD)
│   ├── orders/          # Gestión de Pedidos y Transacciones
│   ├── cart/            # Lógica del Carrito de Compras (Persistencia en DB)
│   ├── wishlists/       # Listas de Deseos / Favoritos
│   ├── dashboard/       # Estadísticas para el Panel Admin
│   ├── files/           # Subida de archivos (Imágenes)
│   ├── addresses/       # Gestión de Direcciones de Envío
│   ├── common/          # Decoradores y utilidades compartidas
│   ├── main.ts          # Punto de entrada (Configuración de Swagger, Pipes, CORS)
│   └── app.module.ts    # Módulo raíz que importa todo
└── test/                # Tests E2E
```

## 🧠 Decisiones de Arquitectura

### 1. Diseño Modular
Cada característica (ej. `Products`, `Auth`) es un módulo aislado. Esto permite que el código esté organizado por dominio y no por tipo de archivo. Si necesitamos cambiar algo de "Productos", todo está en una sola carpeta.

### 2. Prisma ORM
Elegimos Prisma por su seguridad de tipos (Type Safety). El esquema `schema.prisma` actúa como la fuente de la verdad para la base de datos, generando automáticamente el cliente TypeScript que usamos en los servicios.

### 3. DTOs (Data Transfer Objects)
Usamos DTOs para definir estrictamente qué datos se esperan en cada petición (POST/PUT). Junto con `ValidationPipe` en `main.ts`, esto asegura que no entre basura a la base de datos.
*   Ejemplo: `CreateProductDto` valida que el precio sea un número positivo y que el nombre no esté vacío.

### 4. Autenticación y Seguridad
*   **Guards:** Usamos `JwtAuthGuard` para proteger rutas. Si no tienes un token válido, el servidor rechaza la petición antes de que llegue al controlador.
*   **Decoradores:** `@GetUser()` es un decorador personalizado para extraer el usuario del token JWT de forma limpia en los controladores.

### 5. Inyección de Dependencias
NestJS maneja las instancias de las clases. Los controladores piden servicios en su constructor, y Nest se encarga de entregarlos. Esto hace que el código sea muy fácil de testear y desacoplado.

## 🚀 Instalación y Ejecución

1.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```

2.  **Configurar variables de entorno:**
    Crea un archivo `.env` basado en el ejemplo y configura tu `DATABASE_URL` y `JWT_SECRET`.

3.  **Sincronizar base de datos:**
    ```bash
    npx prisma migrate dev
    ```

4.  **Ejecutar en desarrollo:**
    ```bash
    pnpm run start:dev
    ```

5.  **Ver documentación API:**
    Visita `http://localhost:4000/api` para ver el Swagger UI interactivo.
