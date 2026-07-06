"use client";
import { useState } from "react";
import AddCM from "@/components/CustomerMaster/AddCM";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import TableCM from "@/components/CustomerMaster/TableCM";
import FilterModal, { type CustomerFilters } from "@/components/CustomerMaster/FilterModal";

const CustomerMasterPage = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>({
    customerName: "",
    customerId: "",
    status: "",
  });

  const handleResetFilters = () => {
    setFilters({
      customerName: "",
      customerId: "",
      status: "",
    });
    setIsSearchVisible(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative">
      <NavbarCM
        titleEn="Customer Master"
        titleHi="कस्टमर मास्टर"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Customer Master", href: "/" },
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
        <TableCM filters={filters} />
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

      {openAddModal && <AddCM onClose={() => setOpenAddModal(false)} />}
    </div>
  );
};

export default CustomerMasterPage;