import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CollapseButton({ collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      className="absolute -right-[1px] top-8 z-50 flex h-7 w-5 items-center justify-center rounded-l-full bg-[#1976F9] text-white shadow-md transition hover:bg-[#1565D8]"
    >
      {collapsed ? (
        <ChevronRight size={16} />
      ) : (
        <ChevronLeft size={16} />
      )}
    </button>
  );
}