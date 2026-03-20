// src/components/coin/CoinChart.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType } from "lightweight-charts";
import type { IChartApi, ISeriesApi } from "lightweight-charts";

interface CoinChartProps {
  symbol: string;
}

type TimeFrame = "1" | "5" | "15" | "30" | "60" | "240" | "D";

const timeFrameLabels: Record<TimeFrame, string> = {
  "1": "1분",
  "5": "5분",
  "15": "15분",
  "30": "30분",
  "60": "1시간",
  "240": "4시간",
  D: "1일",
};

export function CoinChart({ symbol }: CoinChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  const [timeFrame, setTimeFrame] = useState<TimeFrame>("60");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#111827" },
        textColor: "#9CA3AF",
      },
      grid: {
        vertLines: { color: "#1F2937" },
        horzLines: { color: "#1F2937" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: "#374151",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
    });

    chartRef.current = chart;

    // 캔들스틱 시리즈
    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: "#EF4444",
      downColor: "#3B82F6",
      borderUpColor: "#EF4444",
      borderDownColor: "#3B82F6",
      wickUpColor: "#EF4444",
      wickDownColor: "#3B82F6",
    });

    candlestickSeriesRef.current = candlestickSeries;

    // 거래량 시리즈 (하단)
    const volumeSeries = (chart as any).addHistogramSeries({
      color: "#6B7280",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.8, // 상단 80% 위치부터 시작 (하단에 위치)
        bottom: 0,
      },
    });

    volumeSeriesRef.current = volumeSeries;

    // 반응형 처리
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    async function fetchCandles() {
      if (!candlestickSeriesRef.current || !volumeSeriesRef.current) return;

      try {
        setLoading(true);

        let endpoint = "";
        let count = 200;

        if (timeFrame === "D") {
          endpoint = `https://api.upbit.com/v1/candles/days?market=${symbol}&count=${count}`;
        } else {
          endpoint = `https://api.upbit.com/v1/candles/minutes/${timeFrame}?market=${symbol}&count=${count}`;
        }

        const response = await fetch(endpoint);
        const data = await response.json();

        // 데이터 변환 및 정렬
        const candleData = data
          .map((candle: any) => ({
            time: Math.floor(
              new Date(candle.candle_date_time_kst).getTime() / 1000,
            ),
            open: candle.opening_price,
            high: candle.high_price,
            low: candle.low_price,
            close: candle.trade_price,
          }))
          .sort((a: any, b: any) => a.time - b.time);

        const volumeData = data
          .map((candle: any) => ({
            time: Math.floor(
              new Date(candle.candle_date_time_kst).getTime() / 1000,
            ),
            value: candle.candle_acc_trade_volume,
            color:
              candle.opening_price <= candle.trade_price
                ? "#EF444480"
                : "#3B82F680",
          }))
          .sort((a: any, b: any) => a.time - b.time);

        candlestickSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);

        chartRef.current?.timeScale().fitContent();
      } catch (error) {
        console.error("차트 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCandles();
  }, [symbol, timeFrame]);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      {/* 시간봉 선택 탭 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(timeFrameLabels) as TimeFrame[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeFrame(tf)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              timeFrame === tf
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {timeFrameLabels[tf]}
          </button>
        ))}
      </div>

      {/* 로딩 표시 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg z-10">
          <p className="text-gray-400">차트 로딩 중...</p>
        </div>
      )}

      {/* 차트 컨테이너 */}
      <div ref={chartContainerRef} className="relative" />
    </div>
  );
}
