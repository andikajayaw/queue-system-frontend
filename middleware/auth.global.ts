import { isTokenExpired } from "~/utils/jwt";

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie("token");

  const tryRefreshToken = async (): Promise<boolean> => {
    try {
      const { data, error } = await useCommon(
        "/auth/refresh-token",
        {
          method: "POST",
          credentials: "include",
        },
        false
      );

      if (error.value || !data.value) return false;
      console.log("tryRefreshToken", data);
      token.value.accessToken = data.value;
      return true;
    } catch (err) {
      console.log(err);
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
  console.log(isTokenExpired(token.value.accessToken));
  if (isTokenExpired(token.value.accessToken)) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) {
      token.value = null;
      return navigateTo("/sign-in");
    }
  }

  // Cek profile
  if (token?.value) {
    const { error } = await useCommon("/auth/profile", {
      method: "GET",
      credentials: "include",
    });
    if (error.value) {
      token.value.accessToken = null;
      return navigateTo("/sign-in");
    }
  }

  if (to.path === "/sign-in") return navigateTo("/");
});
