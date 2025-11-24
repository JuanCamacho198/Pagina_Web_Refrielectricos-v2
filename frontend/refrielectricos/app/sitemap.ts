import { MetadataRoute } from 'next';
import { Product } from '@/types/product';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const baseUrl = 'https://refrielectricos.com'; // TODO: Configurar dominio real

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug || product.id}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
