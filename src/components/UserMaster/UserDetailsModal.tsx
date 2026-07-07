import React, { useEffect, useState } from "react";
import {
  User,
  UserCog,
  Eye,
  IdCard,
  Building2,
  Phone,
  Mail,
  Home,
  MapPin,
  Flag,
  X,
  Check,
  MoreVertical,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import CustomerIdPickerModal,{
  type Customer,
} from "../common/CustomerPickListModal";
import BranchListPickerModal, {
  type Branch,
}from "../common/BranchPickListModal";

/* ===================== Shared types ===================== */

type YesNo = "yes" | "no";
type Mode = "edit" | "view";



export interface UserFormData {
  existingCustomer: YesNo;
  userId: string;
  userName: string;
  customerId: string;
  employeeCode: string;
  branchCode: string;
  branchName: string;
  mobileNumber: string;
  emailId: string;
  currentAddress1: string;
  currentAddress2: string;
  currentAddress3: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  isTeller: YesNo;
  isMainCashier: YesNo;
  isSupportUser: YesNo;
}

/* ===================== RadioToggle ===================== */

interface RadioToggleProps {
  label: string;
  name: YesNo;
  checked: boolean;
  onChange: (name: YesNo) => void;
  disabled?: boolean;
}

function RadioToggle({ label, name, checked, onChange, disabled }: RadioToggleProps) {
  return (
    <label
      className={`flex items-center gap-2 select-none ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <span
        className={`relative w-5 h-5 rounded-full flex items-center justify-center border ${
          checked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
        }`}
        onClick={() => !disabled && onChange(name)}
      >
        {checked && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
      </span>
      <span
        className="text-base font-medium text-black"
        onClick={() => !disabled && onChange(name)}
      >
        {label}
      </span>
    </label>
  );
}

/* ===================== YesNoToggle ===================== */

interface YesNoToggleProps {
  value: YesNo;
  onChange: (value: YesNo) => void;
  disabled?: boolean;
}

function YesNoToggle({ value, onChange, disabled }: YesNoToggleProps) {
  return (
    <div className="flex items-center gap-8">
      <RadioToggle label="Yes" name="yes" checked={value === "yes"} onChange={onChange} disabled={disabled} />
      <RadioToggle label="No" name="no" checked={value === "no"} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/* ===================== Field ===================== */

interface FieldProps {
  label: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  action?: boolean;
  readOnly?: boolean;
  onActionClick?: () => void;
}

function Field({
  label,
  labelHi,
  icon: Icon,
  placeholder,
  value,
  onChange,
  action,
  readOnly,
  onActionClick,
}: FieldProps) {
  return (
    <div className="flex-1 min-w-[220px] flex flex-col gap-2.5">
      <div className="flex items-center gap-1">
        <span className="text-base font-medium text-indigo-950">
          {label} / <span className="text-slate-500">{labelHi}</span>
        </span>
        <span className="text-sm font-medium text-red-500">*</span>
      </div>
      <div className="flex items-center gap-2.5">
        <div
          className={`flex-1 flex items-center gap-2 px-3.5 py-3 rounded-xl border outline-none ${
            readOnly ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300"
          }`}
        >
          <Icon className="w-5 h-5 text-gray-400 shrink-0" />
          {readOnly ? (
            <span className={`flex-1 text-base truncate ${value ? "text-gray-500" : "text-gray-400"}`}>
              {value || placeholder}
            </span>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-w-0 outline-none text-base text-gray-900 placeholder:text-gray-400 bg-transparent"
            />
          )}
        </div>
        {action && (
          <button
            type="button"
            onClick={onActionClick}
            className="w-14 self-stretch px-4 py-3 bg-indigo-50 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-sky-700" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ===================== SectionHeader ===================== */

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  titleHi: string;
  desc: string;
  descHi: string;
}

function SectionHeader({ icon: Icon, title, titleHi, desc, descHi }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-11 h-11 shrink-0 rounded-full bg-indigo-50 border border-blue-700 flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-700" />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-6">
          <span className="text-slate-900">{title} / </span>
          <span className="text-slate-500">{titleHi}</span>
        </h2>
        <p className="text-sm text-slate-500 leading-5">
          {desc} / {descHi}
        </p>
      </div>
    </div>
  );
}

/* ===================== Mode config ===================== */

interface ModeConfig {
  icon: LucideIcon;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
}

const MODE_CONFIG: Record<Mode, ModeConfig> = {
  edit: {
    icon: UserCog,
    titleEn: "Edit User Details",
    titleHi: "वापरकर्त्याचे तपशील संपादित",
    descEn: "Edit some basic information related to the Employee",
    descHi: "कर्मचाऱ्याची बेसिक माहिती एडिट करा.",
  },
  view: {
    icon: Eye,
    titleEn: "View User Details",
    titleHi: "वापरकर्त्याचे तपशील पहा",
    descEn: "View basic information related to the Employee",
    descHi: "कर्मचाऱ्याची मूलभूत माहिती पहा.",
  },
};

const DEFAULT_DATA: UserFormData = {
  existingCustomer: "yes",
  userId: "",
  userName: "",
  customerId: "",
  employeeCode: "",
  branchCode: "",
  branchName: "",
  mobileNumber: "",
  emailId: "",
  currentAddress1: "",
  currentAddress2: "",
  currentAddress3: "",
  zip: "",
  city: "",
  state: "",
  country: "",
  isTeller: "yes",
  isMainCashier: "no",
  isSupportUser: "no",
};

/* ===================== UserDetailsModal ===================== */

export interface UserDetailsModalProps {
  open: boolean;
  mode?: Mode;
  initialData?: Partial<UserFormData>;
  onClose?: () => void;
  onSubmit?: (data: UserFormData) => void;
}

export default function UserDetailsModal({
  open,
  mode = "edit",
  initialData,
  onClose,
  onSubmit,
}: UserDetailsModalProps) {
  const [data, setData] = useState<UserFormData>({ ...DEFAULT_DATA, ...initialData });
  const [customerPickerOpen, setCustomerPickerOpen] = useState<boolean>(false);
  const [branchPickerOpen, setBranchPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (open) setData({ ...DEFAULT_DATA, ...initialData });
  }, [open, initialData]);

  if (!open) return null;

  const isView = mode === "view";
  const config = MODE_CONFIG[mode] || MODE_CONFIG.edit;
  const HeaderIcon = config.icon;

  const set =
    <K extends keyof UserFormData>(key: K) =>
    (val: UserFormData[K]) =>
      setData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    onSubmit?.(data);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1476px] mx-auto bg-white rounded-2xl sm:rounded-[36px] flex flex-col h-full sm:h-auto sm:max-h-[90vh] overflow-hidden"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Header (fixed, does not scroll) */}
        <div className="shrink-0 flex items-start justify-between gap-4 p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
              <HeaderIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                <span className="text-indigo-950">{config.titleEn}</span>
                <span className="text-slate-900"> / </span>
                <span className="text-slate-500">{config.titleHi}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 leading-5">
                {config.descEn} / {config.descHi}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable body (cards only). Scrollbar hidden across browsers. */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* User Details */}
          <section className="p-4 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_5px_0px_rgba(3,0,55,0.08)] border border-t-4 border-blue-700 flex flex-col gap-6">
            <SectionHeader
              icon={User}
              title="User Details"
              titleHi="वापरकर्ता तपशील"
              desc="Add some basic information related to the Employee"
              descHi="कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती जोडा"
            />
            <div className="h-px bg-gray-200" />

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="text-base font-medium text-gray-900">
                Are You an Existing Customer? /{" "}
                <span className="text-gray-500">तुम्ही विद्यमान ग्राहक आहात का?</span>
              </span>
              <YesNoToggle value={data.existingCustomer} onChange={set("existingCustomer")} disabled={isView} />
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Field label="User Id" labelHi="वापरकर्ता आयडी" icon={User} value={data.userId} readOnly />
              <Field
                label="User Name"
                labelHi="वापरकर्त्याचे नाव"
                icon={User}
                placeholder="Enter User Name"
                value={data.userName}
                onChange={set("userName")}
                readOnly={isView}
              />
              <Field
                label="Customer Id"
                labelHi="ग्राहक आयडी"
                icon={IdCard}
                value={data.customerId}
                onChange={set("customerId")}
                readOnly={isView}
                action={!isView}
                onActionClick={() => setCustomerPickerOpen(true)}
              />
              <Field label="Employee Code" labelHi="कर्मचारी कोड" icon={IdCard} value={data.employeeCode} readOnly />
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Field
                label="Branch Code"
                labelHi="शाखा कोड"
                icon={Building2}
                value={data.branchCode}
                onChange={set("branchCode")}
                readOnly={isView}
                action={!isView}
                onActionClick={() => setBranchPickerOpen(true)}
              />
              <Field label="Branch Name" labelHi="शाखेचे नाव" icon={Building2} value={data.branchName} readOnly />
              <Field
                label="Mobile Number"
                labelHi="मोबाईल नंबर"
                icon={Phone}
                placeholder="Enter Mobile Number"
                value={data.mobileNumber}
                onChange={set("mobileNumber")}
                readOnly={isView}
              />
              <Field
                label="Email ID"
                labelHi="ईमेल आयडी"
                icon={Mail}
                placeholder="Enter Email ID"
                value={data.emailId}
                onChange={set("emailId")}
                readOnly={isView}
              />
            </div>
          </section>

          {/* Address Details */}
          <section className="p-4 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_5px_0px_rgba(3,0,55,0.08)] border border-t-4 border-blue-700 flex flex-col gap-6">
            <SectionHeader
              icon={MapPin}
              title="Address Details"
              titleHi="पत्ता तपशील"
              desc="Add some basic information related to the Employee Address"
              descHi="कर्मचाऱ्याच्या पत्त्याशी संबंधित काही मूलभूत माहिती जोडा."
            />
            <div className="h-px bg-gray-200" />

            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Field
                label="Current Address 1"
                labelHi="सध्याचा पत्ता १"
                icon={Home}
                placeholder="Enter Current Address 1"
                value={data.currentAddress1}
                onChange={set("currentAddress1")}
                readOnly={isView}
              />
              <Field
                label="Current Address 2"
                labelHi="सध्याचा पत्ता २"
                icon={Home}
                placeholder="Enter Current Address 2"
                value={data.currentAddress2}
                onChange={set("currentAddress2")}
                readOnly={isView}
              />
              <Field
                label="Current Address 3"
                labelHi="सध्याचा पत्ता ३"
                icon={Home}
                placeholder="Enter Current Address 3"
                value={data.currentAddress3}
                onChange={set("currentAddress3")}
                readOnly={isView}
              />
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Field
                label="Zip"
                labelHi="पिन कोड"
                icon={Home}
                placeholder="Enter Pin Code"
                value={data.zip}
                onChange={set("zip")}
                readOnly={isView}
              />
              <Field
                label="City"
                labelHi="शहरे"
                icon={Building2}
                placeholder="City"
                value={data.city}
                onChange={set("city")}
                readOnly={isView}
              />
              <Field
                label="State"
                labelHi="राज्य"
                icon={Building2}
                placeholder="Select State"
                value={data.state}
                onChange={set("state")}
                readOnly={isView}
              />
              <Field
                label="Country"
                labelHi="देश"
                icon={Flag}
                placeholder="Select Country"
                value={data.country}
                onChange={set("country")}
                readOnly={isView}
              />
            </div>
          </section>

          {/* Roles */}
          <section className="p-4 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_5px_0px_rgba(3,0,55,0.08)] border border-t-4 border-blue-700 flex flex-col gap-6">
            <SectionHeader
              icon={IdCard}
              title="Roles"
              titleHi="भूमिका तपशील"
              desc="Configure employee access roles and operational responsibilities"
              descHi="कर्मचाऱ्याच्या प्रवेश भूमिका आणि कार्यात्मक जबाबदाऱ्या कॉन्फिगर करा."
            />
            <div className="h-px bg-gray-200" />

            <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-10">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span className="text-base font-medium text-gray-900 w-full sm:w-40">
                  Is Teller / <span className="text-slate-500">टेलर आहे का</span>
                </span>
                <YesNoToggle value={data.isTeller} onChange={set("isTeller")} disabled={isView} />
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span className="text-base font-medium text-gray-900 w-full sm:w-56">
                  Is Main Cashier / <span className="text-slate-500">मुख्य कॅशियर आहे का</span>
                </span>
                <YesNoToggle value={data.isMainCashier} onChange={set("isMainCashier")} disabled={isView} />
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span className="text-base font-medium text-gray-900 w-full sm:w-64">
                  Is Support User / <span className="text-slate-500">सपोर्ट वापरकर्ता आहे का</span>
                </span>
                <YesNoToggle value={data.isSupportUser} onChange={set("isSupportUser")} disabled={isView} />
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions (fixed, does not scroll) */}
        <div className="shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 border-t border-gray-100">
          {isView ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-36 h-12 px-6 py-3.5 rounded-lg border border-blue-700 flex items-center justify-center gap-2 text-blue-700 text-base font-medium hover:bg-blue-50 transition-colors"
            >
              Close
              <X className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-36 h-12 px-6 py-4 bg-sky-700 rounded-lg flex items-center justify-center gap-2 text-white text-base font-medium hover:bg-sky-800 transition-colors"
              >
                Validate
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-36 h-12 px-6 py-3.5 rounded-lg border border-blue-700 flex items-center justify-center gap-2 text-blue-700 text-base font-medium hover:bg-blue-50 transition-colors"
              >
                Cancel
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-36 h-12 px-6 py-3.5 bg-gray-100 rounded-lg flex items-center justify-center gap-2 text-gray-500 text-base font-medium hover:bg-gray-200 transition-colors"
              >
                Save
                <ChevronDown className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {!isView && (
        <>
          <CustomerIdPickerModal
            open={customerPickerOpen}
            onClose={() => setCustomerPickerOpen(false)}
            onSelect={(customer: Customer) => setData((prev) => ({ ...prev, customerId: customer.id }))}
          />
          <BranchListPickerModal
            open={branchPickerOpen}
            onClose={() => setBranchPickerOpen(false)}
            onSelect={(branch: Branch) =>
              setData((prev) => ({ ...prev, branchCode: branch.code, branchName: branch.name }))
            }
          />
        </>
      )}
    </div>
  );
}

