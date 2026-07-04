import { Clock3, ShieldCheck } from "lucide-react";

type UserFooterProps = {
  user: {
    avatar: string;
    name: string;
    email: string;
    lastLogin: string;
    role: string;
  };
};

export default function UserFooter({ user }: UserFooterProps) {
  return (
    <div className="mt-auto p-2">
      <div className="rounded-lg border border-white/10 bg-[#1A0838] p-2.5">
        {/* User */}
        <div className="flex items-center gap-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 flex-shrink-0 rounded-full border border-[#7255FF] object-cover"
          />

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xs font-semibold text-white">
              {user.name}
            </h3>

            <p className="truncate text-[10px] text-[#9EA6C6]">
              {user.email}
            </p>
          </div>
        </div>

        <div className="my-2 h-px bg-white/10" />

        {/* Last Login */}
        <div className="flex items-center gap-1.5 text-[10px] text-[#9EA6C6]">
          <Clock3 size={11} />
          <span>Last Login:</span>
          <span className="ml-auto font-medium text-white">
            {user.lastLogin}
          </span>
        </div>

        {/* Role */}
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#9EA6C6]">
          <ShieldCheck size={11} className="text-[#7255FF]" />
          <span>Role:</span>
          <span className="ml-auto rounded bg-[#7255FF]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#BCAEFF]">
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}