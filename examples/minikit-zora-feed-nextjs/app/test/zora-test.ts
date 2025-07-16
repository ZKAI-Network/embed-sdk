/**
 * Test file to validate Zora URL parsing functionality
 * Run this in the browser console to test
 */

import { parseZoraUrl, isZoraTokenUrl } from "../utils/zora";

// Test cases
const testUrls = [
  // Valid Zora URLs
  "https://zora.co/coin/base:0x47f9cec54d9bc2014cb0e6fa58f54e0b222176c2",
  "https://zora.co/coin/base:0x47f9cec54d9bc2014cb0e6fa58f54e0b222176c2?referrer=0xb3bf9649116e3c00bfc1919b037f8c12b2cb197b",
  "https://zora.co/coin/ethereum:0x1234567890abcdef1234567890abcdef12345678",
  "https://zora.co/coin/optimism:0xabcdef1234567890abcdef1234567890abcdef12",
  
  // Invalid URLs
  "https://example.com/test",
  "https://zora.co/profile/someone",
  "https://zora.co/coin/invalid-format",
  "https://zora.co/coin/base:invalid-address",
  "not-a-url",
];

export function runZoraTests() {
  console.log("🧪 Testing Zora URL parsing...");
  
  testUrls.forEach((url, index) => {
    console.log(`\n--- Test ${index + 1} ---`);
    console.log(`URL: ${url}`);
    console.log(`Is Zora URL: ${isZoraTokenUrl(url)}`);
    
    const parsed = parseZoraUrl(url);
    if (parsed) {
      console.log(`✅ Parsed successfully:`);
      console.log(`  Chain: ${parsed.chain}`);
      console.log(`  Chain ID: ${parsed.chainId}`);
      console.log(`  Contract: ${parsed.contractAddress}`);
      console.log(`  Referrer: ${parsed.referrer || 'None'}`);
    } else {
      console.log(`❌ Failed to parse`);
    }
  });
  
  console.log("\n🎯 Test complete!");
}

// Test data structure for feed items
export const mockFeedItemWithZora = {
  item_id: "test-123",
  metadata: {
    author: {
      username: "testuser",
      fid: 123,
      display_name: "Test User",
    },
    text: "Check out this awesome token!",
    embed_items: [
      "https://zora.co/coin/base:0x47f9cec54d9bc2014cb0e6fa58f54e0b222176c2?referrer=0xb3bf9649116e3c00bfc1919b037f8c12b2cb197b",
      "https://example.com/some-other-link",
    ],
    likes_count: 10,
    comments_count: 5,
  },
};