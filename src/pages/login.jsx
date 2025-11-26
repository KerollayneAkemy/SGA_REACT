import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });

      if (loginError) {
        alert("Erro no login: " + loginError.message);
        return;
      }

      const user = loginData.user;
      if (!user) {
        alert("Erro inesperado: usuário não encontrado.");
        return;
      }

      const { data: userData, error: userDataError } = await supabase
        .from("usuarios")
        .select("user_role")
        .eq("id", user.id)
        .single();

      if (userDataError || !userData) {
        alert("Erro ao buscar dados do usuário.");
        return;
      }

      const role = userData.user_role;

      switch (role) {
        case "aluno":
          window.location.href = "/painel-aluno";
          break;
        case "professor":
          window.location.href = "/painel-professor";
          break;
        case "admin":
          window.location.href = "/painel-admin";
          break;
        default:
          alert("Role desconhecida. Contate o suporte.");
          await supabase.auth.signOut();
          break;
      }
    } catch (err) {
      alert("Ocorreu um erro inesperado. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <main className="login-main">
        <form className="login-box" onSubmit={handleLogin}>
          <h2 className="login-title">Entrar</h2>

          <input
            type="email"
            className="login-input"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="login-input"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit" className="login-submit">
            Entrar
          </button>

          <a href="/cadastro" className="login-cadastrar">
            Criar conta
          </a>
        </form>
      </main>
    </div>
  );
}
