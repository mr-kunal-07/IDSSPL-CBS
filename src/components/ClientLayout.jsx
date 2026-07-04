"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header";

export default function ClientLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
