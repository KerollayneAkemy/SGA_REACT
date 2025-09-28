import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();
    alert("Cadastro realizado com sucesso!");
    navigate("/login");
  };

  return (
    <div className="page-container">
      <main>
        <section className="auth-container">
          <div className="auth-card">
            <h2>Cadastro</h2>
            <form onSubmit={handleCadastro}>
              <input type="text" placeholder="Nome completo" required />
              <input type="email" placeholder="E-mail" required />
              <input type="password" placeholder="Senha" required />
              <button type="submit">Cadastrar</button>
            </form>
            <p>Já possui conta? <a href="/login">Login</a></p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Cadastro;
