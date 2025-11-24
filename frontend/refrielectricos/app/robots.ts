import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://refrielectricos.com'; // TODO: Configurar dominio real

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/', '/profile/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
