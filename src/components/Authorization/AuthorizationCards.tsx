"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type AuthorizationItem = {
  key: string;
  icon?: string;
  iconSrc?: string;
  titleEn: string;
  titleHi: string;
  badge: string;
  description: string;
  count: number;
};

const AUTHORIZATION_ITEMS: AuthorizationItem[] = [
  {
    key: "account",
    iconSrc: "/money.png",
    titleEn: "Authorize Account",
    titleHi: "खाते अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
  {
    key: "customer",
    iconSrc: "/hand.png",
    titleEn: "Authorize Customer",
    titleHi: "ग्राहक अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
  {
    key: "user",
    iconSrc: "/contact.png",
    titleEn: "Authorize User",
    titleHi: "वापरकर्ता अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
  {
    key: "roles",
    iconSrc: "/settinguser.png",
    titleEn: "Roles Authorization",
    titleHi: "भूमिका अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
  {
    key: "transaction",
    iconSrc: "/note1.png",
    titleEn: "Authorize Transaction",
    titleHi: "व्यवहार अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
  {
    key: "clearing",
    iconSrc: "/note2.png",
    titleEn: "Authorize Clearing",
    titleHi: "क्लिअरिंग अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
  {
    key: "locker",
    iconSrc: "/locker.png",
    titleEn: "Authorize Locker",
    titleHi: "लॉकर अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
  {
    key: "sms",
    iconSrc: "/message.png",
    titleEn: "Authorize SMS",
    titleHi: "एसएमएस अधिकृत करा",
    badge: "New",
    description: "The newly created record is awaiting authorization.",
    count: 56,
  },
];

type AuthorizationCardProps = {
  item: AuthorizationItem;
  onOpen?: (item: AuthorizationItem) => void;
};

const AuthorizationCard = ({ item, onOpen }: AuthorizationCardProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-b border-l-6 border-[#0B63C1] bg-white px-2 py-1 transition-all duration-200 hover:border-[#1565D8] hover:shadow-md">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden">
          <Image
            src={item.iconSrc!}
            alt={item.titleEn}
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-[16px] font-bold leading-5 text-black">
            {item.titleEn} / <span className="font-semibold text-[#64748B]">{item.titleHi}</span> 
          </h3>

          <div className="mt-2 flex flex-wrap bg-[#EEF6FF] border border-[#BEDBFF] rounded-full pr-2 items-center gap-2">
            <span className="shrink-0 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-medium text-[#018D0A]">
              {item.badge}
            </span>
            <span className="text-[12px] leading-4 text-[#1C398E]">
              {item.description}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen?.(item)}
        className="flex shrink-0 items-center gap-5"
      >
        <span className="text-2xl font-semibold text-[#1565D8]">{item.count}</span>
        <ArrowUpRight size={20} strokeWidth={2.5} className="text-[#111827]" />
      </button>
    </div>
  );
};

type AuthorizationCardsProps = {
  onOpen?: (item: AuthorizationItem) => void;
};

const AuthorizationCards = ({ onOpen }: AuthorizationCardsProps) => {
  return (
    <div className="max-w-6xl p-4 md:p-6 bg-white rounded-xl m-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {AUTHORIZATION_ITEMS.map((item) => (
          <AuthorizationCard key={item.key} item={item} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
};

export default AuthorizationCards;
