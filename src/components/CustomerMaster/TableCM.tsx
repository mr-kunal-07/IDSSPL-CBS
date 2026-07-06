"use client";

import { useState, useRef, useEffect } from "react";
import { type CustomerFilters } from "./FilterModal";
import {
  ArrowUpDown,
  MoreVertical,
  ExternalLink,
  Eye,
  SquarePen,
  List,
  Phone,
  Mail,
  Copy,
} from "lucide-react";


type RowData = {
  srNo: number;
  customerId: string;
  phone: string;
  email: string;
  status: string;
  name: string;
  gender: string;
  dob: string;
  regDate: string;
  categoryCode: string;
  riskCategory: string;
};

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false },
  { key: "action", label: "Action", sortable: false },
  { key: "customerDetails", label: "Customer Details", sortable: false },
  { key: "status", label: "Status", sortable: true },
  { key: "name", label: "Customer Name", sortable: true },
  { key: "gender", label: "Gender", sortable: true },
  { key: "dob", label: "Date of Birth", sortable: true },
  { key: "regDate", label: "Registration Date", sortable: true },
  { key: "categoryCode", label: "Category Code", sortable: true },
  { key: "riskCategory", label: "Risk Category", sortable: true },
] as const;

const rows: RowData[] = [
  { srNo: 1, customerId: "1234567890", phone: "8989567890", email: "Shivappa@gmail.com", status: "Active", name: "Jali Shivappa Telgi", gender: "M", dob: "18-Aug-2001", regDate: "25-Sep-2026", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 2, customerId: "0987654321", phone: "7896541230", email: "Aditi@gmail.com", status: "Active", name: "Aditi Verma", gender: "F", dob: "15-Mar-1998", regDate: "10-Oct-2025", categoryCode: "Private", riskCategory: "Low" },
  { srNo: 3, customerId: "5647382910", phone: "1234567891", email: "Ravi@gmail.com", status: "Active", name: "Ravi Kumar", gender: "M", dob: "22-Jul-1995", regDate: "30-Dec-2023", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 4, customerId: "1234567890", phone: "8989567890", email: "Shivappa@gmail.com", status: "Active", name: "Jali Shivappa Telgi", gender: "M", dob: "18-Aug-2001", regDate: "25-Sep-2026", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 5, customerId: "9876543210", phone: "6543210987", email: "Anita.singh@yahoo.com", status: "Active", name: "Anita Singh", gender: "F", dob: "05-May-1995", regDate: "12-Jan-2025", categoryCode: "Private", riskCategory: "Low" },
  { srNo: 6, customerId: "2468013579", phone: "1357908642", email: "rohit_kumar@hotmail.com", status: "Active", name: "Rohit Kumar", gender: "M", dob: "22-Jun-1990", regDate: "30-Aug-2027", categoryCode: "Public", riskCategory: "Low" },
  { srNo: 7, customerId: "0987654321", phone: "5678901234", email: "Anjali@gmail.com", status: "Active", name: "Anjalu Sharma", gender: "F", dob: "05-Jan-1998", regDate: "12-Oct-2025", categoryCode: "Private", riskCategory: "Medium" },
  { srNo: 8, customerId: "1122334455", phone: "3344556677", email: "Rajesh@gmail.com", status: "Active", name: "Rajesh Kumar Sharma", gender: "M", dob: "20-Feb-1990", regDate: "01-Jan-2030", categoryCode: "Public", riskCategory: "High" },
];

const menuOptions = [
  { key: "view", label: "View", icon: Eye },
  { key: "edit", label: "Edit", icon: SquarePen },
  { key: "services", label: "Services", icon: List },
];

type SortKey = keyof Omit<RowData, "phone" | "email">;

const TableCM = ({ filters }: { filters?: CustomerFilters }) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = rows.filter((r) => {
    if (!filters) return true;
    if (filters.customerName && !r.name.toLowerCase().includes(filters.customerName.toLowerCase())) return false;
    if (filters.customerId && !r.customerId.toLowerCase().includes(filters.customerId.toLowerCase())) return false;
    if (filters.status && r.status.toLowerCase() !== filters.status.toLowerCase()) return false;
    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const riskColor = (risk: string) => {
    if (risk === "High") return "text-red-600";
    if (risk === "Medium") return "text-[#0B63C1]";
    return "text-amber-700";
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0B63C1] rounded-t-xl">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() =>
                    col.sortable && handleSort(col.key as SortKey)
                  }
                  className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <ArrowUpDown size={13} className="opacity-80" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr
                key={row.srNo}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50`}
              >
                <td className="px-6 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[#0B63C1] text-sm font-semibold">
                    {row.srNo}
                  </span>
                </td>

                <td className="px-6 py-3 relative">
                  <button
                    onClick={() =>
                      setOpenMenuRow(openMenuRow === row.srNo ? null : row.srNo)
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuRow === row.srNo && (
                    <div
                      ref={menuRef}
                      className="absolute left-6 top-10 z-10 w-64 rounded-xl border border-blue-200 bg-white py-2 shadow-lg"
                    >
                      {menuOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.key}
                            onClick={() => setOpenMenuRow(null)}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            <Icon size={16} className="text-blue-600" />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">
                      {row.customerId}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone size={13} className="text-gray-400" />
                      {row.phone}
                      <button className="text-blue-600 hover:text-blue-700">
                        <Copy size={12} />
                      </button>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                      <Mail size={13} className="text-gray-400" />
                      {row.email}
                      <button className="text-blue-600 hover:text-blue-700">
                        <Copy size={12} />
                      </button>
                    </span>
                  </div>
                </td>

                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                    <span className="h-2 w-1.5 rounded-full bg-emerald-700" />
                    {row.status}
                    <ExternalLink size={12} />
                  </span>
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700">
                  {row.name}
                </td>

                <td className="px-6 py-3">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${
                      row.gender === "M"
                        ? "bg-blue-50 text-[#0B63C1]"
                        : "bg-pink-50 text-pink-600"
                    }`}
                  >
                    {row.gender}
                  </span>
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700">
                  {row.dob}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700">
                  {row.regDate}
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700">
                  {row.categoryCode}
                </td>

                <td className="px-6 py-3">
                  <span
                    className={`text-[16px] font-semibold ${riskColor(row.riskCategory)}`}
                  >
                    {row.riskCategory}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCM;
