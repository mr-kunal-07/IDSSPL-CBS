import {
  LayoutGrid,
  ShieldCheck,
  FileText,
} from "lucide-react";

export const railIcons = [
  {
    id: "home",
    icon: "./sidebar/home.png",
  },
  {
    id: "briefcase",
    icon: "./sidebar/desk.png",
  },
  {
    id: "clipboard",
    icon: "./sidebar/note.png" ,
  },
  {
    id: "calculator",
    icon: "./sidebar/calender.png",
  },
  {
    id: "settings",
    icon: "./sidebar/setting.png",
  },
];

export const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    id: "authorization",
    title: "Authorization",
    icon: ShieldCheck,
    href: "/authorization",
  },
  {
    id: "mis",
    title: "MIS Activity",
    icon: FileText,

    children: [
      {
        id: "account",
        title: "Account Master",
        href: "/accountmaster",
      },
      {
        id: "customer",
        title: "Customer Master",
        href: "/customermaster",
      },
      {
        id: "user",
        title: "User Master",
        href: "/usermaster",
      },
      {
        id: "assign",
        title: "Assign User Role",
        href: "/assignuserrole",
      },
      {
        id: "head",
        title: "Headoffice Master",
        href: "/headofficemaster",
      },
      {
        id: "global",
        title: "Global Master",
        href: "/globalmaster",
      },
      {
        id: "branch",
        title: "Branch Master",
        href: "/branchmaster",
      },
    ],
  },
];

export const user = {
  name: "Kunal Jadhav",
  role: "Admin",
  email: "kunal.jadhav@idsspl.com",
  avatar: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
  lastLogin: "Today, 10:45 AM",
};