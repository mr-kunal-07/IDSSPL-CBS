"use client";
import { useState, useRef, useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { ArrowUpDown, MoreVertical, ExternalLink, Eye, SquarePen, UserRoundCog } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import { type AccountFilters } from "../shared/FilterModal";

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

const menuOptions = [
  { key: "view", labelKey: "common.view", icon: Eye },
  { key: "edit", labelKey: "common.edit", icon: SquarePen },
  { key: "freeze", labelKey: "accountMaster.table.menuFreeze", icon: UserRoundCog },
  { key: "cheque", labelKey: "accountMaster.table.menuCheque", icon: UserRoundCog }
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
  const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuRow(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recalculate menu position on scroll (both vertical and horizontal)
  useEffect(() => {
    const handleScroll = () => {
      if (openMenuRow !== null) {
        const button = buttonRefs.current[openMenuRow];
        if (button) {
          calculateMenuPosition(button);
        }
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [openMenuRow]);

  const calculateMenuPosition = (button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    
    // Calculate the actual menu height based on number of options
    // Each option is ~40px tall (padding + text height)
    const optionHeight = 40;
    const menuPadding = 16; // py-2 = 8px top + 8px bottom
    const menuHeight = (menuOptions.length * optionHeight) + menuPadding;
    
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Check if there's enough space below (with some padding)
    const showBelow = spaceBelow > menuHeight + 20;
    
    let topPosition: number;
    
    if (showBelow) {
      // Show below the button
      topPosition = rect.bottom + window.scrollY + 4;
    } else {
      // Show above the button
      topPosition = rect.top + window.scrollY - menuHeight - 4;
      
      // If menu would go above viewport, clamp it to 10px from top
      if (topPosition < 10) {
        topPosition = 10;
      }
    }
    
    // Calculate left position - always align to the three dots button
    let leftPosition = rect.left + window.scrollX - 40;
    const menuWidth = 256; // w-64 = 256px
    
    // If menu would go off the right side of viewport, adjust
    if (leftPosition + menuWidth > window.innerWidth - 10) {
      leftPosition = window.innerWidth - menuWidth - 10;
    }
    
    // If menu would go off the left side of viewport, adjust
    if (leftPosition < 10) {
      leftPosition = 10;
    }
    
    setMenuPosition({
      top: topPosition,
      left: leftPosition,
    });
  };

  const handleSort = (key: keyof RowData) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleMenuToggle = (srNo: number) => {
    if (openMenuRow === srNo) {
      setOpenMenuRow(null);
      setMenuPosition(null);
      return;
    }

    // Use requestAnimationFrame to ensure button is rendered
    requestAnimationFrame(() => {
      const button = buttonRefs.current[srNo];
      if (button) {
        calculateMenuPosition(button);
      }
      setOpenMenuRow(srNo);
    });
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
      <div 
        ref={tableContainerRef}
        className="table-container relative overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
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
                  <span className="inline-flex items-center gap-1">
                    {tRaw(col.labelKey)}
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
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 relative`}
              >
                <td className="px-6 py-3" style={{ width: "80px" }}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-primary text-sm font-semibold">
                    {row.srNo}
                  </span>
                </td>
                
                {/* Action column */}
                <td className="px-6 py-3 relative" style={{ width: "80px" }}>
                  <button
                    ref={(el) => { buttonRefs.current[row.srNo] = el; }}
                    onClick={() => handleMenuToggle(row.srNo)}
                    className="text-gray-400 hover:text-gray-600 relative z-10"
                  >
                    <MoreVertical size={18} />
                  </button>
                </td>
                <td className="px-6 py-3 text-[16px] text-gray-700 truncate" style={{ width: "180px" }}>{row.applicationNo}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-900 truncate" style={{ width: "180px" }}>{row.accountId}</td>
                <td className="px-6 py-3" style={{ width: "140px" }}>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 whitespace-nowrap">
                    <span className="h-2 w-1.5 rounded-full bg-emerald-700" />
                    {row.status === "Live" ? tRaw("accountMaster.table.statusLive") : row.status}
                    <ExternalLink size={12} />
                  </span>
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

      {/* Menu dropdown with smart positioning */}
      {openMenuRow !== null && menuPosition && (
        <div
          ref={menuRef}
          className="fixed z-50 w-64 rounded-xl border border-primary-200 bg-white py-2 shadow-lg"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            maxHeight: 'min(300px, 80vh)',
            overflowY: 'auto'
          }}
        >
          {menuOptions.map((opt) => {
            const Icon = opt.icon;
            const row = sortedRows.find(r => r.srNo === openMenuRow);
            return (
              <button
                key={opt.key}
                onClick={() => {
                  setOpenMenuRow(null);
                  setMenuPosition(null);
                  if (!row) return;
                  if (opt.key === "view") onView?.(row);
                  if (opt.key === "edit") onEdit?.(row);
                  if (opt.key === "cheque") onChequeBookIssue?.(row);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <Icon size={16} className="text-primary shrink-0" />
                <span className="text-gray-700">{tRaw(opt.labelKey)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountMasterTable;