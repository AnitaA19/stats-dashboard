import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md",
  secondary:
    "bg-gray-800 text-gray-200 hover:bg-gray-700 active:bg-gray-900 shadow-sm hover:shadow-md",
  ghost: "text-gray-400 hover:text-white hover:bg-gray-800",
  danger:
    "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30 shadow-sm hover:shadow-md",
  outline:
    "border border-gray-700 text-gray-300 hover:bg-gray-800 shadow-sm hover:shadow-md",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 rounded-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100
        focus:ring-blue-500/50
        hover:scale-105 active:scale-95
        ${variants[variant]} ${sizes[size]} ${className}
      `.trim()}
    >
      {children}
    </button>
  );
}
