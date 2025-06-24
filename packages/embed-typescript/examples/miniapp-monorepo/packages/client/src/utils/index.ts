export function isMobileContext(): boolean {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iPhone|iPad|iPod|Android|Mobile|warpcast|farcaster/.test(userAgent); // curently only warpcast is really detected, farcaster was added for futureproofing
  }
  return false;
} 
