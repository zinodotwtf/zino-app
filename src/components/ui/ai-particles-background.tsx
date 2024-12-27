'use client';

import { useCallback } from 'react';

import { useTheme } from 'next-themes';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';

export function AiParticlesBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: false,
        fpsLimit: 60,
        particles: {
          color: {
            value: isDark ? '#7E7E7E' : '#D8D8D9',
          },
          links: {
            color: isDark ? '#767676' : '#868686',
            distance: 250,
            enable: true,
            opacity: isDark ? 0.3 : 0.2,
            width: 1,
          },
          collisions: {
            enable: false,
          },
          move: {
            enable: true,
            speed: 0.4,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'bounce',
            },
          },
          number: {
            density: {
              enable: true,
              area: 1000,
            },
            value: 80,
          },
          opacity: {
            value: isDark ? 0.3 : 0.5,
            animation: {
              enable: true,
              speed: 0.8,
              minimumValue: 0.1,
              sync: false,
            },
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 2 },
          },
        },
        interactivity: {
          detect_on: 'window',
          events: {
            onHover: {
              enable: true,
              mode: ['connect', 'bubble'],
              parallax: {
                enable: true,
                force: 60,
                smooth: 10,
              },
            },
          },
          modes: {
            connect: {
              distance: 180,
              links: {
                opacity: 0.5,
                color: isDark ? '#E5E7EB' : '#374151',
              },
              radius: 200,
            },
            bubble: {
              distance: 200,
              size: 4,
              duration: 0.4,
              opacity: 0.8,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        detectRetina: true,
        background: {
          color: 'transparent',
        },
      }}
      className="absolute inset-0 h-full w-full"
    />
  );
}
