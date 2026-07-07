"use client";
import UserMasterTable from '@/components/UserMaster/UserMasterTable';
import AddUserModal from '@/components/UserMaster/AddUserMaster';
import NavbarAM from '@/components/AccountMaster/NavbarAM';
import { useState } from 'react';

interface Breadcrumb {
  label: string;
  href: string;
}

const Page = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);

  const breadcrumbs: Breadcrumb[] = [
    { label: "Home", href: "/" },
    { label: "MIS Activity", href: "/" },
    { label: "User Master", href: "/" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FC] relative">
      <NavbarAM
        titleEn="User Master"
        titleHi="युझर मास्टर"
        breadcrumbs={breadcrumbs}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
      />

      <div className="px-3 py-2">
        <UserMasterTable />
      </div>

      {/* Modal */}
      {openAddModal && (
        <AddUserModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </div>
  );
};

export default Page;