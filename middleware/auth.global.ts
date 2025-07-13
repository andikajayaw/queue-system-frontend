import { isTokenExpired } from "~/utils/jwt";

export default defineNuxtRouteMiddleware(async (to) => {
  const accessToken = useCookie("access_token");
  const refreshToken = useCookie("refresh_token");
  const user = useCookie("user");

  const tryRefreshToken = async (): Promise<boolean> => {
    try {
      const { data, error } = await useCommon(
        "/auth/refresh-token",
        {
          method: "POST",
          credentials: "include",
        },
        false // karena belum bisa kirim access token (expired)
      );

      if (error.value || !data.value) return false;

      // Update access_token & refresh_token dari response
      accessToken.value = data.value.accessToken;
      refreshToken.value = data.value.refresh_token;

      return true;
    } catch (err) {
      console.log("tryRefreshToken error", err);
      return false;
    }
  };

  const publicPages = ["/sign-in", "/display-queue"];
  if (publicPages.includes(to.path)) return;

  // still working with refresh-token
  // if (!accessToken.value || isTokenExpired(accessToken.value)) {
  //   const refreshed = await tryRefreshToken();
  //   if (!refreshed) {
  //     accessToken.value = null;
  //     refreshToken.value = null;
  //     user.value = null;
  //     return navigateTo("/sign-in");
  //   }
  // }

  // Cek profile jika masih ada token
  // if (accessToken.value) {
  //   const { error } = await useCommon("/auth/profile", {
  //     method: "GET",
  //     credentials: "include",
  //   });

  //   if (error.value) {
  //     accessToken.value = null;
  //     refreshToken.value = null;
  //     user.value = null;
  //     return navigateTo("/sign-in");
  //   }
  // }

  // Cegah akses ke /sign-in jika sudah login
  if (to.path === "/sign-in" && accessToken.value) {
    return navigateTo("/");
  }
});
