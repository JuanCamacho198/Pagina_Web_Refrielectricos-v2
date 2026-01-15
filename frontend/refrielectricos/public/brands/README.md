# Logos de Marcas

Esta carpeta contiene los logos de las marcas que se muestran en el carrusel del home.

## Especificaciones de Imágenes

- **Formato recomendado**: PNG con fondo transparente
- **Tamaño recomendado**: 300x150px (ancho x alto)
- **Tamaño máximo de archivo**: 100KB por imagen
- **Relación de aspecto**: 2:1 (horizontal)

## Nombres de Archivos

Los archivos deben nombrarse en minúsculas sin espacios:

- ✅ `samsung.png`
- ✅ `lg.png`
- ✅ `whirlpool.png`
- ❌ `Samsung Logo.png`

## Marcas Actuales Configuradas

1. samsung.png
2. lg.png
3. whirlpool.png
4. electrolux.png
5. mabe.png
6. haceb.png
7. challenger.png
8. indurama.png

## Cómo Agregar Nuevas Marcas

1. Agregar el logo PNG a esta carpeta
2. Editar el archivo: `components/features/home/BrandsCarousel.tsx`
3. Agregar la marca al array `EXAMPLE_BRANDS`:

```typescript
const EXAMPLE_BRANDS: Brand[] = [
  { name: 'Samsung', logo: '/brands/samsung.png' },
  { name: 'Nueva Marca', logo: '/brands/nueva-marca.png' },
  // ...
];
```

## Optimización

Para optimizar las imágenes antes de subirlas:
- Usa herramientas como TinyPNG o ImageOptim
- Asegúrate de que el fondo sea transparente
- Mantén el tamaño del archivo bajo para mejor rendimiento
