import { NextRequest, NextResponse } from 'next/server';

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

function extractCustomOpenGraph(html: string): { metadata: Record<string, string> } {
  const metadata: Record<string, string> = {};
  const regex = /<meta[^>]*(?:property|name)=["']([^"']*)["'][^>]*content=["']([^"']*)["'][^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const [, property, content] = match;
    if (property.startsWith('fc:')) {
      metadata[property] = content;
    }
  }

  return { metadata };
}

function extractMetaTagManually(html: string, metaName: string): string | null {
  const lowerHtml = html.toLowerCase();
  const startIdx = lowerHtml.indexOf(`name="${metaName}"`);
  
  if (startIdx === -1) return null;
  
  const contentIdx = lowerHtml.indexOf('content=', startIdx);
  if (contentIdx === -1) return null;
  
  const quoteIdx = contentIdx + 8;
  const quoteChar = html[quoteIdx];
  if (quoteChar !== '"' && quoteChar !== "'") return null;
  
  const contentStart = quoteIdx + 1;
  let contentEnd = contentStart;
  while (contentEnd < html.length && html[contentEnd] !== quoteChar) {
    contentEnd++;
  }
  
  if (contentEnd >= html.length) return null;
  
  return html.substring(contentStart, contentEnd);
}

function validateMiniAppSchema(obj: unknown): obj is MiniAppEmbed {
  if (!obj || typeof obj !== 'object') return false;
  
  const candidate = obj as Record<string, unknown>;
  
  if (!candidate.version || typeof candidate.version !== 'string') return false;
  if (!['1', 'next'].includes(candidate.version)) return false;
  
  if (!candidate.imageUrl || typeof candidate.imageUrl !== 'string' || candidate.imageUrl.length > 1024) return false;
  
  if (!candidate.button || typeof candidate.button !== 'object') return false;
  
  const button = candidate.button as Record<string, unknown>;
  
  if (!button.title || typeof button.title !== 'string') return false;
  if (button.title.length > 32) return false;
  
  if (!button.action || typeof button.action !== 'object') return false;
  
  const action = button.action as Record<string, unknown>;
  
  const validTypes = ['launch_frame', 'view_token'];
  if (!validTypes.includes(action.type as string)) return false;
  
  if (action.url && (typeof action.url !== 'string' || action.url.length > 1024)) {
    return false;
  }
  
  if (action.name && (typeof action.name !== 'string' || action.name.length > 32)) {
    return false;
  }
  
  if (action.splashImageUrl && typeof action.splashImageUrl !== 'string') {
    return false;
  }
  
  if (action.splashBackgroundColor && 
      (typeof action.splashBackgroundColor !== 'string' || 
       !/^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(action.splashBackgroundColor))) {
    return false;
  }
  
  return true;
}

function tryParseMetaContent(content: string): MiniAppEmbed | null {
  try {
    const jsonContent = content
      .replace(/&quot;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&#x22;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    const parsed = JSON.parse(jsonContent);
    
    if (!validateMiniAppSchema(parsed)) {
      return null;
    }

    return parsed as MiniAppEmbed;
  } catch {
    return null;
  }
}

function extractMiniAppMeta(html: string): MiniAppEmbed | null {
  const { metadata } = extractCustomOpenGraph(html);
  
  const metaTags = ['fc:miniapp', 'fc:frame'];
  
  for (const metaName of metaTags) {
    if (metadata[metaName]) {
      const result = tryParseMetaContent(metadata[metaName]);
      if (result) return result;
    }
    
    const manualResult = extractMetaTagManually(html, metaName);
    if (manualResult) {
      const result = tryParseMetaContent(manualResult);
      if (result) return result;
    }
  }
  
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const action = searchParams.get('action') || 'check';

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MiniAppChecker/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ 
        isMiniApp: false, 
        metadata: null,
        error: `HTTP ${response.status}` 
      }, { status: 200 });
    }

    const html = await response.text();
    const miniAppMeta = extractMiniAppMeta(html);
    
    if (action === 'metadata') {
      return NextResponse.json({
        metadata: miniAppMeta,
        isMiniApp: miniAppMeta !== null
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300' // 5 minutes cache
        }
      });
    }

    return NextResponse.json({
      isMiniApp: miniAppMeta !== null,
      metadata: miniAppMeta
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300' // 5 minutes cache
      }
    });

  } catch (error) {
    console.warn('Failed to check if URL is a mini app:', error);
    return NextResponse.json({ 
      isMiniApp: false,
      metadata: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}