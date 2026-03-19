// src/components/portfolio/HoldingList.tsx

"use client";

import { useState } from "react";
import { Holding } from "@/types/portfolio";
import { Coin } from "@/types/coin";
import { HoldingItem } from "./HoldingItem";
import { SellModal } from "./SellModal";

interface HoldingListProps {
  holdings: Holding[];
  coins: Coin[];
  prices: Record<
    string,
    {
      price: number;
      changeRate: number;
      changePrice: number;
    }
  >;
}

export function HoldingList({ holdings, coins, prices }: HoldingListProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const handleSellClick = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const handleCloseModal = () => {
    setSelectedSymbol(null);
  };

  const selectedHolding = holdings.find((h) => h.symbol === selectedSymbol);
  const selectedCoin = coins.find((c) => c.market === selectedSymbol);

  return (
    <>
      <div className="space-y-3">
        {holdings.map((holding) => {
          const coin = coins.find((c) => c.market === holding.symbol);
          const currentPrice = prices[holding.symbol]?.price || 0;

          return (
            <HoldingItem
              key={holding.symbol}
              holding={holding}
              coin={coin}
              currentPrice={currentPrice}
              onSellClick={handleSellClick}
            />
          );
        })}
      </div>

      {/* 매도 모달 */}
      {selectedSymbol && selectedHolding && selectedCoin && (
        <SellModal
          holding={selectedHolding}
          coin={selectedCoin}
          currentPrice={prices[selectedSymbol]?.price || 0}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
