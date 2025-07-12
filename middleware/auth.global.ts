import { isTokenExpired } from "~/utils/jwt";

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie("token");

  const tryRefreshToken = async (): Promise<boolean> => {
    try {
      const { data, error } = await useCommon("/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (error.value || !data.value) return false;

      token.value.accessToken = data.value;
      return true;
    } catch {
      return false;
    }
  };

  // Bypass untuk public page
  const publicPages = ["/sign-in", "/display-queue"];
  if (publicPages.includes(to.path)) return;

  // Jika tidak punya token, coba refresh
  if (!token.value) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return navigateTo("/sign-in");
  }

  // Jika token ada tapi expired
  if (isTokenExpired(token.value.accessToken)) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) {
      token.value.accessToken = null;
      return navigateTo("/sign-in");
    }
  }

  // Cek profile
  if(token?.value) {
    console.log(token.value)
    const { error } = await useCommon("/auth/profile", {
      method: "GET",
      credentials: "include",
    });
    console.log('cek proflie', error)
    if (error.value) {
      token.value.accessToken = null;
      return navigateTo("/sign-in");
    }
  }

  if (to.path === "/sign-in") return navigateTo("/");
});
