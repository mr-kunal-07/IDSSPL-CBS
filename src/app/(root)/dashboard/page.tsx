'use client'

import React from 'react'
import { useBilingual } from '@/i18n/useBilingual'

const page = () => {
  const { t, en } = useBilingual()
  return (
    <div>
      {en('dashboard.title')} <span className="text-gray-500">/ {t('dashboard.title')}</span>
    </div>
  )
}

export default page
