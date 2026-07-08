"use client";

import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationCards from "@/components/Authorization/AuthorizationCards";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar ">
      <GlobalNav
        titleEn="Authorization"
        titleHi="अधिकृतीकरण"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Authorization", href: "#" },
        ]}
        onBack={() => window.history.back()}
      />

      <AuthorizationCards />
    </div>
  );
};

export default Page;
