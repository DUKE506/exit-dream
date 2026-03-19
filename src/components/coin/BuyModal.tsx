// src/components/coin/BuyModal.tsx

"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Coin } from "@/types/coin";
import { formatPrice, formatKoreanNumber } from "@/lib/upbit";
import { Button } from "@/components/common/Button";

interface BuyModalProps {
  coin: Coin;
  currentPrice: number;
  onClose: () => void;
}

export function BuyModal({ coin, currentPrice, onClose }: BuyModalProps) {
  const { cash, buyCoin } = usePortfolioStore();
  const [amount, setAmount] = useState<string>("");
  const [inputType, setInputType] = useState<"amount" | "total">("total");

  // 입력값을 숫자로 변환
  const numAmount = parseFloat(amount) || 0;

  // 총 금액 계산
  const totalPrice =
    inputType === "amount" ? numAmount * currentPrice : numAmount;

  // 수량 계산
  const coinAmount =
    inputType === "amount" ? numAmount : numAmount / currentPrice;

  // 매수 가능 여부
  const canBuy = totalPrice > 0 && totalPrice <= cash;

  // 매수 실행
  const handleBuy = () => {
    if (!canBuy) return;

    buyCoin(coin.market, coinAmount, currentPrice);
    onClose();
  };

  // 퍼센트 버튼 (10%, 25%, 50%, 100%)
  const handlePercentClick = (percent: number) => {
    const totalAmount = cash * (percent / 100);
    setInputType("total");
    setAmount(Math.floor(totalAmount).toString());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {coin.korean_name} 매수
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* 현재 가격 */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-sm mb-1">현재가</p>
          <p className="text-2xl font-bold text-white">
            {formatPrice(currentPrice)}원
          </p>
        </div>

        {/* 입력 타입 선택 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputType("total")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              inputType === "total"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            금액 입력
          </button>
          <button
            onClick={() => setInputType("amount")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              inputType === "amount"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            수량 입력
          </button>
        </div>

        {/* 입력 필드 */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm block mb-2">
            {inputType === "total" ? "매수 금액 (원)" : "매수 수량"}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>

        {/* 퍼센트 버튼 */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[10, 25, 50, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => handlePercentClick(percent)}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              {percent}%
            </button>
          ))}
        </div>

        {/* 주문 정보 */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">매수 수량</span>
            <span className="text-white font-medium">
              {coinAmount.toFixed(8)} {coin.market.replace("KRW-", "")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">주문 금액</span>
            <span className="text-white font-medium">
              {formatKoreanNumber(totalPrice)}원
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">남은 현금</span>
            <span className="text-white font-medium">
              {formatKoreanNumber(cash - totalPrice)}원
            </span>
          </div>
        </div>

        {/* 보유 현금 */}
        <p className="text-gray-400 text-sm mb-6">
          보유 현금: {formatKoreanNumber(cash)}원
        </p>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onClose}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            variant="success"
            size="lg"
            onClick={handleBuy}
            disabled={!canBuy}
            className="flex-1"
          >
            {!canBuy && totalPrice > cash ? "잔액 부족" : "매수하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
