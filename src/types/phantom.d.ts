interface PhantomProvider {
  publicKey: import('@solana/web3.js').PublicKey | null;
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: import('@solana/web3.js').PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (
    transaction: import('@solana/web3.js').Transaction,
  ) => Promise<import('@solana/web3.js').Transaction>;
  signAllTransactions: (
    transactions: import('@solana/web3.js').Transaction[],
  ) => Promise<import('@solana/web3.js').Transaction[]>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
}

interface Window {
  phantom?: {
    solana?: PhantomProvider;
  };
  solana?: PhantomProvider;
}
