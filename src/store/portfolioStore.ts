// src/store/portfolioStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Portfolio, Holding, Trade } from "@/types/portfolio";

interface PriceInfo {
  price: number;
  changeRate: number;
  changePrice: number;
}

interface PortfolioState extends Portfolio {
  // Actions
  buyCoin: (symbol: string, amount: number, price: number) => void;
  sellCoin: (
    symbol: string,
    amount: number,
    price: number,
    autoSell?: boolean,
    autoSellType?: "TP" | "SL",
  ) => void;

  // TP/SL 설정 추가
  setTPSL: (symbol: string, takeProfit?: number, stopLoss?: number) => void;

  // TP/SL 체크 추가
  checkTPSL: (currentPrices: Record<string, number | PriceInfo>) => void;

  getTotalAsset: (currentPrices: Record<string, number | PriceInfo>) => number;
  getProfitRate: (currentPrices: Record<string, number | PriceInfo>) => number;
  reset: () => void;
}

const INITIAL_CASH = 10_000_000; // 1,000만원

const initialState: Portfolio = {
  cash: INITIAL_CASH,
  initialCash: INITIAL_CASH,
  holdings: [],
  trades: [],
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 매수
      buyCoin: (symbol: string, amount: number, price: number) => {
        const total = amount * price;
        const currentCash = get().cash;

        if (currentCash < total) {
          alert("잔액이 부족합니다!");
          return;
        }

        set((state) => {
          const existingHolding = state.holdings.find(
            (h) => h.symbol === symbol,
          );

          let newHoldings: Holding[];

          if (existingHolding) {
            const totalAmount = existingHolding.amount + amount;
            const totalValue =
              existingHolding.avgPrice * existingHolding.amount + total;
            const newAvgPrice = totalValue / totalAmount;

            newHoldings = state.holdings.map((h) =>
              h.symbol === symbol
                ? { ...h, amount: totalAmount, avgPrice: newAvgPrice }
                : h,
            );
          } else {
            newHoldings = [
              ...state.holdings,
              { symbol, amount, avgPrice: price },
            ];
          }

          const newTrade: Trade = {
            id: Date.now().toString(),
            symbol,
            type: "BUY",
            amount,
            price,
            total,
            timestamp: Date.now(),
          };

          return {
            cash: currentCash - total,
            holdings: newHoldings,
            trades: [newTrade, ...state.trades],
          };
        });
      },

      // sellCoin 함수 수정 (autoSell 파라미터 추가)
      sellCoin: (
        symbol: string,
        amount: number,
        price: number,
        autoSell = false,
        autoSellType?: "TP" | "SL",
      ) => {
        const holding = get().holdings.find((h) => h.symbol === symbol);

        if (!holding || holding.amount < amount) {
          if (!autoSell) {
            alert("보유 수량이 부족합니다!");
          }
          return;
        }

        const total = amount * price;

        set((state) => {
          const newHoldings = state.holdings
            .map((h) =>
              h.symbol === symbol ? { ...h, amount: h.amount - amount } : h,
            )
            .filter((h) => h.amount > 0);

          const newTrade: Trade = {
            id: Date.now().toString(),
            symbol,
            type: "SELL",
            amount,
            price,
            total,
            timestamp: Date.now(),
            autoSell,
            autoSellType,
          };

          return {
            cash: state.cash + total,
            holdings: newHoldings,
            trades: [newTrade, ...state.trades],
          };
        });
      },

      // TP/SL 설정
      setTPSL: (symbol: string, takeProfit?: number, stopLoss?: number) => {
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.symbol === symbol ? { ...h, takeProfit, stopLoss } : h,
          ),
        }));
      },

      // TP/SL 체크 및 자동 매도
      checkTPSL: (currentPrices: Record<string, number | PriceInfo>) => {
        const { holdings, sellCoin } = get();

        holdings.forEach((holding) => {
          const priceData = currentPrices[holding.symbol];
          const currentPrice =
            typeof priceData === "number" ? priceData : priceData?.price || 0;

          if (currentPrice === 0) return;

          // Take Profit 체크
          if (holding.takeProfit && currentPrice >= holding.takeProfit) {
            console.log(`🎯 TP 도달: ${holding.symbol} - ${currentPrice}원`);
            sellCoin(holding.symbol, holding.amount, currentPrice, true, "TP");
            return;
          }

          // Stop Loss 체크
          if (holding.stopLoss && currentPrice <= holding.stopLoss) {
            console.log(`🛑 SL 도달: ${holding.symbol} - ${currentPrice}원`);
            sellCoin(holding.symbol, holding.amount, currentPrice, true, "SL");
            return;
          }
        });
      },

      // 총 자산 계산
      getTotalAsset: (currentPrices: Record<string, number | PriceInfo>) => {
        const { cash, holdings } = get();
        const coinValue = holdings.reduce((sum, holding) => {
          const priceData = currentPrices[holding.symbol];
          const currentPrice =
            typeof priceData === "number" ? priceData : priceData?.price || 0;
          return sum + holding.amount * currentPrice;
        }, 0);
        return cash + coinValue;
      },

      // 수익률 계산
      getProfitRate: (currentPrices: Record<string, number | PriceInfo>) => {
        const { initialCash } = get();
        const totalAsset = get().getTotalAsset(currentPrices);
        return ((totalAsset - initialCash) / initialCash) * 100;
      },

      // 초기화
      reset: () => set(initialState),
    }),
    {
      name: "exit-portfolio-storage", // LocalStorage 키 이름
    },
  ),
);
