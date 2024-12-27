'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export const Circle = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }
>(({ className, children, style }, ref) => {
  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:bg-black',
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = 'Circle';
