"use client";
import { useState, useRef, useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { ArrowUpDown, MoreVertical, ExternalLink, Eye, SquarePen, UserRoundCog } from "lucide-react";

type RowData = {
  srNo: number;
  accountId: string;
  status: string;
  customerId: string;
  accountName: string;
  accountType: string;
  createdBy: string;
  applicationNo: string;
  openingDate: string;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false },
  { key: "applicationNo", label: "Application No.", sortable: false },
  { key: "accountId", label: "Account ID", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "customerId", label: "Customer ID", sortable: true },
  { key: "accountName", label: "Account Name", sortable: true },
  { key: "accountType", label: "Account Type", sortable: true },
  { key: "createdBy", label: "Created By", sortable: true },
  { key: "openingDate", label: "Opening Date", sortable: true },
] as const;

const rows: RowData[] = [
  { srNo: 1, accountId: "000320100000001", status: "Live", customerId: "0003000001", accountName: "Akshay Om More", accountType: "Saving Deposit", createdBy: "Admin", applicationNo: "00326270000001", openingDate: "12-Jan-2024" },
  { srNo: 2, accountId: "000320100000002", status: "Live", customerId: "0003000002", accountName: "Nitish Sai Readdy", accountType: "Term Deposit", createdBy: "Admin", applicationNo: "00326270000002", openingDate: "03-Mar-2024" },
  { srNo: 3, accountId: "000320100000003", status: "Live", customerId: "0003000003", accountName: "Karan Patil", accountType: "Term Loan", createdBy: "Admin", applicationNo: "00326270000003", openingDate: "21-Jun-2024" },
];

const menuOptions = [
  { key: "view", label: "View", icon: Eye },
  { key: "edit", label: "Edit", icon: SquarePen },
  { key: "freeze", label: "Account Freeze / Unfreeze", icon: UserRoundCog },
];

const AccountMasterTable = () => {
  const [activeTab, setActiveTab] = useState("Deposit");
  const [sortKey, setSortKey] = useState<keyof RowData | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key: keyof RowData) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">

      {/* Table */}
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0B63C1] rounded-t-xl">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as keyof RowData)}
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpDown size={13} className="opacity-80" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr
                key={row.accountId}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50`}
              >
                <td className="px-6 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[#0B63C1] text-sm font-semibold">
                    {row.srNo}
                  </span>
                </td>
                
                <td className="px-6 py-3 relative">
                  <button
                    onClick={() => setOpenMenuRow(openMenuRow === row.srNo ? null : row.srNo)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuRow === row.srNo && (
                    <div
                      ref={menuRef}
                      className="absolute left-6 top-10 z-10 w-64 rounded-xl border border-blue-200 bg-white py-2 shadow-lg"
                    >
                      {menuOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.key}
                            onClick={() => setOpenMenuRow(null)}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            <Icon size={16} className="text-blue-600" />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </td>
                                  <td className="px-6 py-3 text-[16px] text-gray-700">{row.applicationNo}</td>

                <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.accountId}</td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                    <span className="h-2 w-1.5 rounded-full bg-emerald-700" />
                    {row.status}
                    <ExternalLink size={12} />
                  </span>
                </td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{row.customerId}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{row.accountName}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{row.accountType}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{row.createdBy}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{row.openingDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountMasterTable;