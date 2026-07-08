"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { TransactionTypeItem } from "./transactionTypes";

export interface TransactionTypeCardProps {
  item: TransactionTypeItem;
  onOpen: (item: TransactionTypeItem) => void;
}

const TransactionTypeCard = ({ item, onOpen }: TransactionTypeCardProps) => {
  return (
    <div className="flex items-center gap-4 bg-white rounded-[20px] border-x border-b border-l-5 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center">
        <Image src={item.icon} alt="" width={56} height={56} className="h-14 w-14 object-contain" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-[#1F2858]">
          {item.titleEn} <span className="text-slate-600">/ {item.titleHi}</span>
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary">
            New
          </span>
          <span className="truncate text-sm text-slate-500">{item.descriptionEn}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(item)}
        className="flex shrink-0 items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-100"
      >
        Open <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default TransactionTypeCard;
