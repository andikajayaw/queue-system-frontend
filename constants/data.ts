const user = useCookie("user");

const data = {
  user: {
    name: user.value?.name,
    email: user.value?.email,
    username: user.value?.username,
    avatar: "/avatar.jpeg",
  },
};

export default data;
