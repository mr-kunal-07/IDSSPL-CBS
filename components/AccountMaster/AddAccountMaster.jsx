"use client";
import { useState, useMemo } from "react";
import {
  X,
  MapPin,
  AlignLeft,
  MoreVertical,
  Upload,
  Plus,
  User,
  Search,
} from "lucide-react";
import SuccessModal from "./SuccessModal";

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const ACCOUNT_TYPES = [
  { code: "AL", name: "All" },
  { code: "BL", name: "Bill Discounting" },
  { code: "BG", name: "Bill Guarantee" },
  { code: "BR", name: "Branch" },
  { code: "CA", name: "Current Account" },
  { code: "CC", name: "Cash Credit" },
  { code: "FA", name: "Fixed Asset" },
  { code: "GL", name: "General Ledger" },
  { code: "IN", name: "Investment" },
  { code: "OG", name: "Over Draft" },
  { code: "PG", name: "Pigmy Deposit" },
];

const SUB_PRODUCTS = {
  AL: [{ code: "201", description: "Saving Depsoit" }],
  BR: [{ code: "BR", description: "Branch" }],
  CA: [{ code: "CA", description: "Current Account" }],
  CC: [{ code: "CC", description: "Cash Credit" }],
  FA: [{ code: "FA", description: "Fixed Asset" }],
};
const DEFAULT_SUB_PRODUCTS = [
  { code: "201", description: "Saving Depsoit" },
  { code: "BR", description: "Branch" },
  { code: "CA", description: "Current Account" },
  { code: "CC", description: "Cash Credit" },
  { code: "FA", description: "Fixed Asset" },
];

/* ------------------------------------------------------------------ */
/* Shared list-modal shell (Account Type List / Sub Product List)      */
/* ------------------------------------------------------------------ */

function ListModal({ title, columns, rows, onSelect, onClose }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, query]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5 flex-shrink-0">
          <h2 className="text-lg font-medium text-slate-900 whitespace-nowrap">
            {title}
          </h2>
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition flex-shrink-0"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto rounded-lg border border-gray-100 ">
          <table className="w-full text-sm">
            <thead className="sticky top-0">
              <tr className="bg-blue-100 text-slate-800">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className="text-left font-semibold px-5 py-3 first:rounded-tl-lg last:rounded-tr-lg"
                  >
                    {c.label}
                  </th>
                ))}
                <th className="text-left font-semibold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 last:border-0 hover:bg-blue-50/50 transition"
                >
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-3.5">
                      {c.key === columns[0].key ? (
                        <span className="inline-block bg-indigo-50 font-medium text-md px-2.5 py-1 rounded-md">
                          {row[c.key]}
                        </span>
                      ) : (
                        <span className="text-slate-800">{row[c.key]}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onSelect(row)}
                      className="bg-indigo-50 text-blue-600 font-semibold text-sm px-4 py-1.5 rounded-md hover:bg-indigo-100 transition"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center text-gray-400 py-8"
                  >
                    No results found
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


function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-slate-800">{value || "—"}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Add Account form                                               */
/* ------------------------------------------------------------------ */

export default function AddAccountFlow({ onClose = () => { } }) {
  const [step, setStep] = useState("form"); // form | accountTypeList | subProductList | success
  const [formData, setFormData] = useState({
    accountType: "",
    accountCode: "",
    accountDescription: "",
    productType: "",
    productDescription: "",
  });

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSelectAccountType = (row) => {
    setFormData((prev) => ({
      ...prev,
      accountCode: row.code,
      accountType: row.name,
      accountDescription: row.name,
    }));
    setStep("form");
  };

  const handleSelectSubProduct = (row) => {
    setFormData((prev) => ({
      ...prev,
      productType: `${row.code} - ${row.description}`,
      productDescription: row.description,
    }));
    setStep("form");
  };

  const subProductRows =
    SUB_PRODUCTS[formData.accountCode] || DEFAULT_SUB_PRODUCTS;

  const fields = [
    {
      key: "accountType",
      label: "Account Type",
      labelHi: "खाते प्रकार",
      placeholder: "Select Account Type",
      icon: MapPin,
      hasMenu: true,
      readOnly: true,
      onMenuClick: () => setStep("accountTypeList"),
    },
    {
      key: "accountDescription",
      label: "Description",
      labelHi: "वर्णन",
      placeholder: "Description",
      icon: AlignLeft,
      hasMenu: false,
    },
    {
      key: "productType",
      label: "Product Type",
      labelHi: "उत्पादनाचा प्रकार",
      placeholder: "Select Product Type",
      icon: MapPin,
      hasMenu: true,
      readOnly: true,
      onMenuClick: () => setStep("subProductList"),
    },
    {
      key: "productDescription",
      label: "Description",
      labelHi: "वर्णन",
      placeholder: "Description",
      icon: AlignLeft,
      hasMenu: false,
    },
  ];

  const isFormValid =
    formData.accountType &&
    formData.accountDescription &&
    formData.productType &&
    formData.productDescription;

  return (
    <>
      {/* Base form modal — stays mounted underneath the list/success modals */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div className="flex items-start gap-3 mb-6">
            <div className="relative w-11 h-11 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center absolute top-0 left-0">
                <User size={16} className="text-white" fill="white" />
              </div>
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center absolute bottom-0 right-0 border-2 border-white">
                <Plus size={12} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Add Account <span className="font-bold text-indigo-600">/ खाते जोडा</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Add some basic information related to the Employee /{" "}
                <span>कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती</span>
              </p>
            </div>
          </div>

          <div className="border-2 border-blue-500 rounded-xl p-6 space-y-5">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                    {field.label}{" "}
                    <span className="font-normal text-gray-500">
                      / {field.labelHi}
                    </span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div
                      onClick={field.onMenuClick}
                      className={`flex items-center gap-2 flex-1 border border-gray-300 rounded-lg px-3.5 py-3 focus-within:border-blue-500 ${field.readOnly ? "cursor-pointer" : ""
                        }`}
                    >
                      <Icon size={18} className="text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        readOnly={field.readOnly}
                        placeholder={field.placeholder}
                        value={formData[field.key]}
                        onChange={field.readOnly ? undefined : handleChange(field.key)}
                        className="w-full outline-none text-sm placeholder-gray-400 text-gray-900 font-medium bg-transparent cursor-pointer"
                      />
                    </div>
                    {field.hasMenu && (
                      <button
                        type="button"
                        onClick={field.onMenuClick}
                        className="w-11 h-11 flex-shrink-0 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 hover:bg-indigo-100 transition"
                      >
                        <MoreVertical size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-blue-500 text-blue-600 font-medium text-sm hover:bg-blue-50 transition"
            >
              Cancel <X size={16} />
            </button>
            <button
              disabled={!isFormValid}
              onClick={() => setStep("success")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition ${isFormValid
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Submit <Upload size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Account Type List overlay */}
      {step === "accountTypeList" && (
        <ListModal
          title="Account Type List"
          columns={[
            { key: "code", label: "Account Type" },
            { key: "name", label: "Name" },
          ]}
          rows={ACCOUNT_TYPES}
          onSelect={handleSelectAccountType}
          onClose={() => setStep("form")}
        />
      )}

      {/* Sub Product List overlay */}
      {step === "subProductList" && (
        <ListModal
          title="Sub Product List"
          columns={[
            { key: "code", label: "Product Code" },
            { key: "description", label: "Description" },
          ]}
          rows={subProductRows}
          onSelect={handleSelectSubProduct}
          onClose={() => setStep("form")}
        />
      )}

      {/* Success overlay after submit */}
      {step === "success" && (
        <SuccessModal
          data={formData}
          onClose={() => setStep("form")}
          onDone={onClose}
        />
      )}
    </>
  );
}