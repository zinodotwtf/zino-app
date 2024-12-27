import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ComingSoonPageProps {
  icon: LucideIcon;
  title?: string;
  className?: string;
}

export function ComingSoonPage({
  icon: Icon,
  title = 'Coming Soon',
  className,
}: ComingSoonPageProps) {
  return (
    <div
      className={cn(
        'relative min-h-[80vh] w-full overflow-hidden',
        '[background-image:radial-gradient(rgb(229_229_229/0.5)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgb(64_64_64/0.25)_1px,transparent_1px)]',
        '[background-size:40px_40px]',
        className,
      )}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/90 to-background/50">
        <div className="relative">
          {/* Glowing Background Effect */}
          <div className="absolute -inset-40 -z-10">
            <div className="bg-gradient-conic absolute inset-0 rotate-180 from-primary/20 via-primary/[0.05] to-primary/20 opacity-50 blur-[100px]" />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-8 px-4">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse blur-2xl">
                <Icon className="h-24 w-24 text-primary/25" />
              </div>
              <Icon className="relative h-24 w-24 text-primary" />
            </div>

            <div className="flex flex-col items-center gap-2.5 text-center">
              <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
              <p className="max-w-[500px] text-muted-foreground">
                Coming soon... Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
