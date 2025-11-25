import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://pagina-web-refrielectricos-v2.vercel.app'; // TODO: Configurar dominio real

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/', '/profile/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
