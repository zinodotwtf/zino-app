import { PublicKey, Transaction } from '@solana/web3.js';

interface PhantomProvider {
  publicKey: import('@solana/web3.js').PublicKey;
  isPhantom?: boolean;
  connect: (opts?: {
    onlyIfTrusted?: boolean;
  }) => Promise<{ publicKey: import('@solana/web3.js').PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (
    transaction: import('@solana/web3.js').Transaction,
  ) => Promise<import('@solana/web3.js').Transaction>;
  signAllTransactions: (
    transactions: import('@solana/web3.js').Transaction[],
  ) => Promise<import('@solana/web3.js').Transaction[]>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  sendTransaction: (
    transaction: import('@solana/web3.js').Transaction,
    connection: import('@solana/web3.js').Connection,
    options?: { skipPreflight?: boolean },
  ) => Promise<string>;
}

interface Window {
  phantom?: {
    solana?: PhantomProvider;
  };
  solana?: PhantomProvider;
}

export {};
