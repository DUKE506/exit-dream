// src/components/coin/CoinDetailModal.tsx

"use client";

import { Coin } from "@/types/coin";
import { formatPrice, formatChangeRate } from "@/lib/upbit";
import { Button } from "@/components/common/Button";
import { CoinChart } from "./CoinChart";

interface CoinDetailModalProps {
  coin: Coin;
  price: {
    price: number;
    changeRate: number;
    changePrice: number;
  };
  onClose: () => void;
  onBuyClick: () => void;
}

export function CoinDetailModal({
  coin,
  price,
  onClose,
  onBuyClick,
}: CoinDetailModalProps) {
  const isPositive = price.changeRate >= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-3xl w-full p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-white">
                {coin.korean_name}
              </h2>
              <span className="text-lg text-gray-400">
                {coin.market.replace("KRW-", "")}
              </span>
            </div>
            <p className="text-gray-400">{coin.english_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl"
          >
            ×
          </button>
        </div>

        {/* 현재가 */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <p className="text-gray-400 text-sm mb-2">현재가</p>
          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-bold text-white">
              {formatPrice(price.price)}원
            </p>
            <div>
              <p
                className={`text-xl font-semibold ${
                  isPositive ? "text-red-500" : "text-blue-500"
                }`}
              >
                {formatChangeRate(price.changeRate)}
              </p>
              <p
                className={`text-sm ${
                  isPositive ? "text-red-400" : "text-blue-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {formatPrice(Math.abs(price.changePrice))}원
              </p>
            </div>
          </div>
        </div>

        {/* 차트 */}
        <div className="mb-6">
          <CoinChart symbol={coin.market} />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onClose}
            className="flex-1"
          >
            닫기
          </Button>
          <Button
            variant="success"
            size="lg"
            onClick={() => {
              onBuyClick();
              onClose();
            }}
            className="flex-1"
          >
            매수하기
          </Button>
        </div>
      </div>
    </div>
  );
}
