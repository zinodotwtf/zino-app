export interface Suggestion {
  id: string;
  title: string;
  subtitle: string;
}

export const SUGGESTIONS: Suggestion[] = [
  {
    id: 'launch-token',
    title: 'Launch a new token',
    subtitle: 'deploy a new token on pump.fun',
  },
  {
    id: 'swap-sol-usdc',
    title: 'Swap 1 SOL for USDC',
    subtitle: 'using Jupiter to swap on Solana',
  },
  {
    id: 'solana-trends',
    title: "What's trending on Solana?",
    subtitle: 'find the current market trends',
  },
  {
    id: 'price-feed',
    title: "What's the price of SOL?",
    subtitle: 'find the current price of SOL',
  },
  {
    id: 'top-gainers-last-24h',
    title: 'Top gainers in the last 24h',
    subtitle: 'find the top gainers in the last 24 hours',
  },
  // {
  //     id: "phantom-updates",
  //     title: "Any updates from @phantom recently?",
  //     subtitle: "summarize the latest tweets from @phantom"
  // },
  // {
  //     id: "toly-updates",
  //     title: "What has toly been doing recently?",
  //     subtitle: "summarize his recent tweets"
  // },
];

export function getRandomSuggestions(count: number): Suggestion[] {
  // Ensure we don't request more items than available
  const safeCount = Math.min(count, SUGGESTIONS.length);
  const startIndex =
    Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % SUGGESTIONS.length;

  // Create a rotated copy of the array starting from startIndex
  const rotatedSuggestions = [
    ...SUGGESTIONS.slice(startIndex),
    ...SUGGESTIONS.slice(0, startIndex),
  ];

  // Return only the first safeCount items
  return rotatedSuggestions.slice(0, safeCount);
}
