"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;

const OtpVerificationPage = () => {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

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

  const handleResendOTP = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(30);
    setCanResend(false);
    inputsRef.current[0]?.focus();
  };

  const CheckOTPverify = () => {
    const code = otp.join("");
    if (code.length === OTP_LENGTH) {
      router.push("/dashboard");
    }
  };

  const isOtpFilled = otp.join("").length === OTP_LENGTH;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-white via-[#EEF8FF] to-[#D0E7F6]">
      <div className="flex w-full h-screen">
        {/* Left Image */}
        <img
          src="/login.png"
          alt="bank"
          className="h-screen w-auto object-cover flex-shrink-0"
        />

        {/* Right */}
       <div className="relative flex-1 pt-[10px] flex flex-col items-center">
          {/* Logo */}
          <div className="w-full flex justify-center items-center mb-5">
            <Image
              src="/logo.png"
              alt="IDSSPL Logo"
              width={353}
    height={118}
    className="w-[353px] h-[118px]"
            />
          </div>

          {/* Login content */}
         <div className="absolute top-[121px] w-full max-w-[557px] flex flex-col items-center">
            <div className="flex flex-col items-start gap-4 h-[134px]">
              <h2
                className="font-medium text-[32px] leading-[110%] text-center w-[557px] h-[35px]"
                style={{ color: "#3730A3", fontFamily: "Literata" }}
              >
                CBS Software Bank
              </h2>
               <h3 className="font-normal text-[28px] leading-[110%] text-center text-[#1A1A1A] w-full">
                Welcome Back
              </h3>
               <p className="font-normal text-[16px] text-center text-[#393939] w-full">
                Empowering banks with a secure, future-ready platform that
                keeps your customers' trust at the heart of every
                transaction.
              </p>
            </div>

            {/* OTP Card */}
            <div className="flex flex-col justify-center items-center px-[54px] py-10 gap-2.5 w-[557px] h-[433px] bg-gradient-to-br from-white to-[#EAF8FB] shadow-[0px_10px_32px_rgba(0,0,0,0.15)] rounded-[22px] mt-8">
              <div className="flex flex-col items-center gap-2.5 w-[412px] h-[369px]">
                <Image
                  src="/Sidebar/Icon.png"
                  alt="otp-icon"
                  width={82}
                  height={82}
                  className="w-[82px] h-[82px]"
                />
              <p
  className="font-medium text-[24px] leading-[24px] text-center w-[332px] h-[24px]"
  style={{ fontFamily: "'Instrument Sans'", color: "#000000" }}
>
  OTP Verification
</p>
                <p
                  className="font-normal text-[16px] leading-[24px] text-center flex justify-center items-center text-[#626262] w-[332px] h-[24px]"
                  style={{ fontFamily: "'Instrument Sans'" }}
                >
                  Enter the OTP Sent to your registered mobile
                </p>

                {/* OTP inputs */}
               <div className="flex flex-row items-center justify-center gap-3.5 h-[61px]">
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
      className="w-12 h-14 text-center rounded-xl border border-[#D8E3F0] bg-white text-lg font-medium text-[#000000] outline-none shadow-sm focus:border-[#1668C8] focus:ring-2 focus:ring-[#1668C8]/20"
    />
  ))}
</div>

                <p
                  className="font-medium text-[16px] leading-[24px] text-center text-[#0B63C1]"
                  style={{ fontFamily: "Instrument Sans" }}
                >
                  00:{timer.toString().padStart(2, "0")}
                </p>

                <p
                  className="font-normal text-[16px] leading-[24px] text-center text-[#626262]"
                  style={{ fontFamily: "Instrument Sans" }}
                >
                  Didn't receive the OTP?{" "}
                  <span
                    className="font-medium text-[#0B63C1] cursor-pointer"
                    onClick={handleResendOTP}
                  >
                    Resend
                  </span>
                </p>
              </div>

              <button
                disabled={!isOtpFilled}
                onClick={CheckOTPverify}
                className="flex flex-row justify-center items-center px-6 py-4 gap-1.5 w-[356px] h-14 bg-[#0B63C1] shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)] rounded-[18px] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;