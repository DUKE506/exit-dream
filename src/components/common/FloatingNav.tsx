// src/components/common/MobileNav.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Briefcase, History, RotateCcw } from "lucide-react";
import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Button } from "./Button";

export function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { reset } = usePortfolioStore();
  const [showResetModal, setShowResetModal] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "거래" },
    { path: "/portfolio", icon: Briefcase, label: "포트폴리오" },
    { path: "/history", icon: History, label: "내역" },
  ];

  const handleReset = () => {
    reset();
    setShowResetModal(false);
    alert("모든 데이터가 초기화되었습니다!");
  };

  return (
    <>
      {/* Floating Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-gray-800/95 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-4 px-2 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-600 text-white scale-105"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* 초기화 버튼 */}
            <button
              onClick={() => setShowResetModal(true)}
              className="flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-gray-700/50 transition-all"
            >
              <RotateCcw size={22} strokeWidth={2} />
              <span className="text-xs font-medium">초기화</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 초기화 확인 모달 */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              정말 초기화하시겠습니까?
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              모든 거래 내역과 보유 코인이 삭제되고,
              <br />
              초기 자금 1,000만원으로 돌아갑니다.
              <br />
              <span className="text-red-400 font-semibold">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </p>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowResetModal(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                variant="danger"
                size="lg"
                onClick={handleReset}
                className="flex-1"
              >
                초기화
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
