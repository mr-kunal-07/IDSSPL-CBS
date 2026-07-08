"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import IconRail from "./IconRail";
import SidebarHeader from "./SidebarHeader";
import NavGroup from "./NavGroup";
import NavItem from "./NavItem";
import UserFooter from "./UserFooter";
import CollapseButton from "./CollapseButton";

import { menuItems, railIcons, user } from "./sidebarData";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen: _isOpen, onClose: _onClose }: SidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [activeRail, setActiveRail] = useState("home");

  return (
   <div
  className="flex h-screen"
  onMouseEnter={() => setCollapsed(false)}
  onMouseLeave={() => setCollapsed(true)}
>
  {/* Left Rail */}
  <IconRail
    items={railIcons}
    active={activeRail}
    onSelect={setActiveRail}
  />

  {/* Sidebar */}
  <div className="relative">
    <CollapseButton
      collapsed={collapsed}
      onClick={() => setCollapsed(!collapsed)}
    />

    <div
      className={`
        overflow-hidden
        rounded-r-2xl
        border-r
        border-primary
        bg-[#0C0B1E]
        transition-all
        duration-300
        ${collapsed ? "w-0" : "w-[230px]"}
      `}
    >
      <div className="flex h-screen w-[230px] flex-col">
        <SidebarHeader />

        <div className="mt-5 flex-1 overflow-y-auto px-2 pb-3">
          <div className="space-y-1">
            {menuItems.map((item) =>
              item.children ? (
                <NavGroup
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  defaultOpen={item.children.some(
                    (child) => child.href === pathname
                  )}
                />
              ) : (
                <NavItem
                  key={item.id}
                  item={item}
                  active={pathname === item.href}
                />
              )
            )}
          </div>
        </div>

        <UserFooter user={user} />
      </div>
    </div>
  </div>
</div>
  );
}