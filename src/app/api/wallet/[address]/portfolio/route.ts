import { NextRequest } from 'next/server';

import { searchWalletAssets } from '@/lib/solana/helius';
import { transformToPortfolio } from '@/types/helius/portfolio';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  try {
    const { address } = await params;
    const { fungibleTokens, nonFungibleTokens } =
      await searchWalletAssets(address);
    const portfolio = transformToPortfolio(
      address,
      fungibleTokens,
      nonFungibleTokens,
    );

    return Response.json(portfolio);
  } catch (error) {
    console.error('Error fetching wallet portfolio:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch wallet portfolio' }),
      {
        status: 500,
      },
    );
  }
}
