import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      const userRole = data.user.user_metadata?.role || 'aluno';
      navigate("/painel", { state: { tipo: userRole } });
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container">
      <main>
        <section className="login-container">
          <div className="login-card">
            <h2>Login</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLogin}>
              <input 
                type="email" 
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <input 
                type="password" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p>
              Não possui conta? <Link to="/cadastro">Cadastre-se aqui</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
