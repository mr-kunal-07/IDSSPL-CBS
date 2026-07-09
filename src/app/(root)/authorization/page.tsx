"use client";

import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizationCards from "@/components/Authorization/AuthorizationCards";
import { useBilingual } from "@/i18n/useBilingual";

const Page = () => {
  const { t, en } = useBilingual();
  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar ">
      <GlobalNav
        titleEn={en("authorization.title")}
        titleHi={t("authorization.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("authorization.breadcrumb"), href: "#" },
        ]}
        onBack={() => window.history.back()}
      />

      <AuthorizationCards />
    </div>
  );
};

export default Page;
