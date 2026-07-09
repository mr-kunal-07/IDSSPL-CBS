"use client";

import type { ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useBilingual } from "@/i18n/useBilingual";

type NavItemData = {
  id: string;
  title: string;
  titleKey?: string;
  href?: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
};

type NavItemProps = {
  item: NavItemData;
  active: boolean;
  level?: number;
  isLast?: boolean;
};

export default function NavItem({
  item,
  active,
  level = 0,
  isLast = false,
}: NavItemProps) {
  const router = useRouter();
  const { tRaw } = useBilingual();
  const Icon = item.icon;

  // Sidebar items are single labels (not bilingual pairs), so use tRaw so the
  // label always shows the selected language and never goes blank in English.
  const label = item.titleKey ? tRaw(item.titleKey) : item.title;

  const handleClick = () => {
    if (item.href) {
      router.push(item.href);
    }
  };

  if (level === 0) {
    return (
      <button
        onClick={handleClick}
        className={`flex h-[42px] w-full items-center rounded-xl px-3 text-[14px] font-medium transition-all ${
          active
            ? "bg-[#2E3050] text-white"
            : "text-[#ECECF4] hover:bg-[#242846]"
        }`}
      >
        {Icon && (
          <Icon
            size={17}
            className="mr-3 shrink-0 text-[#2E8FFF]"
          />
        )}

        <span>{label}</span>
      </button>
    );
  }

  return (
    <div className="relative ml-5 h-11">
      {!isLast && (
        <div className="absolute left-0 top-0 h-full w-px bg-[#E6E6E6]" />
      )}

      {isLast && (
        <div className="absolute left-0 top-0 h-[18px] w-px bg-[#E6E6E6]" />
      )}

      <div className="absolute left-0 top-0 h-[20px] w-3 rounded-bl-lg border-b border-l border-[#E6E6E6]" />

      <button
        onClick={handleClick}
        className={`ml-5 flex h-9 w-[170px] items-center rounded-lg px-3 text-[13px] font-medium transition-all ${
          active
            ? "bg-[#1877F2] text-white shadow-md"
            : "text-[#ECECF4] hover:bg-[#242846]"
        }`}
      >
        {label}
      </button>
    </div>
  );
}