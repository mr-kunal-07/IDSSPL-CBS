"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header";
import I18nProvider from "@/i18n/I18nProvider";
import { getAuthSession, clearAuthSession } from "@/lib/auth";

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      clearAuthSession();
      router.replace("/login");
      return;
    }

    const remainingMs = session.expiresAt - Date.now();
    const timeout = setTimeout(() => {
      clearAuthSession();
      router.replace("/login");
    }, remainingMs);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <I18nProvider>
      <div className="flex h-full">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
        </div>
      </div>
    </I18nProvider>
  );
}
