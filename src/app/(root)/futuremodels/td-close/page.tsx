"use client";
 
import { useState } from "react";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import DepositCloseModal, { type DepositCloseFormData } from "@/components/AccountMaster/DepositClose";
import NavbarAM from "@/components/AccountMaster/NavbarAM";
 
const TermDepositClosePage = () => {
  const [openCloseModal, setOpenCloseModal] = useState(false);
 
  const handleCloseSubmit = (data: DepositCloseFormData) => {
    window.alert(`Term deposit closed for account ${data.accountCode || "-"}.`);
  };
 
  return (
    <div className="min-h-screen bg-[#F4F6FC] relative">
      <NavbarAM
        titleEn="Term Deposit Close"
        titleHi="मुदत ठेव बंद करा"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Future Models", href: "/futuremodels" },
          { label: "Term Deposit Close", href: "/futuremodels/td-close" },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenCloseModal(true)}
      />
 
      {/* {openCloseModal && ( */}
        <DepositCloseModal
          open={openCloseModal}
          onClose={() => setOpenCloseModal(false)}
          onSubmit={handleCloseSubmit}
        />
      {/* )} */}
 
    </div>
  );
};
 
export default TermDepositClosePage;