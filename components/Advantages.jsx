import { CardTilt } from "@/components/CardTilt";

const advantages = [
  {
    image: "/assets/adv-liquidity.jpg",
    title: (
      <>
        Institutional-Grade
        <br />
        Liquidity
      </>
    ),
    copy: "Deep liquidity from Tier-1 providers ensuring minimal slippage and maximum stability."
  },
  {
    image: "/assets/adv-execution.jpg",
    title: (
      <>
        Ultra-Fast
        <br />
        Execution
      </>
    ),
    copy: "Average execution speed under 30ms with no dealing desk interference."
  },
  {
    image: "/assets/adv-security.jpg",
    title: (
      <>
        Security You
        <br />
        Can Trust
      </>
    ),
    copy: "Segregated client funds, advanced encryption, and global regulatory oversight."
  },
  {
    image: "/assets/adv-conditions.jpg",
    title: (
      <>
        Professional
        <br />
        Trading Conditions
      </>
    ),
    copy: "Raw spreads, flexible leverage, and low commissions built for serious performance."
  }
];

export function Advantages() {
  return (
    <section className="advantages-section" id="advantages" aria-labelledby="advantages-title">
      <CardTilt />
      <h2 id="advantages-title">
        Advantages Built for <strong>Serious Traders</strong>
      </h2>

      <div className="advantage-grid">
        {advantages.map((advantage) => (
          <article
            className="advantage-card adv-card"
            data-tilt
            data-tilt-max="8"
            data-tilt-speed="400"
            data-tilt-glare="true"
            data-tilt-max-glare="0.1"
            data-tilt-perspective="1000"
            key={advantage.image}
          >
            <img src={advantage.image} alt="" width="171" height="126" loading="lazy" />
            <h3>{advantage.title}</h3>
            <p>{advantage.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
