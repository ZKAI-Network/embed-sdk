import { createTradeCall, TradeParameters } from "@zoralabs/coins-sdk";
import { WalletClient, PublicClient, Account, Address, encodeFunctionData } from "viem";

const FEE_RECIPIENT = "0x09CEdb7bb69f9F6DF646dBa107D2bAACda93D6C9" as const;
const FEE_PERCENTAGE = 2; // 2%

// Base mainnet multicall3 contract address
const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11" as const;

// Multicall3 ABI for aggregateValue function (supports ETH transfers)
const MULTICALL3_ABI = [
  {
    inputs: [
      {
        components: [
          { name: "target", type: "address" },
          { name: "allowFailure", type: "bool" },
          { name: "value", type: "uint256" },
          { name: "callData", type: "bytes" }
        ],
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "aggregate3Value",
    outputs: [
      {
        components: [
          { name: "success", type: "bool" },
          { name: "returnData", type: "bytes" }
        ],
        name: "returnData",
        type: "tuple[]"
      }
    ],
    stateMutability: "payable",
    type: "function"
  }
] as const;

interface TradeCoinWithFeeParams {
  tradeParameters: TradeParameters;
  walletClient: WalletClient;
  account: Account;
  publicClient: PublicClient;
  validateTransaction?: boolean;
}

export async function tradeCoinWithFee({
  tradeParameters,
  walletClient,
  account,
  publicClient,
}: TradeCoinWithFeeParams) {
  // Calculate 2% fee from the input amount
  const feeAmount = (tradeParameters.amountIn * BigInt(FEE_PERCENTAGE)) / BigInt(100);
  
  // Adjust the trade amount to account for the fee
  const adjustedTradeAmount = tradeParameters.amountIn - feeAmount;
  
  // Create adjusted trade parameters
  const adjustedTradeParameters: TradeParameters = {
    ...tradeParameters,
    amountIn: adjustedTradeAmount,
  };

  // Get the trade call data using Zora SDK
  const tradeQuote = await createTradeCall(adjustedTradeParameters);

  // Prepare multicall calls with values for ETH transfers
  const calls = [
    {
      target: tradeQuote.call.target as Address,
      allowFailure: false,
      value: BigInt(tradeQuote.call.value),
      callData: tradeQuote.call.data as `0x${string}`,
    },
    {
      target: FEE_RECIPIENT,
      allowFailure: false,
      value: feeAmount,
      callData: "0x" as `0x${string}`, // Empty calldata for ETH transfer
    }
  ];

  // Encode the multicall function call
  const multicallData = encodeFunctionData({
    abi: MULTICALL3_ABI,
    functionName: "aggregate3Value",
    args: [calls],
  });

  // Execute the multicall transaction
  const txHash = await walletClient.sendTransaction({
    account,
    to: MULTICALL3_ADDRESS,
    data: multicallData,
    value: BigInt(tradeQuote.call.value) + feeAmount, // Total ETH needed
    chain: undefined,
  });

  // Wait for transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  return receipt;
}