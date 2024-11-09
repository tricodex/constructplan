"use client";

import { cn } from "@/lib/utils";

interface InsightBadgeProps {
  confidence: number;
  className?: string;
}

export const InsightBadge = ({ confidence, className }: InsightBadgeProps) => {
  const getColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800";
    if (confidence >= 70) return "bg-blue-100 text-blue-800";
    if (confidence >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium",
        getColor(confidence),
        className
      )}
    >
      {confidence}% confidence
    </span>
  );
};
