
"use client";
import { useState } from "react";
import { useBilingual } from "@/i18n/useBilingual";
import AccountMasterTable from '@/components/AccountMaster/AccountMasterTable'
import NavbarAM from '@/components/AccountMaster/NavbarAM'
import AddAccountMaster from "@/components/AccountMaster/AddAccountMaster";
import ChequeBookIssue from '@/components/AccountMaster/Cheque/cheque-issue';
import DisplayVouchers from '@/components/AccountMaster/Cheque/voucher';


 

const page = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openChequeModal, setOpenChequeModal] = useState(false);
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
   const { t, en } = useBilingual();

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative" >
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
      />

      <div className="px-3 py-2">
        <AccountMasterTable
          onChequeBookIssue={() => setOpenChequeModal(true)}
        />
      </div>

      {/* Modal */}
      {openAddModal && (
        <AddAccountMaster
          onClose={() => setOpenAddModal(false)}
        />
      )}
      {openChequeModal && (
        <ChequeBookIssue
          onClose={() => setOpenChequeModal(false)}
          onDisplayVouchers={() => {
            setOpenChequeModal(false);
            setOpenVoucherModal(true);
          }}
        />
      )}
      {openVoucherModal && (
        <DisplayVouchers onClose={() => setOpenVoucherModal(false)} />
      )}
    </div>
  )
 }

export default page;