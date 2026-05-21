import { HeroDepthEffects } from "@/components/HeroDepthEffects";
import { ParticleField } from "@/components/ParticleField";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function FeatureIcon({ children }) {
  return <span className="feature-icon">{children}</span>;
}

export function Hero() {
  return (
    <section className="hero-section" id="trading" aria-labelledby="hero-title">
      <ParticleField />
      <HeroDepthEffects />
      <div className="hero-copy">
        <h1 id="hero-title">
          Trade Smarter.
          <br />
          Trade Vertex.
        </h1>
        <p>
          Professional trading conditions, institutional-grade technology, and deep liquidity across global markets.
        </p>

        <div className="hero-actions">
          <a className="btn btn-primary hero-cta" href="#get-started">
            <span>Get Started</span>
            <ArrowIcon />
          </a>
          <a className="btn btn-outline" href="#platforms">
            Try Demo Account
          </a>
        </div>

        <ul className="feature-strip" aria-label="Trading benefits">
          <li>
            <FeatureIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
                <circle cx="12" cy="12" r="6" />
                <path d="m9.9 14.1 4.2-4.2M9.6 9.6h.01M14.4 14.4h.01" />
              </svg>
            </FeatureIcon>
            <strong>Tight Spreads</strong>
            <small>From 0.0 pips</small>
          </li>
          <li>
            <FeatureIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 7v5l3.5 2" />
                <path d="M6.4 5.2 4.7 3.5M17.6 5.2l1.7-1.7" />
              </svg>
            </FeatureIcon>
            <strong>Fast Execution</strong>
            <small>&lt; 30ms Average</small>
          </li>
          <li>
            <FeatureIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 8.5 12 4 4 8.5l8 4.5 8-4.5Z" />
                <path d="M4 8.5v7L12 20l8-4.5v-7" />
                <path d="M12 13v7" />
              </svg>
            </FeatureIcon>
            <strong>Secure &amp; Regulated</strong>
            <small>Global Compliance</small>
          </li>
          <li>
            <FeatureIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 13a8 8 0 0 1 16 0" />
                <path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Zm16 0v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
                <path d="M14 20h-4" />
              </svg>
            </FeatureIcon>
            <strong>24/7 Support</strong>
            <small>Real Traders</small>
          </li>
        </ul>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <img
          src="/assets/hero-bull-panel.jpg"
          alt=""
          width="620"
          height="410"
          fetchPriority="high"
          style={{ animation: "bullRotate 8s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
