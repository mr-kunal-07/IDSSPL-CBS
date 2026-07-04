import { LogOut } from "lucide-react";

type RailItem = {
  id: string;
  icon: string;
};

type IconRailProps = {
  items: RailItem[];
  active: string;
  onSelect: (id: string) => void;
};

export default function IconRail({ items, active, onSelect }: IconRailProps) {
  return (
    <div className="relative flex h-full w-[42px] flex-col items-center bg-[#0C0B1E]">
      <div className="absolute right-0 top-0 h-full w-px bg-[#1877F2]" />

      {/* Top Icons */}
      <div className="mt-20 flex flex-col items-center">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col items-center">
            <button
              onClick={() => onSelect(item.id)}
              className="group flex h-10 w-10 items-center justify-center"
            >
              <img
                src={item.icon}
                alt={item.id}
                className="h-[22px] w-[22px] object-contain transition-opacity"
              />
            </button>

            {index < items.length - 1 && (
              <div className="my-3 h-px w-5 bg-white/40" />
            )}
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mt-auto mb-5">
        <button
          className="group flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-white/10"
          onClick={() => console.log("Logout")}
        >
          <LogOut
            size={20}
            className="text-white/80 transition group-hover:text-white"
          />
        </button>
      </div>
    </div>
  );
}