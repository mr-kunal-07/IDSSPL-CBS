"use client";

import { useState } from "react";
import {
  User,
  CreditCard,
  Calendar,
  FileText,
  IndianRupee,
  Repeat,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  SelectInput,
  DateInput,
  SectionCard,
  LookupButton,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";

const SI_FREQUENCIES = ["Daily", "Weekly", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];

const CREDIT_ACCOUNT_CODES = ["00021010000008", "00024090001664", "00024090005522"];

export interface NewSIFormData {
  debitAccountCode: string;
  debitName: string;
  creditAccountCode: string;
  creditName: string;
  startDate: string;
  endDate: string;
  nextDueDate: string;
  maturityDate: string;
  debitParticular: string;
  creditParticular: string;
  amount: string;
  frequency: string;
}

export interface AddSIProps {
  onClose: () => void;
  onSave?: (data: NewSIFormData) => void;
  debitAccountCode?: string;
  debitName?: string;
}

const AddSI = ({ onClose, onSave, debitAccountCode = "022010014255", debitName = "Mirji Chandrashekar Bhimgouda" }: AddSIProps) => {
  const [account, setAccount] = useState({
    debitAccountCode,
    debitName,
    creditAccountCode: "",
    creditName: "",
  });

  const [si, setSi] = useState({
    startDate: "",
    endDate: "",
    nextDueDate: "",
    maturityDate: "",
    debitParticular: "",
    creditParticular: "",
    amount: "",
    frequency: "",
  });

  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

const grid4 =
  "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-5";
  const isFormComplete = () =>
    account.creditAccountCode.trim() !== "" &&
    account.creditName.trim() !== "" &&
    si.startDate.trim() !== "" &&
    si.endDate.trim() !== "" &&
    si.nextDueDate.trim() !== "" &&
    si.maturityDate.trim() !== "" &&
    si.debitParticular.trim() !== "" &&
    si.creditParticular.trim() !== "" &&
    si.amount.trim() !== "" &&
    si.frequency.trim() !== "";

  const markDirty = () => {
    if (isValidated) setIsValidated(false);
  };

  const handleValidate = () => {
    if (!isFormComplete()) {
      window.alert("Please fill all required fields before validating.");
      return;
    }
    setIsValidated(true);
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    onSave?.({ ...account, ...si });
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        heading={
          <>
            Standing Instruction Added Successfully
            <br />
            Please Authorize
          </>
        }
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="New Standing Instruction"
      titleHi="नवीन स्थायी सूचना"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
    >
      <SectionCard titleEn="Account Details" titleHi="खात्याचा तपशील" icon={<User size={16} />}>
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Debit Account Code" labelHi="नावे खाते संकेत" required>
            <TextInput icon={<CreditCard size={16} />} value={account.debitAccountCode} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Name" labelHi="नाव" required>
            <TextInput icon={<User size={16} />} value={account.debitName} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Credit Account Code" labelHi="जमा खात्याचा कोड" required>
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={account.creditAccountCode}
                  onChange={(v) => {
                    markDirty();
                    setAccount((a) => ({ ...a, creditAccountCode: v }));
                  }}
                  placeholder="Enter Credit Account Code"
                />
              </div>

              <LookupButton
                items={CREDIT_ACCOUNT_CODES}
                onPick={(code) => {
                  markDirty();
                  setAccount((a) => ({
                    ...a,
                    creditAccountCode: code,
                  }));
                }}
              />
            </div>
          </FieldShell>
          <FieldShell label="Name" labelHi="नाव" required>
            <TextInput
              icon={<User size={16} />}
              value={account.creditName}
              onChange={(v) => {
                markDirty();
                setAccount((a) => ({ ...a, creditName: v }));
              }}
              placeholder="Enter Name"
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard titleEn="SI Details" titleHi="SI तपशील" icon={<Repeat size={16} />}>
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Start Date" labelHi="सुरुवात तारीख" required>
            <DateInput value={si.startDate} onChange={(v) => { markDirty(); setSi((s) => ({ ...s, startDate: v })); }} />
          </FieldShell>
          <FieldShell label="End Date" labelHi="समाप्तीची तारीख" required>
            <DateInput value={si.endDate} onChange={(v) => { markDirty(); setSi((s) => ({ ...s, endDate: v })); }} />
          </FieldShell>
          <FieldShell label="Next Due Date" labelHi="पुढील देय तारीख" required>
            <DateInput value={si.nextDueDate} onChange={(v) => { markDirty(); setSi((s) => ({ ...s, nextDueDate: v })); }} />
          </FieldShell>
          <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required>
            <DateInput value={si.maturityDate} onChange={(v) => { markDirty(); setSi((s) => ({ ...s, maturityDate: v })); }} />
          </FieldShell>
          <FieldShell label="Debit Acc. Particular" labelHi="नावे खात्याचा तपशील" required>
            <TextInput
              icon={<FileText size={16} />}
              value={si.debitParticular}
              onChange={(v) => { markDirty(); setSi((s) => ({ ...s, debitParticular: v })); }}
              placeholder="Enter Debit Account Particular"
            />
          </FieldShell>
          <FieldShell label="Credit Acc. Particular" labelHi="जमा खात्याचा तपशील" required>
            <TextInput
              icon={<FileText size={16} />}
              value={si.creditParticular}
              onChange={(v) => { markDirty(); setSi((s) => ({ ...s, creditParticular: v })); }}
              placeholder="Enter Credit Account Particular"
            />
          </FieldShell>
          <FieldShell label="Amount" labelHi="रक्कम" required>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={si.amount}
              onChange={(v) => { markDirty(); setSi((s) => ({ ...s, amount: v })); }}
              placeholder="Enter Amount"
            />
          </FieldShell>
          <FieldShell label="SI Frequency" labelHi="SI वारंवारता" required>
            <SelectInput
              icon={<Calendar size={16} />}
              value={si.frequency}
              onChange={(v) => { markDirty(); setSi((s) => ({ ...s, frequency: v })); }}
              options={SI_FREQUENCIES}
              placeholder="Select SI Frequency"
            />
          </FieldShell>
        </div>
      </SectionCard>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleValidate}
          disabled={isValidated || !isFormComplete()}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            isValidated || !isFormComplete()
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Validate <span>✓</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          Cancel <span className="text-lg">×</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValidated}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            isValidated
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          Save <span>▾</span>
        </button>
      </div>
    </FormModal>
  );
};

export default AddSI;
