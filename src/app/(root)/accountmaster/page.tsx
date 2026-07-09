"use client";
import { useState } from "react";
import { useBilingual } from "@/i18n/useBilingual";
import AccountMasterTable from "@/components/AccountMaster/AccountMasterTable";
import NavbarAM from "@/components/AccountMaster/NavbarAM";
import AddAccountMaster from "@/components/AccountMaster/AddAccountMaster";
import FilterModal, { type AccountFilters } from "@/components/shared/FilterModal";

const AccountMasterPage = () => {
  const { t, en } = useBilingual();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<AccountFilters>({
    accountName: "",
    accountNumber: "",
    accountType: "",
  });

  const handleResetFilters = () => {
    setFilters({
      accountName: "",
      accountNumber: "",
      accountType: "",
    });
    setIsSearchVisible(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative">
      <NavbarAM
        titleEn={en("accountMaster.title")}
        titleHi={t("accountMaster.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("accountMaster.breadcrumb"), href: "/" },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
        isSearchVisible={isSearchVisible}
        filters={filters}
        onToggleSearch={() => setIsSearchVisible((prev) => !prev)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onResetFilters={handleResetFilters}
      />

      <div className="px-3 py-2">
        <AccountMasterTable filters={filters} />
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              onClose={() => setIsFilterOpen(false)}
              onApply={(newFilters) => setFilters(newFilters)}
              initialValues={filters}
            />
          </div>
        </div>
      )}

      {/* Add Modal */}
      {openAddModal && (
        <AddAccountMaster onClose={() => setOpenAddModal(false)} />
      )}
    </div>
  );
};

export default AccountMasterPage;