import type { ReactNode } from "react";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "IDSSPL",
  description: "Core Banking Application",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="h-screen overflow-hidden bg-gray-200">
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
}