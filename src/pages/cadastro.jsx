import { useState } from "react";
import { supabase } from "../services/supabaseClient";

import "../styles/cadastro.css";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      // --- CADASTRO NO AUTH ---
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          data: {
            nome: nome  // ← O TRIGGER USA ESTE VALOR
          }
        }
      });

      if (error) {
        console.error("Erro no cadastro:", error);
        alert("Erro ao cadastrar: " + error.message);
        return;
      }

      alert("Cadastro realizado! Verifique seu e-mail para confirmar.");
      window.location.href = "/login";

    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="cadastro-container">
      <main className="cadastro-main">
        <form onSubmit={handleCadastro} className="cadastro-card">

          <h2 className="cadastro-title">Criar Conta</h2>

          <input
            type="text"
            className="cadastro-input"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            type="email"
            className="cadastro-input"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="cadastro-input"
            placeholder="Senha (mínimo 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
          />

          <button type="submit" className="cadastro-submit">
            Cadastrar
          </button>

        </form>
      </main>
    </div>
  );
}