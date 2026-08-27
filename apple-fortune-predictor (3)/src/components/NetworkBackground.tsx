import React, { useEffect, useRef } from 'react';

export const NetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number;
    let h: number;
    let points: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let raf: number;

    const DENSITY = 64; // px grid step
    const MAX_DIST = 140; // link distance
    const SPEED = 0.22; // movement speed
    const NODESZ = 1.6; // node radius

    function rand(n: number) {
      return (Math.random() * 2 - 1) * n;
    }

    function init() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      points = [];
      for (let x = -MAX_DIST; x < w + MAX_DIST; x += DENSITY) {
        for (let y = -MAX_DIST; y < h + MAX_DIST; y += DENSITY) {
          points.push({
            x: x + rand(14),
            y: y + rand(14),
            vx: rand(SPEED),
            vy: rand(SPEED),
          });
        }
      }
    }

    function step() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'screen';

      // links
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_DIST * MAX_DIST) {
            const a = 1 - Math.sqrt(d2) / MAX_DIST;
            ctx.strokeStyle = `rgba(139, 92, 246, ${a * 0.45})`;
            ctx.lineWidth = Math.max(0.5, a * 1.2);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      ctx.fillStyle = 'rgba(216, 180, 254, 0.95)';
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, NODESZ, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -MAX_DIST || p.x > w + MAX_DIST) p.vx *= -1;
        if (p.y < -MAX_DIST || p.y > h + MAX_DIST) p.vy *= -1;
      }

      raf = requestAnimationFrame(step);
    }

    function onResize() {
      cancelAnimationFrame(raf);
      init();
      step();
    }

    init();
    step();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="net-canvas"
      aria-hidden="true"
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none transition-opacity duration-1000 opacity-90"
      style={{ background: '#07050d' }}
    />
  );
};
