import React, { useEffect, useRef } from 'react';

interface ChalkDustOverlayProps {
  triggerKey: string;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  swirlPhase: number;
  swirlSpeed: number;
}

const CHALK_COLORS = [
  '249, 248, 243', // White chalk
  '254, 240, 138', // Sunny yellow chalk
  '226, 232, 240', // Soft grey-white dust
  '209, 250, 229', // Faint greenboard chalk tint
];

export const ChalkDustOverlay: React.FC<ChalkDustOverlayProps> = ({
  triggerKey,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<DustParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  // Track last click position so chalk puffs both from the click spot and across the chalkboard header
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn a fresh puff of chalk dust particles when triggerKey changes
    const width = window.innerWidth;
    const height = window.innerHeight;
    const newParticles: DustParticle[] = [];

    // 1) Broad chalkboard wipe dust cloud across the upper chalkboard area
    const boardCloudCount = 68;
    for (let i = 0; i < boardCloudCount; i++) {
      const x = width * (0.12 + Math.random() * 0.76);
      const y = Math.min(height * 0.48, 70 + Math.random() * 290);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
      const speed = 0.6 + Math.random() * 2.8;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        radius: 1.8 + Math.random() * 4.8,
        alpha: 0.45 + Math.random() * 0.45,
        life: 0,
        maxLife: 42 + Math.random() * 38,
        color: CHALK_COLORS[Math.floor(Math.random() * CHALK_COLORS.length)],
        swirlPhase: Math.random() * Math.PI * 2,
        swirlSpeed: 0.04 + Math.random() * 0.06,
      });
    }

    // 2) Localized puff around where the student just clicked with their pencil
    if (lastMouseRef.current) {
      const { x: mx, y: my } = lastMouseRef.current;
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 3.4;
        newParticles.push({
          x: mx + (Math.random() - 0.5) * 24,
          y: my + (Math.random() - 0.5) * 24,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6,
          radius: 1.5 + Math.random() * 4.2,
          alpha: 0.55 + Math.random() * 0.4,
          life: 0,
          maxLife: 32 + Math.random() * 28,
          color: CHALK_COLORS[Math.floor(Math.random() * CHALK_COLORS.length)],
          swirlPhase: Math.random() * Math.PI * 2,
          swirlSpeed: 0.05 + Math.random() * 0.08,
        });
      }
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const remaining: DustParticle[] = [];
      for (const p of particlesRef.current) {
        p.life += 1;
        if (p.life >= p.maxLife) continue;

        p.swirlPhase += p.swirlSpeed;
        p.x += p.vx + Math.sin(p.swirlPhase) * 0.35;
        p.y += p.vy;
        // Gentle air drag + subtle downward chalk settling
        p.vx *= 0.97;
        p.vy = p.vy * 0.97 + 0.035;

        const progress = p.life / p.maxLife;
        const currentAlpha = p.alpha * (1 - progress * progress);
        const currentRadius = p.radius * (1 + progress * 0.65);

        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          currentRadius * 2.2
        );
        grad.addColorStop(0, `rgba(${p.color}, ${currentAlpha.toFixed(3)})`);
        grad.addColorStop(
          0.5,
          `rgba(${p.color}, ${(currentAlpha * 0.45).toFixed(3)})`
        );
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        remaining.push(p);
      }

      particlesRef.current = remaining;
      if (remaining.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
};
