import { create } from "zustand";
import { Portfolio, Holding, Trade } from "@/types/portfolio";

interface PortfolioState extends Portfolio {
  // Actions
  buyCoin: (symbol: string, amount: number, price: number) => void;
  sellCoin: (symbol: string, amount: number, price: number) => void;
  getTotalAsset: (currentPrices: Record<string, number>) => number;
  getProfitRate: (currentPrices: Record<string, number>) => number;
  reset: () => void;
}

const INITIAL_CASH = 10_000_000; // 1,000만원

const initialState: Portfolio = {
  cash: INITIAL_CASH,
  initialCash: INITIAL_CASH,
  holdings: [],
  trades: [],
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
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
      const existingHolding = state.holdings.find((h) => h.symbol === symbol);

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
        newHoldings = [...state.holdings, { symbol, amount, avgPrice: price }];
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

  // 매도
  sellCoin: (symbol: string, amount: number, price: number) => {
    const holding = get().holdings.find((h) => h.symbol === symbol);

    if (!holding || holding.amount < amount) {
      alert("보유 수량이 부족합니다!");
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
      };

      return {
        cash: state.cash + total,
        holdings: newHoldings,
        trades: [newTrade, ...state.trades],
      };
    });
  },

  // 총 자산 계산
  getTotalAsset: (currentPrices: Record<string, number>) => {
    const { cash, holdings } = get();
    const coinValue = holdings.reduce((sum, holding) => {
      const currentPrice = currentPrices[holding.symbol] || 0;
      return sum + holding.amount * currentPrice;
    }, 0);
    return cash + coinValue;
  },

  // 수익률 계산
  getProfitRate: (currentPrices: Record<string, number>) => {
    const { initialCash } = get();
    const totalAsset = get().getTotalAsset(currentPrices);
    return ((totalAsset - initialCash) / initialCash) * 100;
  },

  // 초기화
  reset: () => set(initialState),
}));
