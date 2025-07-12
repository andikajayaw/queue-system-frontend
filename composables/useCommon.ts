export const useCommon = async <T = any>(path: string, options = {}) => {
  const token = useCookie("token");
  const config = useRuntimeConfig();
  return await useFetch<T>(`${config.public.apiUrl}${path}`, {
    ...options,
    headers: {
      ...(options as any).headers,
      Authorization: `Bearer ${token.value.accessToken}`,
    },
  });
};
