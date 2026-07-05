"use client";

export type ModuleItem = {
  id: string;
  name: string;
  enabled: boolean;
};

type ModuleToggleListProps = {
  modules: ModuleItem[];
  activeModuleId: string;
  onModuleSelect: (moduleId: string) => void;
  onModuleToggle: (moduleId: string, enabled: boolean) => void;
};

export default function ModuleToggleList({
  modules,
  activeModuleId,
  onModuleSelect,
  onModuleToggle,
}: ModuleToggleListProps) {
  return (
    <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] h-full">
      <div className="flex h-full flex-col gap-2 pr-1">
        {modules.map((module) => {
          const isActive = activeModuleId === module.id;
          return (
            <div
              key={module.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                isActive
                  ? "border-[#0B63C1] bg-[#E8F1FD]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={module.enabled}
                  onChange={(e) => onModuleToggle(module.id, e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#0B63C1] peer-checked:after:translate-x-full" />
              </label>
              <button
                type="button"
                onClick={() => onModuleSelect(module.id)}
                className="flex-1 text-left text-sm font-medium text-gray-800"
              >
                {module.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
