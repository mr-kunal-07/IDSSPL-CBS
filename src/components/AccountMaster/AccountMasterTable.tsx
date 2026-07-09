"use client";
import { useState } from "react";
import { Eye, SquarePen, UserRoundCog } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import { type AccountFilters } from "../shared/FilterModal";
import RowActionMenu from "../shared/RowActionMenu";
import SrNoBadge from "../shared/SrNoBadge";
import StatusPill from "../shared/StatusPill";
import SortableHeaderLabel from "../shared/SortableHeaderLabel";

export type RowData = {
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
  { key: "srNo", labelKey: "accountMaster.table.srNo", sortable: false, width: "80px" },
  { key: "action", labelKey: "accountMaster.table.action", sortable: false, width: "80px" },
  { key: "applicationNo", labelKey: "accountMaster.table.applicationNo", sortable: false, width: "180px" },
  { key: "accountId", labelKey: "accountMaster.table.accountId", sortable: true, width: "180px" },
  { key: "status", labelKey: "accountMaster.table.status", sortable: true, width: "140px" },
  { key: "customerId", labelKey: "accountMaster.table.customerId", sortable: true, width: "160px" },
  { key: "accountName", labelKey: "fields.accountName", sortable: true, width: "200px" },
  { key: "accountType", labelKey: "fields.accountType", sortable: true, width: "180px" },
  { key: "createdBy", labelKey: "accountMaster.table.createdBy", sortable: true, width: "160px" },
  { key: "openingDate", labelKey: "accountMaster.table.openingDate", sortable: true, width: "160px" },
] as const;

const rows: RowData[] = [
  { srNo: 1, accountId: "000320100000001", status: "Live", customerId: "0003000001", accountName: "Akshay Om More", accountType: "Saving Deposit", createdBy: "Admin", applicationNo: "00326270000001", openingDate: "12-Jan-2024" },
  { srNo: 2, accountId: "000320100000002", status: "Live", customerId: "0003000002", accountName: "Nitish Sai Readdy", accountType: "Term Deposit", createdBy: "Admin", applicationNo: "00326270000002", openingDate: "03-Mar-2024" },
  { srNo: 3, accountId: "000320100000003", status: "Live", customerId: "0003000003", accountName: "Karan Patil", accountType: "Term Loan", createdBy: "Admin", applicationNo: "00326270000003", openingDate: "21-Jun-2024" },
];

type AccountMasterTableProps = {
  filters?: AccountFilters;
  onView?: (row: RowData) => void;
  onEdit?: (row: RowData) => void;
  onChequeBookIssue?: (row: RowData) => void;
};

const AccountMasterTable = ({ filters, onView, onEdit, onChequeBookIssue }: AccountMasterTableProps) => {
  const { tRaw } = useBilingual();
  const [sortKey, setSortKey] = useState<keyof RowData | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: keyof RowData) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = rows.filter((r) => {
    if (!filters) return true;
    if (filters.accountName && !r.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) return false;
    if (filters.accountNumber && !r.accountId.toLowerCase().includes(filters.accountNumber.toLowerCase())) return false;
    if (filters.accountType && r.accountType.toLowerCase() !== filters.accountType.toLowerCase()) return false;
    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full bg-white rounded-xl overflow-visible shadow-sm">
      {/* Table container with relative positioning and hidden scrollbar */}
      <div className="table-container relative overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[1520px] table-fixed">
          <thead>
            <tr className="bg-primary rounded-t-xl">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as keyof RowData)}
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{ width: col.width }}
                >
                  <SortableHeaderLabel label={tRaw(col.labelKey)} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr
                key={row.accountId}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 relative`}
              >
                <td className="px-6 py-3" style={{ width: "80px" }}>
                  <SrNoBadge value={row.srNo} />
                </td>

                {/* Action column */}
                <td className="px-6 py-3 relative" style={{ width: "80px" }}>
                  <RowActionMenu
                    items={[
                      { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => onView?.(row) },
                      { key: "edit", label: tRaw("common.edit"), icon: SquarePen, onClick: () => onEdit?.(row) },
                      { key: "freeze", label: tRaw("accountMaster.table.menuFreeze"), icon: UserRoundCog, onClick: () => {} },
                      { key: "cheque", label: tRaw("accountMaster.table.menuCheque"), icon: UserRoundCog, onClick: () => onChequeBookIssue?.(row) },
                    ]}
                  />
                </td>
                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "180px" }}>{row.applicationNo}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-900 truncate" style={{ width: "180px" }}>{row.accountId}</td>
                <td className="px-6 py-3" style={{ width: "140px" }}>
                  <StatusPill label={row.status === "Live" ? tRaw("accountMaster.table.statusLive") : row.status} />
                </td>
                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "160px" }}>{row.customerId}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "200px" }}>{row.accountName}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "180px" }}>{row.accountType}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "160px" }}>{row.createdBy}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "160px" }}>{row.openingDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountMasterTable;
