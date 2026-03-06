// Helper utilities available if needed
// import { getUrlMetadata } from './urlMetadata';
// import { fetchWellKnownFarcaster } from './farcaster';

// Mini App schema validation interfaces
interface MiniAppAction {
  type: 'launch_frame' | 'view_token';
  url?: string;
  name?: string;
  splashImageUrl?: string;
  splashBackgroundColor?: string;
}

interface MiniAppButton {
  title: string;
  action: MiniAppAction;
}

interface MiniAppEmbed {
  version: string;
  imageUrl: string;
  button: MiniAppButton;
}






/**
 * Check if a URL is a Mini App according to the official Farcaster spec
 * https://docs.farcaster.xyz/developers/frames/miniapps
 */
export async function isMiniApp(url: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/miniapp?url=${encodeURIComponent(url)}&action=check`);
    
    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.isMiniApp || false;
  } catch (error) {
    console.warn('Failed to check if URL is a mini app:', error);
    return false;
  }
}

/**
 * Extract Mini App metadata from a URL
 */
export async function getMiniAppMetadata(url: string): Promise<MiniAppEmbed | null> {
  try {
    const response = await fetch(`/api/miniapp?url=${encodeURIComponent(url)}&action=metadata`);
    
    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.metadata || null;
  } catch (error) {
    console.warn('Failed to extract Mini App metadata:', error);
    return null;
  }
}

/**
 * Classify an embed URL to determine its type
 */
export async function classifyEmbed(url: string): Promise<{
  type: 'miniapp' | 'image' | 'video' | 'webpage' | 'unknown';
  metadata?: MiniAppEmbed | null;
  isDirectMedia?: boolean;
}> {
  try {
    // Check if it's a direct media URL
    const isDirectImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    const isDirectVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
    
    if (isDirectImage) {
      return { type: 'image', isDirectMedia: true };
    }
    
    if (isDirectVideo) {
      return { type: 'video', isDirectMedia: true };
    }
    
    // Check if it's a Mini App
    const miniAppMetadata = await getMiniAppMetadata(url);
    if (miniAppMetadata) {
      return { type: 'miniapp', metadata: miniAppMetadata };
    }
    
    // Default to webpage if not a Mini App or direct media
    return { type: 'webpage' };
    
  } catch (error) {
    console.warn('Failed to classify embed:', error);
    return { type: 'unknown' };
  }
}

/**
 * Check multiple URLs efficiently for Mini App detection
 */
export async function batchCheckMiniApps(urls: string[]): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();
  
  const promises = urls.map(async (url) => {
    try {
      const isMini = await isMiniApp(url);
      results.set(url, isMini);
    } catch {
      results.set(url, false);
    }
  });
  
  await Promise.all(promises);
  return results;
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    // If URL parsing fails, try to extract domain manually
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
    return match ? match[1] : url;
  }
}
