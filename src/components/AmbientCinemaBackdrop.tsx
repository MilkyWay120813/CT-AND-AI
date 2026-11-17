import React from 'react';
import { MotionMode } from '../utils/soundscapeEngine';

interface AmbientCinemaBackdropProps {
  theme: 'light' | 'midnight-chalkboard';
  motionMode: MotionMode;
}

const MOTES = [
  { id: 1, left: '6%', size: 6, duration: '24s', delay: '-4s' },
  { id: 2, left: '14%', size: 4, duration: '19s', delay: '-11s' },
  { id: 3, left: '23%', size: 7, duration: '28s', delay: '-7s' },
  { id: 4, left: '34%', size: 5, duration: '22s', delay: '-15s' },
  { id: 5, left: '46%', size: 4, duration: '26s', delay: '-2s' },
  { id: 6, left: '58%', size: 6, duration: '21s', delay: '-9s' },
  { id: 7, left: '69%', size: 5, duration: '25s', delay: '-17s' },
  { id: 8, left: '78%', size: 7, duration: '23s', delay: '-6s' },
  { id: 9, left: '88%', size: 4, duration: '20s', delay: '-13s' },
  { id: 10, left: '94%', size: 6, duration: '27s', delay: '-8s' },
  { id: 11, left: '19%', size: 5, duration: '30s', delay: '-20s' },
  { id: 12, left: '83%', size: 5, duration: '29s', delay: '-16s' },
];

/**
 * AmbientCinemaBackdrop
 * Strictly layered behind all interactive UI cards (`fixed inset-0 z-0 pointer-events-none`).
 * Renders tasteful geometric forms, orbital astrolabe rings, subtle cinema light shafts,
 * and drifting dust/firefly motes—zero text boxes or foreground obstructions.
 */
export const AmbientCinemaBackdrop: React.FC<AmbientCinemaBackdropProps> = ({
  theme,
  motionMode,
}) => {
  const isDark = theme === 'midnight-chalkboard';
  const strokePrimary = isDark ? 'rgba(94, 234, 212, 0.22)' : 'rgba(15, 118, 110, 0.14)';
  const strokeAccent = isDark ? 'rgba(253, 224, 71, 0.2)' : 'rgba(217, 119, 6, 0.14)';
  const strokeSecondary = isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(2, 132, 199, 0.12)';

  return (
    <div
      aria-hidden="true"
      data-testid="ambient-cinema-backdrop"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Cinema Projector / Sunlit Classroom Atmospheric Light Shafts */}
      <div
        className={`absolute -top-32 -left-24 w-[520px] h-[680px] rounded-full ${
          motionMode === 'immersive' ? 'cinema-beam-sway' : ''
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top left, rgba(20, 184, 166, 0.18), transparent 68%)'
            : 'radial-gradient(ellipse at top left, rgba(251, 191, 36, 0.18), transparent 68%)',
        }}
      />

      <div
        className={`absolute -bottom-40 -right-24 w-[560px] h-[560px] rounded-full ${
          motionMode === 'immersive' ? 'cinema-beam-sway-reverse' : ''
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at bottom right, rgba(250, 204, 21, 0.10), transparent 70%)'
            : 'radial-gradient(ellipse at bottom right, rgba(20, 184, 166, 0.14), transparent 70%)',
        }}
      />

      {motionMode === 'immersive' && (
        <>
          {/* 2. Top-Right Slow Rotating Mathematical Astrolabe & Orbiting Satellites */}
          <svg
            viewBox="0 0 300 300"
            className="hidden md:block absolute -top-20 -right-20 w-[380px] h-[380px] cinema-orbit-slow opacity-70"
          >
            <circle
              cx="150"
              cy="150"
              r="128"
              fill="none"
              stroke={strokePrimary}
              strokeWidth="1.2"
              strokeDasharray="6 10"
            />
            <circle
              cx="150"
              cy="150"
              r="94"
              fill="none"
              stroke={strokeAccent}
              strokeWidth="1"
            />
            <polygon
              points="150,36 248,206 52,206"
              fill="none"
              stroke={strokeSecondary}
              strokeWidth="1"
            />
            <circle cx="150" cy="22" r="4" fill={isDark ? '#5EEAD4' : '#0F766E'} opacity="0.4" />
            <circle cx="244" cy="150" r="3" fill={isDark ? '#FDE047' : '#D97706'} opacity="0.45" />
          </svg>

          {/* 3. Bottom-Left Slow Counter-Rotating Polyhedral Ring */}
          <svg
            viewBox="0 0 260 260"
            className="hidden md:block absolute -bottom-24 -left-20 w-[340px] h-[340px] cinema-orbit-reverse opacity-70"
          >
            <circle
              cx="130"
              cy="130"
              r="108"
              fill="none"
              stroke={strokeAccent}
              strokeWidth="1.2"
              strokeDasharray="4 12"
            />
            <rect
              x="54"
              y="54"
              width="152"
              height="152"
              rx="10"
              fill="none"
              stroke={strokePrimary}
              strokeWidth="1"
              transform="rotate(22 130 130)"
            />
            <rect
              x="72"
              y="72"
              width="116"
              height="116"
              rx="8"
              fill="none"
              stroke={strokeSecondary}
              strokeWidth="1"
              transform="rotate(55 130 130)"
            />
          </svg>

          {/* 4. Moving Geometric Wireframe Objects (Strictly Background Margins) */}
          {/* Wireframe 3D Isometric Cube */}
          <svg
            viewBox="0 0 120 120"
            className="hidden lg:block absolute top-[22%] left-[2.5%] w-20 h-20 cinema-object-drift-a"
          >
            <polygon
              points="60,14 102,38 102,84 60,108 18,84 18,38"
              fill={isDark ? 'rgba(45, 212, 191, 0.05)' : 'rgba(15, 118, 110, 0.04)'}
              stroke={strokePrimary}
              strokeWidth="1.6"
            />
            <polyline
              points="18,38 60,62 102,38"
              fill="none"
              stroke={strokePrimary}
              strokeWidth="1.3"
            />
            <line x1="60" y1="62" x2="60" y2="108" stroke={strokePrimary} strokeWidth="1.3" />
          </svg>

          {/* Golden Octahedron / Diamond */}
          <svg
            viewBox="0 0 120 120"
            className="hidden lg:block absolute top-[58%] right-[2.5%] w-24 h-24 cinema-object-drift-b"
          >
            <polygon
              points="60,10 105,60 60,110 15,60"
              fill={isDark ? 'rgba(253, 224, 71, 0.05)' : 'rgba(217, 119, 6, 0.04)'}
              stroke={strokeAccent}
              strokeWidth="1.5"
            />
            <polygon
              points="60,10 80,60 60,110 40,60"
              fill="none"
              stroke={strokeAccent}
              strokeWidth="1.1"
            />
            <line x1="15" y1="60" x2="105" y2="60" stroke={strokeAccent} strokeWidth="1.1" />
          </svg>

          {/* Floating Golden Spiral Arc */}
          <svg
            viewBox="0 0 120 120"
            className="hidden xl:block absolute top-[18%] right-[3%] w-20 h-20 cinema-object-drift-c"
          >
            <path
              d="M60,60 m0,-4 a4,4 0 1,1 4,4 a8,8 0 1,1 -8,-8 a14,14 0 1,1 14,14 a22,22 0 1,1 -22,-22 a32,32 0 1,1 32,32"
              fill="none"
              stroke={strokeSecondary}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Floating Compass / Star Polygon */}
          <svg
            viewBox="0 0 100 100"
            className="hidden xl:block absolute bottom-[22%] left-[3%] w-16 h-16 cinema-object-drift-b"
          >
            <polygon
              points="50,8 60,38 92,50 60,62 50,92 40,62 8,50 40,38"
              fill={isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(2, 132, 199, 0.04)'}
              stroke={strokeSecondary}
              strokeWidth="1.4"
            />
          </svg>

          {/* 5. Gentle Luminous Projector Dust / Firefly Motes */}
          {MOTES.map((mote, i) => (
            <span
              key={mote.id}
              className="absolute bottom-0 rounded-full cinema-mote-rise"
              style={{
                left: mote.left,
                width: `${mote.size}px`,
                height: `${mote.size}px`,
                animationDuration: mote.duration,
                animationDelay: mote.delay,
                background: isDark
                  ? i % 3 === 0
                    ? 'radial-gradient(circle, rgba(253,224,71,0.85), rgba(253,224,71,0) 70%)'
                    : 'radial-gradient(circle, rgba(94,234,212,0.75), rgba(94,234,212,0) 70%)'
                  : i % 2 === 0
                  ? 'radial-gradient(circle, rgba(245,158,11,0.42), rgba(245,158,11,0) 70%)'
                  : 'radial-gradient(circle, rgba(13,148,136,0.34), rgba(13,148,136,0) 70%)',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
