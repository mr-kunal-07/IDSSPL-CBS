"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;
const TIMER_SECONDS = 15;

const OtpVerificationPage = () => {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeLeft(TIMER_SECONDS);
    inputsRef.current[0]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    console.log(code);
    router.push("/dashboard");
  };

  return (
   <div className="min-h-screen bg-linear-to-br from-white to-[#D0E7F6] flex ">
      {/* Left */}
      <div>
        <Image
          src="/login.png"
          alt="Login"
          width={1000}
          height={1000}
          className="h-screen w-auto"
        />      </div>
      {/* Right */}
       <div className="flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logo.png" alt="logo" width={250} height={250} priority />
        </div>

        {/* Heading */}
        <h1 className="mt-3 text-center text-[30px] font-serif text-[#2C3193] leading-none">
          CBS Software Bank
        </h1>

        <h2 className="text-center text-[25px] font-medium text-[#222]">
          Welcome Back
        </h2>

        <p className="mt-1 text-center text-sm text-gray-600 leading-5">
          Empowering banks with a secure, future-ready platform that keeps your
          customers' trust at the heart of every transaction."
        </p>

        {/* OTP Card */}
        <div className="mt-3 rounded-2xl border border-[#D8E3F0] bg-white shadow-sm px-8 py-8">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-[#EAF1FB] flex items-center justify-center">
              <Lock size={22} className="text-[#1668C8]" />
            </div>
          </div>

          <h3 className="mt-4 text-center text-lg font-semibold text-[#222]">
            OTP Verification
          </h3>

          <p className="mt-1 text-center text-sm text-gray-500">
            Enter The OTP Sent To Your Registered Mobile
          </p>

          <div className="mt-5 flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-11 rounded-lg border border-[#D8E3F0] text-center text-lg font-medium text-[#222] outline-none focus:border-[#5B63C6]"
              />
            ))}
          </div>

          <p className="mt-4 text-center text-sm font-medium text-[#1668C8]">
            {formatTime(timeLeft)}
          </p>

          <p className="mt-1 text-center text-sm text-gray-500">
            Didn't receive the OTP?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-[#1668C8] font-medium hover:underline"
            >
              Resend
            </button>
          </p>

          <button
            type="button"
            onClick={handleVerify}
            className="mt-2 h-12 w-full rounded-xl bg-[#1668C8] text-white font-medium hover:bg-[#0F5AB3] transition flex items-center justify-center gap-2"
          >
            Verify
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OtpVerificationPage;