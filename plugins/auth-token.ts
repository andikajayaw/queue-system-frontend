export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const token = useCookie('token'); // Ganti 'token' sesuai nama cookie-mu

  if (token.value) {
    nuxtApp.$fetch = $fetch.create({
      baseURL: config.public.apiUrl,
      headers: {
        Authorization: `Bearer ${token.value.accessToken}`,
      },
      credentials: 'include', // jika masih butuh kirim cookies
    });
  }
});