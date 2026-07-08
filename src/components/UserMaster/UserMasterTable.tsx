import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpDown,
  MoreVertical,
  ExternalLink,
  Phone,
  Mail,
  SquarePenIcon,
  Eye,
  KeyRound,
  Lock,
  Power,
  LucideIcon,
} from "lucide-react";
import UserDetailsModal from "./UserDetailsModal";
import EditMobileEmailModal from "../common/EditMobileEmailModal";
import SetUserPasswordModal, { type SetUserPasswordData } from "./SetUserPassword";
import SetOtpModal, { type SetOtpData } from "./SetOTP";
import { type UserFilters } from "./FilterModal";

/* ===================== Types ===================== */

export type UserStatus = "Active" | "Inactive";

export type FieldType = "mobile" | "email";

export interface UserRow {
  sr: number;
  code: string;
  phone: string;
  email: string;
  status: UserStatus;
  name: string;
  role: string;
  createdBy: string;
  date: string;
  branchCode: string;
  branchName: string;
  // Optional fields referenced when mapping a row to modal form data
  customerId?: string;
  employeeCode?: string;
}

export type SortableRowKey = Extract<
  keyof UserRow,
  "code" | "status" | "name" | "role" | "createdBy" | "date" | "branchCode" | "branchName"
>;

interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
  sortKey?: SortableRowKey;
}

type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortableRowKey;
  direction: SortDirection;
}

interface EditState {
  sr: number;
  fieldType: FieldType;
}

type ModalMode = "view" | "edit";

interface ModalState {
  mode: ModalMode;
  row: UserRow;
}

export interface UserFormData {
  userId: string;
  userName: string;
  customerId: string;
  employeeCode: string;
  branchCode: string;
  branchName: string;
  mobileNumber: string;
  emailId: string;
}

const columns: ColumnDef[] = [
  { key: "srNo", label: "Sr No.", sortable: false },
  { key: "action", label: "Action", sortable: false },
  { key: "userDetails", label: "User Details", sortable: true, sortKey: "code" },
  { key: "status", label: "Status", sortable: true, sortKey: "status" },
  { key: "name", label: "User Name", sortable: true, sortKey: "name" },
  { key: "role", label: "User Role", sortable: true, sortKey: "role" },
  { key: "createdBy", label: "Created By", sortable: true, sortKey: "createdBy" },
  { key: "date", label: "Created Date", sortable: true, sortKey: "date" },
  { key: "branchCode", label: "Branch Code", sortable: true, sortKey: "branchCode" },
  { key: "branchName", label: "Branch Name", sortable: true, sortKey: "branchName" },
];

const ROWS: UserRow[] = [
  { sr: 1, code: "AMT", phone: "8989567890", email: "akshay@gmail.com", status: "Active", name: "Appana M Telagi", role: "Administrator", createdBy: "Head Office", date: "26-Jun-2026", branchCode: "0002", branchName: "Bilagi" },
  { sr: 2, code: "POS", phone: "2345678901", email: "priya.singh@example.com", status: "Active", name: "Priya Om Singh", role: "Clerk", createdBy: "Head Office", date: "15-Dec-2025", branchCode: "0003", branchName: "Dharwad" },
  { sr: 3, code: "JHD", phone: "3456789012", email: "john.doe@mail.com", status: "Active", name: "John Harry Doe", role: "Officer", createdBy: "Head Office", date: "10-Jan-2026", branchCode: "0004", branchName: "Hubli" },
  { sr: 4, code: "SSC", phone: "4567890123", email: "sara.connor@domain.com", status: "Active", name: "Sara Smith Connor", role: "Clerk", createdBy: "Head Office", date: "05-Mar-2024", branchCode: "0005", branchName: "Bagalkot" },
  { sr: 5, code: "MSJ", phone: "5678901234", email: "mike.jones@web.com", status: "Active", name: "Mike Smith Jones", role: "Officer", createdBy: "Admin", date: "20-Jul-2023", branchCode: "0006", branchName: "Gadag" },
  { sr: 6, code: "LDB", phone: "6789012345", email: "linda.brown@service.com", status: "Active", name: "Linda David Brown", role: "Clerk", createdBy: "Admin", date: "30-Nov-2025", branchCode: "0007", branchName: "Koppal" },
  { sr: 7, code: "JSB", phone: "7890123456", email: "james.smith@work.net", status: "Active", name: "James Smith Brown", role: "Clerk", createdBy: "Admin", date: "12-Aug-2024", branchCode: "0008", branchName: "Vijayapura" },
  { sr: 8, code: "KWB", phone: "8901234567", email: "karen.williams@co.com", status: "Active", name: "Karen Williams Brown", role: "Officer", createdBy: "Admin", date: "22-Apr-2026", branchCode: "0009", branchName: "Haveri" },
  { sr: 9, code: "DJB", phone: "9012345678", email: "david.johnson@place.org", status: "Active", name: "David Johnson Brown", role: "Officer", createdBy: "Admin", date: "18-Sep-2023", branchCode: "0010", branchName: "Chitradurga" },
];

/* ===================== StatusBadge ===================== */

interface StatusBadgeProps {
  status: UserStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium ${
        isActive
          ? "border-emerald-500 bg-emerald-50 text-emerald-600"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      <span className={`h-2 w-1.5 rounded-full ${isActive ? "bg-emerald-700" : "bg-slate-400"}`} />
      {status}
      <ExternalLink size={12} />
    </span>
  );
}

/* ===================== ContactLine ===================== */

interface ContactLineProps {
  icon: LucideIcon;
  value: string;
  onEdit: () => void;
}

function ContactLine({ icon: Icon, value, onEdit }: ContactLineProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-primary">
      <Icon size={14} className="text-black shrink-0" />
      <span className="truncate">{value}</span>
      <button type="button" onClick={onEdit} className="text-primary hover:text-primary-700" aria-label="Edit">
        <SquarePenIcon size={16} />
      </button>
    </span>
  );
}

/* ===================== ActionMenuButton ===================== */

interface ActionMenuButtonProps {
  row: UserRow;
  onView?: (row: UserRow) => void;
  onEdit?: (row: UserRow) => void;
  onSetOtp?: (row: UserRow) => void;
  onSetPassword?: (row: UserRow) => void;
  onToggleStatus?: (row: UserRow) => void;
}

interface ActionMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
}

/**
 * Three-dot action menu.
 * Options: View, Edit, Set OTP, Set Password, Enable/Disable (toggles based on current status).
 * Each handler is optional — pass them down from the parent to hook up real behavior.
 */
function ActionMenuButton({
  row,
  onView,
  onEdit,
  onSetOtp,
  onSetPassword,
  onToggleStatus,
}: ActionMenuButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const items: ActionMenuItem[] = [
    { label: "View", icon: Eye, onClick: () => onView?.(row) },
    { label: "Edit", icon: SquarePenIcon, onClick: () => onEdit?.(row) },
    { label: "Set/Rest Password", icon: Lock, onClick: () => onSetPassword?.(row) },
    { label: "Set OTP", icon: KeyRound, onClick: () => onSetOtp?.(row) },
    { label: "User Enable/ Disable", icon: Power, onClick: () => onToggleStatus?.(row) },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-gray-400 hover:text-gray-600"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div role="menu" className="absolute left-6 top-10 z-20 w-64 rounded-xl border border-primary-200 bg-white py-2 shadow-lg">
          {items.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => {
                onClick();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-50"
            >
              <Icon size={16} className="text-primary" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================== UserTable ===================== */

export interface UserTableProps {
  rows?: UserRow[];
  filters?: UserFilters;
  onView?: (row: UserRow) => void;
  onEdit?: (row: UserRow) => void;
  onSetOtp?: (row: UserRow) => void;
  onSetPassword?: (row: UserRow) => void;
}

export default function UserMasterTable({
  rows: initialRows = ROWS,
  filters,
  onView,
  onEdit,
  onSetOtp,
  onSetPassword,
}: UserTableProps) {
  const [rows, setRows] = useState<UserRow[]>(initialRows);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [passwordRow, setPasswordRow] = useState<UserRow | null>(null);
  const [otpRow, setOtpRow] = useState<UserRow | null>(null);

  const rowToFormData = (row: UserRow): UserFormData => ({
    userId: row.code,
    userName: row.name,
    customerId: row.customerId ?? "",
    employeeCode: row.employeeCode ?? "",
    branchCode: row.branchCode,
    branchName: row.branchName,
    mobileNumber: row.phone,
    emailId: row.email,
  });

  const handleSort = (col: ColumnDef) => {
    if (!col.sortable || !col.sortKey) return;
    const sortKey = col.sortKey;
    setSortConfig((prev) => {
      if (!prev || prev.key !== sortKey) {
        return { key: sortKey, direction: "asc" };
      }
      if (prev.direction === "asc") return { key: sortKey, direction: "desc" };
      return null; // third click clears sorting
    });
  };

  const filteredRows = useMemo(() => {
    if (!filters) return rows;
    return rows.filter((r) => {
      if (filters.userName && !r.name.toLowerCase().includes(filters.userName.toLowerCase())) return false;
      if (filters.userId && !r.code.toLowerCase().includes(filters.userId.toLowerCase())) return false;
      if (filters.status && r.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      return true;
    });
  }, [rows, filters]);

  const sortedRows = useMemo(() => {
    if (!sortConfig) return filteredRows;
    const { key, direction } = sortConfig;
    const sorted = [...filteredRows].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredRows, sortConfig]);

  const handleToggleStatus = (row: UserRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.sr === row.sr
          ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" }
          : r
      )
    );
  };

  const openFieldEdit = (sr: number, fieldType: FieldType) =>
    setEditState({ sr, fieldType });
  const closeFieldEdit = () => setEditState(null);

  const editingRow = editState ? rows.find((r) => r.sr === editState.sr) : null;
  const editingValue =
    editingRow && editState
      ? editState.fieldType === "mobile"
        ? editingRow.phone
        : editingRow.email
      : "";

  const handleSubmitFieldEdit = (newValue: string) => {
    if (!editState) return;
    setRows((prev) =>
      prev.map((r) => {
        if (r.sr !== editState.sr) return r;
        return editState.fieldType === "mobile"
          ? { ...r, phone: newValue }
          : { ...r, email: newValue };
      })
    );
  };

  const handleView = (row: UserRow) => {
    setModalState({ mode: "view", row });
  };

  const handleEdit = (row: UserRow) => {
    setModalState({ mode: "edit", row });
  };

  const handleSetPassword = (row: UserRow) => {
    setPasswordRow(row);
    onSetPassword?.(row);
  };

  const handleSubmitPassword = (_data: SetUserPasswordData) => {
    // hook up API call to persist the new password here
    setPasswordRow(null);
  };

  const handleSetOtp = (row: UserRow) => {
    setOtpRow(row);
    onSetOtp?.(row);
  };

  const handleSubmitOtp = (_data: SetOtpData) => {
    // hook up API call to persist the generated OTP here
    setOtpRow(null);
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary rounded-t-xl">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={`text-left text-[16px] font-semibold text-white px-4 py-2 whitespace-nowrap ${
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
            {sortedRows.map((r, idx) => (
              <tr
                key={r.sr}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50`}
              >
                <td className="px-6 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-primary text-sm font-semibold">
                    {r.sr}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <ActionMenuButton
                    row={r}
                    onView={handleView}
                    onEdit={handleEdit}
                    onSetOtp={handleSetOtp}
                    onSetPassword={handleSetPassword}
                    onToggleStatus={handleToggleStatus}
                  />
                </td>
                <td className="px-6 py-3 text-[16px] text-primary">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-black">{r.code}</span>
                    <ContactLine icon={Phone} value={r.phone} onEdit={() => openFieldEdit(r.sr, "mobile")} />
                    <ContactLine icon={Mail} value={r.email} onEdit={() => openFieldEdit(r.sr, "email")} />
                  </div>
                </td>
                <td className="px-6 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{r.name}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{r.role}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{r.createdBy}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{r.date}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{r.branchCode}</td>
                <td className="px-6 py-3 text-[16px] text-gray-700">{r.branchName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditMobileEmailModal
        open={!!editState}
        fieldType={editState?.fieldType}
        initialValue={editingValue}
        userId={editingRow?.code}
        userName={editingRow?.name}
        onClose={closeFieldEdit}
        onSubmit={handleSubmitFieldEdit}
      />

      <UserDetailsModal
        open={!!modalState}
        mode={modalState?.mode}
        initialData={modalState ? rowToFormData(modalState.row) : undefined}
        onClose={() => setModalState(null)}
        onSubmit={(updatedData: UserFormData) => {
          // persist updatedData back into your rows state here
        }}
      />

      <SetUserPasswordModal
        open={!!passwordRow}
        userId={passwordRow?.code}
        userName={passwordRow?.name}
        onClose={() => setPasswordRow(null)}
        onSubmit={handleSubmitPassword}
      />

      <SetOtpModal
        open={!!otpRow}
        userId={otpRow?.code}
        userName={otpRow?.name}
        onClose={() => setOtpRow(null)}
        onSubmit={handleSubmitOtp}
      />
    </div>
  );
}
