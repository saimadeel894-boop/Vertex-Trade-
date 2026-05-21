"use client";

import { useEffect } from "react";

export function HeroDepthEffects() {
  useEffect(() => {
    const hero = document.querySelector(".hero-section");
    const visual = document.querySelector(".hero-visual");
    const background = document.querySelector(".particle-field");
    const chips = Array.from(document.querySelectorAll(".feature-strip li"));

    if (!hero || !visual) return;

    let rafId = 0;

    const update = () => {
      rafId = 0;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);

      visual.style.setProperty("--scroll-depth-y", `${progress * -22}px`);
      background?.style.setProperty("--scroll-depth-y", `${progress * -8}px`);
      chips.forEach((chip, index) => {
        chip.style.setProperty("--chip-depth-y", `${progress * (index % 2 === 0 ? -5 : -9)}px`);
      });
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      visual.style.removeProperty("--scroll-depth-y");
      background?.style.removeProperty("--scroll-depth-y");
      chips.forEach((chip) => chip.style.removeProperty("--chip-depth-y"));
    };
  }, []);

  return null;
}
