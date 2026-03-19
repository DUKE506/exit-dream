// src/components/coin/CoinList.tsx

"use client";

import { Coin } from "@/types/coin";
import { CoinListItem } from "./CoinListItem";

interface CoinListProps {
  coins: Coin[];
  prices: Record<
    string,
    { price: number; changeRate: number; changePrice: number }
  >;
  onBuyClick: (symbol: string) => void;
  onDetailClick: (symbol: string) => void; // ← 추가
}

export function CoinList({
  coins,
  prices,
  onBuyClick,
  onDetailClick,
}: CoinListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-white mb-4">실시간 시세</h2>

      {coins.map((coin) => (
        <CoinListItem
          key={coin.market}
          coin={coin}
          price={prices[coin.market]}
          onBuyClick={onBuyClick}
          onDetailClick={onDetailClick} // ← 추가
        />
      ))}
    </div>
  );
}
