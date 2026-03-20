// src/app/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useUpbitWebSocket } from "@/hooks/useUpbitWebSocket";
import { getTopCoins } from "@/lib/upbit";
import { Coin } from "@/types/coin";
import { AssetSummary } from "@/components/common/AssetSummary";
import { CoinList } from "@/components/coin/CoinList";
import { BuyModal } from "@/components/coin/BuyModal";
import { useRouter } from "next/navigation";
import { CoinDetailModal } from "@/components/coin/CoinDetailModal";
import { WelcomeModal } from "@/components/common/WelcomModal";

export default function Home() {
  const router = useRouter();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string | null>(
    null,
  );
  const [detailCoinSymbol, setDetailCoinSymbol] = useState<string | null>(null);

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

  // 매수 버튼 클릭 핸들러
  const handleBuyClick = (symbol: string) => {
    setSelectedCoinSymbol(symbol);
  };

  const handleCloseModal = () => {
    setSelectedCoinSymbol(null);
  };

  // 종목 상세 모달 핸들러
  const handleDetailClick = (symbol: string) => {
    setDetailCoinSymbol(symbol);
  };

  const handleCloseDetailModal = () => {
    setDetailCoinSymbol(null);
  };

  return (
    <>
      <WelcomeModal />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 헤더 */}
          <header className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  EXIT
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  코인 투자 시뮬레이터
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

          <div className="mb-6 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-yellow-200 font-semibold mb-1">
                  가상 투자 시뮬레이터입니다
                </p>
                <p className="text-yellow-300/80 text-sm">
                  실제 돈이 아닌 가상 자금으로 연습하는 서비스입니다. 실제 거래,
                  입출금, 환전 등은 불가능합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 자산 요약 */}
          <div className="mb-8">
            <AssetSummary currentPrices={prices} />
          </div>

          {/* 코인 리스트 */}
          <div>
            {coins.length > 0 ? (
              <CoinList
                coins={coins}
                prices={prices}
                onBuyClick={handleBuyClick}
                onDetailClick={handleDetailClick}
              />
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                <p className="text-gray-400">코인 목록 불러오는 중...</p>
              </div>
            )}
          </div>
          {/* 매수 모달 - 여기에 추가! */}
          {selectedCoinSymbol && (
            <BuyModal
              coin={coins.find((c) => c.market === selectedCoinSymbol)!}
              currentPrice={prices[selectedCoinSymbol]?.price || 0}
              onClose={handleCloseModal}
            />
          )}

          {/* 차트 상세 모달 - 추가! */}
          {detailCoinSymbol && prices[detailCoinSymbol] && (
            <CoinDetailModal
              coin={coins.find((c) => c.market === detailCoinSymbol)!}
              price={prices[detailCoinSymbol]}
              onClose={handleCloseDetailModal}
              onBuyClick={() => handleBuyClick(detailCoinSymbol)}
            />
          )}
        </div>
      </div>
    </>
  );
}
