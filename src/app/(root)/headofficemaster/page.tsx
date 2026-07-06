"use client";

import React, { useState, useCallback } from "react";
import Nav from "@/components/HeadOfficeMaster/Nav";
import HeroOffice from "@/components/HeadOfficeMaster/HeroOffice";
import ParameterModal from "@/components/HeadOfficeMaster/ParameterModal";
import FilterModal from "@/components/HeadOfficeMaster/FilterModal";
import { getMasterConfig, emptyFormData } from "@/components/HeadOfficeMaster/masterConfig";

interface BreadcrumbItem {
  label: string;
  href: string;
  onClick?: () => void;
}

interface MasterItem {
  titleEn: string;
  titleHi: string;
  key: string;
  icon: string;
}

type ModalMode = "add" | null;

const Page: React.FC = () => {
  const [openMaster, setOpenMaster] = useState<MasterItem | null>(null);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [showFilter, setShowFilter] = useState(false);

  const handleOpenMaster = useCallback((master: MasterItem) => {
    const config = getMasterConfig(master.key);
    setOpenMaster(master);
    setTableRows([...config.rows]);
    setFilters({});
  }, []);

  const handleCloseMaster = useCallback(() => {
    setOpenMaster(null);
    setTableRows([]);
    setFilters({});
    setModalMode(null);
    setShowFilter(false);
  }, []);

  const breadcrumbs: BreadcrumbItem[] = openMaster
    ? [
        { label: "Home", href: "/" },
        { label: "MIS Activity", href: "/mis-activity" },
        {
          label: "Master Maintenance Head Office",
          href: "#",
          onClick: handleCloseMaster,
        },
        { label: openMaster.titleEn, href: "#" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "MIS Activity", href: "/mis-activity" },
        { label: "Master Maintenance Head Office", href: "#" },
      ];

  const handleAddSave = (formData: Record<string, string>) => {
    if (!openMaster) return;
    const newRow: Record<string, unknown> = {
      id: String(Date.now()),
      ...formData,
    };
    if (openMaster.key === "accountType") {
      newRow.createdDate = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).toUpperCase();
    }
    setTableRows((prev) => [...prev, newRow]);
    setModalMode(null);
  };

  return (
    <div className="bg-[#E7EAEF] min-h-screen">
      <Nav
        titleEn={openMaster ? openMaster.titleEn : "Master Maintenance Head Office"}
        titleHi={openMaster ? openMaster.titleHi : "मुख्य कार्यालय मास्टर मेंटेनन्स"}
        breadcrumbs={breadcrumbs}
        onBack={() => (openMaster ? handleCloseMaster() : window.history.back())}
        showActions={!!openMaster}
        onFilter={() => setShowFilter(true)}
        onAdd={() => setModalMode("add")}
      />
      <HeroOffice
        openMaster={openMaster}
        setOpenMaster={handleOpenMaster}
        tableRows={tableRows}
        onRowsChange={setTableRows}
        filters={filters}
      />

      {modalMode === "add" && openMaster && (
        <ParameterModal
          mode="add"
          masterKey={openMaster.key}
          initialData={emptyFormData(openMaster.key)}
          onClose={() => setModalMode(null)}
          onSave={handleAddSave}
        />
      )}

      {showFilter && openMaster && (
        <FilterModal
          masterKey={openMaster.key}
          initialFilters={filters}
          onClose={() => setShowFilter(false)}
          onApply={setFilters}
        />
      )}
    </div>
  );
};

export default Page;
