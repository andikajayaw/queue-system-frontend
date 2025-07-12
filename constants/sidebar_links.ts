type SidebarSubItem = {
  icon?: string;
  title: string;
  url: string;
};

type SidebarLink = {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: SidebarSubItem[];
};

export type SidebarGroup = {
  label: string;
  links?: SidebarLink[];
};

const sidebar_groups: SidebarGroup[] = [
  {
    label: "Geral",
    links: [
      {
        title: "Dashboard",
        url: "/",
        icon: "hugeicons:dashboard-square-01",
      },
      {
        title: "Queue",
        url: "/queue",
        icon: "hugeicons:package",
      },
      // {
      //   title: "Users",
      //   url: "/tasks",
      //   icon: "hugeicons:blockchain-06",
      // },
    ],
  },
  // {
  //   label: "Pages",

  //   links: [
  //     {
  //       title: "Auth",
  //       url: "#",
  //       icon: "hugeicons:locked",
  //       isActive: false,
  //       items: [
  //         {
  //           title: "Sign-in (simple)",
  //           url: "/sign-in-1",
  //         },
  //         {
  //           title: "Sign-in (2 Col)",
  //           url: "/sign-in-2",
  //         },
  //         {
  //           title: "Sign-up",
  //           url: "/sign-up",
  //         },
  //         {
  //           title: "Forgot Password",
  //           url: "/forgot-password",
  //         },
  //         {
  //           title: "OTP",
  //           url: "/otp",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Errors",
  //       url: "#",
  //       icon: "hugeicons:bug-01",
  //       isActive: false,
  //       items: [
  //         {
  //           icon: "tabler:lock",
  //           title: "Unauthorized",
  //           url: "/401",
  //         },
  //         {
  //           icon: "tabler:forbid",
  //           title: "Forbidden",
  //           url: "/403",
  //         },
  //         {
  //           icon: "tabler:error-404",
  //           title: "Not Found",
  //           url: "/404",
  //         },
  //         {
  //           icon: "tabler:server-off",
  //           title: "Internal Server Error",
  //           url: "/500",
  //         },
  //         {
  //           icon: "tabler:plug-off",
  //           title: "Maintenance Error",
  //           url: "/503",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default sidebar_groups;
