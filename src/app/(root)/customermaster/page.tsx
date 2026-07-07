"use client";
import AddCM from "@/components/CustomerMaster/AddCM";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import TableCM from "@/components/CustomerMaster/TableCM";
import BankingServices from "@/components/CustomerMaster/BankingServices";
import { useState } from "react";
import EditEmailModal from "@/components/CustomerMaster/EditEmail";
import EditMobileModal from "@/components/CustomerMaster/EditMobile";

const page = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [openEditMobile, setOpenEditMobile] = useState(false);
  const [openEditEmail, setOpenEditEmail] = useState(false);
  const [openBankingServices, setOpenBankingServices] = useState(false);

  const handleView = (row: any) => {
    console.log("View:", row);
    setSelectedRow(row);
  };

  const handleEdit = (row: any) => {
    console.log("Edit:", row);
    setSelectedRow(row);
    setOpenEditMobile(true);
  };

  const handleEditPhone = (row: any) => {
    console.log("Edit Phone:", row);
    setSelectedRow(row);
    setOpenEditMobile(true);
  };

  const handleEditEmail = (row: any) => {
    console.log("Edit Email:", row);
    setSelectedRow(row);
    setOpenEditEmail(true);
  };

  const handleServices = (row: any) => {
    console.log("Services:", row);
    setSelectedRow(row);
    setOpenBankingServices(true);
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
      />

      <div className="px-3 py-2">
        <TableCM
          onView={handleView}
          onEdit={handleEdit}
          onServices={handleServices}
          onEditPhone={handleEditPhone}
          onEditEmail={handleEditEmail}
        />
      </div>

      {openAddModal && <AddCM onClose={() => setOpenAddModal(false)} />}
      {openEditMobile && selectedRow && (
  <EditMobileModal
    isOpen={openEditMobile}
    onClose={() => setOpenEditMobile(false)}
    onSubmit={(mobile) => {
      // call your update API here
      setOpenEditMobile(false);
    }}
    customerId={selectedRow.customerId}
    customerName={selectedRow.name}
    currentMobile={selectedRow.phone}
  />
)}
     {openEditEmail && selectedRow && (
  <EditEmailModal
    isOpen={openEditEmail}
    onClose={() => setOpenEditEmail(false)}
    onSubmit={(email) => {
      // call your update API here
      setOpenEditEmail(false);
    }}
    customerId={selectedRow.customerId}
    customerName={selectedRow.name}
    currentEmail={selectedRow.email}
  />
)}
      {openBankingServices && selectedRow && (
        <BankingServices
          onClose={() => setOpenBankingServices(false)}
          customerId={selectedRow.customerId}
          customerName={selectedRow.name}
        />
      )}
    </div>
  );
};

export default page