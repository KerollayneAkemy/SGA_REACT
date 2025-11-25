import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/cadastro.css";

function Cadastro() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "aluno"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await signUp(formData.email, formData.password, {
      name: formData.name,
      role: formData.role
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Cadastro realizado com sucesso! Verifique seu e-mail.");
      navigate("/login");
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container">
      <main>
        <section className="auth-container">
          <div className="auth-card">
            <h2>Cadastro</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleCadastro}>
              <input 
                type="text" 
                name="name"
                placeholder="Nome completo" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="E-mail" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <input 
                type="password" 
                name="password"
                placeholder="Senha" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                required
              >
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
                <option value="admin">Administrador</option>
              </select>
              <button type="submit" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>
            <p>Já possui conta? <Link to="/login">Login</Link></p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Cadastro;
