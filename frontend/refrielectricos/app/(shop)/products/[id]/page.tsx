'use client';

import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProductGallery from '@/components/features/products/ProductGallery';
import ProductInfo from '@/components/features/products/ProductInfo';
import ProductDescription from '@/components/features/products/ProductDescription';
import { useProduct } from '@/hooks/useProducts';

export default function ProductDetailPage() {
  const params = useParams();
  
  // Nota: Aunque la carpeta se llama [id], ahora puede recibir un slug
  const term = params?.id as string;

  const { data: product, isLoading: loading, isError } = useProduct(term);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Producto no encontrado</h1>
        <Link href="/">
          <Button variant="outline">Volver a la tienda</Button>
        </Link>
      </div>
    );
  }

  const images = product.images_url && product.images_url.length > 0 
    ? product.images_url 
    : (product.image_url ? [product.image_url] : []);

  return (
    <>
      <Breadcrumbs 
        items={[
          { label: 'Productos', href: '/products' },
          { label: product.name }
        ]}
        className="mb-8"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Galería de Imágenes */}
          <ProductGallery images={images} productName={product.name} />

          {/* Información del Producto */}
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Descripción y Detalles */}
      <ProductDescription description={product.description || ''} tags={product.tags} />
    </>
  );
}
