"use client";

interface StatusBarProps {
  followers: number;
  prPoints: number;
  classExpectation: number;
}

export default function StatusBar({ followers, prPoints, classExpectation }: StatusBarProps) {
  return (
    <div className="flex gap-3 text-xs bg-gray-50 border-b border-gray-100 px-4 py-2">
      <div className="text-gray-600">
        フォロワー <span className="font-semibold text-gray-900">{followers}</span>
      </div>
      <div className="text-gray-600">
        広報Pt <span className="font-semibold text-gray-900">{prPoints}</span>
      </div>
      <div className="text-gray-600">
        期待度{" "}
        <span
          className={`font-semibold ${
            classExpectation >= 60
              ? "text-green-600"
              : classExpectation >= 30
              ? "text-yellow-600"
              : "text-gray-500"
          }`}
        >
          {classExpectation >= 60 ? "高め" : classExpectation >= 30 ? "少し上昇" : "普通"}
        </span>
      </div>
    </div>
  );
}
