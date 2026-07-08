"use client";

type PermissionCheckboxListProps = {
  permissions: string[];
  selectedPermissions: string[];
  onChange: (selected: string[]) => void;
};

export default function PermissionCheckboxList({
  permissions,
  selectedPermissions,
  onChange,
}: PermissionCheckboxListProps) {
  const selectAll =
    permissions.length > 0 &&
    permissions.every((p) => selectedPermissions.includes(p));

  const handleSelectAll = (checked: boolean) => {
    onChange(checked ? [...permissions] : []);
  };

  const handleToggle = (permission: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, permission]);
    } else {
      onChange(selectedPermissions.filter((p) => p !== permission));
    }
  };

  return (
    <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] h-full">
      <label className="mb-3 flex cursor-pointer items-center gap-2.5 border-b border-gray-100 pb-3">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className="text-sm font-semibold text-gray-800">Select All</span>
      </label>

      <div className="flex h-full flex-col gap-1.5">
        {permissions.map((permission) => (
          <label
            key={permission}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 hover:bg-[#F8FBFF]"
          >
            <input
              type="checkbox"
              checked={selectedPermissions.includes(permission)}
              onChange={(e) => handleToggle(permission, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">{permission}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
