'use client'

import React from 'react'
import Link from 'next/link'
import { Users, Landmark, ShieldCheck, FileText, LucideIcon } from 'lucide-react'

interface ModuleItem {
  name: string
  route: string
  icon?: LucideIcon
}

const modules: ModuleItem[] = [
  { name: 'Team Deposit Open', route: '/futuremodels/td-open', icon: Users },
  { name: 'Team Deposit Close', route: '/futuremodels/td-close', icon: Landmark },
  { name: 'TD Calculate', route: '/futuremodels/td-calculate', icon: ShieldCheck },
  { name: 'Lean', route: '/futuremodels/lean', icon: FileText },
  { name: 'Un-Lean', route: '/futuremodels/un-lean', icon: FileText },
  { name: 'Standing Instructions', route: '/futuremodels/standing-instructions', icon: FileText },
  { name: 'Memo', route: '/futuremodels/memo', icon: FileText },
]

const MainModel = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
      {modules.map((mod) => {
        const Icon = mod.icon
        return (
          <Link key={mod.route} href={mod.route}>
            <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border border-gray-200 bg-white shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary hover:bg-primary/5">
              {Icon && <Icon className="w-6 h-6 text-primary" />}
              <span className="text-sm font-medium text-gray-700 text-center">
                {mod.name}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default MainModel