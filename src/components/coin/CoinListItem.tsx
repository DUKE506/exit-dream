// src/components/coin/CoinListItem.tsx

"use client";

import { Coin } from "@/types/coin";
import { formatPrice, formatChangeRate } from "@/lib/upbit";
import { Button } from "@/components/common/Button";

interface CoinListItemProps {
  coin: Coin;
  price?: {
    price: number;
    changeRate: number;
    changePrice: number;
  };
  onBuyClick: (symbol: string) => void;
  onDetailClick: (symbol: string) => void; // ← 추가
}

export function CoinListItem({
  coin,
  price,
  onBuyClick,
  onDetailClick,
}: CoinListItemProps) {
  const isPositive = price ? price.changeRate >= 0 : false;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between">
        {/* 코인 정보 */}
        <div
          className="flex-1 cursor-pointer"
          onClick={() => price && onDetailClick(coin.market)}
        >
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-white hover:text-blue-400 transition">
              {coin.korean_name}
            </h3>
            <span className="text-sm text-gray-400">
              {coin.market.replace("KRW-", "")}
            </span>
          </div>

          {price ? (
            <div>
              <p className="text-xl font-semibold text-white mb-1">
                {formatPrice(price.price)}원
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    isPositive ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  {formatChangeRate(price.changeRate)}
                </span>
                <span
                  className={`text-xs ${
                    isPositive ? "text-red-400" : "text-blue-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {formatPrice(Math.abs(price.changePrice))}원
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">로딩 중...</p>
          )}
        </div>

        {/* 버튼들 */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => price && onDetailClick(coin.market)}
            disabled={!price}
          >
            차트
          </Button>
          <Button
            variant="success"
            size="md"
            onClick={() => onBuyClick(coin.market)}
            disabled={!price}
          >
            매수
          </Button>
        </div>
      </div>
    </div>
  );
}
