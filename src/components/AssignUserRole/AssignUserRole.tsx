"use client";

import { useState } from "react";
import NavbarAUR from "./NavbarAUR";
import UserTable from "./UserTable";
import RoleAssignmentForm, { type SelectedUser } from "./RoleAssignmentForm";

export default function AssignUserRole() {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>({
    userId: "001",
    userName: "Appana M Telgi",
    userRole: "Officer",
  });

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarAUR
        titleEn="Assign User Role"
        titleHi="कस्टमर मास्टर"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Assign User Role", href: "/assignuserrole" },
        ]}
        onBack={() => window.history.back()}
      />

      <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
        <UserTable onUserSelect={setSelectedUser} />
        <RoleAssignmentForm selectedUser={selectedUser} />
      </div>
    </div>
  );
}
