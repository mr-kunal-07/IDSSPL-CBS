"use client";

import { Search, Filter } from "lucide-react";

type SearchFilterBarProps = {
  onOpenFilter: () => void;
  placeholder?: string;
};

export default function SearchFilterBar({
  onOpenFilter,
  placeholder = "Search/ Filter",
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onOpenFilter}
        className="flex w-[220px] items-center gap-2.5 rounded-lg border border-[#0B63C1] bg-white px-3 py-2 transition hover:bg-[#F8FBFF] sm:w-[260px]"
      >
        <Search size={16} className="shrink-0 text-[#0B63C1]" />
        <span className="text-sm text-gray-400">{placeholder}</span>
      </button>
      <button
        type="button"
        onClick={onOpenFilter}
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-[#0B63C1] bg-white text-[#0B63C1] transition hover:bg-[#F8FBFF]"
      >
        <Filter size={18} />
      </button>
    </div>
  );
}
