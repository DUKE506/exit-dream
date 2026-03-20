// src/components/common/WelcomeModal.tsx

"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 첫 방문 확인
    const hasVisited = localStorage.getItem("exit-dream-visited");
    if (!hasVisited) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("exit-dream-visited", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700">
        {/* 아이콘 */}
        <div className="text-center mb-4">
          <div className="text-6xl mb-3">💭</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            EXIT DREAM에 오신 것을 환영합니다!
          </h2>
        </div>

        {/* 안내 문구 */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-yellow-200 font-semibold mb-2">
                가상 투자 시뮬레이터
              </p>
              <ul className="text-yellow-300/80 text-sm space-y-1">
                <li>• 실제 돈이 아닌 가상 자금입니다</li>
                <li>• 실제 거래, 입출금 불가능</li>
                <li>• 연습 목적의 시뮬레이터입니다</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 기능 소개 */}
        <div className="mb-6 space-y-2 text-sm text-gray-300">
          <p className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            가상 1,000만원으로 시작
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            실시간 30개 코인 시세
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            TP/SL 자동 매도
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            안전한 투자 연습
          </p>
        </div>

        {/* 버튼 */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleClose}
          className="w-full"
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}
