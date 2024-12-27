'use server';

import { cookies } from 'next/headers';

import { PrivyClient } from '@privy-io/server-auth';
import { z } from 'zod';

import prisma from '@/lib/prisma';
import { ActionResponse, actionClient } from '@/lib/safe-action';
import { generateEncryptedKeyPair } from '@/lib/solana/wallet-generator';
import { PrismaUser } from '@/types/db';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;

if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error('Lack of necessary environment variables');
}

const PRIVY_SERVER_CLIENT = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);

const getOrCreateUser = actionClient
  .schema(z.object({ userId: z.string() }))
  .action<ActionResponse<PrismaUser>>(async ({ parsedInput: { userId } }) => {
    const prismaUser = await prisma.user.findUnique({
      where: { privyId: userId },
      include: {
        wallets: {
          select: {
            id: true,
            ownerId: true,
            name: true,
            publicKey: true,
          },
        },
      },
    });

    if (prismaUser) {
      return {
        success: true,
        data: prismaUser,
      };
    }

    const createdUser = await prisma.user.create({ data: { privyId: userId } });
    const { publicKey, encryptedPrivateKey } = await generateEncryptedKeyPair();
    const initalWallet = await prisma.wallet.create({
      data: {
        ownerId: createdUser.id,
        name: 'Default',
        publicKey,
        encryptedPrivateKey,
      },
    });

    return {
      success: true,
      data: {
        ...createdUser,
        wallets: [
          {
            id: initalWallet.id,
            ownerId: initalWallet.ownerId,
            name: initalWallet.name,
            publicKey: initalWallet.publicKey,
          },
        ],
      },
    };
  });

export const verifyUser = actionClient.action<
  ActionResponse<{ id: string; publicKey?: string }>
>(async () => {
  const token = (await cookies()).get('privy-token')?.value;

  if (!token) {
    return {
      success: false,
      error: 'No privy token found',
    };
  }

  try {
    const claims = await PRIVY_SERVER_CLIENT.verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { privyId: claims.userId },
      select: {
        id: true,
        wallets: {
          select: {
            publicKey: true,
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      data: {
        id: user.id,
        publicKey: user.wallets[0]?.publicKey,
      },
    };
  } catch (_) {
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
});

export const getUserData = actionClient.action<ActionResponse<PrismaUser>>(
  async () => {
    const token = (await cookies()).get('privy-token')?.value;

    if (!token) {
      return {
        success: false,
        error: 'No privy token found',
      };
    }

    try {
      const claims = await PRIVY_SERVER_CLIENT.verifyAuthToken(token);
      const response = await getOrCreateUser({ userId: claims.userId });
      const success = response?.data?.success;
      const user = response?.data?.data;
      const error = response?.data?.error;

      if (!success) {
        return {
          success: false,
          error: error,
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (_) {
      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  },
);
