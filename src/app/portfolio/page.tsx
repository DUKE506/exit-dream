// src/app/portfolio/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useUpbitWebSocket } from "@/hooks/useUpbitWebSocket";
import { getTopCoins } from "@/lib/upbit";
import { Coin } from "@/types/coin";
import { AssetSummary } from "@/components/common/AssetSummary";
import { HoldingList } from "@/components/portfolio/HoldingList";
import { Button } from "@/components/common/Button";

export default function PortfolioPage() {
  const router = useRouter();
  const { holdings, checkTPSL } = usePortfolioStore();
  const [coins, setCoins] = useState<Coin[]>([]);

  // 코인 목록 가져오기
  useEffect(() => {
    async function loadCoins() {
      const topCoins = await getTopCoins();
      setCoins(topCoins);
    }
    loadCoins();
  }, []);

  // WebSocket으로 실시간 가격 받기
  const symbols = coins.map((coin) => coin.market);
  const { prices, isConnected } = useUpbitWebSocket({ symbols });

  // TP/SL 자동 체크 (1초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(prices).length > 0) {
        checkTPSL(prices);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prices, checkTPSL]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                포트폴리오
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                보유 코인 및 수익률
              </p>
            </div>

            {/* 연결 상태 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                  isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              <span className="text-xs md:text-sm text-gray-400">
                {isConnected ? "실시간" : "연결 끊김"}
              </span>
            </div>
          </div>
        </header>

        {/* 자산 요약 */}
        <div className="mb-8">
          <AssetSummary currentPrices={prices} />
        </div>

        {/* 보유 코인 리스트 */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">보유 코인</h2>

          {holdings.length > 0 ? (
            <HoldingList holdings={holdings} coins={coins} prices={prices} />
          ) : (
            <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
              <p className="text-gray-400 text-lg mb-4">
                보유한 코인이 없습니다
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/")}
              >
                코인 거래하러 가기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
