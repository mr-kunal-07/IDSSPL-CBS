"use client";

import { useState } from "react";
import { X, Filter as FilterIcon, Users, Hash, ChevronRight } from "lucide-react";

const filterOptions = [
  {
    id: "accountName",
    label: "Account Name",
    icon: (
      <span className="flex h-5 w-5 items-center justify-center rounded border border-[#0B63C1] text-[10px] font-bold text-[#0B63C1]">
        A
      </span>
    ),
    placeholder: "Account Name",
    inputIcon: (
      <span className="flex h-5 w-5 items-center justify-center rounded border border-[#0B63C1] text-[10px] font-bold text-[#0B63C1]">
        A
      </span>
    ),
  },
  {
    id: "accountType",
    label: "Account Type",
    icon: <Users size={18} className="text-[#0B63C1]" />,
    placeholder: "Account Type",
    inputIcon: <Users size={18} className="text-[#0B63C1]" />,
  },
  {
    id: "accountNumber",
    label: "Account Number",
    icon: (
      <span className="flex h-5 w-5 items-center justify-center rounded border border-[#0B63C1] text-[10px] font-bold text-[#0B63C1]">
        3
      </span>
    ),
    placeholder: "Account Number",
    inputIcon: (
      <span className="flex h-5 w-5 items-center justify-center rounded border border-[#0B63C1] text-[10px] font-bold text-[#0B63C1]">
        3
      </span>
    ),
  },
];

export default function FilterModal({ onClose }) {
  const [activeFilter, setActiveFilter] = useState("accountName");
  const [values, setValues] = useState({
    accountName: "",
    accountType: "",
    accountNumber: "",
  });

  const active = filterOptions.find((f) => f.id === activeFilter);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [activeFilter]: e.target.value }));
  };

  const handleClearAll = () => {
    setValues({
      accountName: "",
      accountType: "",
      accountNumber: "",
    });
  };

  const handleApply = () => {
    console.log("Applied filters:", values);
  };

  return (
    <div className="relative w-full max-w-[1163px] rounded-3xl border-2 border-[#0B63C1] bg-white p-8 overflow-hidden">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC]" />
      <div className="pointer-events-none absolute top-16 right-0 h-56 w-56 rounded-full bg-[#DCEBFC]" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC]" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-8 top-8 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100"
      >
        <X size={18} />
      </button>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#0B63C1]">
          <FilterIcon size={24} className="text-[#0B63C1]" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Filter</h2>
          <p className="text-gray-400">Use filter for fast and efficient searching</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 border-b border-gray-200" />

      {/* Body */}
      <div className="relative z-10 mt-8 flex items-start gap-0">
        {/* Left options */}
        <div className="flex w-full max-w-[470px] flex-col gap-4">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <div key={option.id} className="relative flex items-center">
                <button
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                    isActive
                      ? "border-[#0B63C1] bg-[#E8F1FD]"
                      : "border-[#0B63C1] bg-white"
                  }`}
                >
                  {option.icon}
                  <span className="text-lg font-medium text-gray-900">
                    {option.label}
                  </span>
                </button>

                {isActive && (
                  <div className="absolute -right-6 flex h-10 w-10 items-center justify-center">
                    <div
                      className="h-0 w-0 border-y-[16px] border-l-[22px] border-y-transparent border-l-[#B9D8F8]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right panel */}
        <div className="ml-10 flex-1 rounded-2xl bg-[#DCEBFC] p-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            {active?.label}
          </h3>
          <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3">
            {active?.inputIcon}
            <input
              type="text"
              value={values[activeFilter]}
              onChange={handleChange}
              placeholder={active?.placeholder}
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="relative z-10 mt-10 flex justify-center gap-4">
        <button
          onClick={handleClearAll}
          className="rounded-full border border-[#0B63C1] px-8 py-3 font-semibold text-[#0B63C1] hover:bg-[#F2F8FE]"
        >
          Clear All
        </button>
        <button
          onClick={handleApply}
          className="rounded-full bg-[#0B63C1] px-10 py-3 font-semibold text-white hover:bg-[#0a56aa]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}