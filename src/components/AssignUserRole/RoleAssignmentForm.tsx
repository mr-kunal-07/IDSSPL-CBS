"use client";

import { useState } from "react";
import { UserRound, UserCheck, MoreVertical, IdCard } from "lucide-react";
import ModuleToggleList, { type ModuleItem } from "./ModuleToggleList";
import PermissionCheckboxList from "./PermissionCheckboxList";
import MainRoleListModal, { type MainRole } from "./MainRoleListModal";

const modulePermissions: Record<string, string[]> = {
  account_closing: ["Account Closing View", "Account Closing Process"],
  application: [
    "Application View",
    "Application Create",
    "Application Modify",
    "Application Approve",
  ],
  bills: ["Bills View", "Bills Create", "Bills Modify"],
  branch: ["Branch View", "Branch Create", "Branch Modify"],
  clearing: ["Clearing View", "Clearing Process"],
  customer: ["Customer View", "Customer Create", "Customer Modify"],
  locker: ["Locker View", "Locker Assign", "Locker Release"],
  queries: ["Queries View", "Queries Execute"],
  account: [
    "Account Freeze Revoke",
    "Account Memo",
    "Account Modification",
    "Add Insurance Details",
    "Lein Mark",
    "Lein Revoke",
    "Cheque Book Issue",
    "Stop Cheque Payment",
    "New Standing Instruction",
  ],
};

const defaultModules: ModuleItem[] = [
  { id: "account_closing", name: "Account Closing", enabled: false },
  { id: "application", name: "Application", enabled: false },
  { id: "bills", name: "Bills", enabled: false },
  { id: "branch", name: "Branch", enabled: false },
  { id: "clearing", name: "Clearing", enabled: false },
  { id: "customer", name: "Customer", enabled: false },
  { id: "locker", name: "Locker", enabled: false },
  { id: "queries", name: "Queries", enabled: false },
  { id: "account", name: "Account", enabled: true },
];

export type SelectedUser = {
  userId: string;
  userName: string;
  userRole: string;
};

type RoleAssignmentFormProps = {
  selectedUser: SelectedUser | null;
  onRoleAssigned?: (userId: string, role: string) => void;
};

export default function RoleAssignmentForm({ selectedUser, onRoleAssigned }: RoleAssignmentFormProps) {
  const [userRole, setUserRole] = useState("Officer");
  const [isRoleListOpen, setIsRoleListOpen] = useState(false);
  const [modules, setModules] = useState<ModuleItem[]>(defaultModules);
  const [activeModuleId, setActiveModuleId] = useState("account");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleRoleSelect = (role: MainRole) => {
    setUserRole(role.name);
  };

  const handleSaveRole = () => {
    if (selectedUser && onRoleAssigned) {
      onRoleAssigned(selectedUser.userId, userRole);
    }
  };

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, enabled } : m))
    );
  };

  const handleModuleSelect = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setSelectedPermissions([]);
  };

  const permissions = modulePermissions[activeModuleId] ?? [];

  return (
    <>
      <div className="rounded-xl border border-[#0B63C1]/30 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <UserRound size={28} className="text-[#0B63C1]" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
              +
            </span>
          </div>
          <h2 className="text-base font-semibold text-[#1C398E]">
            Assign Role / <span className="font-normal">वापरकर्ता तपशील</span>
          </h2>
        </div>

        <div className="mb-5 rounded-xl border-2 border-[#0B63C1] p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs text-gray-500">
                User Id / <span className="text-gray-400">वापरकर्ता आयडी</span>
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5">
                <UserRound size={16} className="text-[#0B63C1]" />
                <span className="text-sm text-gray-700">
                  {selectedUser?.userId ?? "—"}
                </span>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3"> </div>
              <label className="mb-1.5 block text-xs text-gray-500">
                Username / <span className="text-gray-400">आडनाव</span>
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5">
                <IdCard size={16} className="text-[#0B63C1]" />
                <span className="text-sm text-gray-700">
                  {selectedUser?.userName ?? "—"}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-gray-500">
                User Role / <span className="text-gray-400">वापरकर्ता भूमिका</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                  <UserCheck size={16} className="shrink-0 text-[#0B63C1]" />
                  <span className="text-sm text-gray-700">{userRole}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRoleListOpen(true)}
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-[#0B63C1] bg-[#E8F1FD] text-[#0B63C1] transition hover:bg-[#DCEBFC]"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 ">
          <div>
            <ModuleToggleList
              modules={modules}
              activeModuleId={activeModuleId}
              onModuleSelect={handleModuleSelect}
              onModuleToggle={handleModuleToggle}
            />
          </div>

          <div>
            <PermissionCheckboxList
              permissions={permissions}
              selectedPermissions={selectedPermissions}
              onChange={setSelectedPermissions}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveRole}
            className="rounded-lg bg-[#0B63C1] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#0A5BC0]"
          >
            Save Role
          </button>
        </div>
      </div>

      {isRoleListOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsRoleListOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MainRoleListModal
              onClose={() => setIsRoleListOpen(false)}
              onSelect={handleRoleSelect}
            />
          </div>
        </div>
      )}
    </>
  );
}
