"use client";

import { useState, useRef, useEffect } from "react";
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
import { type CustomerFilters } from "./FilterModal";

export type RowData = {
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

interface TableCMProps {
  filters?: CustomerFilters;
  onView?: (row: RowData) => void;
  onEdit?: (row: RowData) => void;
  onServices?: (row: RowData) => void;
  onEditPhone?: (row: RowData) => void;
  onEditEmail?: (row: RowData) => void;
}

const TableCM = ({
  filters,
  onView,
  onEdit,
  onServices,
  onEditPhone,
  onEditEmail,
}: TableCMProps) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuRow(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recalculate menu position on scroll (both vertical and horizontal)
  useEffect(() => {
    const handleScroll = () => {
      if (openMenuRow !== null) {
        const button = buttonRefs.current[openMenuRow];
        if (button) {
          calculateMenuPosition(button);
        }
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Also listen for horizontal scroll specifically
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [openMenuRow]);

  const calculateMenuPosition = (button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    
    // Calculate the actual menu height based on number of options
    // Each option is ~40px tall (padding + text height)
    const optionHeight = 40;
    const menuPadding = 16; // py-2 = 8px top + 8px bottom
    const menuHeight = (menuOptions.length * optionHeight) + menuPadding;
    
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Check if there's enough space below (with some padding)
    const showBelow = spaceBelow > menuHeight + 20;
    
    let topPosition: number;
    
    if (showBelow) {
      // Show below the button
      topPosition = rect.bottom + window.scrollY + 4;
    } else {
      // Show above the button
      topPosition = rect.top + window.scrollY - menuHeight - 4;
      
      // If menu would go above viewport, clamp it to 10px from top
      if (topPosition < 10) {
        topPosition = 10;
      }
    }
    
    // Calculate left position - always align to the three dots button
    let leftPosition = rect.left + window.scrollX - 40;
    const menuWidth = 256; // w-64 = 256px
    
    // If menu would go off the right side of viewport, adjust
    if (leftPosition + menuWidth > window.innerWidth - 10) {
      leftPosition = window.innerWidth - menuWidth - 10;
    }
    
    // If menu would go off the left side of viewport, adjust
    if (leftPosition < 10) {
      leftPosition = 10;
    }
    
    setMenuPosition({
      top: topPosition,
      left: leftPosition,
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleMenuToggle = (srNo: number) => {
    if (openMenuRow === srNo) {
      setOpenMenuRow(null);
      setMenuPosition(null);
      return;
    }

    // Use requestAnimationFrame to ensure button is rendered
    requestAnimationFrame(() => {
      const button = buttonRefs.current[srNo];
      if (button) {
        calculateMenuPosition(button);
      }
      setOpenMenuRow(srNo);
    });
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
    if (risk === "Medium") return "text-primary";
    return "text-amber-700";
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-visible shadow-sm">
      <div 
        ref={tableContainerRef}
        className="overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        <table className="w-full border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-primary rounded-t-xl">
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
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 relative`}
              >
                <td className="px-6 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-primary text-sm font-semibold">
                    {row.srNo}
                  </span>
                </td>

                <td className="px-6 py-3 relative">
                  <button
                    ref={(el) => { buttonRefs.current[row.srNo] = el; }}
                    onClick={() => handleMenuToggle(row.srNo)}
                    className="text-gray-400 hover:text-gray-600 relative z-10"
                  >
                    <MoreVertical size={18} />
                  </button>
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">
                      {row.customerId}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone size={13} className="text-gray-400" />
                      {row.phone}
                      <button
                        onClick={() => onEditPhone?.(row)}
                        className="text-primary hover:text-primary-700"
                      >
                        <Copy size={12} />
                      </button>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                      <Mail size={13} className="text-gray-400" />
                      {row.email}
                      <button
                        onClick={() => onEditEmail?.(row)}
                        className="text-primary hover:text-primary-700"
                      >
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
                        ? "bg-primary-50 text-primary"
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

      {/* Menu dropdown with smart positioning */}
      {openMenuRow !== null && menuPosition && (
        <div
          ref={menuRef}
          className="fixed z-50 w-64 rounded-xl border border-primary-200 bg-white py-2 shadow-lg"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            maxHeight: 'min(300px, 80vh)',
            overflowY: 'auto'
          }}
        >
          {menuOptions.map((opt) => {
            const Icon = opt.icon;
            const row = sortedRows.find(r => r.srNo === openMenuRow);
            return (
              <button
                key={opt.key}
                onClick={() => {
                  setOpenMenuRow(null);
                  setMenuPosition(null);
                  if (!row) return;
                  if (opt.key === "view") onView?.(row);
                  if (opt.key === "edit") onEdit?.(row);
                  if (opt.key === "services") onServices?.(row);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <Icon size={16} className="text-primary shrink-0" />
                <span className="text-gray-700">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TableCM;