/**
 * Format utilities for displaying data
 */

/**
 * Format user creation date
 */
export function formatUserCreationDate(date: string | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format wallet address for display
 */
export function formatWalletAddress(
  address: string | undefined,
  length: number = 5,
): string {
  if (!address) return 'Anonymous';
  const start = address.slice(0, length);
  const end = address.slice(-length);
  return `${start}...${end}`;
}

/**
 * Format Privy ID by removing prefix
 */
export function formatPrivyId(id: string | undefined): string {
  if (!id) return '';
  return id.replace('did:privy:', '');
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
