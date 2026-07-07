"use client";

import { useCallback, useMemo, useState } from "react";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import BranchMasterTable, { DEFAULT_BRANCH_ROWS, rowToBranchFormData, type BranchRow } from "@/components/BranchMaster/BranchMasterTable";
import AddBranchModal, { emptyBranchFormData, type BranchFormData } from "@/components/BranchMaster/AddBranchModal";
import FilterModal, { defaultBranchFilterValues, type BranchFilters } from "@/components/BranchMaster/FilterModal";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "MIS Activity", href: "/" },
  { label: "Branch Master", href: "#" },
];

const FILTER_LABELS: Record<keyof BranchFilters, string> = {
  branchCode: "Branch Code",
  branchName: "Branch Name",
  cityCode: "City Code",
  isImplemented: "Is Implemented",
};

export default function BranchMasterPage() {
  const [rows, setRows] = useState<BranchRow[]>(DEFAULT_BRANCH_ROWS);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [viewRow, setViewRow] = useState<BranchRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BranchFilters>(defaultBranchFilterValues);

  const filteredRows = useMemo(() => {
    let result = rows;
    const activeEntries = Object.entries(filters).filter(([, v]) => v?.trim());
    if (activeEntries.length > 0) {
      result = result.filter((row) =>
        activeEntries.every(([key, value]) =>
          String(row[key as keyof BranchRow] ?? "").toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
    }
    return result;
  }, [rows, filters, searchQuery]);

  const activeFilterCount = useMemo(() => Object.values(filters).filter((v) => v?.trim()).length, [filters]);

  const filterSummary = useMemo(() => {
    const entries = Object.entries(filters).filter(([, v]) => v?.trim()) as [keyof BranchFilters, string][];
    if (entries.length === 0) return "";
    const [firstKey, firstVal] = entries[0];
    const extra = entries.length > 1 ? ` +${entries.length - 1} more` : "";
    return `${FILTER_LABELS[firstKey]}:${firstVal}${extra}`;
  }, [filters]);

  const handleAddSave = useCallback((formData: BranchFormData) => {
    setRows((prev) => [
      ...prev,
      {
        sr: prev.length + 1,
        branchCode: formData.branchCode,
        ifscCode: "",
        branchName: formData.branchName,
        shortName: formData.shortName,
        address: [formData.address1, formData.address2, formData.address3].filter(Boolean).join(", "),
        cityCode: formData.cityCode,
        emailId: formData.emailId,
        phoneNo: formData.phoneNumber1,
        isImplemented: formData.isImplemented === "Yes" ? "Y" : "N",
      },
    ]);
    setShowAdd(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#E7EAEF]">
      <GlobalNav
        titleEn="Branch Master"
        titleHi="शाखा मास्टर"
        breadcrumbs={breadcrumbs}
        onBack={() => window.history.back()}
        showActions
        onAdd={() => setShowAdd(true)}
        onFilter={() => setShowFilter(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => {
          setFilters(defaultBranchFilterValues);
          setSearchQuery("");
        }}
        activeFilterCount={activeFilterCount}
        filterSummary={filterSummary}
      />

      <div className="p-4">
        <BranchMasterTable
          rows={filteredRows}
          onView={setViewRow}
          onBranchNonCbsParameter={(row) => console.log("Branch Non CBS Parameter", row)}
          onBranchChequeBookLot={(row) => console.log("Branch Cheque Book Lot", row)}
          onBranchTdReceiptLot={(row) => console.log("Branch TD Receipt Lot", row)}
        />
      </div>

      <AddBranchModal
        open={showAdd}
        mode="add"
        initialData={emptyBranchFormData}
        onClose={() => setShowAdd(false)}
        onSave={handleAddSave}
      />

      <AddBranchModal
        open={!!viewRow}
        mode="view"
        initialData={viewRow ? rowToBranchFormData(viewRow) : emptyBranchFormData}
        onClose={() => setViewRow(null)}
      />

      {showFilter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowFilter(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setShowFilter(false)}
              onApply={setFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
