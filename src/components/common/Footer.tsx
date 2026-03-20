export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-left text-gray-500 text-sm space-y-3">
          <p className="font-bold text-gray-300 text-base mb-4">EXIT DREAM</p>

          <p>
            본 서비스는{" "}
            <strong className="text-yellow-400">가상 투자 시뮬레이터</strong>
            입니다.
          </p>

          <p>
            실제 금전 거래, 입출금, 환전 등은 불가능하며,
            <br />
            교육 및 연습 목적으로만 사용됩니다.
          </p>

          <div className="pt-6 mt-6 border-t border-gray-800">
            <p className="text-xs text-gray-600">
              © 2025 EXIT DREAM. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
