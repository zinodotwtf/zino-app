import Link from 'next/link';

import { DynamicImage } from './dynamic-image';

export default function MaintenanceIndex() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <style jsx global>{`
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
      <div
        style={{ animation: 'fadeInOut 3s ease-in-out infinite' }}
        className=" pointer-events-none select-none"
      >
        <DynamicImage
          lightSrc="/logo_w.svg"
          darkSrc="/logo.svg"
          alt="Logo"
          width={100}
          height={100}
          className="h-auto w-auto"
          priority
        />
      </div>

      <div className="text-center text-foreground">
        <p className="text-lg">
          Follow{' '}
          <Link
            href="https://x.com/neur_sh"
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            @neur_sh
          </Link>{' '}
          for updates on our launch
        </p>
      </div>
    </div>
  );
}
