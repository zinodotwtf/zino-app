'use client';

import useSWR from 'swr';

import { useUser } from '@/hooks/use-user';
import { WalletPortfolio } from '@/types/helius/portfolio';

export function useWalletPortfolio() {
  const { user } = useUser();
  const walletAddress = user?.wallets?.[0]?.publicKey;

  return useSWR<WalletPortfolio>(
    walletAddress ? ['wallet-portfolio', walletAddress] : null,
    async () => {
      if (!walletAddress) throw new Error('No wallet address');

      const response = await fetch(`/api/wallet/${walletAddress}/portfolio`);
      if (!response.ok) throw new Error('Failed to fetch portfolio');

      return response.json();
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      keepPreviousData: true,
    },
  );
}
