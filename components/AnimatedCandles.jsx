"use client";

import { useEffect, useRef } from "react";

function parsePoints(points) {
  return points.split(" ").map((point) => {
    const [x, y] = point.split(",").map(Number);
    return { x, y };
  });
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

export function AnimatedCandles({ points, neutral = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const basePoints = parsePoints(points);
    let candles = basePoints.map((point, index) => ({
      x: point.x,
      open: point.y + (index % 2 === 0 ? 4 : -3),
      close: point.y,
      high: point.y - 6,
      low: point.y + 7,
      born: index * 70,
      live: true
    }));

    let start = performance.now();
    let lastCandleAt = start;
    let rafId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(Math.floor(rect.width * ratio), 1);
      canvas.height = Math.max(Math.floor(rect.height * ratio), 1);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const addCandle = (now) => {
      const previous = candles[candles.length - 1];
      const drift = (Math.random() - 0.42) * 8;
      const close = Math.max(5, Math.min(33, previous.close + drift));
      candles = [
        ...candles.slice(-15).map((candle, index) => ({ ...candle, x: index * 7.8 })),
        {
          x: 118,
          open: previous.close,
          close,
          high: Math.min(previous.close, close) - 5,
          low: Math.max(previous.close, close) + 6,
          born: now - start,
          live: false
        }
      ];
    };

    const draw = (now) => {
      rafId = window.requestAnimationFrame(draw);

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const elapsed = now - start;
      if (now - lastCandleAt > 2000) {
        lastCandleAt = now;
        addCandle(now);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.15;
      ctx.lineCap = "round";
      const scaleX = width / 118;
      const scaleY = height / 38;

      candles.forEach((candle, index) => {
        const intro = candle.live ? Math.min(1, elapsed / 1100) : Math.min(1, (elapsed - candle.born) / 520);
        const alpha = easeOutCubic(Math.max(0, Math.min(1, intro - index * 0.025)));
        if (alpha <= 0) return;

        const x = candle.x * scaleX;
        const open = candle.open * scaleY;
        const close = (candle.open + (candle.close - candle.open) * easeOutCubic(alpha)) * scaleY;
        const up = close <= open;
        const color = neutral ? "rgba(226, 226, 226," : up ? "rgba(64, 217, 132," : "rgba(255, 82, 82,";
        const wick = neutral ? "rgba(255, 255, 255," : color;

        ctx.strokeStyle = `${wick} ${0.34 + alpha * 0.34})`;
        ctx.beginPath();
        ctx.moveTo(x, candle.high * scaleY);
        ctx.lineTo(x, candle.low * scaleY);
        ctx.stroke();

        ctx.strokeStyle = `${color} ${0.5 + alpha * 0.36})`;
        ctx.lineWidth = 2.3;
        ctx.beginPath();
        ctx.moveTo(x, open);
        ctx.lineTo(x, close);
        ctx.stroke();
        ctx.lineWidth = 1.15;
      });
    };

    resize();
    rafId = window.requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [neutral, points]);

  return <canvas ref={canvasRef} className="ticker-candles" aria-hidden="true" />;
}
