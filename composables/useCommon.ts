export const useCommon = async <T = any>(
  path: string,
  options: any = {},
  withAuth: boolean = true
) => {
  const config = useRuntimeConfig();
  const accessToken = useCookie<string>("access_token");

  const headers = {
    ...(options.headers || {}),
    ...(withAuth && accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : {}),
  };

  return await useFetch<T>(`${config.public.apiUrl}${path}`, {
    ...options,
    headers,
    credentials: "include", // penting agar kirim cookie
  });
};
