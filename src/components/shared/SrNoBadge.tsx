interface SrNoBadgeProps {
  value: number | string;
}

export default function SrNoBadge({ value }: SrNoBadgeProps) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-primary text-sm font-semibold">
      {value}
    </span>
  );
}
