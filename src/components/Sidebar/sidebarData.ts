import {
  LayoutGrid,
  ShieldCheck,
  FileText,
} from "lucide-react";

export const railIcons = [
  {
    id: "home",
    icon: "/home.png",
  },
  {
    id: "briefcase",
    icon: "/desk.png",
  },
  {
    id: "clipboard",
    icon: "/note.png",
  },
  {
    id: "calculator",
    icon: "/calender.png",
  },
  {
    id: "settings",
    icon: "/setting.png",
  },
];

export const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    titleKey: "sidebar.dashboard",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    id: "authorization",
    title: "Authorization",
    titleKey: "sidebar.authorization",
    icon: ShieldCheck,
    href: "/authorization",
  },
  {
    id: "mis",
    title: "MIS Activity",
    titleKey: "sidebar.misActivity",
    icon: FileText,

    children: [
      {
        id: "account",
        title: "Account Master",
        titleKey: "sidebar.accountMaster",
        href: "/accountmaster",
      },
      {
        id: "customer",
        title: "Customer Master",
        titleKey: "sidebar.customerMaster",
        href: "/customermaster",
      },
      {
        id: "transaction",
        title: "Transaction Master",
        href: "/transactionmaster",
      },
      {
        id: "user",
        title: "User Master",
        titleKey: "sidebar.userMaster",
        href: "/usermaster",
      },
      {
        id: "assign",
        title: "Assign User Role",
        titleKey: "sidebar.assignUserRole",
        href: "/assignuserrole",
      },
      {
        id: "head",
        title: "Headoffice Master",
        titleKey: "sidebar.headOfficeMaster",
        href: "/headofficemaster",
      },
      {
        id: "global",
        title: "Global Master",
        titleKey: "sidebar.globalMaster",
        href: "/globalmaster",
      },
      {
        id: "branch",
        title: "Branch Master",
        titleKey: "sidebar.branchMaster",
        href: "/branchmaster",
      },
      {
        id: "futuremodels",
        title: "Future Models",
        titleKey: "sidebar.futureModels",
        href: "/futuremodels",
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