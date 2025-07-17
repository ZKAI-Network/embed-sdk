import { useEffect, useState } from 'react';
import type { Token } from '@coinbase/onchainkit/token';
import { getCoin, setApiKey } from '@zoralabs/coins-sdk';

export interface UseTokenFromContractResult {
  token: Token | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch token metadata from a contract address using the Zora SDK
 */
export function useTokenFromContract(
  contractAddress: string,
  chainId: number
): UseTokenFromContractResult {
  const [token, setToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contractAddress || !chainId) {
      setToken(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Only support Base chain for now
    if (chainId !== 8453) {
      setError('Unsupported chain');
      setIsLoading(false);
      return;
    }

    const fetchTokenMetadata = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Set API key if available
        if (process.env.NEXT_PUBLIC_ZORA_API_KEY) {
          setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY);
        }
        
        // Use Zora SDK to get real token metadata
        const response = await getCoin({
          address: contractAddress,
          chain: chainId,
        });

        if (response.data?.zora20Token) {
          const zoraToken = response.data.zora20Token;
          
          // Convert Zora token data to OnchainKit Token format
          const token: Token = {
            name: zoraToken.name || 'Unknown Token',
            address: contractAddress as `0x${string}`,
            symbol: zoraToken.symbol || 'UNKNOWN',
            decimals: 18, // Zora tokens are typically 18 decimals
            image: '',
            chainId: chainId,
          };

          setToken(token);
        } else {
          // Fallback if no data from Zora SDK
          const fallbackToken: Token = {
            name: 'Unknown Token',
            address: contractAddress as `0x${string}`,
            symbol: 'UNKNOWN',
            decimals: 18,
            image: '',
            chainId: chainId,
          };
          
          setToken(fallbackToken);
        }
      } catch (err) {
        console.error('Error fetching token metadata from Zora SDK:', err);
        
        // Fallback to basic token info on error
        const fallbackToken: Token = {
          name: 'Token',
          address: contractAddress as `0x${string}`,
          symbol: 'TOKEN',
          decimals: 18,
          image: '',
          chainId: chainId,
        };
        
        setToken(fallbackToken);
        setError('Failed to fetch token metadata');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenMetadata();
  }, [contractAddress, chainId]);

  return { token, isLoading, error };
}