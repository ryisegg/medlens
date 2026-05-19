interface Props {
  quantity: number;
  language: string;
}

export function LowStockBadge({ quantity, language }: Props) {
  if (quantity > 5) return null;
  return (
    <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
      {language === "zh" ? "库存不足" : "Low Stock"}
    </span>
  );
}
