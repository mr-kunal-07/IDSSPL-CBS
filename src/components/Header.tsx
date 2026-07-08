"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Clock3 } from "lucide-react";
import Image from "next/image";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60);

  useEffect(() => {
    setNow(new Date());

    const clock = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timeLeft]);

  const date = now
    ? now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const sessionTime = `${minutes}:${seconds}`;

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#ECECEC] bg-white px-6">
      {/* Left */}
      <div className="text-sm text-[#5D6B82]">
        {date && date.replace(",", " |")}
      </div>

      {/* Center */}
      <div className="flex items-center gap-2">
        <Image
          src="/IDSSPL.png"
          alt="Logo"
          width={36}
          height={36}
          priority
        />

        <h1 className="text-[15px] font-semibold text-[#30343B]">
          CBS Banking Software
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-8 w-32 items-center justify-between rounded-[10px] border border-[#1D73F6] bg-white px-4 text-xs text-[#1D73F6]"
        >
          <span>Language</span>
          <ChevronDown size={15} />
        </button>

        <div
          className="flex h-8 items-center gap-1 rounded-[10px] bg-primary px-3 text-xs text-white"
        >
          <Clock3 size={12} />
          <span>Session Time {sessionTime}</span>
        </div>
      </div>
    </header>
  );
}