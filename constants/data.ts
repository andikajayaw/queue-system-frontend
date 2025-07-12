const token = useCookie("token");

const data = {
  user: {
    name: token.value?.user?.name,
    email: token.value?.user?.email,
    username: token.value?.user?.username,
    avatar: "/avatar.jpeg",
  },
};

export default data;
