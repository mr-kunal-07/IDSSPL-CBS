import { Check, X } from "lucide-react";

type SuccessModalProps = {
  onClose: () => void;
  onDone: () => void;
  data?: unknown;
};

export default function SuccessModal({ onClose, onDone }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div className="relative w-full max-w-[500px] overflow-hidden rounded-[30px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)]">

        {/* Background Circles */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#DCEBFF] opacity-90 blur-[1px]" />
        <div className="absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-[#DCEBFF] opacity-90 blur-[1px]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-7 top-7 text-[#6F7785] hover:scale-105 transition"
        >
          <X size={32} strokeWidth={2.2} />
        </button>

        <div className="px-12 py-14 flex flex-col items-center">

          {/* Success Icon */}
          <SuccessIcon />

          {/* Heading */}
          <h2 className="mt-10 text-center text-[28px] font-[700] leading-[34px] text-black">
            Account Added Successfully
            <br />
            Please Authorize
          </h2>

          {/* Button */}
          <button
            onClick={onDone}
            className="mt-9 h-[45px] w-[88px] rounded-lg bg-[#1F67F4] text-[22px] font-semibold text-white shadow-md transition hover:bg-[#0E57EA]"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div className="relative flex items-center justify-center">

      {/* Decorative dots */}
      <span className="absolute h-[105px] w-[105px] rounded-full border border-dashed border-[#3F73F5]/20" />

      {[
        "top-0 left-1/2",y
        "top-4 left-3",
        "top-6 right-3",
        "left-0 top-1/2",
        "right-0 top-1/2",
        "bottom-5 left-3",
        "bottom-4 right-4",
        "bottom-0 left-1/2",
        "top-2 right-10",
        "top-8 left-8",
        "bottom-7 right-10",
        "bottom-8 left-9",
      ].map((cls, i) => (
        <span
          key={i}
          className={`absolute ${cls} h-[4px] w-[4px] rounded-full bg-[#3F73F5]`}
        />
      ))}

      {/* Blue Circle */}
      <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#416EF4] shadow-[0_10px_20px_rgba(65,110,244,0.35)]">
        <Check
          size={44}
          strokeWidth={3.5}
          color="white"
        />
      </div>
    </div>
  );
}