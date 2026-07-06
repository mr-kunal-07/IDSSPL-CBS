"use client";
import AddCM from "@/components/CustomerMaster/AddCM";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import TableCM from "@/components/CustomerMaster/TableCM";
import { useState } from "react";

const page = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
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
      />

      <div className="px-3 py-2">
        <TableCM />
      </div>

      {openAddModal && <AddCM onClose={() => setOpenAddModal(false)} />}
    </div>
  );
};

export default page