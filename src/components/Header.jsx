import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/header.css";

function Header({ usuario, handleLogout }) {
  return (
    <header>
      <div className="logo">SGA</div>
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
        <NavLink to="/curso" className={({ isActive }) => (isActive ? "active" : "")}>Cursos</NavLink>
        <NavLink to="/sobre" className={({ isActive }) => (isActive ? "active" : "")}>Sobre</NavLink>
        <NavLink to="/contato" className={({ isActive }) => (isActive ? "active" : "")}>Contato</NavLink>

        {/* Botão login ou usuário logado */}
        {usuario ? (
          <div className="usuario-logado">
            <img src={usuario.avatar} alt="Avatar" className="avatar" />
            <span>{usuario.nome}</span>
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