import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAuthSession } from "@/lib/auth";

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

  const route = useRouter();
  return (
    <div className="relative flex h-full w-[50px] flex-col items-center bg-[#0C0B1E]">
      <div className="absolute right-0 top-0 h-full w-px bg-[#1877F2]" />

      {/* Top Icons */}
      <div className="mt-20 flex flex-col items-center">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col items-center">
            <button
              onClick={() => onSelect(item.id)}
              className="group flex h-18 w-18 items-center justify-center transition-all duration-300 ease-out hover:scale-125"
            >
              <img
                src={item.icon}
                alt={item.id}
                className="h-[33px] w-[33px] object-contain transition-transform duration-300 ease-out group-hover:scale-110"
              />
            </button>

            {index < items.length - 1 && (
              <div className="my-3 h-px w-5 bg-white/40" />
            )}
          </div>
        ))}
      </div>

      <div className="mb-5 mt-auto">
        <button
          onClick={() => {
            clearAuthSession();
            route.push("/login");
          }}
          className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/10 hover:scale-105"
        >
          <LogOut
            size={20}
            className="text-white/70 transition-colors hover:text-white"
          />
        </button>
      </div>
    </div>
  );
}  