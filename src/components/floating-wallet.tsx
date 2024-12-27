'use client';

import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ExternalLink, TrendingUp, Wallet } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { WalletPortfolio as Portfolio } from '@/types/helius/portfolio';

interface FloatingWalletProps {
  data: Portfolio;
  className?: string;
  isLoading?: boolean;
}

export function FloatingWallet({
  data,
  className,
  isLoading = false,
}: FloatingWalletProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Preload all token images
    if (data.tokens.length > 0) {
      Promise.all(
        data.tokens.map((token) => {
          if (!token.imageUrl) return Promise.resolve();
          return new Promise((resolve) => {
            const img = new Image();
            img.src = token.imageUrl;
            img.onload = resolve;
            img.onerror = resolve;
          });
        }),
      ).then(() => setImagesLoaded(true));
    } else {
      setImagesLoaded(true);
    }
  }, [data.tokens]);

  if (!mounted || !imagesLoaded) return null;

  return (
    <div
      className={cn(
        'absolute bottom-full right-4 z-50 mb-3 select-none',
        className,
      )}
    >
      <motion.div
        layout="preserve-aspect"
        animate={{
          width: isExpanded ? 300 : 'auto',
        }}
        transition={{
          type: 'spring',
          bounce: 0,
          duration: 0.25,
          stiffness: 400,
          damping: 30,
        }}
        className="relative will-change-transform"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 340 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                height: {
                  type: 'spring',
                  bounce: 0,
                  duration: 0.25,
                  stiffness: 400,
                  damping: 30,
                },
                opacity: {
                  duration: 0.15,
                },
              }}
              className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl bg-black/[0.08] backdrop-blur-[20px] will-change-transform dark:bg-black/40 dark:backdrop-blur-2xl"
            >
              <div className="flex h-[340px] flex-col bg-white/90 shadow-sm dark:bg-transparent">
                <div className="flex flex-col gap-3 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium">
                      <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                        <TrendingUp className="h-3 w-3 shrink-0" />
                        <span>{data.tokens.length}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {formatNumber(data.totalBalance, 'currency')}
                      </div>
                    </div>
                    <a
                      href={`https://solscan.io/account/${data.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary"
                    >
                      <span className="max-w-[120px] truncate">
                        {data.address.slice(0, 4)}...{data.address.slice(-4)}
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>

                <ScrollArea className="-mx-3 flex-1 px-3">
                  <div className="space-y-px">
                    {data.tokens.map((token, index) => (
                      <motion.a
                        key={index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            type: 'spring',
                            bounce: 0,
                            duration: 0.2,
                            delay: Math.min(index * 0.015, 0.3),
                          },
                        }}
                        href={`https://solscan.io/account/${data.address}#portfolio`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-xl transition-colors duration-150 ease-out hover:bg-black/[0.06] dark:hover:bg-white/[0.06]"
                      >
                        <div className="flex items-center justify-between p-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <Avatar className="h-8 w-8 shrink-0 rounded-lg bg-background">
                              <AvatarImage
                                src={token.imageUrl}
                                alt={token.name}
                                className="object-cover transition-transform duration-150 group-hover:scale-105"
                              />
                              <AvatarFallback className="rounded-lg text-xs">
                                {token.symbol.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <div className="truncate text-sm font-medium text-foreground">
                                  {token.name}
                                </div>
                                <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                  {token.symbol}
                                </span>
                              </div>
                              <div className="mt-0.5 text-xs text-muted-foreground">
                                {token.balance.toLocaleString(undefined, {
                                  maximumFractionDigits: 4,
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-0.5">
                            <div className="text-sm font-medium text-foreground">
                              {formatNumber(
                                token.balance * token.pricePerToken,
                                'currency',
                              )}
                            </div>
                            {token.pricePerToken > 0 && (
                              <div className="text-[10px] text-muted-foreground">
                                @ {token.pricePerToken.toFixed(4)} $
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout="preserve-aspect"
          className="flex cursor-pointer items-center gap-1.5 rounded-2xl bg-black/[0.08] px-3 py-2 backdrop-blur-[20px] transition-colors hover:bg-black/[0.12] dark:bg-black/40 dark:backdrop-blur-2xl dark:hover:bg-black/50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Wallet className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className={cn('min-w-0', isExpanded && 'flex-1')}>
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ type: 'spring', bounce: 0.2 }}
                  className="block text-sm text-muted-foreground"
                >
                  Embedded Wallet
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ type: 'spring', bounce: 0.2 }}
                  className="block text-sm text-muted-foreground"
                >
                  {formatNumber(data.totalBalance, 'currency')}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="h-4 w-4 shrink-0 text-muted-foreground"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
