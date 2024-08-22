export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo({ path: "/login", query: { redirectTo: from.fullPath } });
  }
});
