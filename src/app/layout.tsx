// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/common/FloatingNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EXIT - 코인 투자 시뮬레이터",
  description: "리스크 없이 안전하게 코인 투자를 경험하고 연습하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        <FloatingNav />
        {/* Floating Nav 높이만큼 하단 여백 */}
        <div className="h-24" />
      </body>
    </html>
  );
}
