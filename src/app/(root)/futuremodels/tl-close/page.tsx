"use client";

import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  FileText, 
  ClipboardList, 
  RefreshCw, 
  MoreVertical, 
  Calendar,
  Clock,
  Home,
  Plus,
  ChevronDown,
  ArrowLeft,
  MapPin,
  AlignLeft
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

interface FormData {
  accountCode: string;
  accountName: string;
  glAccountCode: string;
  description: string;
  ledgerBalance: string;
  availableBalance: string;
  scrollNumber: string;
  interestRate: string;
  modeOfPayment: string;
  transferAcCode: string;
  transferAcName: string;
  renewal: string;
  depositAmount: string;
  refundAmount: string;
  surcharge: string;
  completedMonths: string;
  overdue: string;
  particular: string;
  particular1: string;
  outlistSerialNo: string;
  outlistDescription: string;
  outlistDocNo: string;
  serviceCharges: string;
  adviceNumber: string;
  adviceDate: string;
  acReviewDate: string;
  orgResponding: string;
  serviceTax: string;
  interestCalculationDate: string;
}

interface FieldConfig {
  key: keyof FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  readOnly?: boolean;
  suffix?: boolean;
  select?: boolean;
  hasMenu?: boolean;
  onMenuClick?: () => void;
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

interface NavbarCMProps {
  titleEn: string;
  titleHi: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  onBack: () => void;
  onAdd?: () => void;
}

function NavbarCM({ titleEn, titleHi, breadcrumbs, onBack, onAdd }: NavbarCMProps) {
  return (
    <>

      {/* BREADCRUMBS FRAME */}
      <div className="px-6 pt-3 pb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-7 h-7 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-blue-600 hover:bg-slate-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              {titleEn} <span className="text-slate-400 font-medium text-[11px]">| {titleHi}</span>
            </h1>
            <nav className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-0.5">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index === 0 ? (
                    <Home className="w-3 h-3 text-slate-400" />
                  ) : (
                    <span>&gt;</span>
                  )}
                  <span className={index === breadcrumbs.length - 1 ? 'text-blue-500' : ''}>
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[11px] font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        )}
      </div>
    </>
  );
}

// ==========================================
// FORM FIELD COMPONENT - FIXED
// ==========================================

function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  const Icon = field.icon;
  const hasMenu = field.hasMenu || Boolean(field.onMenuClick);

  if (field.select) {
    return (
      <div className="mb-3 last:mb-0">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {field.label}
          <span className="text-slate-400 font-normal">
            {" "}
            <span className="text-slate-600">/</span> {field.labelHi}
          </span>
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <select
            value={value}
            onChange={onChange}
            disabled={field.readOnly}
            className={`
              w-full h-9 rounded-[10px] border border-slate-300 bg-white
              pl-8 pr-3 text-sm text-slate-600 outline-none
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500
              appearance-none
              ${field.readOnly ? 'bg-slate-50 cursor-not-allowed' : ''}
            `}
          >
            <option value="">{field.placeholder}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 last:mb-0">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {field.label}
        <span className="text-slate-400 font-normal">
          {" "}
          <span className="text-slate-600">/</span> {field.labelHi}
        </span>
        <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center gap-2">
        <div
          className={`
            group flex flex-1 items-center w-full h-9 rounded-[10px]
            border border-slate-300 bg-white px-2.5
            transition-all duration-200
            hover:border-blue-400 focus-within:border-blue-500
            focus-within:ring-1 focus-within:ring-blue-500
            ${hasMenu ? 'cursor-pointer' : ''}
          `}
        >
          <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <input
            type="text"
            readOnly={field.readOnly}
            placeholder={field.placeholder}
            value={value}
            onChange={field.readOnly ? undefined : onChange}
            className={`
              ml-2 w-full bg-transparent outline-none
              placeholder:font-medium text-sm text-slate-600
              placeholder:text-slate-400
              ${hasMenu ? 'pointer-events-none cursor-pointer' : ''}
              ${field.readOnly ? 'cursor-not-allowed' : ''}
            `}
          />

          {field.suffix && (
            <span className="text-slate-400 text-sm font-medium ml-auto">₹</span>
          )}
        </div>

        {hasMenu && (
          <button
            type="button"
            onClick={field.onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-blue-600 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
          >
            <MoreVertical size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// SECTION CARD COMPONENT
// ==========================================

interface CardSectionProps {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  description: string;
  children: React.ReactNode;
}

function CardSection({ icon, title, subTitle, description, children }: CardSectionProps) {
  return (
    <div className="border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-2 bg-white shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {title} <span className="text-slate-400 font-normal text-xs">/ {subTitle}</span>
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AccountManagementForm() {
  const [formData, setFormData] = useState<FormData>({
    accountCode: '',
    accountName: '',
    glAccountCode: '',
    description: '',
    ledgerBalance: '',
    availableBalance: '',
    scrollNumber: '',
    interestRate: '',
    modeOfPayment: '',
    transferAcCode: '',
    transferAcName: '',
    renewal: 'yes',
    depositAmount: '',
    refundAmount: '',
    surcharge: '',
    completedMonths: '',
    overdue: '',
    particular: '',
    particular1: '',
    outlistSerialNo: '',
    outlistDescription: '',
    outlistDocNo: '',
    serviceCharges: '',
    adviceNumber: '',
    adviceDate: '',
    acReviewDate: '',
    orgResponding: '',
    serviceTax: '',
    interestCalculationDate: '',
  });

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRenewalChange = (value: string) => {
    setFormData((prev) => ({ ...prev, renewal: value }));
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleValidate = () => {
    console.log('Validate clicked');
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const handlePrintVoucher = () => {
    console.log('Print Voucher clicked');
  };

  const handleSave = () => {
    console.log('Save clicked');
  };

  const handleAccountCodeMenu = () => {
    console.log('Open account code menu');
  };

  const section1Fields: FieldConfig[] = [
    {
      key: 'accountCode',
      label: 'Account Code',
      labelHi: 'खाते कोड',
      placeholder: 'Select Account Code',
      icon: MapPin,
      hasMenu: true,
      onMenuClick: handleAccountCodeMenu,
    },
    {
      key: 'accountName',
      label: 'Account Name',
      labelHi: 'खात्याचे नाव',
      placeholder: 'Account Name',
      icon: User,
    },
    {
      key: 'glAccountCode',
      label: 'GL Account Code',
      labelHi: 'जीएल खाते कोड',
      placeholder: 'GL Account Code',
      icon: FileText,
    },
    {
      key: 'description',
      label: 'Description',
      labelHi: 'ग्राहकाचे नाव',
      placeholder: 'Customer Name',
      icon: User,
    },
    {
      key: 'ledgerBalance',
      label: 'Ledger Balance',
      labelHi: 'उपलब्ध शिल्लक',
      placeholder: 'Enter Ledger Balance',
      icon: CreditCard,
      suffix: true,
    },
    {
      key: 'availableBalance',
      label: 'Available Balance',
      labelHi: 'ठेव कालावधी',
      placeholder: 'Enter Available Balance',
      icon: CreditCard,
      suffix: true,
    },
    {
      key: 'scrollNumber',
      label: 'Scroll Number',
      labelHi: 'स्क्रोल क्रमांक',
      placeholder: 'Scroll Number',
      icon: FileText,
    },
    {
      key: 'interestRate',
      label: 'Interest Rate',
      labelHi: 'व्याज दर',
      placeholder: 'Interest Rate %',
      icon: CreditCard,
      select: true,
    },
  ];

  const section2Fields: FieldConfig[] = [
    {
      key: 'modeOfPayment',
      label: 'Mode of Payment',
      labelHi: 'पेमेंट पद्धत',
      placeholder: 'Select Mode of Payment',
      icon: CreditCard,
      select: true,
    },
    {
      key: 'transferAcCode',
      label: 'Transfer A/c Code',
      labelHi: 'रक्कम',
      placeholder: 'Enter Amount',
      icon: CreditCard,
    },
    {
      key: 'transferAcName',
      label: 'Transfer A/c Name',
      labelHi: 'रक्कम',
      placeholder: 'Enter Amount',
      icon: User,
    },
    {
      key: 'depositAmount',
      label: 'Deposit Amount',
      labelHi: 'ठेव सारांश',
      placeholder: 'Deposit Amount',
      icon: CreditCard,
      suffix: true,
    },
    {
      key: 'refundAmount',
      label: 'Refund Amount',
      labelHi: 'ठेव रक्कम',
      placeholder: 'Enter Refund Amount',
      icon: Calendar,
    },
    {
      key: 'surcharge',
      label: 'Surcharge',
      labelHi: 'मुदतपूर्ती तारीख',
      placeholder: 'Maturity Value',
      icon: CreditCard,
      suffix: true,
    },
    {
      key: 'completedMonths',
      label: 'Completed Months',
      labelHi: 'मुदतपूर्ती मूल्य',
      placeholder: 'Period of Deposit',
      icon: Calendar,
    },
    {
      key: 'overdue',
      label: 'Overdue',
      labelHi: 'ठेव सारांश',
      placeholder: 'Deposit Amount',
      icon: CreditCard,
      suffix: true,
    },
    {
      key: 'particular',
      label: 'Particular',
      labelHi: 'तपशील',
      placeholder: 'By Cash',
      icon: FileText,
    },
    {
      key: 'particular1',
      label: 'Particular 1',
      labelHi: 'तपशील',
      placeholder: 'By Cash',
      icon: FileText,
    },
  ];

  const section3Fields: FieldConfig[] = [
    {
      key: 'outlistSerialNo',
      label: 'Outlist Serial No.',
      labelHi: 'आउटलिस्ट दस्तऐवज क्रमांक',
      placeholder: 'Outlist Doc No.',
      icon: FileText,
    },
    {
      key: 'outlistDescription',
      label: 'Outlist Description',
      labelHi: 'जीएल आउटलिस्ट वर्णन',
      placeholder: 'GL Outlist Description',
      icon: FileText,
      select: true,
    },
    {
      key: 'outlistDocNo',
      label: 'Outlist Doc. No.',
      labelHi: 'आउटलिस्ट दस्तऐवज क्रमांक',
      placeholder: 'Outlist Doc No.',
      icon: FileText,
    },
    {
      key: 'serviceCharges',
      label: 'Service Charges',
      labelHi: 'तपशील',
      placeholder: 'By Cash',
      icon: CreditCard,
      suffix: true,
    },
    {
      key: 'adviceNumber',
      label: 'Advice Number',
      labelHi: 'लिंग',
      placeholder: 'Advice Number',
      icon: FileText,
    },
    {
      key: 'adviceDate',
      label: 'Advice Date',
      labelHi: 'लिंग',
      placeholder: 'Advice Date',
      icon: Calendar,
    },
    {
      key: 'acReviewDate',
      label: 'A/c Review Date',
      labelHi: 'रक्कम',
      placeholder: 'Enter Amount',
      icon: Calendar,
    },
    {
      key: 'orgResponding',
      label: 'Org/Responding',
      labelHi: 'लिंग',
      placeholder: 'Token Number',
      icon: FileText,
      select: true,
    },
    {
      key: 'serviceTax',
      label: 'Service Tax',
      labelHi: 'लिंग',
      placeholder: 'Advice Number',
      icon: FileText,
    },
    {
      key: 'interestCalculationDate',
      label: 'Interest Calculation Date',
      labelHi: 'लिंग',
      placeholder: 'Advice Date',
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn="TL/CC Closer"
        titleHi="मुदत कर्ज वितरण"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Clerk', href: '/clerk' },
          { label: 'Transaction', href: '/clerk/transaction' },
        ]}
        onBack={handleBack}
      />

      <div className="px-6 py-3 space-y-4 max-w-8xl mx-auto">
        {/* Section 1: Account Details */}
        <CardSection
          icon={<User className="w-4 h-4 text-blue-600" />}
          title="Account Details"
          subTitle="खाते तपशील"
          description="Manage customer's personal and identity information. / ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section1Fields.map((field) => (
              <div key={field.key} className="flex items-end gap-2">
                <div className="flex-1">
                  <FormField
                    field={field}
                    value={formData[field.key]}
                    onChange={handleChange(field.key)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 2: Payment Details */}
        <CardSection
          icon={<CreditCard className="w-4 h-4 text-blue-600" />}
          title="Payment Details"
          subTitle="पेमेंट तपशील"
          description="Manage customer's personal and identity information. / ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section2Fields.slice(0, 3).map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
            
            {/* Renewal Radio Buttons */}
            <div className="mb-2">
              <label className="block text-xs font-semibold text-slate-700">
                Renewal <span className="text-slate-400 font-normal">/ अतिरिक्त व्याज गणना</span>
              </label>
              <div className="flex items-center gap-4 mt-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="renewal"
                    value="yes"
                    checked={formData.renewal === 'yes'}
                    onChange={(e) => handleRenewalChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="renewal"
                    value="no"
                    checked={formData.renewal === 'no'}
                    onChange={(e) => handleRenewalChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  No
                </label>
              </div>
            </div>

            {section2Fields.slice(3).map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 3: Accounting Details */}
        <CardSection
          icon={<ClipboardList className="w-4 h-4 text-blue-600" />}
          title="Accounting Details"
          subTitle="ठेव सारांश"
          description="Manage customer's personal and identity information. / ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section3Fields.map((field) => (
              <div key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                />
              </div>
            ))}
          </div>
        </CardSection>

        {/* Section 4: Recovery Summary */}
        <CardSection
          icon={<RefreshCw className="w-4 h-4 text-blue-600" />}
          title="Recovery Summary"
          subTitle="व्याज तपशील"
          description="Manage customer's personal and identity information. / प्राप्त करण्याची येथील संबंधित माहिती व्यवस्थापित करा."
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-[10px] border border-blue-100 bg-blue-50/80 shadow-sm">
              <div className="text-[10px] font-bold text-blue-700 flex flex-wrap gap-1">
                Total Deposit Amount <span className="font-normal opacity-80">/ पूर्वीय निवेश</span>
              </div>
              <div className="text-base font-bold mt-1 tracking-tight text-blue-700">₹ 50,000.00</div>
            </div>
            <div className="p-3 rounded-[10px] border border-indigo-100 bg-indigo-50/80 shadow-sm">
              <div className="text-[10px] font-bold text-indigo-700 flex flex-wrap gap-1">
                Principal Amount <span className="font-normal opacity-80">/ मूल रक्कम</span>
              </div>
              <div className="text-base font-bold mt-1 tracking-tight text-indigo-700">₹ 1,388.89</div>
            </div>
            <div className="p-3 rounded-[10px] border border-purple-100 bg-purple-50/80 shadow-sm">
              <div className="text-[10px] font-bold text-purple-700 flex flex-wrap gap-1">
                Interest Amount <span className="font-normal opacity-80">/ व्याज रक्कम</span>
              </div>
              <div className="text-base font-bold mt-1 tracking-tight text-purple-700">₹ 500.00</div>
            </div>
            <div className="p-3 rounded-[10px] border border-emerald-100 bg-emerald-50/80 shadow-sm">
              <div className="text-[10px] font-bold text-emerald-700 flex flex-wrap gap-1">
                Charges Amount <span className="font-normal opacity-80">/ शुल्क रक्कम</span>
              </div>
              <div className="text-base font-bold mt-1 tracking-tight text-emerald-700">₹ 0.00</div>
            </div>
          </div>

          {/* Two Column Layout for Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Receivable Table */}
            <div className="border border-slate-200 rounded-[10px] overflow-hidden shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-3 bg-[#1e1b4b] text-white text-[10px] font-bold py-2 px-3">
                <div className="text-left">Receivable</div>
                <div className="text-center">Calculated</div>
                <div className="text-center">Recovery</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100 bg-white">
                {[
                  { label: 'Insurance', labelHi: 'लिंग' },
                  { label: 'Insurance Fire', labelHi: 'जन्मी लिंग' },
                  { label: 'ABN Fees', labelHi: 'ABN शुल्क' },
                  { label: 'Execution Fees', labelHi: 'अंमलबजावणी शुल्क' },
                  { label: 'Recovery Charges', labelHi: 'वसुली शुल्क' },
                  { label: 'Interest', labelHi: 'व्याज' },
                  { label: 'Other Charges', labelHi: 'इतर शुल्क' },
                  { label: 'Charges Head', labelHi: 'रक्कम' },
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3 py-1.5 px-3 items-center hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.labelHi}</div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                      <input 
                        type="text" 
                        defaultValue="0.0" 
                        className="w-full text-right text-sm font-medium border border-slate-200 bg-slate-50/50 rounded-[10px] py-1 px-2 pr-3 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                      <input 
                        type="text" 
                        defaultValue="0.0" 
                        className="w-full text-right text-sm font-medium border border-slate-200 bg-white rounded-[10px] py-1 px-2 pr-3 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recovery Table */}
            <div className="border border-slate-200 rounded-[10px] overflow-hidden shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-3 bg-[#1e1b4b] text-white text-[10px] font-bold py-2 px-3">
                <div className="text-left">Recovery</div>
                <div className="text-center">Calculated</div>
                <div className="text-center">Recovery</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100 bg-white">
                {[
                  { label: 'Normal', labelHi: 'नियमित' },
                  { label: 'Overdue', labelHi: 'देय' },
                  { label: 'Moratorium', labelHi: 'स्थिति' },
                  { label: 'Penal Rec.', labelHi: 'दंड वसुली' },
                  { label: 'Penal Int.', labelHi: 'दंड व्याज' },
                  { label: 'Unrecovered', labelHi: 'न वसूल' },
                  { label: 'Pending OIR', labelHi: 'प्रतिबंध OIR' },
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3 py-1.5 px-3 items-center hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.labelHi}</div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                      <input 
                        type="text" 
                        defaultValue="0.0" 
                        className="w-full text-right text-sm font-medium border border-slate-200 bg-slate-50/50 rounded-[10px] py-1 px-2 pr-3 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                      <input 
                        type="text" 
                        defaultValue="0.0" 
                        className="w-full text-right text-sm font-medium border border-slate-200 bg-white rounded-[10px] py-1 px-2 pr-3 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 bg-[#f0f7ff] border border-slate-200 rounded-[10px] p-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-blue-700 font-medium text-[10px]">
              Total recovery will be debited from the selected account after Save.
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <div className="text-[9px] text-slate-500 font-normal">Total Calculated</div>
                <div className="text-blue-700 text-sm font-bold">₹ 500.00</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-normal">Total Recovery</div>
                <div className="text-blue-700 text-sm font-bold">₹ 500.00</div>
              </div>
            </div>
          </div>
        </CardSection>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pb-4">
          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            Validate <span>✓</span>
          </button>
          
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-5 py-2 bg-white border border-[#0b66c2] text-[#0b66c2] hover:bg-slate-50 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            Cancel <span className="text-[10px]">✕</span>
          </button>
          
          <button
            onClick={handlePrintVoucher}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-700 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            Print Voucher <span className="text-xs">🖨️</span>
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center gap-4 px-6 py-2 bg-[#e2e8f0] text-slate-400 text-xs font-semibold rounded-md cursor-not-allowed"
            disabled
          >
            Save <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>
    </div>
  );
}