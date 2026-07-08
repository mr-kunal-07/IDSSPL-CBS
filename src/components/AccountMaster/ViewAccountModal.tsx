"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  IdCard,
  Landmark,
  Coins,
  Wallet,
  FileText,
  ClipboardList,
  Tag,
  UserCog,
  Activity,
  Link2,
  UserCheck,
  AlertTriangle,
  ChevronDown,
  MoreVertical,
  User,
  Percent,
  Home,
  Flag,
  Check,
  Wrench,
  ArrowLeftRight,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AccountDetails {
  accountCode?: string;
  accountName?: string;
  accountOpenDate?: string;
  accountClosedDate?: string;
  customerId?: string;
  customerName?: string;
  createdBy?: string;
  branchCode?: string;
  ledgerBalance?: number | string;
  availableBalance?: number | string;
  minBalanceId?: string;
  lastOperatedDate?: string;
  todApplicable?: string;
  todLimit?: string | number;
  todInterestRate?: string | number;
  todInterest?: string | number;
  accountOperationCapacityId?: string;
  applicationNumber?: string;
  categoryCode?: string;
  agentId?: string;
  accountStatus?: string;
  introducerAccountCode?: string;
  officerId?: string;
  riskCategory?: string;
}

export interface DepositDetails {
  accountType?: string;
  accountOpenDate?: string;
  unitOfPeriod?: "Day" | "Month";
  periodDeposit?: string | number;
  interestRate?: string | number;
  maturityDate?: string;
  interestPaidInCash?: "Day" | "Month";
  rateDiscounted?: "Day" | "Month";
  interestPaymentFrequency?: string;
  depositAmount?: string | number;
  depositAmountInWords?: string;
  cash?: string | number;
  clearing?: string | number;
  transfer?: string | number;
  creditAccountCode?: string;
  creditAccountName?: string;
  maturityAmount?: string | number;
}

export interface NomineeDetails {
  srNo?: string | number;
  salutationCode?: string;
  nomineeCustomerId?: string;
  nomineeName?: string;
  relation?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface JointHolderDetails {
  srNo?: string | number;
  salutationCode?: string;
  jtHolderCustomerId?: string;
  jtHolderName?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
}

type TabKey = "Details" | "Deposit" | "Nominee" | "Joint Holder";
const TABS: TabKey[] = ["Details", "Deposit", "Nominee", "Joint Holder"];

// Salutation options shown in the Salutation Code dropdown
const SALUTATION_OPTIONS = ["MR", "MS", "MRS"];

// Sample rows for the "Customer Type List" popup (opened from the Customer ID menu button)
const CUSTOMER_LIST: { id: string; name: string }[] = Array.from({ length: 10 }, () => ({
  id: "00012",
  name: "Balami Manjunath Iranna",
}));

// Sample rows for the "Branch List" popup (opened from the Branch Code menu button)
const BRANCH_LIST: { code: string; name: string }[] = [
  { code: "0002", name: "Belgaum" },
  { code: "0003", name: "Ajara" },
  { code: "0004", name: "Goa" },
  { code: "0005", name: "Maharashtra" },
  { code: "0006", name: "Hubli" },
  { code: "0007", name: "Kagal" },
  { code: "0008", name: "Mumbai" },
  { code: "0009", name: "Pune" },
  { code: "0010", name: "Satara" },
  { code: "0011", name: "Gadiganglaj" },
];

interface ViewAccountModalProps {
  onClose: () => void;
  onNext?: () => void;
  data?: AccountDetails;
  depositData?: DepositDetails;
  nomineeData?: NomineeDetails;
  jointHolderData?: JointHolderDetails;
}

/* ------------------------------------------------------------------ */
/*  Date helpers — power the native calendar picker on date fields     */
/* ------------------------------------------------------------------ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "23-May-2026" -> "2026-05-23" (what <input type="date"> needs)
function toISODate(value?: string | number): string {
  if (!value) return "";
  const str = String(value);
  const match = str.match(/^(\d{1,2})-([A-Za-z]{3,})-(\d{4})$/);
  if (!match) return "";
  const day = match[1].padStart(2, "0");
  const monthIdx = MONTHS.findIndex((m) => m.toLowerCase() === match[2].slice(0, 3).toLowerCase());
  if (monthIdx === -1) return "";
  const month = String(monthIdx + 1).padStart(2, "0");
  return `${match[3]}-${month}-${day}`;
}

// "2026-05-23" -> "23-May-2026" (what the rest of the UI displays)
function fromISODate(iso: string): string {
  if (!iso) return "";
  const [y, mo, d] = iso.split("-");
  const monthIdx = parseInt(mo, 10) - 1;
  if (Number.isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) return iso;
  return `${parseInt(d, 10)}-${MONTHS[monthIdx]}-${y}`;
}

/* ------------------------------------------------------------------ */
/*  Primitive: BilingualLabel — single line, no wrap                   */
/* ------------------------------------------------------------------ */

function BilingualLabel({
  en,
  mr,
  required,
  variant = "large",
}: {
  en: string;
  mr?: string;
  required?: boolean;
  variant?: "large" | "small";
}) {
  return (
    <label
      className={`mb-1.5 block truncate whitespace-nowrap text-[#1F2858] ${
        variant === "large" ? "text-[16px] font-semibold" : "text-xs font-medium"
      }`}
      title={mr ? `${en} / ${mr}` : en}
    >
      {en}
      {mr && (
        <>
          <span className="text-slate-400"> / </span>
          <span className="text-[#64748B]">{mr}</span>
        </>
      )}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Primitive: Field — read-only display, icon sits beside the value  */
/*  (not inside the input) so labels never push fields out of line     */
/* ------------------------------------------------------------------ */

const iconWrap = "flex h-9 w-9 shrink-0 items-center justify-center text-[#6B7280]";

interface FieldProps {
  icon?: LucideIcon;
  labelEn: string;
  labelMr?: string;
  value?: string | number;
  required?: boolean;
  type?: "text" | "date" | "currency";
  menu?: boolean;
  menuActive?: boolean;
  onChange?: (value: string) => void;
  onMenuClick?: () => void;
}

function Field({
  icon: Icon,
  labelEn,
  labelMr,
  value,
  required = true,
  type = "text",
  menu = false,
  menuActive = false,
  onChange,
  onMenuClick,
}: FieldProps) {
  const isCurrency = type === "currency";
  const isDate = type === "date";
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value !== undefined ? String(value) : "");

  const displayValue =
    isCurrency && value !== undefined && value !== ""
      ? Number(value).toLocaleString("en-IN", { minimumFractionDigits: 1 })
      : value || "\u2014";

  const startEditing = () => {
    setDraft(value !== undefined ? String(value) : "");
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    onChange?.(draft);
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <BilingualLabel en={labelEn} mr={labelMr} required={required} />
      <div className="flex flex-1 items-stretch gap-2">
        <div className="relative flex flex-1 min-w-0 items-center">
          {Icon && (
            <span className="pointer-events-none absolute left-3 text-slate-400">
              <Icon size={16} />
            </span>
          )}
          {isEditing ? (
            isDate ? (
              <input
                autoFocus
                type="date"
                value={toISODate(draft)}
                onChange={(e) => setDraft(fromISODate(e.target.value))}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className={`w-full rounded-lg border bg-white py-2.5 ${
                  Icon ? "pl-9" : "pl-3"
                } pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 border-blue-500 ring-1 ring-blue-500`}
              />
            ) : (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className={`w-full rounded-lg border bg-white py-2.5 ${
                  Icon ? "pl-9" : "pl-3"
                } pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 border-blue-500 ring-1 ring-blue-500`}
              />
            )
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className={`w-full truncate rounded-lg border border-slate-300 bg-white py-2.5 text-left ${
                Icon ? "pl-9" : "pl-3"
              } pr-3 text-sm transition-colors hover:border-slate-400 ${
                value !== undefined && value !== "" ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {displayValue}
            </button>
          )}
        </div>
        {menu && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={`More options for ${labelEn}`}
            className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center self-center rounded-lg border transition-colors ${
              menuActive
                ? "border-blue-200 bg-blue-100 text-blue-600"
                : "border-slate-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            <MoreVertical size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * SelectField
 * - If `options` is provided, this renders a real dropdown: clicking it opens
 *   a list of the given options, and picking one commits the value and closes
 *   the list (click-outside also closes it).
 * - If `options` is omitted, it falls back to the old inline-editable-text
 *   behavior so every other usage of SelectField keeps working unchanged.
 */
function SelectField({
  icon: Icon,
  labelEn,
  labelMr,
  value,
  required = true,
  options,
  onChange,
}: {
  icon?: LucideIcon;
  labelEn: string;
  labelMr?: string;
  value?: string;
  required?: boolean;
  options?: string[];
  onChange?: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const startEditing = () => {
    setDraft(value ?? "");
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    onChange?.(draft);
  };

  // Dropdown mode (real select-like behavior with a fixed options list)
  if (options && options.length > 0) {
    return (
      <div className="flex h-full min-w-0 flex-col" ref={containerRef}>
        <BilingualLabel en={labelEn} mr={labelMr} required={required} />
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={`flex h-10 w-full items-center rounded-md border bg-white px-4 text-left transition-all duration-200 ${
              isOpen ? "border-[#0A66D8] ring-2 ring-[#0A66D8]/10" : "border-[#B8C2D6] hover:border-[#0A66D8]"
            }`}
          >
            {Icon && (
              <span className="shrink-0 text-[#6B7280]">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
            )}
            <span className={`flex-1 truncate text-sm ${Icon ? "ml-3" : ""} ${value ? "text-[#4B5563]" : "text-[#7C879B]"}`}>
              {value || "\u2014"}
            </span>
            <ChevronDown
              className={`ml-2 h-5 w-5 shrink-0 text-[#6B7280] transition-transform ${isOpen ? "rotate-180" : ""}`}
              strokeWidth={1.75}
            />
          </button>

          {isOpen && (
            <ul
              role="listbox"
              className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-52 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            >
              {options.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt === value}
                    onClick={() => {
                      onChange?.(opt);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-[14px] transition ${
                      opt === value ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {opt}
                    {opt === value && <Check className="h-4 w-4" strokeWidth={1.75} />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Fallback: inline-editable text (unchanged legacy behavior)
  return (
    <div className="flex h-full min-w-0 flex-col">
      <BilingualLabel en={labelEn} mr={labelMr} required={required} />
      <div
        className={`flex h-10 flex-1 min-w-0 items-center rounded-md border bg-white px-4 transition-all duration-200 ${
          isEditing ? "border-[#0A66D8] ring-2 ring-[#0A66D8]/10" : "border-[#B8C2D6] hover:border-[#0A66D8]"
        }`}
      >
        {Icon && (
          <span className="shrink-0 text-[#6B7280]">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
        )}
        {isEditing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            className={`w-full flex-1 bg-transparent text-sm text-[#4B5563] outline-none ${
              Icon ? "ml-3" : ""
            }`}
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className={`flex-1 truncate text-left text-sm text-[#4B5563] ${Icon ? "ml-3" : ""}`}
          >
            {value || "\u2014"}
          </button>
        )}
        <ChevronDown className="ml-2 h-5 w-5 shrink-0 text-[#6B7280]" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function SrNoField({ value }: { value?: string | number }) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <span className="mb-1.5 block truncate whitespace-nowrap text-[16px] font-semibold text-[#1F2858]">Sr No</span>
      <div className="flex h-10 flex-1 items-center justify-center rounded-md border border-[#B8C2D6] bg-white text-sm text-[#4B5563]">
        {value ?? "\u2014"}
      </div>
    </div>
  );
}

function FieldGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 3 | 4 }) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-5 sm:grid-cols-2 [&>*]:min-w-0 ${
        cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      }`}
    >
      {children}
    </div>
  );
}

/* Single line, vertically centered in the full cell height so it sits
   dead-center next to its neighbors instead of clinging to the top. */
function RadioGroup({
  labelEn,
  labelMr,
  value,
  onChange,
}: {
  labelEn: string;
  labelMr?: string;
  value?: "Day" | "Month";
  onChange?: (value: "Day" | "Month") => void;
}) {
  return (
    <div className="flex h-full min-w-0 flex-col justify-center">
      <div className="flex items-center justify-between gap-4">
        <span className="whitespace-nowrap text-[16px] font-semibold text-[#1F2858]">
          {labelEn}
          {labelMr && (
            <>
              <span className="text-slate-400"> / </span>
              <span className="text-[#64748B]">{labelMr}</span>
            </>
          )}
        </span>
        <div className="flex items-center gap-6">
          {(["Day", "Month"] as const).map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-[14px] text-slate-600">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  value === opt ? "border-blue-600" : "border-slate-300"
                }`}
              >
                {value === opt && <span className="h-2 w-2 rounded-full bg-blue-600" />}
              </span>
              <input
                type="radio"
                className="hidden"
                checked={value === opt}
                onChange={() => onChange?.(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onChange }: { tabs: TabKey[]; active: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="flex gap-[28.82px] border-b border-slate-200 bg-white px-6">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`relative -mb-px py-3 text-[14px] font-medium transition ${
              isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ListModal — shared popup for "Customer Type List" and "Branch List" */
/*  Styled per the Figma spec: 36px corner radius, soft blurred corner   */
/*  ellipses, F9FAFB search field, EEF2FF "Select" pill.                 */
/* ------------------------------------------------------------------ */

interface ListModalProps<T> {
  title: string;
  idLabel: string;
  nameLabel: string;
  items: T[];
  getId: (item: T) => string;
  getName: (item: T) => string;
  onSelect: (item: T) => void;
  onClose: () => void;
}

function ListModal<T>({ title, idLabel, nameLabel, items, getId, getName, onSelect, onClose }: ListModalProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return getId(item).toLowerCase().includes(q) || getName(item).toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-[841px] flex-col overflow-hidden rounded-[36px] bg-white shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-32 h-64 w-64 rounded-full bg-[#DFEEFE] blur-2xl" aria-hidden />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#DFEEFE] blur-2xl" aria-hidden />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-8 pt-7 pb-5">
          <h3 className="text-[19px] font-semibold text-slate-800">{title}</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-[300px] items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-2 shadow-[0_1px_0.5px_0.05px_rgba(29,41,61,0.02)]">
              <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-8 pb-8">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0">
              <tr className="bg-blue-50">
                <th className="rounded-l-lg px-4 py-2.5 text-left text-[13px] font-semibold text-slate-700">{idLabel}</th>
                <th className="px-4 py-2.5 text-left text-[13px] font-semibold text-slate-700">{nameLabel}</th>
                <th className="rounded-r-lg px-4 py-2.5 text-left text-[13px] font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={`${getId(item)}-${idx}`} className="border-b border-slate-100 last:border-none">
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md bg-indigo-50 px-3 py-1 text-[13px] font-medium text-indigo-700">
                      {getId(item)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[15px] font-medium text-slate-800">{getName(item)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      className="flex h-10 w-[120px] items-center justify-center rounded-lg bg-[#EEF2FF] px-4 text-[13px] font-semibold text-blue-600 transition hover:bg-indigo-100"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-[14px] text-slate-400">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Details tab                                                        */
/* ------------------------------------------------------------------ */

function DetailsTab({ data }: { data: AccountDetails }) {
  const [formData, setFormData] = useState<AccountDetails>(data);
  const update = (key: keyof AccountDetails) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isBranchListOpen, setIsBranchListOpen] = useState(false);

  return (
    <>
    <FieldGrid>
      <Field icon={IdCard} labelEn="Account Code" labelMr="खाते कोड" value={formData.accountCode} onChange={update("accountCode")} />
      <Field icon={User} labelEn="Account Name" labelMr="खाते नाव" value={formData.accountName} onChange={update("accountName")} />
      <Field icon={Calendar} labelEn="Account Open Date" labelMr="खाते उघडण्याची तारीख" value={formData.accountOpenDate} type="date" onChange={update("accountOpenDate")} />
      <Field icon={Calendar} labelEn="Account Closed Date" labelMr="खाते बंद झाल्याची तारीख" value={formData.accountClosedDate} type="date" onChange={update("accountClosedDate")} />

      <Field icon={IdCard} labelEn="Customer ID" labelMr="ग्राहक आयडी" value={formData.customerId} menu onMenuClick={() => setIsCustomerListOpen(true)} onChange={update("customerId")} />
      <Field icon={User} labelEn="Customer Name" labelMr="ग्राहकाचे नाव" value={formData.customerName} onChange={update("customerName")} />
      <Field icon={User} labelEn="Created By" labelMr="किंमत तयार केली" value={formData.createdBy} onChange={update("createdBy")} />
      <Field icon={Landmark} labelEn="Branch Code" labelMr="शाखा कोड" value={formData.branchCode} menu onMenuClick={() => setIsBranchListOpen(true)} onChange={update("branchCode")} />

      <Field icon={Coins} labelEn="Ledger Balance" labelMr="लेजर शिल्लक" value={formData.ledgerBalance} type="currency" onChange={update("ledgerBalance")} />
      <Field icon={Wallet} labelEn="Available Balance" labelMr="उपलब्ध शिल्लक" value={formData.availableBalance} type="currency" onChange={update("availableBalance")} />
      <SelectField icon={UserCheck} labelEn="Min Balance ID" labelMr="किमान शिल्लक आयडी" value={formData.minBalanceId} onChange={update("minBalanceId")} />
      <Field icon={Calendar} labelEn="Last Operated Date" labelMr="शेवटची ऑपरेशन तारीख" value={formData.lastOperatedDate} type="date" onChange={update("lastOperatedDate")} />

      <SelectField icon={FileText} labelEn="Is TOD Applicable" labelMr="TOD लागू आहे का?" value={formData.todApplicable} onChange={update("todApplicable")} />
      <Field icon={FileText} labelEn="TOD Limit" labelMr="TOD मर्यादा" value={formData.todLimit} onChange={update("todLimit")} />
      <Field icon={FileText} labelEn="TOD Interest Rate" labelMr="TOD व्याजदर" value={formData.todInterestRate} onChange={update("todInterestRate")} />
      <Field icon={FileText} labelEn="TOD Interest" labelMr="TOD व्याज" value={formData.todInterest} onChange={update("todInterest")} />

      <SelectField icon={ClipboardList} labelEn="Account Operation Capacity ID" labelMr="खाते ऑपरेशन क्षमता आयडी" value={formData.accountOperationCapacityId} onChange={update("accountOperationCapacityId")} />
      <Field icon={ClipboardList} labelEn="Application Number" labelMr="अर्ज क्रमांक" value={formData.applicationNumber} onChange={update("applicationNumber")} />
      <SelectField icon={Tag} labelEn="Category Code" labelMr="कॅटेगरी कोड" value={formData.categoryCode} onChange={update("categoryCode")} />

      <Field icon={UserCog} labelEn="Agent ID" labelMr="एजंट आयडी" value={formData.agentId} onChange={update("agentId")} />
      <SelectField icon={Activity} labelEn="Account Status" labelMr="आकाउंट स्थीती" value={formData.accountStatus} onChange={update("accountStatus")} />
      <Field icon={Link2} labelEn="Introducer Account Code" labelMr="ओळखपत्र खात्याचा कोड" value={formData.introducerAccountCode} onChange={update("introducerAccountCode")} />

      <Field icon={UserCog} labelEn="Officer ID" labelMr="कर्मचारी आयडी" value={formData.officerId} onChange={update("officerId")} />
      <SelectField icon={AlertTriangle} labelEn="Risk Category" labelMr="धोक्याचा प्रकार" value={formData.riskCategory} onChange={update("riskCategory")} />
    </FieldGrid>

    {isCustomerListOpen && (
      <ListModal
        title="Customer Type List"
        idLabel="Customer ID"
        nameLabel="Customer Name"
        items={CUSTOMER_LIST}
        getId={(item) => item.id}
        getName={(item) => item.name}
        onSelect={(item) => {
          update("customerId")(item.id);
          update("customerName")(item.name);
          setIsCustomerListOpen(false);
        }}
        onClose={() => setIsCustomerListOpen(false)}
      />
    )}

    {isBranchListOpen && (
      <ListModal
        title="Branch List"
        idLabel="Branch Code"
        nameLabel="Branch Name"
        items={BRANCH_LIST}
        getId={(item) => item.code}
        getName={(item) => item.name}
        onSelect={(item) => {
          update("branchCode")(item.code);
          setIsBranchListOpen(false);
        }}
        onClose={() => setIsBranchListOpen(false)}
      />
    )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Deposit tab                                                        */
/* ------------------------------------------------------------------ */

function DepositTab({ data }: { data: DepositDetails }) {
  const [formData, setFormData] = useState<DepositDetails>(data);
  const update = (key: keyof DepositDetails) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));
  const updateRadio = (key: keyof DepositDetails) => (value: "Day" | "Month") =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <FieldGrid cols={3}>
      <Field icon={User} labelEn="Account Type" labelMr="आकाउंट प्रकार" value={formData.accountType} onChange={update("accountType")} />
      <Field icon={Calendar} labelEn="Account Open Date" labelMr="खाते उघडण्याची तारीख" value={formData.accountOpenDate} type="date" onChange={update("accountOpenDate")} />
      <RadioGroup labelEn="Unit Of Period" value={formData.unitOfPeriod} onChange={updateRadio("unitOfPeriod")} />

      <Field icon={Calendar} labelEn="Period Deposit" labelMr="काळजी ठेव" value={formData.periodDeposit} onChange={update("periodDeposit")} />
      <Field icon={Percent} labelEn="Interest Rate" labelMr="व्याज दर" value={formData.interestRate} onChange={update("interestRate")} />
      <Field icon={Calendar} labelEn="Maturity Date" labelMr="परिपक्वता तारीख" value={formData.maturityDate} type="date" onChange={update("maturityDate")} />

      <RadioGroup labelEn="Interest Paid in Cash" value={formData.interestPaidInCash} onChange={updateRadio("interestPaidInCash")} />
      <RadioGroup labelEn="Rate Discounted" value={formData.rateDiscounted} onChange={updateRadio("rateDiscounted")} />
      <SelectField icon={Calendar} labelEn="Interest Payment Frequency" labelMr="व्याज भरण्याची वारंवारिता" value={formData.interestPaymentFrequency} onChange={update("interestPaymentFrequency")} />

      <Field icon={Coins} labelEn="Deposit Amount" labelMr="ठेव रक्कम" value={formData.depositAmount} onChange={update("depositAmount")} />
      <Field icon={Coins} labelEn="Deposit Amount in words" labelMr="ठेव रक्कम शब्दांमध्ये" value={formData.depositAmountInWords} onChange={update("depositAmountInWords")} />
      <span className="hidden lg:block" aria-hidden />

      <Field icon={IdCard} labelEn="Cash" labelMr="रोख" value={formData.cash} onChange={update("cash")} />
      <Field icon={Wrench} labelEn="Clearing" labelMr="क्लीअरिंग" value={formData.clearing} onChange={update("clearing")} />
      <Field icon={ArrowLeftRight} labelEn="Transfer" labelMr="हस्तांतरण" value={formData.transfer} onChange={update("transfer")} />

      <Field icon={Landmark} labelEn="Credit Account Code" labelMr="क्रेडिट अकाउंट कोड" value={formData.creditAccountCode} menu menuActive onChange={update("creditAccountCode")} />
      <Field icon={User} labelEn="Credit Account Name" labelMr="क्रेडिट खाते नाव" value={formData.creditAccountName} onChange={update("creditAccountName")} />
      <Field icon={Coins} labelEn="Maturity Amount" labelMr="परिपक्वतेची रक्कम" value={formData.maturityAmount} onChange={update("maturityAmount")} />
    </FieldGrid>
  );
}

/* ------------------------------------------------------------------ */
/*  Nominee tab                                                        */
/* ------------------------------------------------------------------ */

function NomineeTab({ data }: { data: NomineeDetails }) {
  const [formData, setFormData] = useState<NomineeDetails>(data);
  const update = (key: keyof NomineeDetails) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);

  return (
    <>
    <div className="rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[80px_1.3fr_1fr_1fr_1fr] [&>*]:min-w-0">
        <SrNoField value={formData.srNo} />
        <SelectField
          labelEn="Salutation Code"
          labelMr="संबोधनी"
          value={formData.salutationCode}
          options={SALUTATION_OPTIONS}
          onChange={update("salutationCode")}
        />
        <Field icon={IdCard} labelEn="Nominee Customer ID" labelMr="नॉमिनी ग्राहक आयडी" value={formData.nomineeCustomerId} menu menuActive onMenuClick={() => setIsCustomerListOpen(true)} onChange={update("nomineeCustomerId")} />
        <Field icon={User} labelEn="Nominee Name" labelMr="नॉमिनी नाव" value={formData.nomineeName} onChange={update("nomineeName")} />
        <SelectField icon={User} labelEn="Relation" value={formData.relation} onChange={update("relation")} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
        <Field icon={Home} labelEn="Address 1" labelMr="पत्ता १" value={formData.address1} onChange={update("address1")} />
        <Field icon={Home} labelEn="Address 2" labelMr="पत्ता २" value={formData.address2} onChange={update("address2")} />
        <Field icon={Home} labelEn="Address 3" labelMr="पत्ता ३" value={formData.address3} required={false} onChange={update("address3")} />
        <Field icon={Home} labelEn="Zip" labelMr="पिन कोड" value={formData.zip} onChange={update("zip")} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
        <SelectField icon={Landmark} labelEn="City" labelMr="शहरे" value={formData.city} onChange={update("city")} />
        <Field icon={Landmark} labelEn="State" labelMr="राज्य" value={formData.state} onChange={update("state")} />
        <Field icon={Flag} labelEn="Country" labelMr="देश" value={formData.country} onChange={update("country")} />
      </div>
    </div>

    {isCustomerListOpen && (
      <ListModal
        title="Customer Type List"
        idLabel="Customer ID"
        nameLabel="Customer Name"
        items={CUSTOMER_LIST}
        getId={(item) => item.id}
        getName={(item) => item.name}
        onSelect={(item) => {
          update("nomineeCustomerId")(item.id);
          update("nomineeName")(item.name);
          setIsCustomerListOpen(false);
        }}
        onClose={() => setIsCustomerListOpen(false)}
      />
    )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Joint Holder tab                                                   */
/* ------------------------------------------------------------------ */

function JointHolderTab({ data }: { data: JointHolderDetails }) {
  const [formData, setFormData] = useState<JointHolderDetails>(data);
  const update = (key: keyof JointHolderDetails) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);

  return (
    <>
    <div className="rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[80px_1.3fr_1fr_1fr] [&>*]:min-w-0">
        <SrNoField value={formData.srNo} />
        <SelectField
          labelEn="Salutation Code"
          labelMr="संबोधनी"
          value={formData.salutationCode}
          options={SALUTATION_OPTIONS}
          onChange={update("salutationCode")}
        />
        <Field icon={IdCard} labelEn="J/T Holder Customer ID" labelMr="J/T धारक ग्राहक आयडी" required={false} value={formData.jtHolderCustomerId} menu menuActive onMenuClick={() => setIsCustomerListOpen(true)} onChange={update("jtHolderCustomerId")} />
        <Field icon={User} labelEn="J/T Holder Name" labelMr="J/T धारकाचे नाव" value={formData.jtHolderName} onChange={update("jtHolderName")} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
        <Field icon={Home} labelEn="Address 1" labelMr="पत्ता १" value={formData.address1} onChange={update("address1")} />
        <Field icon={Home} labelEn="Address 2" labelMr="पत्ता २" value={formData.address2} onChange={update("address2")} />
        <Field icon={Home} labelEn="Address 3" labelMr="पत्ता ३" value={formData.address3} required={false} onChange={update("address3")} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
        <Field icon={Home} labelEn="Zip" labelMr="पिन कोड" value={formData.zip} onChange={update("zip")} />
        <SelectField icon={Home} labelEn="City" labelMr="शहरे" value={formData.city} onChange={update("city")} />
        <Field icon={Landmark} labelEn="State" labelMr="राज्य" value={formData.state} onChange={update("state")} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
        <Field icon={Flag} labelEn="Country" labelMr="देश" value={formData.country} onChange={update("country")} />
      </div>
    </div>

    {isCustomerListOpen && (
      <ListModal
        title="Customer Type List"
        idLabel="Customer ID"
        nameLabel="Customer Name"
        items={CUSTOMER_LIST}
        getId={(item) => item.id}
        getName={(item) => item.name}
        onSelect={(item) => {
          update("jtHolderCustomerId")(item.id);
          update("jtHolderName")(item.name);
          setIsCustomerListOpen(false);
        }}
        onClose={() => setIsCustomerListOpen(false)}
      />
    )}
    </>
  );
}

function HeaderIcon() {
  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
      <Image src="/person1.png" alt="" fill sizes="44px" className="object-contain" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main: ViewAccountModal                                             */
/* ------------------------------------------------------------------ */

const defaultData: AccountDetails = {
  accountCode: "4022399911",
  accountName: "Nitish Sai Readdy",
  accountOpenDate: "23-May-2026",
  accountClosedDate: "01-June-2026",
  customerId: "00021",
  customerName: "Nitish Sai Readdy",
  createdBy: "Admin",
  branchCode: "0002",
  ledgerBalance: 408493.5,
  availableBalance: 408493.5,
  minBalanceId: "200",
  lastOperatedDate: "18-Jan-2026",
  todApplicable: "No",
  todLimit: "0.0",
  todInterestRate: "0.0",
  todInterest: "0.0",
  accountOperationCapacityId: "Self",
  applicationNumber: "12",
  categoryCode: "Public",
  agentId: "0",
  accountStatus: "Live",
  introducerAccountCode: "1001",
  officerId: "Admin",
  riskCategory: "Low",
};

const defaultDepositData: DepositDetails = {
  accountType: "TD",
  accountOpenDate: "23-May-2026",
  unitOfPeriod: "Day",
  periodDeposit: "7",
  interestRate: "1.2",
  maturityDate: "23-May-2026",
  interestPaidInCash: "Day",
  rateDiscounted: "Day",
  interestPaymentFrequency: "Monthly",
  depositAmount: "100/-",
  depositAmountInWords: "One Hundred",
  cash: "100",
  clearing: "0",
  transfer: "0",
  creditAccountCode: "2001",
  creditAccountName: "Akshay Om More",
  maturityAmount: "23,990/-",
};

const defaultNomineeData: NomineeDetails = {
  srNo: 1,
  salutationCode: "MR",
  nomineeCustomerId: "00021",
  nomineeName: "Nitish Sai Readdy",
  relation: "Father",
  address1: "Kolhapur",
  address2: "Kolhapur",
  address3: "Kolhapur",
  zip: "416005",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",
};

const defaultJointHolderData: JointHolderDetails = {
  srNo: 1,
  salutationCode: "MR",
  jtHolderCustomerId: "00021",
  jtHolderName: "Nitish Sai Readdy",
  address1: "Kolhapur",
  address2: "Kolhapur",
  address3: "Kolhapur",
  zip: "416005",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",
};

export default function ViewAccountModal({
  onClose,
  onNext,
  data = defaultData,
  depositData = defaultDepositData,
  nomineeData = defaultNomineeData,
  jointHolderData = defaultJointHolderData,
}: ViewAccountModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("Details");
  const isLastTab = activeTab === TABS[TABS.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-[95vw] max-w-[1400px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className="flex items-start gap-3">
            <HeaderIcon />
            <div>
              <h2 className="text-[32px] font-bold leading-[120%] tracking-[0.0025em] text-[#1E1B4B]">
                View Deposit Account Details
                <span className="text-slate-400"> / </span>
                <span className="text-[#64748B]">ठेव खाते तपशील पहा</span>
              </h2>
              <p className="mt-1 text-[16px] font-normal leading-5 tracking-[0.0025em] text-[#64748B]">
                Only can view some basic information related to the Employee / कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Body */}
        <div className="scrollbar-hide flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
          {activeTab === "Details" && <DetailsTab data={data} />}
          {activeTab === "Deposit" && <DepositTab data={depositData} />}
          {activeTab === "Nominee" && <NomineeTab data={nomineeData} />}
          {activeTab === "Joint Holder" && <JointHolderTab data={jointHolderData} />}
        </div>
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Footer */}
        <div className="flex items-center justify-end gap-6 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-5 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLastTab) {
                onNext?.();
              } else {
                const currentIndex = TABS.indexOf(activeTab);
                setActiveTab(TABS[currentIndex + 1]);
              }
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-[14px] font-medium text-white transition hover:bg-blue-700"
          >
            {isLastTab ? "Ok, Got It" : "Next"}
            {isLastTab ? <Check className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 -rotate-90" />}
          </button>
        </div>
      </div>
    </div>
  );
}