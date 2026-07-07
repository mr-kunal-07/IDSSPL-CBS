"use client";

import { useState } from "react";
import NavbarAM from "./NavbarAM";
import FilterModal, { type AccountFilters } from "./FilterModal";
import AccountMasterTable from "./AccountMasterTable";

export default function AccountMasterPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<AccountFilters>({
    accountName: "",
    accountNumber: "",
    accountType: "",
  });

  return (
    <div>
      <NavbarAM
        titleEn="Account Master"
        titleHi="खाता मास्टर"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account Master", href: "/account-master" },
        ]}
        onBack={() => console.log("back")}
        onOpenFilter={() => setIsFilterOpen(true)}
        onAdd={() => console.log("add")}
      />

      {/* Page content goes here */}

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <AccountMasterTable filters={filters} />
      </div>
    </div>
  );
}