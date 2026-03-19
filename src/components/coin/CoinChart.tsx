// src/components/coin/CoinChart.tsx

"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/upbit";

interface CoinChartProps {
  symbol: string;
}

interface CandleData {
  timestamp: number;
  price: number;
  time: string;
}

export function CoinChart({ symbol }: CoinChartProps) {
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandles() {
      try {
        setLoading(true);

        // 업비트 분봉 API (최근 24시간, 60분봉)
        const response = await fetch(
          `https://api.upbit.com/v1/candles/minutes/60?market=${symbol}&count=24`,
        );
        const data = await response.json();

        const formattedData = data.reverse().map((candle: any) => ({
          timestamp: new Date(candle.candle_date_time_kst).getTime(),
          price: candle.trade_price,
          time: new Date(candle.candle_date_time_kst).toLocaleTimeString(
            "ko-KR",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("차트 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCandles();
  }, [symbol]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-400">차트 로딩 중...</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-400">차트 데이터 없음</p>
      </div>
    );
  }

  // 최고가/최저가
  const prices = chartData.map((d) => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const firstPrice = chartData[0].price;
  const lastPrice = chartData[chartData.length - 1].price;
  const isUp = lastPrice >= firstPrice;

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-white font-semibold">24시간 차트 (1시간봉)</h3>
        <div className="text-sm">
          <span className="text-gray-400">최고 </span>
          <span className="text-red-400">{formatPrice(maxPrice)}</span>
          <span className="text-gray-400 mx-2">|</span>
          <span className="text-gray-400">최저 </span>
          <span className="text-blue-400">{formatPrice(minPrice)}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            domain={[minPrice * 0.999, maxPrice * 1.001]}
            stroke="#6B7280"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickFormatter={(value) => formatPrice(value)}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: any) => [formatPrice(value) + "원", "가격"]}
            labelStyle={{ color: "#9CA3AF" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isUp ? "#EF4444" : "#3B82F6"}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
