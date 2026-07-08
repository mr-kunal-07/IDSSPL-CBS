"use client";

import { ChevronDown, Calendar, FileText, MoreVertical, X, Upload } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export interface FieldShellProps {
  label: string;
  labelHi?: string;
  required?: boolean;
  error?: boolean;
  children: ReactNode;
  className?: string;
  variant?: "default" | "large";
}

export const FieldShell = ({
  label,
  labelHi,
  required,
  error,
  children,
  className = "",
  variant = "default",
}: FieldShellProps) => (
  <div className={className}>
    <label
      className={`mb-1.5 block text-black ${variant === "large"
          ? "text-[16px] font-semibold"
          : "text-sm font-medium"
        }`}
    >
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>{label}</span>
        {labelHi && (
          <span className={variant === "large" ? "font-medium text-gray-500" : "text-slate-600"}>
            / {labelHi}
          </span>
        )}
        {required && <span className="text-red-500">*</span>}
      </span>
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">This field is required</p>}
  </div>
);

export interface TextInputProps {
  icon?: ReactNode ;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: boolean;
  trailing?: ReactNode;
  type?: string;
}

export const TextInput = ({
  icon,
  value,
  onChange,
  placeholder,
  readOnly,
  error,
  trailing,
  type = "text",
}: TextInputProps) => (
  <div className="flex items-center gap-2">
    {icon && (
      <span className="pointer-events-none absolute left-3 text-slate-400">{icon}</span>
    )}
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
<<<<<<< HEAD
      className={`w-full rounded-lg border bg-white py-2.5 ${icon ? "pl-9" : "pl-3"} $pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
        readOnly ? "bg-slate-50 text-slate-500" : ""
      } ${error ? "border-red-400" : readOnly ? "border-[#6A7282]" : "border-slate-600"}`}
=======
      className={`w-full rounded-lg border bg-white py-2.5 ${icon ? "pl-9" : "pl-3"} ${trailing ? "pr-11" : "pr-3"} text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${readOnly ? "bg-slate-50 text-slate-500" : ""
        } ${error ? "border-red-400" : "border-slate-600"}`}
>>>>>>> Development
    />
    {trailing && <div className="shrink-0">{trailing}</div>}
  </div>
);

export interface SelectInputProps {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
}

export const SelectInput = ({
  icon,
  value,
  onChange,
  options,
  placeholder = "Select",
  error,
}: SelectInputProps) => (
  <div className="relative flex items-center">
    {icon && (
      <span className="pointer-events-none absolute left-3 z-10 text-slate-400">{icon}</span>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full appearance-none rounded-lg border bg-white py-2.5 ${icon ? "pl-9" : "pl-3"} pr-9 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-600"
        } ${!value ? "text-slate-400" : ""}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown size={16} className="pointer-events-none absolute right-3 text-slate-400" />
  </div>
);

export interface DateInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}

export const DateInput = ({ value, onChange, placeholder, error }: DateInputProps) => (
  <div className="relative flex items-center">
    <span className="pointer-events-none absolute left-3 text-slate-400">
      <Calendar size={16} />
    </span>
    <input
      type="date"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? "border-red-400" : "border-slate-600"
        }`}
    />
  </div>
);

export interface RadioYesNoProps {
  label: string;
  labelHi?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export const RadioYesNo = ({ label, labelHi, value, onChange, disabled }: RadioYesNoProps) => (
  <div className=" last:mb-0 flex gap-2 items-center">
    <label className=" block text-sm large font-medium text-[#1F2858]">

      {label}
      {labelHi && <span className="text-slate-600"> / {labelHi}</span>}
    </label>
    <div className="flex items-center gap-4 pt-1">
      {(["Yes", "No"] as const).map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-2 text-sm text-slate-700 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
        >
          <input
            type="radio"
            checked={opt === "Yes" ? value : !value}
            onChange={() => !disabled && onChange(opt === "Yes")}
            disabled={disabled}
            className="h-4 w-4 accent-blue-600"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export interface SectionCardProps {
  titleEn: string;
  titleHi: string;
  subtitleEn?: string;
  subtitleHi?: string;
  icon?: string | ReactNode;
  children: ReactNode;
}

export const SectionCard = ({
  titleEn,
  titleHi,
  subtitleEn,
  subtitleHi,
  icon,
  children,
}: SectionCardProps) => (
  <div className="bg-white rounded-[20px] border-x border-b-2 border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
    <div className="mb-5 flex items-center gap-3">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center">
          {typeof icon === "string" ? (
  <img src={icon} alt="" className="h-8 w-8" />
) : (
  icon
)}
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold leading-none text-[#1F2858]">
          {titleEn} / <span className="text-slate-600">{titleHi}</span>
        </h3>
        {(subtitleEn || subtitleHi) && (
          <p className="mt-0.5 text-xs text-[#64748B]">
            {subtitleEn}
            {subtitleHi && ` / ${subtitleHi}`}
          </p>
        )}
      </div>
    </div>
    {children}
  </div>
);

export interface DocumentRowProps {
  label: string;
  checked: boolean;
  expiryDate: string;
  documentNumber: string;
  onCheck: (v: boolean) => void;
  onExpiryChange: (v: string) => void;
  onDocNumberChange: (v: string) => void;
  showDocNumber?: boolean;
}

export const DocumentRow = ({
  label,
  checked,
  expiryDate,
  documentNumber,
  onCheck,
  onExpiryChange,
  onDocNumberChange,
  showDocNumber = true,
}: DocumentRowProps) => (
  <div className="flex items-center gap-3 border-b border-slate-100 py-2.5 last:border-0">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheck(e.target.checked)}
      className="h-4 w-4 shrink-0 accent-blue-600"
    />
    <span className="min-w-[140px] flex-1 text-sm text-slate-700">{label}</span>
    <div className="relative w-44">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Calendar size={14} />
      </span>
      <input
        type="date"
        value={expiryDate}
        disabled={!checked}
        onChange={(e) => onExpiryChange(e.target.value)}
        placeholder="Enter Expiry Date"
        className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-2 text-xs disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
    {showDocNumber && (
      <div className="relative w-44">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <FileText size={14} />
        </span>
        <input
          type="text"
          value={documentNumber}
          disabled={!checked}
          onChange={(e) => onDocNumberChange(e.target.value)}
          placeholder="Enter Document Number"
          className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-2 text-xs disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>
    )}
  </div>
);

export interface UploadZoneProps {
  titleEn: string;
  titleHi: string;
  subtitleEn?: string;
  subtitleHi?: string;
}

export interface LookupButtonProps {
  items: string[];
  onPick: (item: string) => void;
}

export const LookupButton = ({ items, onPick }: LookupButtonProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-[#0A66D8] transition hover:bg-[#DDEAFF]"
      >
        <MoreVertical size={18} strokeWidth={2.4} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-20 max-h-52 w-40 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onPick(item);
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export interface PickerFieldProps {
  label: string;
  labelHi?: string;
  required?: boolean;
  icon: ReactNode;
  value: string;
  placeholder?: string;
  onPickerClick: () => void;
}

/** AccountMaster-style field: icon input + external lookup button */
export const PickerField = ({
  label,
  labelHi,
  required = true,
  icon,
  value,
  placeholder,
  onPickerClick,
}: PickerFieldProps) => (
  <FieldShell label={label} labelHi={labelHi} required={required} variant="large" className="mb-3 last:mb-0">
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onPickerClick}
        className="group flex h-10 w-full cursor-pointer items-center rounded-md border border-[#B8C2D6] bg-white px-4 transition-all duration-200 hover:border-[#0A66D8] focus-within:border-[#0A66D8] focus-within:ring-2 focus-within:ring-[#0A66D8]/10"
      >
        <span className="shrink-0 text-[#6B7280]">{icon}</span>
        <input
          type="text"
          readOnly
          placeholder={placeholder}
          value={value}
          className="pointer-events-none ml-3 w-full cursor-pointer bg-transparent text-[16px] text-[#4B5563] placeholder:text-[#7C879B] outline-none"
        />
      </button>
      <button
        type="button"
        onClick={onPickerClick}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#0A66D8] transition-all duration-200 hover:bg-[#DDEAFF] active:scale-95"
      >
        <MoreVertical size={18} strokeWidth={2.5} />
      </button>
    </div>
  </FieldShell>
);

export interface FormTextFieldProps {
  label: string;
  labelHi?: string;
  required?: boolean;
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

/** AccountMaster-style editable text field with icon */
export const FormTextField = ({
  label,
  labelHi,
  required = true,
  icon,
  value,
  onChange,
  placeholder,
  readOnly,
}: FormTextFieldProps) => (
  <FieldShell label={label} labelHi={labelHi} required={required} variant="large" className="mb-3 last:mb-0">
    <div className="flex h-10 items-center rounded-md border border-[#B8C2D6] bg-white px-4 transition-all duration-200 focus-within:border-[#0A66D8] focus-within:ring-2 focus-within:ring-[#0A66D8]/10">
      <span className="shrink-0 text-[#6B7280]">{icon}</span>
      <input
        type="text"
        readOnly={readOnly}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ml-3 w-full bg-transparent text-[16px] text-[#4B5563] placeholder:text-[#7C879B] outline-none"
      />
    </div>
  </FieldShell>
);

export const UploadZone = ({ titleEn, titleHi, subtitleEn, subtitleHi }: UploadZoneProps) => (
  <SectionCard
    titleEn={titleEn}
    titleHi={titleHi}
    subtitleEn={subtitleEn}
    subtitleHi={subtitleHi}
  >
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6">
      <p className="mb-4 text-sm text-slate-500">Drag and drop a file here, or:</p>
      <div className="flex gap-8">
        {[
          { label: "Browse", icon: "🖥" },
          { label: "Library", icon: "📁" },
          { label: "Click Photo", icon: "📷" },
        ].map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="flex flex-col items-center gap-1 text-xs text-slate-600 hover:text-blue-600"
          >
            <span className="text-2xl">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  </SectionCard>
);

export interface ActionButtonsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelText?: string;
  submitText?: string;
  className?: string;
}

export const ActionButtons = ({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  className = "",
}: ActionButtonsProps) => (
  <div className={`flex items-center justify-end gap-3 ${className}`}>
    <button
      type="button"
      onClick={onCancel}
      className="flex items-center gap-2 rounded-lg border-2 border-[#0A66D8] bg-white px-6 py-2.5 text-sm font-medium text-[#0A66D8] transition-colors hover:bg-blue-50"
    >
      <X size={16} />
      {cancelText}
    </button>
    <button
      type="button"
      onClick={onSubmit}
      className="flex items-center gap-2 rounded-lg bg-[#0A66D8] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
    >
      {submitText}
      <Upload size={16} />
    </button>
  </div>
);
