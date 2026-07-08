'use client'

import React, { useState } from 'react'
import {
  X,
  UserPlus,
  User,
  CreditCard,
  Wallet,
  FileText,
  Check,
  ChevronDown,
  Settings,
} from 'lucide-react'
import Image from 'next/image'

const page = () => {
  const [remark, setRemark] = useState('')

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-white rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
            <Image
              src="/add-icn.png"
              alt="Lien Mark"
              width={32}
              height={32}
              className="object-contain h-15 w-15"
              priority
            />
          <h2 className="text-[24px] font-bold text-black">
            Lien Mark / {' '}
            <span className="text-gray-500 font-semibold"> बोजा नोंदवणे</span>
          </h2>
        </div>
        <button
          type="button"
          className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Account Details Card */}
      <div className="rounded-2xl border-x border-b border-t-4 border-[#0A66D8] p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full border border-[#0B63C1]/40 bg-blue-50 flex items-center justify-center">
            <User className="w-5 h-5 text-[#0B63C1]" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1B3D]">
            Account Details /{' '}
            <span className="text-gray-500 font-semibold">खात्याचा तपशील</span>
          </h3>
        </div>
        <div className="border-t border-gray-200 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Account Code / <span className="text-gray-500">खाते कोड</span>
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3">
              <User className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                readOnly
                defaultValue="1234567890"
                className="w-full bg-transparent text-gray-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Account Name / <span className="text-gray-500">खाते नाव</span>
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3">
              <User className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                readOnly
                defaultValue="Akshay Om More"
                className="w-full bg-transparent text-gray-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Ledger Balance / <span className="text-gray-500">लेजर शिल्लक</span>
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3">
              <Wallet className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                readOnly
                defaultValue="408493.5"
                className="w-full bg-transparent text-gray-600 outline-none text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Available Balance /{' '}
              <span className="text-gray-500">उपलब्ध शिल्लक</span>
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3">
              <Wallet className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                readOnly
                defaultValue="408493.5"
                className="w-full bg-transparent text-gray-600 outline-none text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lien Details Card */}
      <div className="rounded-2xl border-x border-b border-t-4 border-[#0A66D8] p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full border border-[#0B63C1]/40 bg-blue-50 flex items-center justify-center">
            <User className="w-5 h-5 text-[#0B63C1]" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1B3D]">
            Lien Details /{' '}
            <span className="text-gray-500 font-semibold">खात्याचा तपशील</span>
          </h3>
        </div>
        <div className="border-t border-gray-200 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Loan Account Code /{' '}
              <span className="text-gray-500">कर्ज खाते कोड</span>
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3">
              <User className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                defaultValue="1234567890"
                className="w-full bg-transparent text-gray-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Loan Account Name /{' '}
              <span className="text-gray-500">कर्ज खाते नाव</span>
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3">
              <input
                type="text"
                defaultValue="Akshay Om More"
                className="w-full bg-transparent text-gray-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Lien Amount / <span className="text-gray-500">बोजा रक्कम</span>
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3">
              <Wallet className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                defaultValue="408493.5"
                className="w-full bg-transparent text-gray-800 outline-none text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Remark / <span className="text-gray-500">शेरा</span>
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3">
              <FileText className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="-"
                className="w-full bg-transparent text-gray-800 outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#0B63C1] text-white font-semibold hover:bg-[#0a58ac] transition-colors"
        >
          Validate <Check className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-8 py-3 rounded-lg border border-[#0B63C1] text-[#0B63C1] font-semibold hover:bg-blue-50 transition-colors"
        >
          Cancel <X className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-100 text-gray-400 font-semibold cursor-not-allowed"
          disabled
        >
          Save <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default page