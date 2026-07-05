"use client";

import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  Phone,
  Mail,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SearchFilterBar from "./SearchFilterBar";
import FilterModal, { type UserRoleFilters } from "./FilterModal";
import type { SelectedUser } from "./RoleAssignmentForm";

export type UserRow = {
  srNo: number;
  shortName: string;
  phone: string;
  email: string;
  userName: string;
  userId: string;
  assigned: boolean;
};

const defaultUsers: UserRow[] = Array.from({ length: 10 }, (_, i) => ({
  srNo: i + 1,
  shortName: "AMT",
  phone: "9876543210",
  email: "amt@example.com",
  userName: "Appana M Telgi",
  userId: "001",
  assigned: true,
}));

type TabType = "new" | "modify";

type UserTableProps = {
  onUserSelect: (user: SelectedUser) => void;
};

const PAGINATION_ITEMS: (number | "ellipsis")[] = [
  1,
  "ellipsis",
  98,
  99,
  100,
  101,
  102,
  103,
  "ellipsis",
  125,
];

export default function UserTable({ onUserSelect }: UserTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>("modify");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<UserRoleFilters>({
    userName: "",
    userId: "",
    status: "",
  });
  const [selectedRow, setSelectedRow] = useState<number | null>(1);
  const [currentPage, setCurrentPage] = useState(101);
  const [sortAsc, setSortAsc] = useState(true);

  const filteredUsers = useMemo(() => {
    let result = [...defaultUsers];

    if (filters.userName.trim()) {
      const q = filters.userName.toLowerCase();
      result = result.filter((u) => u.userName.toLowerCase().includes(q));
    }

    if (filters.userId.trim()) {
      result = result.filter((u) => u.userId.includes(filters.userId));
    }

    result.sort((a, b) =>
      sortAsc
        ? a.userName.localeCompare(b.userName)
        : b.userName.localeCompare(a.userName)
    );

    return result;
  }, [filters, sortAsc]);

  const handleRowClick = (user: UserRow) => {
    setSelectedRow(user.srNo);
    onUserSelect({
      userId: user.userId,
      userName: user.userName,
      userRole: "Officer",
    });
  };

  const handleFilterApply = (newFilters: UserRoleFilters) => {
    setFilters(newFilters);
  };

  const tabClass = (tab: TabType) =>
    activeTab === tab
      ? "rounded-md bg-[#0B63C1] px-4 py-2 text-sm font-semibold text-white"
      : "px-2 py-2 text-sm font-medium text-gray-800 hover:text-[#0B63C1]";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#0B63C1]/30 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className={tabClass("new")}
          >
            New User Role
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("modify")}
            className={tabClass("modify")}
          >
            Modify User Role
          </button>
        </div>

        <SearchFilterBar onOpenFilter={() => setIsFilterOpen(true)} />
      </div>

      <div className="flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0B63C1]">
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Sr No.
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-white"
                onClick={() => setSortAsc(!sortAsc)}
              >
                <span className="inline-flex items-center gap-1">
                  User Details
                  <ArrowUpDown size={13} className="opacity-80" />
                </span>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-white"
                onClick={() => setSortAsc(!sortAsc)}
              >
                <span className="inline-flex items-center gap-1">
                  User Name
                  <ArrowUpDown size={13} className="opacity-80" />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Assigned
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr
                key={user.srNo}
                onClick={() => handleRowClick(user)}
                className={`cursor-pointer transition-colors ${
                  selectedRow === user.srNo ? "bg-[#E8F1FD]" : "hover:bg-gray-50"
                } ${idx !== filteredUsers.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <td className="px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-sm font-semibold text-[#0B63C1]">
                    {user.srNo}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-[#0B63C1]">
                      {user.shortName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <Phone size={11} className="text-[#0B63C1]" />
                      {user.phone}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <Mail size={11} className="text-[#0B63C1]" />
                      {user.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.userName}</td>
                <td className="px-4 py-3">
                  {user.assigned && (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50">
                      <AlertTriangle size={16} className="text-red-500" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-gray-100 px-4 py-3">
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft size={15} />
          Back
        </button>

        {PAGINATION_ITEMS.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => setCurrentPage(item)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium ${
                currentPage === item
                  ? "bg-[#0B63C1] text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => setCurrentPage((p) => p + 1)}
          className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              onClose={() => setIsFilterOpen(false)}
              onApply={handleFilterApply}
              initialValues={filters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
