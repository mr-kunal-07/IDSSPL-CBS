import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Phone,
  Mail,
  Pencil,
  SquareArrowOutUpRight,
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
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${
        isActive
          ? "bg-green-100 border-green-500"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-green-500" : "bg-slate-400"
        }`}
      />
      <span
        className={`text-sm font-medium ${
          isActive ? "text-green-700" : "text-slate-600"
        }`}
      >
        {status}
      </span>
      <SquareArrowOutUpRight
        className={`w-3 h-3 ${
          isActive ? "text-green-700" : "text-slate-600"
        }`}
      />
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
    <div className="flex items-center gap-1.5 text-blue-700 min-w-0">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="text-sm sm:text-base font-medium truncate">{value}</span>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 p-0.5 rounded hover:bg-blue-50"
        aria-label="Edit"
      >
        <Pencil className="w-3.5 h-3.5 text-blue-700 cursor-pointer" />
      </button>
    </div>
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

  // isActive kept for parity with original implementation, even though it's
  // not currently used to alter the menu items shown.
  const isActive = row.status === "Active";

  const items: ActionMenuItem[] = [
    { label: "View", icon: Eye, onClick: () => onView?.(row) },
    { label: "Edit", icon: Pencil, onClick: () => onEdit?.(row) },
    { label: "Set/Rest Password", icon: Lock, onClick: () => onSetPassword?.(row) },
    { label: "Set OTP", icon: KeyRound, onClick: () => onSetOtp?.(row) },
    {
      label: "User Enable/ Disable",
      icon: Power,
      onClick: () => onToggleStatus?.(row),
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-20 right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 overflow-hidden"
        >
          {items.map(({ label, icon: Icon, onClick, danger }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => {
                onClick();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium text-left hover:bg-slate-50 transition-colors ${
                danger ? "text-red-600" : "text-slate-700"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================== SortableHeader ===================== */

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
        direction === "asc" ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
      )}
    </span>
  );
}

/* ===================== UserTable ===================== */

export interface UserTableProps {
  rows?: UserRow[];
  onView?: (row: UserRow) => void;
  onEdit?: (row: UserRow) => void;
  onSetOtp?: (row: UserRow) => void;
  onSetPassword?: (row: UserRow) => void;
}

export default function UserMasterTable({
  rows: initialRows = ROWS,
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

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;
    const { key, direction } = sortConfig;
    const sorted = [...rows].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [rows, sortConfig]);

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
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* ===================== DESKTOP / TABLET TABLE (md and up) ===================== */}
        <table className="hidden md:table w-full border-collapse">
          <thead>
            <tr className="bg-[#0B63C1] rounded-t-xl">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  {col.sortable ? (
                    <SortableHeader
                      label={col.label}
                      active={sortConfig?.key === col.sortKey}
                      direction={
                        sortConfig && sortConfig.key === col.sortKey
                          ? sortConfig.direction
                          : null
                      }
                    />
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedRows.map((r) => (
              <tr key={r.sr} className="bg-white hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 align-middle">
                  <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 rounded-md text-blue-700 text-sm font-semibold">
                    {r.sr}
                  </span>
                </td>
                <td className="px-3 py-3 align-middle">
                  <ActionMenuButton
                    row={r}
                    onView={handleView}
                    onEdit={handleEdit}
                    onSetOtp={handleSetOtp}
                    onSetPassword={handleSetPassword}
                    onToggleStatus={handleToggleStatus}
                  />
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-slate-900 text-base font-medium uppercase">
                      {r.code}
                    </div>
                    <ContactLine icon={Phone} value={r.phone} onEdit={() => openFieldEdit(r.sr, "mobile")} />
                    <ContactLine icon={Mail} value={r.email} onEdit={() => openFieldEdit(r.sr, "email")} />
                  </div>
                </td>
                <td className="px-3 py-3 align-middle">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-3 py-3 align-middle text-slate-800 text-sm font-medium capitalize">
                  {r.name}
                </td>
                <td className="px-3 py-3 align-middle text-slate-800 text-sm font-medium capitalize">
                  {r.role}
                </td>
                <td className="px-3 py-3 align-middle text-slate-800 text-sm font-medium capitalize">
                  {r.createdBy}
                </td>
                <td className="px-3 py-3 align-middle text-slate-800 text-sm font-medium">
                  {r.date}
                </td>
                <td className="px-3 py-3 align-middle text-slate-800 text-sm font-medium">
                  {r.branchCode}
                </td>
                <td className="px-6 py-3 align-middle text-slate-800 text-sm font-medium capitalize">
                  {r.branchName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===================== MOBILE CARD LIST (below md) ===================== */}
        <div className="md:hidden divide-y divide-slate-200">
          {sortedRows.map((r) => (
            <div key={r.sr} className="p-4 bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 bg-indigo-50 rounded-md text-blue-700 text-xs font-semibold">
                    {r.sr}
                  </span>
                  <span className="text-slate-900 text-base font-semibold uppercase">
                    {r.code}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  <ActionMenuButton
                    row={r}
                    onView={onView}
                    onEdit={onEdit}
                    onSetOtp={handleSetOtp}
                    onSetPassword={handleSetPassword}
                    onToggleStatus={handleToggleStatus}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-3">
                <ContactLine icon={Phone} value={r.phone} onEdit={() => openFieldEdit(r.sr, "mobile")} />
                <ContactLine icon={Mail} value={r.email} onEdit={() => openFieldEdit(r.sr, "email")} />
              </div>

              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div>
                  <dt className="text-slate-400 text-xs">User Name</dt>
                  <dd className="text-slate-800 font-medium capitalize">{r.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 text-xs">User Role</dt>
                  <dd className="text-slate-800 font-medium capitalize">{r.role}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 text-xs">Created By</dt>
                  <dd className="text-slate-800 font-medium capitalize">{r.createdBy}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 text-xs">Created Date</dt>
                  <dd className="text-slate-800 font-medium">{r.date}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 text-xs">Branch Code</dt>
                  <dd className="text-slate-800 font-medium">{r.branchCode}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 text-xs">Branch Name</dt>
                  <dd className="text-slate-800 font-medium capitalize">{r.branchName}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>

      <EditMobileEmailModal
        open={!!editState}
        fieldType={editState?.fieldType}
        initialValue={editingValue}
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