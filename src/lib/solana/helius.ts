import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { FungibleToken } from '@/types/helius/fungibleToken';
import { NonFungibleToken } from '@/types/helius/nonFungibleToken';

import { RPC_URL } from '../constants';

type HeliusMethod = 'searchAssets' | 'getBalance';

const fetchHelius = async (method: HeliusMethod, params: any) => {
  try {
    const response = await fetch(RPC_URL, {
      next: { revalidate: 5 },
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'request-id',
        method: method,
        params: { ...params },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Helius API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(
        `Helius API error: ${data.error.message || JSON.stringify(data.error)}`,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Helius API request failed: ${error.message}`);
    }
    throw new Error('Helius API request failed with unknown error');
  }
};

export const getBalance: (walletAddress: string) => Promise<number> = async (
  walletAddress: string,
) => {
  const data = await fetchHelius('getBalance', [walletAddress]);
  return Number(data.result.balance) / LAMPORTS_PER_SOL;
};

export const searchWalletAssets: (walletAddress: string) => Promise<{
  fungibleTokens: FungibleToken[];
  nonFungibleTokens: NonFungibleToken[];
}> = async (ownerAddress: string) => {
  try {
    const data = await fetchHelius('searchAssets', {
      ownerAddress: ownerAddress,
      tokenType: 'all',
      displayOptions: {
        showNativeBalance: true,
        showInscription: false,
        showCollectionMetadata: false,
      },
    });

    if (!data.result?.items) {
      throw new Error('Invalid response format from Helius API');
    }

    const items: (FungibleToken | NonFungibleToken)[] = data.result.items;

    // Split the items into fungible and non-fungible tokens
    let fungibleTokens: FungibleToken[] = items.filter(
      (item): item is FungibleToken =>
        item.interface === 'FungibleToken' ||
        item.interface === 'FungibleAsset',
    );

    // Hardcoding the image for USDC
    fungibleTokens = fungibleTokens.map((item) => {
      if (item.id === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') {
        return {
          ...item,
          content: {
            ...item.content,
            files: [
              {
                uri: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
                cdn_uri: '',
                mime: 'image/png',
              },
            ],
            links: {
              image:
                'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
            },
          },
        };
      } else if (item.id === 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1') {
        return {
          ...item,
          content: {
            ...item.content,
            files: [
              {
                uri: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png',
                cdn_uri: '',
                mime: 'image/png',
              },
            ],
            links: {
              image:
                'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png',
            },
          },
        };
      }
      return item;
    });
    const nonFungibleTokens: NonFungibleToken[] = items.filter(
      (item): item is NonFungibleToken =>
        !['FungibleToken', 'FungibleAsset'].includes(item.interface),
    );

    // Calculate SOL balance from lamports
    const solBalance = data.result.nativeBalance.lamports;
    //console.log(data.result);

    // Create SOL token object
    const solToken = {
      interface: 'FungibleAsset',
      id: 'So11111111111111111111111111111111111111112', // Mint address as ID
      content: {
        $schema: 'https://schema.metaplex.com/nft1.0.json',
        json_uri: '',
        files: [
          {
            uri: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
            cdn_uri: '',
            mime: 'image/png',
          },
        ],
        metadata: {
          description: 'Solana Token',
          name: 'Wrapped SOL',
          symbol: 'SOL',
          token_standard: 'Native Token',
        },
        links: {
          image:
            'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        },
      },
      authorities: [],
      compression: {
        eligible: false,
        compressed: false,
        data_hash: '',
        creator_hash: '',
        asset_hash: '',
        tree: '',
        seq: 0,
        leaf_id: 0,
      },
      grouping: [],
      royalty: {
        royalty_model: '',
        target: null,
        percent: 0,
        basis_points: 0,
        primary_sale_happened: false,
        locked: false,
      },
      creators: [],
      ownership: {
        frozen: false,
        delegated: false,
        delegate: null,
        ownership_model: 'token',
        owner: nonFungibleTokens[0]?.ownership.owner,
      },
      supply: null,
      mutable: true,
      burnt: false,

      token_info: {
        symbol: 'SOL',
        balance: solBalance,
        supply: 0,
        decimals: 9,
        token_program: '',
        associated_token_address: '',
        price_info: {
          price_per_token: data.result.nativeBalance.price_per_sol,
          total_price: data.result.nativeBalance.total_price,
          currency: '',
        },
      },
    };

    // Add SOL token to the tokens array
    fungibleTokens.push(solToken);

    return { fungibleTokens, nonFungibleTokens };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to search wallet assets: ${error.message}`);
    }
    throw new Error('Failed to search wallet assets with unknown error');
  }
};
