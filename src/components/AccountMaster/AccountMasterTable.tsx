"use client";
import { useState, useRef, useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { ArrowUpDown, MoreVertical, ExternalLink, Eye, SquarePen, UserRoundCog } from "lucide-react";
import type { AccountFilters } from "../shared/FilterModal";

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
  { key: "action", label: "Action", sortable: false },
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

const AccountMasterTable = ({ filters }: { filters?: AccountFilters }) => {
  const [sortKey, setSortKey] = useState<keyof RowData | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const repositionMenu = () => {
    const btn = triggerRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const estimatedHeight = Math.min(300, menuOptions.length * 44 + 16);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const willOpenTop = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    const menuWidth = 256;
    const horizontalOffset = 12;
    let left = rect.left + horizontalOffset;
    if (left + menuWidth > window.innerWidth - 16) left = window.innerWidth - menuWidth - 16;
    if (left < 8) left = 8;

    if (willOpenTop) {
      const top = rect.top - estimatedHeight - 8;
      setMenuStyle({ position: 'fixed', left, top: Math.max(8, top), minWidth: 220, width: menuWidth, maxHeight: '50vh', overflowY: 'auto' });
      setMenuPosition('top');
    } else {
      const top = rect.bottom + 8;
      setMenuStyle({ position: 'fixed', left, top, minWidth: 220, width: menuWidth, maxHeight: '50vh', overflowY: 'auto' });
      setMenuPosition('bottom');
    }
  };

  useEffect(() => {
    if (openMenuRow == null) return;

    const rafIdRef: { id?: number } = {};
    const onScrollOrResize = () => {
      if (rafIdRef.id) cancelAnimationFrame(rafIdRef.id);
      rafIdRef.id = requestAnimationFrame(() => repositionMenu());
    };

    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    const ro = new ResizeObserver(() => onScrollOrResize());
    if (triggerRef.current) ro.observe(triggerRef.current);
    ro.observe(document.body);

    // initial position
    repositionMenu();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      ro.disconnect();
      if (rafIdRef.id) cancelAnimationFrame(rafIdRef.id);
    };
  }, [openMenuRow]);

  const handleMenuToggle = (e: ReactMouseEvent<HTMLButtonElement>, srNo: number) => {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const estimatedHeight = Math.min(300, menuOptions.length * 44 + 16);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (openMenuRow === srNo) {
      setOpenMenuRow(null);
      setMenuStyle(null);
      triggerRef.current = null;
      return;
    }

    const willOpenTop = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
    setMenuPosition(willOpenTop ? 'top' : 'bottom');

    const menuWidth = 256; // desired menu width in px
    const horizontalOffset = 12; // shift menu slightly to the right
    let left = rect.left + horizontalOffset;
    if (left + menuWidth > window.innerWidth - 16) left = window.innerWidth - menuWidth - 16;
    if (left < 8) left = 8;

    // save trigger so we can reposition while open
    triggerRef.current = btn;

    if (willOpenTop) {
      const top = rect.top - estimatedHeight - 8; // position above the button
      setMenuStyle({ position: 'fixed', left, top: Math.max(8, top), minWidth: 220, width: menuWidth, maxHeight: '50vh', overflowY: 'auto' });
    } else {
      const top = rect.bottom + 8; // position below the button
      setMenuStyle({ position: 'fixed', left, top, minWidth: 220, width: menuWidth, maxHeight: '50vh', overflowY: 'auto' });
    }

    setOpenMenuRow(srNo);
  };

  const handleSort = (key: keyof RowData) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = rows.filter((row) => {
  let match = true;
  if (filters?.accountName) {
    match &&= row.accountName.toLowerCase().includes(filters.accountName.toLowerCase());
  }
  if (filters?.accountNumber) {
    match &&= row.accountId.toLowerCase().includes(filters.accountNumber.toLowerCase());
  }
  if (filters?.accountType) {
    match &&= row.accountType.toLowerCase().includes(filters.accountType.toLowerCase());
  }
  return match;
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
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">

      {/* Table */}
      <div className="overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary rounded-t-xl">
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
                    {col.sortable && <ArrowUpDown size={16} strokeWidth={2.5} className="" />}
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-primary text-sm font-semibold">
                    {row.srNo}
                  </span>
                </td>
                
                <td className="px-6 py-3 relative">
                  <button
                    onClick={(e) => handleMenuToggle(e, row.srNo)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuRow === row.srNo && (
                    <div
                      ref={menuRef}
                      className={`z-50 rounded-xl border border-primary-200 bg-white py-2 shadow-lg`}
                      style={menuStyle ?? { minWidth: 220, maxHeight: '50vh', overflowY: 'auto' }}
                    >
                      {menuOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.key}
                            onClick={() => setOpenMenuRow(null)}
                            className="flex w-full text-black items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            <Icon size={16} className="text-primary" />
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