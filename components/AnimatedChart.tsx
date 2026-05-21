"use client";

import { useEffect, useRef } from "react";

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

function createCandle(previous = 67842): Candle {
  const direction = Math.random() > 0.45 ? 1 : -1;
  const close = Math.max(64000, previous + direction * (90 + Math.random() * 260));
  return {
    open: previous,
    close,
    high: Math.max(previous, close) + 80 + Math.random() * 180,
    low: Math.min(previous, close) - 80 - Math.random() * 180,
    volume: 0.28 + Math.random() * 0.64
  };
}

function seedCandles() {
  const candles: Candle[] = [];
  let close = 67480;
  for (let index = 0; index < 20; index += 1) {
    const candle = createCandle(close);
    candles.push(candle);
    close = candle.close;
  }
  return candles;
}

export function AnimatedChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let candles = seedCandles();
    let nextCandleAt = performance.now() + 2000;
    let animationStart = performance.now();
    let rafId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now: number) => {
      rafId = window.requestAnimationFrame(draw);

      if (now >= nextCandleAt) {
        candles = [...candles.slice(1), createCandle(candles[candles.length - 1].close)];
        animationStart = now;
        nextCandleAt = now + 2000;
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const progress = Math.min(1, (now - animationStart) / 650);
      const eased = 1 - Math.pow(1 - progress, 3);
      const chartTop = height * 0.12;
      const chartBottom = height * 0.78;
      const volumeTop = height * 0.82;
      const volumeBottom = height * 0.95;
      const min = Math.min(...candles.map((candle) => candle.low));
      const max = Math.max(...candles.map((candle) => candle.high));
      const range = Math.max(1, max - min);
      const step = width / 20;
      const candleWidth = Math.max(5, step * 0.48);
      const offset = -step * (1 - eased);

      context.clearRect(0, 0, width, height);

      context.strokeStyle = "rgba(255,255,255,0.055)";
      context.lineWidth = 1;
      for (let x = 0; x < width; x += 60) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const yFor = (value: number) => chartBottom - ((value - min) / range) * (chartBottom - chartTop);

      candles.forEach((candle, index) => {
        const x = index * step + step * 0.5 + offset;
        const openY = yFor(candle.open);
        const closeY = yFor(candle.close);
        const highY = yFor(candle.high);
        const lowY = yFor(candle.low);
        const up = candle.close >= candle.open;
        const color = up ? "#22c55e" : "#ef4444";
        const volumeHeight = (volumeBottom - volumeTop) * candle.volume;

        context.strokeStyle = color;
        context.globalAlpha = 1;
        context.beginPath();
        context.moveTo(x, highY);
        context.lineTo(x, lowY);
        context.stroke();

        context.fillStyle = color;
        context.globalAlpha = 0.92;
        context.fillRect(
          x - candleWidth / 2,
          Math.min(openY, closeY),
          candleWidth,
          Math.max(2, Math.abs(closeY - openY))
        );

        context.globalAlpha = 0.26;
        context.fillRect(x - candleWidth / 2, volumeBottom - volumeHeight, candleWidth, volumeHeight);
      });

      context.globalAlpha = 1;
      context.strokeStyle = "#2563eb";
      context.lineWidth = 2;
      context.beginPath();
      candles.forEach((_, index) => {
        const slice = candles.slice(Math.max(0, index - 4), index + 1);
        const average = slice.reduce((sum, candle) => sum + candle.close, 0) / slice.length;
        const x = index * step + step * 0.5 + offset;
        const y = yFor(average);
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.stroke();
      context.globalAlpha = 1;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    rafId = window.requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="auth-chart" aria-hidden="true" />;
}
