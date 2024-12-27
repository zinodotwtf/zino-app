import Image from 'next/image';

import { motion } from 'framer-motion';

import type { Integration } from '../data/integrations';

interface IntegrationCardProps {
  item: Integration;
  index: number;
  onClick?: () => void;
}

interface IntegrationCardStyles extends React.CSSProperties {
  '--integration-primary': string;
  '--integration-secondary': string;
}

export function IntegrationCard({
  item,
  index,
  onClick,
}: IntegrationCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.99,
        transition: { duration: 0.1 },
      }}
      onClick={onClick}
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl bg-muted 
        p-4 transition-all duration-200"
      style={
        {
          '--integration-primary': item.theme.primary,
          '--integration-secondary': item.theme.secondary,
        } as IntegrationCardStyles
      }
    >
      <motion.div
        initial={false}
        whileHover={{
          scale: 1.05,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${item.theme.primary}15, ${item.theme.secondary}10)`,
        }}
      >
        <Image
          src={item.icon}
          alt={item.label}
          width={24}
          height={24}
          className="z-10 transition-transform duration-300 group-hover:scale-105"
        />
      </motion.div>

      <div className="z-10 flex-1 space-y-0.5 text-left">
        <motion.div
          className="text-sm font-medium transition-colors duration-300"
          initial={false}
        >
          {item.label}
        </motion.div>
        {item.description && (
          <motion.div
            className="line-clamp-1 text-xs text-muted-foreground/70"
            initial={false}
          >
            {item.description}
          </motion.div>
        )}
      </div>

      {/* Theme color overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${item.theme.primary}10, ${item.theme.secondary}05)`,
        }}
      />
    </motion.button>
  );
}
