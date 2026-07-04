import { Search } from "lucide-react";

export default function SidebarHeader() {
    return (
        <div className="px-4 pt-5">

            {/* Logo */}

            <div className="flex items-center justify-center gap-2">

                {/* Replace with your logo */}

                <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-10 w-auto object-contain"
                />

                {/* OR Uncomment if no logo */}

                {/*
                <h2 className="text-xl font-semibold tracking-wide text-white">
                    <span className="text-[#27A7FF]">i</span>DSSPL
                </h2>
                */}

            </div>

            {/* Search */}

            <div className="relative mt-5">

                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7387]"
                />

                <input
                    type="text"
                    placeholder="Search"
                    className="h-8 w-full rounded-md border border-[#ECECEC] bg-white pl-9 pr-3 text-xs text-[#444] placeholder:text-[#9AA2B2] outline-none focus:border-[#1976F9]"
                />

            </div>

        </div>
    );
}