"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatedChart } from "@/components/AnimatedChart";

const chipSeed = [
  { symbol: "BTCUSD", base: 67842, decimals: 0, change: "+1.08%", className: "chip-btc" },
  { symbol: "EURUSD", base: 1.0842, decimals: 4, change: "+0.47%", className: "chip-eur" },
  { symbol: "XAUUSD", base: 2384, decimals: 0, change: "+0.62%", className: "chip-xau" }
];

function formatPrice(value: number, decimals: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function AuthBackground() {
  const [tick, setTick] = useState(0);
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        left: `${(index * 17) % 96}%`,
        delay: `${(index % 8) * -0.7}s`,
        duration: `${7 + (index % 6)}s`,
        size: `${2 + (index % 3)}px`
      })),
    []
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => setTick((value) => value + 1), 2000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <aside className="auth-visual-panel" aria-hidden="true">
      <div className="auth-visual-grid" />
      <div className="auth-chart-layer">
        <AnimatedChart />
      </div>
      <div className="auth-glow auth-glow-blue" />
      <div className="auth-glow auth-glow-green" />

      <div className="auth-price-chips">
        {chipSeed.map((chip, index) => {
          const drift = Math.sin((tick + index) * 0.8) * (chip.decimals ? 0.0012 : 140);
          return (
            <div className={`auth-price-chip ${chip.className}`} key={chip.symbol}>
              <strong>{chip.symbol}</strong>
              <span>{formatPrice(chip.base + drift, chip.decimals)}</span>
              <em>{chip.change}</em>
            </div>
          );
        })}
      </div>

      <div className="auth-particles">
        {particles.map((particle, index) => (
          <span
            key={index}
            style={{
              "--particle-left": particle.left,
              "--particle-delay": particle.delay,
              "--particle-duration": particle.duration,
              "--particle-size": particle.size
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="auth-visual-brand">
        <div>VUNEX</div>
        <span>MARKETS</span>
        <p>Institutional-grade trading technology</p>
      </div>

      <div className="auth-edge-fade" />
    </aside>
  );
}
