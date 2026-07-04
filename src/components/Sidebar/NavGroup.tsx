"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { ChevronDown } from "lucide-react";
import NavItem from "./NavItem";

type NavChild = {
  id: string;
  title: string;
  href: string;
};

type NavItemData = {
  id: string;
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  href?: string;
  children?: NavChild[];
};

type NavGroupProps = {
  item: NavItemData;
  pathname: string;
  defaultOpen?: boolean;
};

export default function NavGroup({
  item,
  pathname,
  defaultOpen = false,
}: NavGroupProps) {
  const children = item.children ?? [];

  const hasActiveChild = children.some(
    (child) => child.href === pathname
  );

  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (hasActiveChild) {
      setOpen(true);
    }
  }, [hasActiveChild]);

  const Icon = item.icon;

  return (
    <div className="select-none">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-10 w-full items-center rounded-md px-3 text-[13px] font-medium transition-all duration-200 ${
          hasActiveChild || open
            ? "bg-[#2B2F55] text-white"
            : "text-[#D7D9E4] hover:bg-[#242845]"
        }`}
      >
        <Icon
          size={17}
          className="mr-3 shrink-0"
        />

        <span className="flex-1 text-left">
          {item.title}
        </span>

        <ChevronDown
          size={15}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open
            ? "mt-1 max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="relative ml-4">
          {children.map((child, index) => (
            <NavItem
              key={child.id}
              item={child}
              level={1}
              active={pathname === child.href}
              isLast={index === children.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}