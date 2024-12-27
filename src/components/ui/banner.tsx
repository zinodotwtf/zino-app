'use client';

import { useEffect, useState } from 'react';

import { X } from 'lucide-react';

const bannerStateKey = 'dd-banner:visible';

interface BannerProps {
  children: React.ReactNode;
}

export function Banner({ children }: BannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Persist banner state in localStorage
  useEffect(() => {
    const bannerState = localStorage.getItem(bannerStateKey);
    if (bannerState !== 'false') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(bannerStateKey, 'false');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-muted px-6 py-2.5 sm:px-3.5">
      <div className="flex items-center justify-between gap-x-4">
        <p className="text-sm">{children}</p>
        <button
          type="button"
          className="-m-1.5 flex-none p-1.5 hover:opacity-80"
          onClick={handleDismiss}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
