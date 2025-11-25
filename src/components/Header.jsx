import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/header.css";

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header>
      <div className="logo">SGA</div>
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
        <NavLink to="/curso" className={({ isActive }) => (isActive ? "active" : "")}>Cursos</NavLink>
        <NavLink to="/sobre" className={({ isActive }) => (isActive ? "active" : "")}>Sobre</NavLink>
        <NavLink to="/contato" className={({ isActive }) => (isActive ? "active" : "")}>Contato</NavLink>

        {user ? (
          <div className="usuario-logado">
            <span>{user.user_metadata?.name || user.email}</span>
            <NavLink to="/painel" className="btn-painel">Painel</NavLink>
            <button className="btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        ) : (
          <NavLink to="/login" className="btn-login">Login</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Header;
