'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { usePrivy } from '@privy-io/react-auth';

import PageLoading from '@/components/page-loading';

export default function RefreshContent() {
  const { getAccessToken } = usePrivy();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function refreshAndRedirect() {
      try {
        // Try to refresh access token
        const token = await getAccessToken();
        // Get original target path, default to home if not provided
        const redirectUri = searchParams.get('redirect_uri') || '/';

        if (token) {
          // User is authenticated, redirect to original target path
          router.replace(redirectUri);
        } else {
          // User is not authenticated, redirect to home (login) with original target path
          router.replace(
            `/${redirectUri !== '/' ? `?redirect_uri=${redirectUri}` : ''}`,
          );
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        // Redirect to home on error
        router.replace('/');
      }
    }

    refreshAndRedirect();
  }, [getAccessToken, router, searchParams]);

  return <PageLoading />;
}
