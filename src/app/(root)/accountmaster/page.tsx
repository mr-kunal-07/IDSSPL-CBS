
"use client";
import AccountMasterTable from '@/components/AccountMaster/AccountMasterTable'
import NavbarAM from '@/components/AccountMaster/NavbarAM'
import AddAccountMaster from "@/components/AccountMaster/AddAccountMaster";
import { useState } from 'react';
import ChequeBookIssue from '@/components/AccountMaster/Cheque/cheque-issue';
import DisplayVouchers from '@/components/AccountMaster/Cheque/voucher';
import LienMarkForm from '@/components/AccountMaster/lien/lienMark';


const page = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openChequeModal, setOpenChequeModal] = useState(false);
  const [openVoucherModal, setOpenVoucherModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative" >
      <NavbarAM
        titleEn="Account Master"
        titleHi="खाते मास्टर"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Account Master", href: "/" },
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

export default page