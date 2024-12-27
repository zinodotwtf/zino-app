import { version } from '../../package.json';

export const APP_VERSION = version;
export const IS_BETA = true;

export const RPC_URL =
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
  'https://api.mainnet-beta.solana.com';
