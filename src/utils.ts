/**
 * Utility functions for the portfolio application.
 */

/**
 * Converts an Instagram post, reel, or TV video image URL into a server-side proxied image URL.
 * This avoids CORS/Referer 403 errors and expired Instagram tokens.
 */
export function getInstagramImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  if (trimmed.startsWith('/api/instagram-image') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  
  // Match instagram.com/p/ID, instagram.com/reel/ID, etc.
  const match = trimmed.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/i);
                
  if (match && match[2]) {
    return `/api/instagram-image?url=${encodeURIComponent(trimmed)}`;
  }
  
  return trimmed;
}
