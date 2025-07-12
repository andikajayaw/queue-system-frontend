export const useCommon = async <T = any>(path: string, options = {}, withAuth: boolean = true) => {
  const token = useCookie("token");
  const config = useRuntimeConfig();

  const headers = {
    ...(options.headers || {}),
    ...(withAuth && token.value?.accessToken
      ? { Authorization: `Bearer ${token.value.accessToken}` }
      : {}),
  };

  return await useFetch<T>(`${config.public.apiUrl}${path}`, {
    ...options,
    headers,
  });
};
