import { createClient } from "@supabase/supabase-js";

// ======================================================
// CONFIG DO SUPABASE
// ======================================================
const SUPABASE_URL = "https://mqtvpnqojmvjyrwhusry.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xdHZwbnFvam12anlyd2h1c3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODA0NTksImV4cCI6MjA3OTY1NjQ1OX0.vn3MJ1rsP54A6CouV5BxQI9_xVB8QZOrUZIGuUVkQpg";

// ======================================================
// CRIA O CLIENTE DO SUPABASE
// ======================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======================================================
// CHECK ROLE + AUTENTICAÇÃO
// ======================================================
export const checkAuthAndRole = async (requiredRole = null, redirect = null) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    if (redirect) window.location.href = redirect;
    return null;
  }

  const { data: userRow, error } = await supabase
    .from("usuarios")
    .select("id, nome, email, user_role")
    .eq("id", session.user.id)
    .single();

  if (error || !userRow) {
    console.error("Erro ao buscar role:", error);
    if (redirect) window.location.href = redirect;
    return null;
  }

  if (requiredRole && userRow.user_role !== requiredRole) {
    if (redirect) window.location.href = redirect;
    return null;
  }

  return {
    id: userRow.id,
    email: userRow.email,
    nome: userRow.nome,
    role: userRow.user_role
  };
};

// ======================================================
// LOGOUT
// ======================================================
export const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "login.html";
};