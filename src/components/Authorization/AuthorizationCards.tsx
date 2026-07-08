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
    <div
      className="
        flex flex-col gap-2 rounded-2xl border border-l-5 sm:border-l-6 border-[#0B63C1]
        bg-white p-2
        transition-all duration-200 hover:border-[#1565D8] hover:shadow-md
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden sm:h-16 sm:w-16 md:h-20 md:w-20">
          <Image
            src={item.iconSrc!}
            alt={item.titleEn}
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-[clamp(13px,3.4vw,16px)] font-bold leading-[1.35] text-black">
            {item.titleEn}{" "}
            <span className="font-semibold text-[#64748B]">
              / {item.titleHi}
            </span>
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-full border border-[#BEDBFF] bg-[#EEF6FF] py-0.5 pl-0.5 pr-2">
            <span className="shrink-0 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[clamp(9px,2vw,11px)] font-medium text-[#018D0A]">
              {item.badge}
            </span>
            <span className="text-[clamp(10px,2.2vw,12px)] leading-[1.4] text-[#1C398E]">
              {item.description}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen?.(item)}
        aria-label={`Open ${item.titleEn}, ${item.count} pending`}
        className="
          flex shrink-0 items-center justify-between gap-3 self-stretch
          rounded-lg px-1 py-1
          transition-colors hover:bg-[#F1F5F9] focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-[#1565D8] focus-visible:ring-offset-2
          sm:justify-end sm:gap-4 md:gap-5
        "
      >
        <span className="text-[clamp(17px,3.8vw,24px)] font-semibold text-[#1565D8]">
          {item.count}
        </span>
        <ArrowUpRight
          size={20}
          strokeWidth={2.5}
          className="shrink-0 text-[#111827]"
        />
      </button>
    </div>
  );
};

type AuthorizationCardsProps = {
  onOpen?: (item: AuthorizationItem) => void;
};

const AuthorizationCards = ({ onOpen }: AuthorizationCardsProps) => {
  return (
    <div className=" m-5 w-full max-w-7xl rounded-xl bg-white p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-2">
        {AUTHORIZATION_ITEMS.map((item) => (
          <AuthorizationCard key={item.key} item={item} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
};

export default AuthorizationCards;