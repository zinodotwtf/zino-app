'use client';

import { Suspense } from 'react';

import PageLoading from '@/components/page-loading';

import RefreshContent from './refresh-content';

export default function RefreshPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <RefreshContent />
    </Suspense>
  );
}
