import React, { useState } from "react";
import {
  User,
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
import CustomerIdPickerModal from "../common/CustomerPickListModal";
import BranchListPickerModal from "../common/BranchPickListModal";
import Image from "next/image";

/* ===================== Shared types ===================== */

type YesNo = "yes" | "no";
/* ===================== RadioToggle ===================== */

interface RadioToggleProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (name: string) => void;
}

function RadioToggle({ label, name, checked, onChange }: RadioToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span
        className={`relative w-5 h-5 rounded-full flex items-center justify-center border ${
          checked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
        }`}
        onClick={() => onChange(name)}
      >
        {checked && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
      </span>
      <span
        className="text-base font-medium text-black"
        onClick={() => onChange(name)}
      >
        {label}
      </span>
    </label>
  );
}

/* ===================== YesNoToggle ===================== */

interface YesNoToggleProps {
  value: YesNo;
  onChange: (value: string) => void;
}

function YesNoToggle({ value, onChange }: YesNoToggleProps) {
  return (
    <div className="flex items-center gap-8">
      <RadioToggle
        label="Yes"
        name="yes"
        checked={value === "yes"}
        onChange={onChange}
      />
      <RadioToggle
        label="No"
        name="no"
        checked={value === "no"}
        onChange={onChange}
      />
    </div>
  );
}

/* ===================== Field ===================== */

interface FieldProps {
  label: string;
  labelHi: string;
  icon: string | LucideIcon;
  placeholder?: string;
  value?: string;
  action?: boolean;
   onChange?: (value: string) => void;
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
  readOnly = false,
  onActionClick,
}: FieldProps) {
  return (
    <div className="flex-1 min-w-[220px] flex flex-col gap-2.5">
      {/* Label */}
      <div className="flex items-center gap-1">
        <span className="text-base font-medium text-indigo-950">
          {label} / <span className="text-slate-500">{labelHi}</span>
        </span>
        <span className="text-sm font-medium text-red-500">*</span>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2.5">
        <div
          className=
        //   {`
            "flex-1 flex items-center gap-2 px-3.5 py-3 rounded-xl border shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)]"
        //   ${
        //     readOnly
        //       ? "bg-gray-100 border-gray-200"
        //       : "bg-white border-gray-300"
        //   }`}
        >
          <Icon className="w-5 h-5 text-gray-400 shrink-0" />

          {readOnly ? (
            <span
              className={`flex-1 text-base truncate ${
                value ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {value || placeholder}
            </span>
          ) : (
            <input
              type="text"
              value={value ?? ""}
              placeholder={placeholder}
              onChange={(e) => onChange?.(e.target.value)}
              className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-400"
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
  icon: string ;
  title: string;
  titleHi: string;
  desc: string;
  descHi: string;
}

function SectionHeader({ icon: Icon, title, titleHi, desc, descHi }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      {/* <div className="w-11 h-11 shrink-0 rounded-full bg-indigo-50 border border-blue-700 flex items-center justify-center"> */}
        {/* <Icon className="w-6 h-6 text-blue-700" /> */}
        <Image src={Icon} alt="User Icon" width={24} height={24} className="w-11 h-11 shrink-0 rounded-full bg-indigo-50 border border-blue-700 flex items-center justify-center"/>
      {/* </div> */}
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

/* ===================== AddUserForm ===================== */




interface AddUserFormProps {
  onClose?: () => void;
}

function AddUserForm({ onClose }: AddUserFormProps) {
  const [existingCustomer, setExistingCustomer] = useState<YesNo>("yes");
  const [isTeller, setIsTeller] = useState<YesNo>("yes");
  const [isMainCashier, setIsMainCashier] = useState<YesNo>("no");
  const [isSupportUser, setIsSupportUser] = useState<YesNo>("no");
  const [customerId, setCustomerId] = useState<string>("010");
  const [customerPickerOpen, setCustomerPickerOpen] = useState<boolean>(false);
  const [branchCode, setBranchCode] = useState<string>("0002");
  const [branchName, setBranchName] = useState<string>("Main Branch, Bilagi");
  const [branchPickerOpen, setBranchPickerOpen] = useState<boolean>(false);
  const [zip, setZip] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [country, setCountry] = useState("India");
const [loading, setLoading] = useState(false);

const fetchPincode = async (pin: string) => {
  if (pin.length !== 6) return;

  try {
    setLoading(true);

    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pin}`
    );

    const data = await response.json();

    if (
      data[0].Status === "Success" &&
      data[0].PostOffice.length > 0
    ) {
      const office = data[0].PostOffice[0];

      setCity(office.District);
      setState(office.State);
      setCountry(office.Country);
    } else {
      setCity("");
      setState("");
      setCountry("");
      alert("Invalid Pincode");
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-[1476px] mx-auto bg-white rounded-2xl sm:rounded-[36px] flex flex-col h-full sm:h-auto sm:max-h-[90vh] overflow-hidden">
      {/* Header (fixed, does not scroll) */}
      <div className="shrink-0 flex items-start justify-between gap-4 p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
        <div className="flex items-start gap-3 mb-6">
            <Image src="/add-icn.png" alt="User Icon" width={50} height={50} />
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                <span className="text-indigo-950">Add User</span>
                <span className="text-slate-900"> / </span>
                <span className="text-slate-500">वापरकर्ता तपशील</span>
                </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-5">
              Add some basic information related to the Employee / कर्मचाऱ्याची
              बेसिक माहिती ॲड करा.
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

      {/* Scrollable body (cards only). Scrollbar is hidden across browsers. */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* User Details */}
        <section className="p-4 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_5px_0px_rgba(3,0,55,0.08)] border border-t-4 border-blue-700 flex flex-col gap-6">
          <SectionHeader
            icon="/User.png"
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
            <YesNoToggle
              value={existingCustomer}
              onChange={(v) => setExistingCustomer(v as YesNo)}
            />
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Field label="User Id" labelHi="वापरकर्ता आयडी" icon={User} placeholder="Enter User ID" />
            <Field label="User Name" labelHi="वापरकर्त्याचे नाव" icon={User} placeholder="Enter User Name" />
            <Field
              label="Customer Id"
              labelHi="ग्राहक आयडी"
              icon={IdCard}
              placeholder="Enter Customer ID"
              value={customerId}
              action
              onActionClick={() => setCustomerPickerOpen(true)}
            />
            <Field label="Employee Code" labelHi="कर्मचारी कोड" icon={IdCard} placeholder="Enter Employee Code" />
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Field
              label="Branch Code"
              labelHi="शाखा कोड"
              icon={Building2}
              placeholder="Enter Branch Code"
              value={branchCode}
              action
              onActionClick={() => setBranchPickerOpen(true)}
            />
            <Field
              label="Branch Name"
              labelHi="शाखेचे नाव"
              icon={Building2}
              placeholder="Main Branch, Bilagi"
              value={branchName}
              readOnly
            />
            <Field label="Mobile Number" labelHi="मोबाईल नंबर" icon={Phone} placeholder="Enter Mobile Number" />
            <Field label="Email ID" labelHi="ईमेल आयडी" icon={Mail} placeholder="Enter Email ID" />
          </div>
        </section>

        {/* Address Details */}
        <section className="p-4 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_5px_0px_rgba(3,0,55,0.08)] border border-t-4 border-blue-700 flex flex-col gap-6">
          <SectionHeader
            icon="/Address.png"
            title="Address Details"
            titleHi="पत्ता तपशील"
            desc="Add some basic information related to the Employee Address"
            descHi="कर्मचाऱ्याच्या पत्त्याशी संबंधित काही मूलभूत माहिती जोडा."
          />
          <div className="h-px bg-gray-200" />

          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Field label="Current Address 1" labelHi="सध्याचा पत्ता १" icon={Home} placeholder="Enter Current Address 1" />
            <Field label="Current Address 2" labelHi="सध्याचा पत्ता २" icon={Home} placeholder="Enter Current Address 2" />
            <Field label="Current Address 3" labelHi="सध्याचा पत्ता ३" icon={Home} placeholder="Enter Current Address 3" />
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Field label="Zip" labelHi="पिन कोड" icon={Home} placeholder="Enter Pin Code" 
              onChange={(value:string) => {
    const pin = value.replace(/\D/g, "");
    setZip(pin);

    if (pin.length === 6) {
      fetchPincode(pin);
    }
  }}/>
            <Field label="City" labelHi="शहरे" icon={Building2} placeholder="City" readOnly />
            <Field label="State" labelHi="राज्य" icon={Building2} placeholder="Select State" readOnly />
            <Field label="Country" labelHi="देश" icon={Flag} placeholder="Select Country" readOnly />
          </div>
        </section>

        {/* Roles */}
        <section className="p-4 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_5px_0px_rgba(3,0,55,0.08)] border border-t-4 border-blue-700 flex flex-col gap-6">
          <SectionHeader
             icon="/Address.png"
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
              <YesNoToggle value={isTeller} onChange={(v) => setIsTeller(v as YesNo)} />
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="text-base font-medium text-gray-900 w-full sm:w-56">
                Is Main Cashier /{" "}
                <span className="text-slate-500">मुख्य कॅशियर आहे का</span>
              </span>
              <YesNoToggle value={isMainCashier} onChange={(v) => setIsMainCashier(v as YesNo)} />
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="text-base font-medium text-gray-900 w-full sm:w-64">
                Is Support User /{" "}
                <span className="text-slate-500">सपोर्ट वापरकर्ता आहे का</span>
              </span>
              <YesNoToggle value={isSupportUser} onChange={(v) => setIsSupportUser(v as YesNo)} />
            </div>
          </div>
        </section>
      </div>

      {/* Footer actions (fixed, does not scroll) */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 border-t border-gray-100">
        <button
          type="button"
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
          className="w-full sm:w-36 h-12 px-6 py-3.5 bg-gray-100 rounded-lg flex items-center justify-center gap-2 text-gray-500 text-base font-medium hover:bg-gray-200 transition-colors"
        >
          Save
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <CustomerIdPickerModal
        open={customerPickerOpen}
        onClose={() => setCustomerPickerOpen(false)}
        onSelect={(customer) => setCustomerId(customer.id)}
      />

      <BranchListPickerModal
        open={branchPickerOpen}
        onClose={() => setBranchPickerOpen(false)}
        onSelect={(branch) => {
          setBranchCode(branch.code);
          setBranchName(branch.name);
        }}
      />
    </div>
  );
}

/* ===================== AddUserModal ===================== */

export interface AddUserModalProps {
  open: boolean;
  onClose?: () => void;
}

export default function AddUserModal({ open, onClose }: AddUserModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full h-full sm:h-auto sm:max-w-[1476px]"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <AddUserForm onClose={onClose} />
      </div>
    </div>
  );
}

