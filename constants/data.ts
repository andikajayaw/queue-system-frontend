const data = {
  user: {
    name: "Miguel Domingos",
    email: "mighueldomingos@gmail.com",
    avatar: "/avatar.jpeg",
  },
  teams: [
    {
      name: "Nuxt",
      logo: "/avatar.jpeg",
      plan: "Enterprise",
    },
    {
      name: "Shadcn",
      logo: "/avatar.jpeg",
      plan: "Startup",
    },
    {
      name: "Tailwindcss",
      logo: "/avatar.jpeg",
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: "tabler:terminal-2",
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: "hugeicons:chat-bot",
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: "tabler:book",
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "tabler:settings",
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export default data;
