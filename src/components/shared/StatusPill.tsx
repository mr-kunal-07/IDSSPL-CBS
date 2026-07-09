import { ExternalLink } from "lucide-react";

interface StatusPillProps {
  label: string;
  tone?: "success" | "neutral";
}

const TONE_CLASSES: Record<NonNullable<StatusPillProps["tone"]>, { pill: string; dot: string }> = {
  success: { pill: "border-emerald-500 bg-emerald-50 text-emerald-600", dot: "bg-emerald-700" },
  neutral: { pill: "border-slate-200 bg-slate-50 text-slate-600", dot: "bg-slate-400" },
};

export default function StatusPill({ label, tone = "success" }: StatusPillProps) {
  const { pill, dot } = TONE_CLASSES[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium whitespace-nowrap ${pill}`}>
      <span className={`h-2 w-1.5 rounded-full ${dot}`} />
      {label}
      <ExternalLink size={12} />
    </span>
  );
}
