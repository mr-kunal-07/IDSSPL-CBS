"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  IdCard,
  FileText,
  CalendarDays,
  Percent,
  Zap,
  ChevronDown,
  MoreVertical,
  Calculator,
} from "lucide-react";
import ListModal from "@/components/AccountMaster/ListModal";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TLCalculatorModalProps {
  onClose?: () => void;
  onCalculate?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helper: resolves a real close/navigate-back handler when no        */
/*  onClose prop is passed (e.g. when this is rendered as a page)      */
/* ------------------------------------------------------------------ */

function useCloseHandler(onClose?: () => void) {
  const router = useRouter();
  return () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };
}

// Sample rows for the "Installment Type List" popup (opened from the
// Installment Type field's menu button)
const INSTALLMENT_TYPE_LIST: { id: string; description: string }[] = [
  { id: "0", description: "NOT SPECIFIED" },
  { id: "101", description: "EMI" },
  { id: "105", description: "PLAIN PRINCIPAL" },
  { id: "201", description: "REDUCING INSTALLMENT" },
  { id: "301", description: "BULLON" },
  { id: "401", description: "VERIABLE" },
  { id: "501", description: "WITH INT" },
];

/* ------------------------------------------------------------------ */
/*  Primitive: HeaderIcon — local logo image, matches ViewAccountModal */
/* ------------------------------------------------------------------ */

function HeaderIcon() {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 shadow-sm">
      <Image
        src="/Frame%201618867441.png"
        alt=""
        fill
        sizes="48px"
        className="object-contain"
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Primitive: BilingualLabel — matches ViewAccountModal                */
/* ------------------------------------------------------------------ */

function BilingualLabel({
  en,
  mr,
  required = true,
}: {
  en: string;
  mr?: string;
  required?: boolean;
}) {
  return (
    <label
      className="mb-1.5 block truncate whitespace-nowrap text-sm font-medium text-[#1F2858]"
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
/*  Primitive: FieldWrap                                               */
/* ------------------------------------------------------------------ */

interface FieldWrapProps {
  label: string;
  labelHi?: string;
  required?: boolean;
  children: ReactNode;
}

function FieldWrap({ label, labelHi, required = true, children }: FieldWrapProps) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <BilingualLabel en={label} mr={labelHi} required={required} />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Primitive: TextField — matches ViewAccountModal's Field input       */
/* ------------------------------------------------------------------ */

interface TextFieldProps {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  disabled?: boolean;
}

function TextField({ icon, value, onChange, placeholder, prefix, disabled }: TextFieldProps) {
  return (
    <div className="relative flex flex-1 min-w-0 items-center">
      {(icon || prefix) && (
        <span className="pointer-events-none absolute left-3 flex items-center gap-1 text-slate-400">
          {icon}
          {prefix && <span className="text-sm text-slate-400">{prefix}</span>}
        </span>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-h-[42px] rounded-lg border border-slate-600 px-3 py-2.5 ${
          icon || prefix ? "pl-10" : "pl-3"
        } pr-3 text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
          disabled ? "bg-slate-50 text-slate-600" : "bg-white text-slate-700"
        }`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Primitive: TextFieldWithMenu — text field + three-dot menu button   */
/*  that opens the pickup list, matching ViewAccountModal's Field menu  */
/* ------------------------------------------------------------------ */

function TextFieldWithMenu({
  icon,
  value,
  onChange,
  onMenuClick,
  menuActive,
}: {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  onMenuClick: () => void;
  menuActive?: boolean;
}) {
  return (
    <div className="flex flex-1 items-stretch gap-2">
      <TextField icon={icon} value={value} onChange={onChange} />
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="More options"
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center self-center rounded-lg border transition-colors ${
          menuActive
            ? "border-primary-200 bg-primary-100 text-primary"
            : "border-slate-200 bg-primary-50 text-primary hover:bg-primary-100"
        }`}
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Primitive: SelectField — matches ViewAccountModal's SelectField     */
/* ------------------------------------------------------------------ */

interface SelectFieldProps {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

function SelectField({ icon, value, onChange, options }: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-[42px] w-full items-center rounded-lg border bg-white px-3 text-left transition-all ${
          isOpen ? "border-primary ring-2 ring-primary/10" : "border-slate-600 hover:border-primary"
        }`}
      >
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className={`flex-1 truncate text-sm ${icon ? "ml-3" : ""} ${value ? "text-slate-600" : "text-slate-400"}`}>
          {value || "Select"}
        </span>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                option === value ? "bg-primary-50 text-primary" : "hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main: TLCalculatorModal                                            */
/* ------------------------------------------------------------------ */

export default function TLCalculatorModal({ onClose, onCalculate = () => {} }: TLCalculatorModalProps) {
  const handleClose = useCloseHandler(onClose);
  const [installmentType, setInstallmentType] = useState("401");
  const [description, setDescription] = useState("Fixed Deposit Monthly");
  const [loanAmount, setLoanAmount] = useState("60 Months");
  const [rate, setRate] = useState("0");
  const [repayMode, setRepayMode] = useState("Monthly");
  const [period, setPeriod] = useState("0");
  const [totalInstallment, setTotalInstallment] = useState("");

  const [isInstallmentListOpen, setIsInstallmentListOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-[95vw] max-w-[1150px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <HeaderIcon />
            <div>
              <h2 className="text-[20px] font-semibold leading-6 tracking-[0.0025em] text-slate-800">
                TL Caclulator
                <span className="text-slate-400"> / </span>
                <span className="text-[#64748B]">परिपक्वतेची रक्कम</span>
              </h2>
              <p className="mt-1 text-sm font-normal leading-5 tracking-[0.0025em] text-slate-500">
                All Information&apos;s are related to Maturity Amount / सर्व माहितीपर्यंत प्राप्त्या रकमेशी संबंधित आहे
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-hide flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
          <div className="grid grid-cols-1 gap-4 rounded-[20px] border-x border-b-2 border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:grid-cols-2 [&>*]:min-w-0">
            <FieldWrap label="Installment Type" labelHi="उत्पादन कोड">
              <TextFieldWithMenu
                icon={<IdCard size={16} />}
                value={installmentType}
                onChange={setInstallmentType}
                menuActive={isInstallmentListOpen}
                onMenuClick={() => setIsInstallmentListOpen(true)}
              />
            </FieldWrap>

            <FieldWrap label="Description" labelHi="उत्पादन कोड">
              <TextField icon={<FileText size={16} />} value={description} onChange={setDescription} placeholder="Fixed Deposit Monthly" />
            </FieldWrap>

            <FieldWrap label="Loan Amount" labelHi="ठेवींची कालावधी" required={false}>
              <TextField icon={<CalendarDays size={16} />} value={loanAmount} onChange={setLoanAmount} />
            </FieldWrap>

            <FieldWrap label="Rate" labelHi="दर">
              <TextField prefix="%" value={rate} onChange={setRate} />
            </FieldWrap>

            <FieldWrap label="Repay Mode" labelHi="व्याज भरण्याची वारंवारिता">
              <SelectField icon={<Zap size={16} />} value={repayMode} onChange={setRepayMode} options={["Monthly", "Quarterly", "Half Yearly", "Yearly"]} />
            </FieldWrap>

            <FieldWrap label="Period" labelHi="दर">
              <TextField prefix="%" value={period} onChange={setPeriod} />
            </FieldWrap>

            <FieldWrap label="Total Installment" labelHi="व्याज भरण्याची वारंवारिता">
              <TextField icon={<Zap size={16} />} value={totalInstallment} onChange={setTotalInstallment} placeholder="name@company.com" disabled />
            </FieldWrap>
          </div>
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
            onClick={onCalculate}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[14px] font-medium text-white transition hover:bg-primary-700"
          >
            Calculate
            <Calculator className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-5 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isInstallmentListOpen && (
        <ListModal
          title="Installment Type List"
          columns={[
            { key: "id", label: "Installment Type Id" },
            { key: "description", label: "Description" },
          ]}
          rows={INSTALLMENT_TYPE_LIST}
          onSelect={(item) => {
            setInstallmentType(item.id);
            setDescription(item.description);
            setIsInstallmentListOpen(false);
          }}
          onClose={() => setIsInstallmentListOpen(false)}
        />
      )}
    </div>
  );
}