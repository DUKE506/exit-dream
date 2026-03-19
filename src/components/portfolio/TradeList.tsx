// src/components/portfolio/TradeList.tsx

"use client";

import { Trade } from "@/types/portfolio";
import { Coin } from "@/types/coin";
import { TradeItem } from "./TradeItem";

interface TradeListProps {
  trades: Trade[];
  coins: Coin[];
}

export function TradeList({ trades, coins }: TradeListProps) {
  return (
    <div className="space-y-2">
      {trades.map((trade) => {
        const coin = coins.find((c) => c.market === trade.symbol);

        return <TradeItem key={trade.id} trade={trade} coin={coin} />;
      })}
    </div>
  );
}
