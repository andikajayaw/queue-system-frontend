// utils/api.ts
export const apiFetch = async (path: string, options: any = {}) => {
  const config = useRuntimeConfig();
  const token = useCookie("token");

  return await $fetch(`${config.public.apiUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token.value.accessToken}`,
      ...options.headers,
    },
  });
};
