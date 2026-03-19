// src/components/common/AssetSummary.tsx

"use client";

import { usePortfolioStore } from "@/store/portfolioStore";
import { formatKoreanNumber } from "@/lib/upbit";

interface AssetSummaryProps {
  currentPrices: Record<
    string,
    {
      price: number;
      changeRate: number;
      changePrice: number;
    }
  >;
}

export function AssetSummary({ currentPrices }: AssetSummaryProps) {
  const { cash, getTotalAsset, getProfitRate } = usePortfolioStore();

  const totalAsset = getTotalAsset(currentPrices);
  const profitRate = getProfitRate(currentPrices);
  const profitAmount = totalAsset - 10_000_000; // 초기자금 1000만원

  const isProfit = profitRate >= 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 총 자산 */}
        <div>
          <p className="text-gray-400 text-sm mb-1">총 자산</p>
          <p className="text-3xl font-bold text-white">
            {formatKoreanNumber(totalAsset)}원
          </p>
        </div>

        {/* 보유 현금 */}
        <div>
          <p className="text-gray-400 text-sm mb-1">보유 현금</p>
          <p className="text-2xl font-semibold text-gray-300">
            {formatKoreanNumber(cash)}원
          </p>
        </div>

        {/* 수익률 */}
        <div>
          <p className="text-gray-400 text-sm mb-1">총 수익률</p>
          <div className="flex items-baseline gap-2">
            <p
              className={`text-3xl font-bold ${
                isProfit ? "text-red-500" : "text-blue-500"
              }`}
            >
              {isProfit ? "+" : ""}
              {profitRate.toFixed(2)}%
            </p>
            <p
              className={`text-lg ${
                isProfit ? "text-red-400" : "text-blue-400"
              }`}
            >
              ({isProfit ? "+" : ""}
              {formatKoreanNumber(profitAmount)}원)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
