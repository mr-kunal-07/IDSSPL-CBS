"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpDown, ChevronUp, ChevronDown, MoreVertical, Eye, Landmark, CreditCard, Receipt } from "lucide-react";
import { emptyBranchFormData, type BranchFormData } from "./AddBranchModal";

export interface BranchRow {
  sr: number;
  branchCode: string;
  ifscCode: string;
  branchName: string;
  shortName: string;
  address: string;
  cityCode: string;
  emailId: string;
  phoneNo: string;
  isImplemented: "Y" | "N";
}

type SortableRowKey = Exclude<keyof BranchRow, "sr">;

interface ColumnDef {
  key: string;
  label: string;
  sortKey?: SortableRowKey;
}

type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortableRowKey;
  direction: SortDirection;
}

const columns: ColumnDef[] = [
  { key: "branchCode", label: "Branch Code", sortKey: "branchCode" },
  { key: "ifscCode", label: "IFSC Code", sortKey: "ifscCode" },
  { key: "branchName", label: "Branch Name", sortKey: "branchName" },
  { key: "shortName", label: "Short Name", sortKey: "shortName" },
  { key: "address", label: "Address", sortKey: "address" },
  { key: "cityCode", label: "City Code", sortKey: "cityCode" },
  { key: "emailId", label: "Email ID", sortKey: "emailId" },
  { key: "phoneNo", label: "Phone No.", sortKey: "phoneNo" },
  { key: "isImplemented", label: "Is Implemented", sortKey: "isImplemented" },
];

export const DEFAULT_BRANCH_ROWS: BranchRow[] = [
  { sr: 1, branchCode: "0100", ifscCode: "ILKA0000001", branchName: "Ilkal Branch", shortName: "Ikala", address: "Gongada Shetti Building", cityCode: "Ilkal", emailId: "bilagiur@yahoo.com", phoneNo: "9876543210", isImplemented: "Y" },
  { sr: 2, branchCode: "0200", ifscCode: "CHIK0000001", branchName: "Chikmagalur Branch", shortName: "Chikmagalur", address: "Mysore Road Complex", cityCode: "Chikmagalur", emailId: "chikmagalur@domain.com", phoneNo: "9876543211", isImplemented: "Y" },
  { sr: 3, branchCode: "0300", ifscCode: "DAVA0000001", branchName: "Davangere Branch", shortName: "Davangere", address: "Mohan Towers", cityCode: "Davangere", emailId: "davangere@domain.com", phoneNo: "9876543212", isImplemented: "Y" },
  { sr: 4, branchCode: "0400", ifscCode: "HAVE0000001", branchName: "Haveri Branch", shortName: "Haveri", address: "Mallikharjuna Complex", cityCode: "Haveri", emailId: "haveri@domain.com", phoneNo: "9876543213", isImplemented: "Y" },
  { sr: 5, branchCode: "0500", ifscCode: "BAGA0000001", branchName: "Bagalkot Branch", shortName: "Bagalkot", address: "Gadad Complex", cityCode: "Bagalkot", emailId: "bagalkot@domain.com", phoneNo: "9876543214", isImplemented: "Y" },
  { sr: 6, branchCode: "0600", ifscCode: "KOPP0000001", branchName: "Koppal Branch", shortName: "Koppal", address: "Ravi Towers", cityCode: "Koppal", emailId: "koppal@domain.com", phoneNo: "9876543215", isImplemented: "Y" },
  { sr: 7, branchCode: "0700", ifscCode: "BELA0000001", branchName: "Belagavi Branch", shortName: "Belagavi", address: "Shivaji Chowk", cityCode: "Belagavi", emailId: "belagavi@domain.com", phoneNo: "9876543216", isImplemented: "N" },
  { sr: 8, branchCode: "0800", ifscCode: "UDUP0000001", branchName: "Udupi Branch", shortName: "Udupi", address: "Karnataka Towers", cityCode: "Udupi", emailId: "udupi@domain.com", phoneNo: "9876543217", isImplemented: "N" },
  { sr: 9, branchCode: "0900", ifscCode: "KARW0000001", branchName: "Karwar Branch", shortName: "Karwar", address: "Navy Nagar Complex", cityCode: "Karwar", emailId: "karwar@domain.com", phoneNo: "9876543218", isImplemented: "N" },
  { sr: 10, branchCode: "1000", ifscCode: "RANE0000001", branchName: "Ranebennur Branch", shortName: "Ranebennur", address: "Market Yard", cityCode: "Ranebennur", emailId: "ranebennur@domain.com", phoneNo: "9876543219", isImplemented: "N" },
  { sr: 11, branchCode: "1100", ifscCode: "KOLA0000001", branchName: "Kolar Branch", shortName: "Kolar", address: "Kolar Gold Fields", cityCode: "Kolar", emailId: "kolar@domain.com", phoneNo: "9876543220", isImplemented: "N" },
  { sr: 12, branchCode: "1200", ifscCode: "SIRS0000001", branchName: "Sirsi Branch", shortName: "Sirsi", address: "Puttaraj Gali", cityCode: "Sirsi", emailId: "sirsi@domain.com", phoneNo: "9876543221", isImplemented: "N" },
  { sr: 13, branchCode: "1300", ifscCode: "SHIM0000001", branchName: "Shimoga Branch", shortName: "Shimoga", address: "Basappa Street", cityCode: "Shimoga", emailId: "shimoga@domain.com", phoneNo: "9876543222", isImplemented: "N" },
];

export function rowToBranchFormData(row: BranchRow): BranchFormData {
  return {
    ...emptyBranchFormData,
    branchCode: row.branchCode,
    branchName: row.branchName,
    shortName: row.shortName,
    address1: row.address,
    address2: row.address,
    address3: row.address,
    cityCode: row.cityCode,
    emailId: row.emailId,
    isImplemented: row.isImplemented === "Y" ? "Yes" : "No",
    phoneNumber1: row.phoneNo,
    phoneNumber2: row.phoneNo,
  };
}

interface BadgeProps {
  value: "Y" | "N";
}

function ImplementedBadge({ value }: BadgeProps) {
  const isYes = value === "Y";
  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-0.5 text-xs font-medium ${
        isYes ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-red-200 bg-red-50 text-red-500"
      }`}
    >
      {value}
    </span>
  );
}

interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection | null;
}

function SortableHeader({ label, active, direction }: SortableHeaderProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      {active ? (
        direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
      )}
    </span>
  );
}

export interface BranchActionHandlers {
  onView?: (row: BranchRow) => void;
  onBranchNonCbsParameter?: (row: BranchRow) => void;
  onBranchChequeBookLot?: (row: BranchRow) => void;
  onBranchTdReceiptLot?: (row: BranchRow) => void;
}

interface ActionMenuButtonProps extends BranchActionHandlers {
  row: BranchRow;
}

const MENU_WIDTH = 224;
const MENU_MARGIN = 8;

function ActionMenuButton({ row, onView, onBranchNonCbsParameter, onBranchChequeBookLot, onBranchTdReceiptLot }: ActionMenuButtonProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; openUp: boolean } | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const estimatedMenuHeight = 4 * 32 + 16;
    const openUp = spaceBelow < estimatedMenuHeight + MENU_MARGIN;

    let left = rect.left;
    if (left + MENU_WIDTH > window.innerWidth - MENU_MARGIN) {
      left = window.innerWidth - MENU_WIDTH - MENU_MARGIN;
    }
    left = Math.max(MENU_MARGIN, left);

    const top = openUp ? rect.top - MENU_MARGIN : rect.bottom + MENU_MARGIN;
    setPosition({ top, left, openUp });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleReposition() {
      updatePosition();
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleReposition, true);
      window.addEventListener("resize", handleReposition);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open]);

  const items = [
    { label: "View", icon: Eye, onClick: () => onView?.(row) },
    { label: "Branch Non CBS Parameter", icon: Landmark, onClick: () => onBranchNonCbsParameter?.(row) },
    { label: "Branch Cheque Book Lot", icon: CreditCard, onClick: () => onBranchChequeBookLot?.(row) },
    { label: "Branch TD Receipt Lot", icon: Receipt, onClick: () => onBranchTdReceiptLot?.(row) },
  ];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && position && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: "fixed",
              top: position.openUp ? undefined : position.top,
              bottom: position.openUp ? window.innerHeight - position.top : undefined,
              left: position.left,
              width: MENU_WIDTH,
            }}
            className="z-50 bg-white rounded-lg shadow-lg border border-primary overflow-hidden"
          >
            {items.map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                onClick={() => {
                  onClick();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1 text-sm font-medium text-left text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0 text-primary" />
                {label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

export interface BranchMasterTableProps extends BranchActionHandlers {
  rows?: BranchRow[];
}

export default function BranchMasterTable({
  rows: initialRows = DEFAULT_BRANCH_ROWS,
  onView,
  onBranchNonCbsParameter,
  onBranchChequeBookLot,
  onBranchTdReceiptLot,
}: BranchMasterTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (col: ColumnDef) => {
    if (!col.sortKey) return;
    const sortKey = col.sortKey;
    setSortConfig((prev) => {
      if (!prev || prev.key !== sortKey) return { key: sortKey, direction: "asc" };
      if (prev.direction === "asc") return { key: sortKey, direction: "desc" };
      return null;
    });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return initialRows;
    const { key, direction } = sortConfig;
    return [...initialRows].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [initialRows, sortConfig]);

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Sr No.</th>
              <th className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap">Actions</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className="text-left text-[15px] font-medium text-white px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                >
                  <SortableHeader
                    label={col.label}
                    active={sortConfig?.key === col.sortKey}
                    direction={sortConfig && sortConfig.key === col.sortKey ? sortConfig.direction : null}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              sortedRows.map((r) => (
                <tr key={r.sr} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-primary-700 text-sm font-medium">
                      {r.sr}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <ActionMenuButton
                      row={r}
                      onView={onView}
                      onBranchNonCbsParameter={onBranchNonCbsParameter}
                      onBranchChequeBookLot={onBranchChequeBookLot}
                      onBranchTdReceiptLot={onBranchTdReceiptLot}
                    />
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap">{r.branchCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap">{r.ifscCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap">{r.branchName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap">{r.shortName}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap">{r.address}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap">{r.cityCode}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap">{r.emailId}</td>
                  <td className="px-4 py-3 align-middle text-slate-800 text-sm font-medium whitespace-nowrap">{r.phoneNo}</td>
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    <ImplementedBadge value={r.isImplemented} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
