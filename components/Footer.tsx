function VertexFooterLogo() {
  return (
    <a className="site-footer-logo" href="#top" aria-label="Vertex Markets home">
      <svg className="site-footer-mark" viewBox="0 0 44 44" aria-hidden="true">
        <path d="M5 4 22 39 39 4l-8 4-9 18L13 8 5 4Z" />
        <path d="M15 4h7l-4 8-3-8Zm14 0h-7l4 8 3-8Z" />
      </svg>
      <span className="site-footer-brand-text">
        <span>VERTEX</span>
        <small>MARKETS</small>
      </span>
    </a>
  );
}

function PaymentIcon({ label, className }: { label: string; className: string }) {
  return (
    <span className={`payment-icon ${className}`} aria-label={label}>
      {label}
    </span>
  );
}

function SocialIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <a className="footer-social-link" href="#" aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}

const legalLinks = ["Privacy Policy", "Return Policy", "AML & KYC Policy", "Risk Disclosure"];
const companyLinks = ["About Us", "Careers", "Partners", "Contact Us"];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top-row">
        <div className="footer-brand-block">
          <VertexFooterLogo />
          <p>
            Professional trading conditions with cutting-edge technology.
            <br />
            Institutional-grade liquidity across global markets.
          </p>
        </div>

        <div className="footer-payments" aria-label="Supported payment methods">
          <span>Supported Payments</span>
          <div className="payment-icons">
            <PaymentIcon label="Visa" className="visa" />
            <PaymentIcon label="Mastercard" className="mastercard" />
            <PaymentIcon label="Skrill" className="skrill" />
            <PaymentIcon label="Neteller" className="neteller" />
          </div>
        </div>
      </div>

      <div className="footer-middle-row">
        <nav className="footer-link-column" aria-label="Legal links">
          <h2>Legal</h2>
          {legalLinks.map((link) => (
            <a href="#" key={link}>
              {link}
            </a>
          ))}
        </nav>

        <nav className="footer-link-column" aria-label="Company links">
          <h2>Company</h2>
          {companyLinks.map((link) => (
            <a href="#" key={link}>
              {link}
            </a>
          ))}
        </nav>

        <address className="footer-link-column footer-contact">
          <h2>Contact Us</h2>
          <a href="mailto:support@vertexmarkets.com">support@vertexmarkets.com</a>
          <a href="tel:+442090925000">+44 20 9092 5000</a>
          <span>(use placeholder — client will update)</span>
        </address>
      </div>

      <div className="footer-bottom-row">
        <div className="footer-socials">
          <SocialIcon label="Twitter/X">
            <path d="M4 4h4.7l3.9 5.3L17.2 4H20l-6.1 7 6.6 9h-4.7l-4.2-5.7L6.7 20H4l6.4-7.4L4 4Zm3.3 1.8 9.4 12.4h1.6L8.9 5.8H7.3Z" />
          </SocialIcon>
          <SocialIcon label="Facebook">
            <path d="M14 8.2V6.7c0-.7.2-1.1 1.2-1.1H17V2.3C16.1 2.2 15.2 2 14.3 2c-2.8 0-4.7 1.7-4.7 4.8v1.4H6.5V12h3.1v10H14V12h3.1l.5-3.8H14Z" />
          </SocialIcon>
          <SocialIcon label="Instagram">
            <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.2-2.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
          </SocialIcon>
          <SocialIcon label="LinkedIn">
            <path d="M5.4 8.8H2.2V22h3.2V8.8ZM3.8 2A1.9 1.9 0 1 0 3.8 5.8 1.9 1.9 0 0 0 3.8 2Zm6 6.8H6.7V22h3.1v-6.9c0-1.9.9-3.1 2.5-3.1 1.4 0 2.1 1 2.1 3.1V22h3.2v-7.5c0-4-2.1-5.9-4.9-5.9-1.7 0-2.8.9-3.3 1.8h-.1l.1-1.6Z" />
          </SocialIcon>
        </div>

        <p className="footer-disclaimer">
          Trading involves significant risk and is not suitable for all clients.
          <br />
          Please ensure you fully understand the risks involved and seek
          <br />
          independent advice. Vunex Markets only accepts clients who
          <br />
          understand and accept the risks involved.
        </p>

        <p className="footer-copyright">© 2026 Vertex Markets. All rights reserved.</p>
      </div>
    </footer>
  );
}
import type { ReactNode } from "react";
