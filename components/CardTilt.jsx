"use client";

import { useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

export function CardTilt() {
  useEffect(() => {
    let frameId = 0;
    let tiltInstances = [];

    const initFallbackTilt = (card) => {
      const onMove = (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
      };
      const onLeave = () => {
        card.style.transform = "";
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      card.vanillaTilt = {
        destroy() {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
          card.style.transform = "";
        }
      };
    };

    frameId = window.requestAnimationFrame(() => {
      tiltInstances = Array.from(document.querySelectorAll(".adv-card"));
      const tilt = VanillaTilt?.default ?? VanillaTilt;

      if (tilt?.init) {
        tilt.init(tiltInstances, {});
      }

      tiltInstances.forEach((card) => {
        if (!card.vanillaTilt) {
          initFallbackTilt(card);
        }
        card.setAttribute("data-tilt-ready", "true");
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      tiltInstances.forEach((card) => card.vanillaTilt?.destroy());
    };
  }, []);

  return null;
}
