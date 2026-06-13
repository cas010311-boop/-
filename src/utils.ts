/**
 * Utility functions for the portfolio application.
 */

/**
 * Converts an Instagram post, reel, or TV video image URL into a direct-linkable high-quality image URL.
 * If the URL is not from Instagram, it returns the URL unchanged.
 */
export function getInstagramImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // If it already is a converted media link or an upload (base64)
  if (trimmed.includes('/media/?size=') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  
  // Match instagram.com/p/ID, instagram.com/reel/ID, etc.
  const match = trimmed.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/i);
                
  if (match && match[2]) {
    const postId = match[2];
    return `https://www.instagram.com/p/${postId}/media/?size=l`;
  }
  
  return trimmed;
}
