import React, { useEffect, useState } from "react";
import { Phone, Mail, X, Upload, LucideIcon } from "lucide-react";

export type FieldType = "mobile" | "email";

interface FieldConfig {
  icon: LucideIcon;
  titleEn: string;
  titleHi: string;
  labelEn: string;
  labelHi: string;
  inputType: string;
  placeholder: string;
  validate: (val: string) => string;
}

/**
 * Config for each supported field type.
 * Add more entries here (e.g. "userName", "address") to reuse
 * this same modal for other single-field edits.
 */
const FIELD_CONFIG: Record<FieldType, FieldConfig> = {
  mobile: {
    icon: Phone,
    titleEn: "Mobile Number",
    titleHi: "मोबाइल क्रमांक",
    labelEn: "Edit Mobile Number",
    labelHi: "मोबाईल नंबर एडिट करा",
    inputType: "tel",
    placeholder: "Enter Mobile Number",
    validate: (val: string) => {
      if (!val.trim()) return "Mobile number is required";
      if (!/^\d{10}$/.test(val.trim())) return "Enter a valid 10-digit mobile number";
      return "";
    },
  },
  email: {
    icon: Mail,
    titleEn: "Email ID",
    titleHi: "ईमेल आयडी",
    labelEn: "Edit Email ID",
    labelHi: "ईमेल आयडी एडिट करा",
    inputType: "email",
    placeholder: "Enter Email ID",
    validate: (val: string) => {
      if (!val.trim()) return "Email ID is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Enter a valid email address";
      return "";
    },
  },
};

export interface EditFieldModalProps {
  open: boolean;
  fieldType?: FieldType;
  initialValue?: string;
  onClose?: () => void;
  onSubmit?: (value: string) => void;
}

export default function EditFieldModal({
  open,
  fieldType,
  initialValue = "",
  onClose,
  onSubmit,
}: EditFieldModalProps) {
  const config = (fieldType && FIELD_CONFIG[fieldType]) || FIELD_CONFIG.mobile;
  const Icon = config.icon;

  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string>("");

  // Reset the field whenever the modal is (re)opened for a new value.
  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError("");
    }
  }, [open, initialValue, fieldType]);

  if (!open) return null;

  const handleSubmit = () => {
    const validationError = config.validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit?.(value.trim());
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Decorative blurred blobs */}
        <div className="pointer-events-none absolute -left-11 top-[220px] w-44 h-44 bg-sky-100 rounded-full blur-sm" />
        <div className="pointer-events-none absolute -right-8 -top-11 w-44 h-44 bg-sky-100 rounded-full blur-sm" />

        <div className="relative flex flex-col items-center gap-10 sm:gap-16 p-5 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="w-full flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full border-2 border-blue-700 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-700" />
            </div>
            <h1 className="flex-1 text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              <span className="text-indigo-950">{config.titleEn} </span>
              <span className="text-slate-900"> / </span>
              <span className="text-slate-500">{config.titleHi}</span>
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="w-full flex flex-col items-center gap-10 sm:gap-16">
            <div className="w-full flex flex-col gap-2.5">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {config.labelEn} /{" "}
                  <span className="text-slate-500">{config.labelHi}</span>
                </span>
                <span className="text-sm font-medium text-red-500">*</span>
              </div>

              <div
                className={`w-full flex items-center gap-2 px-4 py-3.5 rounded-xl border outline-none ${
                  error ? "border-red-400" : "border-blue-700"
                } shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)]`}
              >
                <Icon className="w-5 h-5 text-gray-900 shrink-0" />
                <input
                  type={config.inputType}
                  value={value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setValue(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder={config.placeholder}
                  className="flex-1 min-w-0 outline-none text-base text-gray-900 placeholder:text-gray-400"
                  autoFocus
                />
              </div>
              {error && <span className="text-sm text-red-500">{error}</span>}
            </div>

            {/* Footer actions */}
            <div className="w-full flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-36 h-12 px-6 py-3.5 rounded-lg border border-blue-700 flex items-center justify-center gap-2 text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors"
              >
                Cancel
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-36 h-12 px-6 py-4 bg-sky-700 rounded-lg flex items-center justify-center gap-2 text-white text-base font-bold hover:bg-sky-800 transition-colors"
              >
                Submit
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}