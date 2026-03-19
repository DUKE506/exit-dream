// src/app/history/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortfolioStore } from "@/store/portfolioStore";
import { getTopCoins } from "@/lib/upbit";
import { Coin } from "@/types/coin";
import { TradeList } from "@/components/portfolio/TradeList";
import { Button } from "@/components/common/Button";
import { formatKoreanNumber } from "@/lib/upbit";

export default function HistoryPage() {
  const router = useRouter();
  const { trades } = usePortfolioStore();
  const [coins, setCoins] = useState<Coin[]>([]);

  // 코인 목록 가져오기
  useEffect(() => {
    async function loadCoins() {
      const topCoins = await getTopCoins();
      setCoins(topCoins);
    }
    loadCoins();
  }, []);

  // 통계 계산
  const totalTrades = trades.length;
  const buyTrades = trades.filter((t) => t.type === "BUY");
  const sellTrades = trades.filter((t) => t.type === "SELL");
  const totalBuyAmount = buyTrades.reduce((sum, t) => sum + t.total, 0);
  const totalSellAmount = sellTrades.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">거래 내역</h1>
              <p className="text-gray-400">전체 매수/매도 기록</p>
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={() => router.push("/")}
            >
              거래하기
            </Button>
          </div>
        </header>

        {/* 거래 통계 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl mb-8">
          <h2 className="text-xl font-bold text-white mb-4">거래 통계</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">총 거래 횟수</p>
              <p className="text-2xl font-bold text-white">{totalTrades}회</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">매수 횟수</p>
              <p className="text-2xl font-bold text-green-500">
                {buyTrades.length}회
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">총 매수 금액</p>
              <p className="text-xl font-semibold text-white">
                {formatKoreanNumber(totalBuyAmount)}원
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">총 매도 금액</p>
              <p className="text-xl font-semibold text-white">
                {formatKoreanNumber(totalSellAmount)}원
              </p>
            </div>
          </div>
        </div>

        {/* 거래 내역 리스트 */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">전체 거래</h2>

          {trades.length > 0 ? (
            <TradeList trades={trades} coins={coins} />
          ) : (
            <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
              <p className="text-gray-400 text-lg mb-4">거래 내역이 없습니다</p>
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
