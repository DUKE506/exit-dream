// src/hooks/useUpbitWebSocket.ts

import { useEffect, useState } from "react";
import { WebSocketTickerData } from "@/types/coin";

interface PriceData {
  [symbol: string]: {
    price: number;
    changeRate: number;
    changePrice: number;
  };
}

// 전역 WebSocket 인스턴스 (단 1개만 유지)
let globalWs: WebSocket | null = null;
let subscribers = new Set<(prices: PriceData) => void>();
let currentPrices: PriceData = {};
let subscribedSymbols = new Set<string>();

function connectWebSocket(symbols: string[]) {
  // 이미 연결되어 있으면 구독만 추가
  if (globalWs?.readyState === WebSocket.OPEN) {
    console.log("⚠️ WebSocket 이미 연결됨, 구독 추가만 진행");

    // 새로운 심볼 추가
    const newSymbols = symbols.filter((s) => !subscribedSymbols.has(s));
    if (newSymbols.length > 0) {
      newSymbols.forEach((s) => subscribedSymbols.add(s));
      // 구독 메시지 재전송
      const subscribeMessage = [
        { ticket: "exit-coin-ticker" },
        { type: "ticker", codes: Array.from(subscribedSymbols) },
      ];
      globalWs.send(JSON.stringify(subscribeMessage));
    }
    return;
  }

  // 연결 중이면 기다림
  if (globalWs?.readyState === WebSocket.CONNECTING) {
    console.log("⏳ WebSocket 연결 중...");
    return;
  }

  console.log("🔌 WebSocket 새로 연결 시작");

  symbols.forEach((s) => subscribedSymbols.add(s));

  globalWs = new WebSocket("wss://api.upbit.com/websocket/v1");

  globalWs.onopen = () => {
    console.log("✅ WebSocket 연결 성공");

    const subscribeMessage = [
      { ticket: "exit-coin-ticker" },
      { type: "ticker", codes: Array.from(subscribedSymbols) },
    ];

    globalWs?.send(JSON.stringify(subscribeMessage));
  };

  globalWs.onmessage = async (event) => {
    try {
      const text = await event.data.text();
      const data: WebSocketTickerData = JSON.parse(text);

      currentPrices = {
        ...currentPrices,
        [data.code]: {
          price: data.trade_price,
          changeRate: data.signed_change_rate,
          changePrice: data.signed_change_price,
        },
      };

      // 모든 구독자에게 알림
      subscribers.forEach((callback) => callback(currentPrices));
    } catch (error) {
      console.error("메시지 파싱 에러:", error);
    }
  };

  globalWs.onerror = (error) => {
    console.error("❌ WebSocket 에러:", error);
  };

  globalWs.onclose = () => {
    console.log("🔌 WebSocket 연결 종료");
    globalWs = null;

    // 5초 후 재연결
    setTimeout(() => {
      if (subscribers.size > 0) {
        console.log("🔄 재연결 시도...");
        connectWebSocket(Array.from(subscribedSymbols));
      }
    }, 5000);
  };
}

export function useUpbitWebSocket({ symbols }: { symbols: string[] }) {
  const [prices, setPrices] = useState<PriceData>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (symbols.length === 0) return;

    // 구독자 등록
    subscribers.add(setPrices);

    // WebSocket 연결
    connectWebSocket(symbols);

    // 연결 상태 체크
    const checkConnection = setInterval(() => {
      setIsConnected(globalWs?.readyState === WebSocket.OPEN);
    }, 1000);

    // cleanup
    return () => {
      subscribers.delete(setPrices);
      clearInterval(checkConnection);

      // 마지막 구독자가 떠나면 연결 종료
      if (subscribers.size === 0) {
        console.log("👋 모든 구독자 떠남, WebSocket 종료");
        globalWs?.close();
        globalWs = null;
        subscribedSymbols.clear();
        currentPrices = {};
      }
    };
  }, [symbols.join(",")]); // symbols 배열이 변경될 때만 재실행

  return { prices, isConnected };
}
