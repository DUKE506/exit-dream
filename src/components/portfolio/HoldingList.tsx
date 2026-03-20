// src/components/portfolio/HoldingList.tsx

"use client";

import { useState } from "react";
import { Holding } from "@/types/portfolio";
import { Coin } from "@/types/coin";
import { HoldingItem } from "./HoldingItem";
import { SellModal } from "./SellModal";
import { TPSLModal } from "./TPSLModal";

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
  const [selectedSymbolForSell, setSelectedSymbolForSell] = useState<
    string | null
  >(null);
  const [selectedSymbolForTPSL, setSelectedSymbolForTPSL] = useState<
    string | null
  >(null);

  const handleSellClick = (symbol: string) => {
    setSelectedSymbolForSell(symbol);
  };
  const handleTPSLClick = (symbol: string) => {
    setSelectedSymbolForTPSL(symbol);
  };

  const handleCloseSellModal = () => {
    setSelectedSymbolForSell(null);
  };
  const handleCloseTPSLModal = () => {
    setSelectedSymbolForTPSL(null);
  };

  const selectedHoldingForSell = holdings.find(
    (h) => h.symbol === selectedSymbolForSell,
  );
  const selectedCoinForSell = coins.find(
    (c) => c.market === selectedSymbolForSell,
  );

  const selectedHoldingForTPSL = holdings.find(
    (h) => h.symbol === selectedSymbolForTPSL,
  );
  const selectedCoinForTPSL = coins.find(
    (c) => c.market === selectedSymbolForTPSL,
  );

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
              onTPSLClick={handleTPSLClick}
            />
          );
        })}
      </div>

      {/* 매도 모달 */}
      {selectedSymbolForSell &&
        selectedHoldingForSell &&
        selectedCoinForSell && (
          <SellModal
            holding={selectedHoldingForSell}
            coin={selectedCoinForSell}
            currentPrice={prices[selectedSymbolForSell]?.price || 0}
            onClose={handleCloseSellModal}
          />
        )}

      {/* TP/SL 모달 */}
      {selectedSymbolForTPSL &&
        selectedHoldingForTPSL &&
        selectedCoinForTPSL && (
          <TPSLModal
            holding={selectedHoldingForTPSL}
            coin={selectedCoinForTPSL}
            currentPrice={prices[selectedSymbolForTPSL]?.price || 0}
            onClose={handleCloseTPSLModal}
          />
        )}
    </>
  );
}
