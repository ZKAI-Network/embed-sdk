/**
 * Utility functions for parsing and handling Zora URLs
 */

export interface ZoraTokenInfo {
  chain: string;
  chainId: number;
  contractAddress: string;
  referrer?: string;
}

/**
 * Chain name to chain ID mapping
 */
const CHAIN_MAP: Record<string, number> = {
  'base': 8453,
  'ethereum': 1,
  'optimism': 10,
  'arbitrum': 42161,
  'polygon': 137,
  'zora': 7777777,
};

/**
 * Parse a Zora URL to extract token information
 * Supports both formats:
 * - https://zora.co/coin/base:0x47f9cec54d9bc2014cb0e6fa58f54e0b222176c2?referrer=0xb3bf9649116e3c00bfc1919b037f8c12b2cb197b
 * - zoracoin://0x19433ed1feeecd0cd973ac73526732faaaf21dca
 * - zoraCoin://0x19433ed1feeecd0cd973ac73526732faaaf21dca (case insensitive)
 */
export function parseZoraUrl(url: string): ZoraTokenInfo | null {
  try {
    // Handle zoracoin:// and zoraCoin:// protocol formats
    if (url.toLowerCase().startsWith('zoracoin://')) {
      const contractAddress = url.replace(/^zoracoin:\/\//i, '');
      
      // Validate contract address (basic ethereum address format)
      if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
        return null;
      }
      
      // Default to Base chain for zoracoin:// format
      return {
        chain: 'base',
        chainId: 8453,
        contractAddress: contractAddress.toLowerCase(),
      };
    }
    
    // Handle https://zora.co/coin/ format
    const urlObj = new URL(url);
    
    // Check if it's a Zora URL
    if (urlObj.hostname !== 'zora.co') {
      return null;
    }
    
    // Check if it's a coin path
    const pathMatch = urlObj.pathname.match(/^\/coin\/([^:]+):(.+)$/);
    if (!pathMatch) {
      return null;
    }
    
    const [, chain, contractAddress] = pathMatch;
    
    // Validate chain
    const chainId = CHAIN_MAP[chain.toLowerCase()];
    if (!chainId) {
      return null;
    }
    
    // Validate contract address (basic ethereum address format)
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return null;
    }
    
    // Extract referrer if present
    const referrer = urlObj.searchParams.get('referrer');
    
    return {
      chain: chain.toLowerCase(),
      chainId,
      contractAddress: contractAddress.toLowerCase(),
      referrer: referrer || undefined,
    };
  } catch (error) {
    console.error('Error parsing Zora URL:', error);
    return null;
  }
}

/**
 * Check if a URL is a Zora token URL
 */
export function isZoraTokenUrl(url: string): boolean {
  return parseZoraUrl(url) !== null;
}

/**
 * Check if a chain is supported for trading
 * Currently focusing on Base (8453) as mentioned in requirements
 */
export function isSupportedChain(chainId: number): boolean {
  // For now, only support Base
  return chainId === 8453;
}

/**
 * Get display name for chain
 */
export function getChainDisplayName(chainId: number): string {
  const chainNames: Record<number, string> = {
    1: 'Ethereum',
    8453: 'Base',
    10: 'Optimism',
    42161: 'Arbitrum',
    137: 'Polygon',
    7777777: 'Zora',
  };
  
  return chainNames[chainId] || `Chain ${chainId}`;
}