import { AnimatedCandles } from "@/components/AnimatedCandles";

const markets = [
  {
    symbol: "EURUSD",
    value: "1.08945",
    change: "+0.47%",
    points: "0,28 7,24 13,31 19,20 25,26 32,18 39,24 45,15 52,20 59,17 66,23 73,18 80,26 87,21 94,24 101,19 109,15 118,6"
  },
  {
    symbol: "GBPUSD",
    value: "1.27482",
    change: "+0.35%",
    points: "0,29 8,26 16,30 24,23 32,25 40,21 48,25 56,19 64,22 72,18 80,24 88,17 96,21 104,11 112,17 118,4"
  },
  {
    symbol: "XAUUSD",
    value: "2,384.65",
    change: "+0.62%",
    points: "0,25 8,21 16,23 24,18 32,16 40,19 48,15 56,18 64,12 72,16 80,14 88,20 96,17 104,13 112,15 118,9"
  },
  {
    symbol: "USDJPY",
    value: "156.743",
    change: "-0.21%",
    neutral: true,
    points: "0,12 8,18 16,14 24,22 32,17 40,24 48,21 56,27 64,20 72,26 80,23 88,29 96,26 104,21 112,18 118,15"
  },
  {
    symbol: "BTCUSD",
    value: "67,842.10",
    change: "+1.08%",
    points: "0,30 8,26 16,28 24,22 32,25 40,18 48,21 56,14 64,17 72,12 80,16 88,9 96,13 104,8 112,10 118,4"
  },
  {
    symbol: "USOIL",
    value: "78.245",
    change: "-0.15%",
    neutral: true,
    points: "0,26 8,22 16,27 24,20 32,24 40,18 48,21 56,16 64,18 72,13 80,17 88,15 96,12 104,14 112,10 118,8"
  }
];

export function MarketStrip() {
  return (
    <section className="market-strip" id="markets" aria-label="Market prices">
      {markets.map((market) => (
        <article className={market.neutral ? "neutral" : undefined} key={market.symbol}>
          <div>
            <strong>{market.symbol}</strong>
            <span>{market.value}</span>
          </div>
          <em>{market.change}</em>
          <AnimatedCandles points={market.points} neutral={market.neutral} />
        </article>
      ))}
    </section>
  );
}
