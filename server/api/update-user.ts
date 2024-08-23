import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  event.headers.delete("cookie");
  try {
    const client = await serverSupabaseClient(event);
    const data = await readBody(event);
    const resp = await client.auth.updateUser({ data });
    return resp.data.user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
});
