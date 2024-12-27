'use client';

import { useEffect, useRef } from 'react';

import { animate, useInView, useMotionValue } from 'framer-motion';

import { cn } from '@/lib/utils';

export default function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  duration = 2, // duration in seconds
}: {
  value: number;
  direction?: 'up' | 'down';
  className?: string;
  delay?: number; // delay in s
  decimalPlaces?: number;
  duration?: number; // duration in s
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (!isInView) return;

    const timeoutId = setTimeout(() => {
      const controls = animate(motionValue, direction === 'down' ? 0 : value, {
        duration,
        ease: 'easeOut',
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Intl.NumberFormat('en-US', {
              minimumFractionDigits: decimalPlaces,
              maximumFractionDigits: decimalPlaces,
            }).format(Number(latest.toFixed(decimalPlaces)));
          }
        },
      });

      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [motionValue, isInView, delay, value, direction, duration, decimalPlaces]);

  return (
    <span
      className={cn(
        'inline-block tabular-nums tracking-wider text-black dark:text-white',
        className,
      )}
      ref={ref}
    />
  );
}
