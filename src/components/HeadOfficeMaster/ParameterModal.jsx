"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Check, ChevronDown, ThumbsUp, UserRound, SquarePen } from "lucide-react";
import { getMasterConfig, getFieldIcon } from "./masterConfig";

const MODAL_META = {
  add: {
    titleEn: "Add New Parameter",
    titleHi: "नवीन मापदंड जोडा",
    subtitleEn: "Fill in the details below to create a new parameter.",
    subtitleHi: "नवीन पॅरामीटर जोडण्यासाठी खालील तपशील प्रविष्ट करा.",
    icon: "/add-icn.png",
    useImage: true,
  },
  edit: {
    titleEn: "Edit Parameter",
    titleHi: "पॅरामीटर संपादित करा",
    subtitleEn: "Review and update the details below as needed.",
    subtitleHi: "आवश्यकतेनुसार खालील तपशील तपासा व अद्ययावत करा.",
    icon: SquarePen,
    useImage: false,
  },
  view: {
    titleEn: "View Parameter",
    titleHi: "पॅरामीटर पहा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    icon: UserRound,
    useImage: false,
  },
};

const ParameterModal = ({
  mode = "add",
  masterKey,
  initialData = {},
  onClose,
  onSave,
}) => {
  const config = getMasterConfig(masterKey);
  const meta = MODAL_META[mode];
  const [formData, setFormData] = useState(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, mode, masterKey]);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleValidate = () => {
    const newErrors = {};
    config.fields.forEach((field) => {
      if (!formData[field.key]?.toString().trim()) {
        newErrors[field.key] = true;
      }
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleSave = () => {
    if (!validated) return;
    onSave?.(formData);
    onClose();
  };

  const HeaderIcon = meta.useImage ? null : meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-start gap-3">
            {meta.useImage ? (
              <Image src={meta.icon} alt="" width={50} height={50} />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-[#0B63C1]">
                <HeaderIcon size={24} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-[#1C398E]">
                {meta.titleEn}{" "}
                <span className="font-bold text-[#64748B]">/ {meta.titleHi}</span>
              </h2>
              <p className="text-sm text-slate-500">
                {meta.subtitleEn} / {meta.subtitleHi}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <div className="mt-4 rounded-xl border-2 border-[#0B63C1]/30 p-5">
          {config.fields.map((field) => {
            const Icon = getFieldIcon(field.icon);
            const isReadOnly =
              isView || (isEdit && field.readOnlyOnEdit);
            const hasError = errors[field.key];

            return (
              <div key={field.key} className="mb-4 last:mb-0">
                <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858]">
                  {field.labelEn}
                  <span className="font-medium text-gray-500"> / {field.labelHi}</span>
                  <span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex h-11 items-center rounded-lg border bg-white px-3 transition-colors ${
                    hasError
                      ? "border-red-400"
                      : isReadOnly
                        ? "border-slate-200 bg-slate-50"
                        : "border-[#B8C2D6] focus-within:border-[#0A66D8] focus-within:ring-2 focus-within:ring-[#0A66D8]/10"
                  }`}
                >
                  <Icon size={18} className="shrink-0 text-[#6B7280]" />
                  <input
                    type="text"
                    value={formData[field.key] ?? ""}
                    readOnly={isReadOnly}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={`ml-3 w-full bg-transparent text-[15px] outline-none ${
                      isReadOnly ? "text-slate-500" : "text-[#4B5563] placeholder:text-[#7C879B]"
                    }`}
                  />
                </div>
                {hasError && (
                  <p className="mt-1 text-xs text-red-500">This field is required</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          {isView ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Cancel <X size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Ok, Got It <ThumbsUp size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleValidate}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Validate <Check size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Cancel <X size={16} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  disabled={!validated}
                  onClick={() => validated && setSaveMenuOpen((o) => !o)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    validated
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                  }`}
                >
                  Save <ChevronDown size={16} />
                </button>
                {saveMenuOpen && validated && (
                  <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50"
                    >
                      Save & New
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParameterModal;
