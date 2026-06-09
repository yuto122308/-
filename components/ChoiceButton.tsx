"use client";

interface ChoiceButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "choice";
  disabled?: boolean;
  className?: string;
}

export default function ChoiceButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: ChoiceButtonProps) {
  const base = "w-full rounded-lg px-4 py-3 text-sm font-medium transition-all active:scale-95 disabled:opacity-40";
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-700",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    choice:
      "bg-white border border-gray-300 text-gray-800 hover:border-gray-500 hover:bg-gray-50 text-left",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
