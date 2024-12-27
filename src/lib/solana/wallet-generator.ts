'use server';

import bs58 from 'bs58';
import { createCipheriv, createDecipheriv } from 'crypto';
import { randomBytes } from 'crypto';

/**
 * Generate encrypted keypair
 */
export async function generateEncryptedKeyPair() {
  const { publicKey, privateKey } = await generateExposedKeyPair();
  const encryptedPrivateKey = await WalletEncryption.encrypt(privateKey);
  return { publicKey, encryptedPrivateKey };
}

/**
 * Decrypt private key
 */
export async function decryptPrivateKey(encryptedPrivateKey: string) {
  return await WalletEncryption.decrypt(encryptedPrivateKey);
}

/**
 * Generate exposed keypair
 */
async function generateExposedKeyPair() {
  // Generate Ed25519 keypair
  const keypair = await crypto.subtle.generateKey('Ed25519', true, [
    'sign',
    'verify',
  ]);

  // Export public and private keys
  const publicKeyBuffer = await crypto.subtle.exportKey(
    'raw',
    keypair.publicKey,
  );
  const privateKeyBuffer = await crypto.subtle.exportKey(
    'pkcs8',
    keypair.privateKey,
  );

  // Solana private key needs to include both 32 bytes of private key and 32 bytes of public key
  const privateKeyBytes = new Uint8Array(privateKeyBuffer.slice(-32)); // Extract private key part
  const publicKeyBytes = new Uint8Array(publicKeyBuffer); // Extract public key part
  const solanaPrivateKey = new Uint8Array([
    ...privateKeyBytes,
    ...publicKeyBytes,
  ]); // 64 bytes format

  // Convert to Base58 format
  const publicKeyBase58 = bs58.encode(publicKeyBytes);
  const privateKeyBase58 = bs58.encode(solanaPrivateKey);

  return {
    publicKey: publicKeyBase58,
    privateKey: privateKeyBase58,
  };
}

/**
 * Wallet encryption tool class
 */
class WalletEncryption {
  private static readonly algorithm = 'aes-256-cbc';
  private static readonly encryptionKey = Buffer.from(
    process.env.WALLET_ENCRYPTION_KEY!,
    'utf-8',
  ).subarray(0, 32);
  private static readonly ivLength = 16;

  static async encrypt(source: string): Promise<string> {
    try {
      const iv = randomBytes(this.ivLength);
      const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);
      const encrypted = Buffer.concat([
        cipher.update(source, 'utf8'),
        cipher.final(),
      ]);
      const result = Buffer.concat([iv, encrypted]);
      return result.toString('base64');
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt private key');
    }
  }

  static async decrypt(encrypted: string): Promise<string> {
    try {
      if (!encrypted) {
        throw new Error('Missing encrypted private key');
      }

      const encryptedBuffer = Buffer.from(encrypted, 'base64');
      const iv = encryptedBuffer.subarray(0, this.ivLength);
      const encryptedContent = encryptedBuffer.subarray(this.ivLength);

      const decipher = createDecipheriv(this.algorithm, this.encryptionKey, iv);
      const decrypted = Buffer.concat([
        decipher.update(encryptedContent),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Decryption failed:', error);
      if (error instanceof Error) {
        throw new Error(`Private key decryption failed: ${error.message}`);
      }
      throw new Error('Private key decryption failed');
    }
  }
}
