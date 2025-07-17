"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { tradeCoin, TradeParameters } from "@zoralabs/coins-sdk";
import Image from "next/image";

interface ZoraBuyComponentProps {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenImage?: string;
  chainId: number;
}

export function ZoraBuyComponent({
  tokenAddress,
  tokenName,
  tokenSymbol,
  tokenImage,
}: ZoraBuyComponentProps) {
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  
  const [amount, setAmount] = useState("0.001");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!account || !walletClient || !publicClient) {
      setError("Please connect your wallet");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setTxHash(null);

    try {
      const tradeParameters: TradeParameters = {
        sell: { type: "eth" },
        buy: {
          type: "erc20",
          address: tokenAddress as `0x${string}`,
        },
        amountIn: parseEther(amount),
        slippage: 0.05, // 5% slippage tolerance
        sender: account,
      };

      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account: walletClient.account,
        publicClient,
      });

      if (receipt.status === "success") {
        setSuccess(true);
        setTxHash(receipt.transactionHash);
        setAmount("0.001"); // Reset amount
      } else {
        setError("Transaction failed");
      }
    } catch (err) {
      console.error("Error buying token:", err);
      // Handle common error scenarios
      if (err instanceof Error) {
        if (err.message.includes("insufficient funds")) {
          setError("Insufficient ETH balance");
        } else if (err.message.includes("user rejected")) {
          setError("Transaction cancelled by user");
        } else if (err.message.includes("slippage")) {
          setError("Price changed too much. Try again with higher slippage");
        } else {
          setError(err.message);
        }
      } else {
        setError("Transaction failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="bg-[var(--app-gray-light)] rounded-lg p-4 text-center">
        <p className="text-sm text-[var(--app-foreground-muted)]">
          Connect your wallet to buy {tokenSymbol}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--app-gray-light)] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        {tokenImage && (
          <Image 
            src={tokenImage} 
            alt={tokenName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            step="0.001"
            min="0"
            className="flex-1 px-3 py-2 bg-[var(--app-background)] border border-[var(--app-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent"
            disabled={isLoading}
          />
          <span className="text-sm text-[var(--app-foreground-muted)]">ETH</span>
        </div>

        <button
          onClick={handleBuy}
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
          className="w-full bg-[var(--app-accent)] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-[var(--app-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Processing..." : `Buy`}
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-xs p-2 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 text-xs p-2 bg-green-50 rounded border border-green-200 space-y-1">
          <p>Successfully purchased {tokenSymbol}!</p>
          {txHash && (
            <a 
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block"
            >
              View transaction →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
