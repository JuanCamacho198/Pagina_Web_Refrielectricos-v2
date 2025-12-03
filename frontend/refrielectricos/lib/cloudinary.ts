export type CloudinaryCropMode = 'fill' | 'scale' | 'limit' | 'pad' | 'crop';

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: string | number; // 'auto', 80, etc.
  format?: string; // 'auto', 'webp', etc.
  crop?: CloudinaryCropMode;
}

/**
 * Generates an optimized Cloudinary URL.
 * Handles both full URLs (injecting transformations) and public IDs (constructing URL).
 * 
 * Convention for Public IDs:
 * - products/{slug}/main
 * - products/{slug}/gallery/{filename}
 */
export function getCloudinaryUrl(
  imageIdentifier: string | null | undefined,
  options: CloudinaryOptions = {}
): string {
  if (!imageIdentifier) return '';

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options;

  // Construct transformation string
  const transformations: string[] = [];
  
  if (format) transformations.push(`f_${format}`);
  if (quality) transformations.push(`q_${quality}`);
  if (crop) transformations.push(`c_${crop}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);

  const transformString = transformations.join(',');

  // Case 1: It's already a full Cloudinary URL
  if (imageIdentifier.includes('res.cloudinary.com')) {
    // Regex to find the insertion point after /upload/
    // Supports versioned (/v1234/) and unversioned URLs
    const parts = imageIdentifier.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/${transformString}/${parts[1]}`;
    }
    return imageIdentifier; // Fallback if structure is unexpected
  }

  // Case 2: It's a public ID (e.g., "products/fridge-123/main")
  // We need the cloud name. Ideally from env var.
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    // If we don't have a cloud name and it's not a full URL, we can't construct it properly.
    // Return as is or handle error. For now, assuming it might be a relative path or external URL.
    if (imageIdentifier.startsWith('http')) return imageIdentifier;
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set, cannot construct URL from public ID');
    return imageIdentifier;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${imageIdentifier}`;
}

/**
 * Generates a tiny blur placeholder URL for Next.js Image blurDataURL
 */
export function getBlurPlaceholder(imageIdentifier: string): string {
  return getCloudinaryUrl(imageIdentifier, {
    width: 10,
    quality: 'low',
    format: 'auto',
    crop: 'scale'
  });
}
