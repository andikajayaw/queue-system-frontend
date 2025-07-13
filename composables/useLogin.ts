export const useLogin = async (username: string, password: string) => {
  const { data, error } = await useFetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    body: { username, password },
  });
  console.log(data.value, error.value)

  if (error.value) {
    throw new Error(error.value.data?.message || 'Login gagal');
  }

  const { accessToken, refresh_token, user } = data.value;

  if (!accessToken || !refresh_token) {
    throw new Error('Token tidak ditemukan');
  }

  // Simpan token di cookie
  const access = useCookie('access_token');
  const refresh = useCookie('refresh_token');
  const userCookie = useCookie('user');

  access.value = accessToken;
  refresh.value = refresh_token;
  userCookie.value = user;

  return data.value;
};
