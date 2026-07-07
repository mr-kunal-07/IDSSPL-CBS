"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Globe, ArrowUpRight } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { ActionButtons } from "@/components/shared/FormFields";

type BankingServicesProps = {
  onClose: () => void;
  customerId: string;
  customerName: string;
};

const BankingServices = ({ onClose, customerId, customerName }: BankingServicesProps) => {
  const [services, setServices] = useState({
    debitCard: false,
    mobileBanking: true,
    internetBanking: true,
    upiServices: false,
  });

  const toggleService = (key: keyof typeof services) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    console.log("Submitting services:", services);
    onClose();
  };

  const serviceItems = [
    { key: "debitCard" as const, label: "Debit Card", labelHi: "डेबिट कार्ड", icon: CreditCard },
    { key: "mobileBanking" as const, label: "Mobile Banking", labelHi: "मोबाईल बँकिंग", icon: Smartphone },
    { key: "internetBanking" as const, label: "Internet Banking", labelHi: "इंटरनेट बँकिंग", icon: Globe },
    { key: "upiServices" as const, label: "UPI Services", labelHi: "UPI सेवा", icon: ArrowUpRight },
  ];

  return (
    <FormModal
      onClose={onClose}
      titleEn="Banking Services"
      titleHi="बँकिंग सेवा"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      maxWidth="max-w-md"
      hideFooter
    >
      <div className="space-y-4">
        <div className="mb-4 space-y-2">
          <div className="text-sm text-slate-600">
            <span className="font-medium">Customer ID:</span> {customerId}
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium">Customer Name:</span> {customerName}
          </div>
        </div>

        <div className="space-y-3">
          {serviceItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.labelHi}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleService(item.key)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    services[item.key] ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                      services[item.key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <ActionButtons
          onCancel={onClose}
          onSubmit={handleSubmit}
          className="mt-6"
        />
      </div>
    </FormModal>
  );
};

export default BankingServices;
