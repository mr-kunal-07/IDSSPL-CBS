'use client'

import React, { useState } from 'react'
import {
  X,
  UserPlus,
  User,
  Wallet,
  FileText,
  Check,
  ChevronDown,
  Hash,
} from 'lucide-react'
import { useBilingual } from '@/i18n/useBilingual'

const page = () => {
  const { t, en } = useBilingual()
  const [serial, setSerial] = useState('9')

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-white rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-primary-500 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0B1B3D]">
            {en('lienRevoke.title')}
            {t('lienRevoke.title') ? (
              <span className="text-gray-500 font-semibold"> / {t('lienRevoke.title')}</span>
            ) : null}
          </h2>
        </div>
        <button
          type="button"
          className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Account Details Card */}
      <div className="rounded-2xl border-2 border-primary p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full border border-primary/40 bg-primary-50 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1B3D]">
            {en('common.accountDetails')}
            {t('common.accountDetails') ? <span className="text-gray-500 font-semibold"> / {t('common.accountDetails')}</span> : null}
          </h3>
        </div>
        <div className="border-t border-gray-200 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {en('fields.accountCode')}
              {t('fields.accountCode') ? <span className="text-gray-500"> / {t('fields.accountCode')}</span> : null}
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
              {en('fields.accountName')}
              {t('fields.accountName') ? <span className="text-gray-500"> / {t('fields.accountName')}</span> : null}
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
        </div>
      </div>

      {/* Lien Details Card */}
      <div className="rounded-2xl border-2 border-primary p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full border border-primary/40 bg-primary-50 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1B3D]">
            {en('common.lienDetails')}
            {t('common.lienDetails') ? <span className="text-gray-500 font-semibold"> / {t('common.lienDetails')}</span> : null}
          </h3>
        </div>
        <div className="border-t border-gray-200 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {en('fields.serial')}
              {t('fields.serial') ? <span className="text-gray-500"> / {t('fields.serial')}</span> : null}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3">
              <Hash className="w-5 h-5 text-gray-500 shrink-0" />
              <select
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                className="w-full bg-transparent text-gray-700 outline-none appearance-none cursor-pointer"
              >
                <option value="9">9</option>
                <option value="8">8</option>
                <option value="7">7</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {en('fields.loanAccountCode')}
              {t('fields.loanAccountCode') ? <span className="text-gray-500"> / {t('fields.loanAccountCode')}</span> : null}
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
              {en('fields.loanAccountName')}
              {t('fields.loanAccountName') ? <span className="text-gray-500"> / {t('fields.loanAccountName')}</span> : null}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3">
              <input
                type="text"
                readOnly
                defaultValue="Akshay Om More"
                className="w-full bg-transparent text-gray-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {en('fields.lienAmount')}
              {t('fields.lienAmount') ? <span className="text-gray-500"> / {t('fields.lienAmount')}</span> : null}
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
              {en('fields.remark')}
              {t('fields.remark') ? <span className="text-gray-500"> / {t('fields.remark')}</span> : null}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3">
              <FileText className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                readOnly
                defaultValue="-"
                className="w-full bg-transparent text-gray-600 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-[#0a58ac] transition-colors"
        >
          {en('common.validate')} <Check className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-8 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary-50 transition-colors"
        >
          {en('common.cancel')} <X className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-100 text-gray-400 font-semibold cursor-not-allowed"
          disabled
        >
          {en('common.revoke')} <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default page