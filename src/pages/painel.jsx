import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/paineis.css";

function Painel() {
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [mensagem, setMensagem] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  const [formCurso, setFormCurso] = useState({
    nomeCurso: "",
    disciplina: "",
    plano: "",
  });

  const [formPerfil, setFormPerfil] = useState({
    nome: "",
    email: "",
  });

  const usuario = {
    nome: "João Silva",
    avatar: "https://i.pravatar.cc/50",
  };

  const menuRef = useRef();
  const navigate = useNavigate();

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handleClickFora = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  // Redireciona se não houver usuário logado
  useEffect(() => {
    if (!tipoUsuario) {
      navigate("/login");
    }
  }, [tipoUsuario, navigate]);

  const handleLogout = () => {
    setTipoUsuario(null);
    navigate("/login");
  };

  const SwitchButton = ({ label, active, onClick }) => (
    <button
      className={`switch-btn ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const Card = ({ title, children }) => (
    <div className="card">{children ? children : <h3>{title}</h3>}</div>
  );

  const handleSubmitCurso = (e) => {
    e.preventDefault();
    setMensagem("✅ Curso cadastrado com sucesso!");
    // Limpa campos do formulário
    setFormCurso({ nomeCurso: "", disciplina: "", plano: "" });
    setTimeout(() => setMensagem(""), 3000);
  };

  const handleSubmitPerfil = (e) => {
    e.preventDefault();
    setMensagem("✅ Perfil atualizado com sucesso!");
    setFormPerfil({ nome: "", email: "" });
    setTimeout(() => setMensagem(""), 3000);
  };

  return (
    <div className="painel-container">
      <div className="painel-header">
        <h1 className="titulo-painel">
          Painel do {tipoUsuario === "admin" ? "Administrador" : "Aluno"}
        </h1>

        <div className="perfil-container" ref={menuRef}>
          <img
            src={usuario.avatar}
            alt="Avatar"
            className="avatar"
            onClick={() => setMenuAberto(!menuAberto)}
          />
          <span className="nome-usuario">{usuario.nome}</span>

          {menuAberto && (
            <div className="menu-suspenso">
              <button onClick={handleLogout}>Sair</button>
            </div>
          )}
        </div>
      </div>

      <div className="switch-usuario">
        <SwitchButton
          label="Entrar como Aluno"
          active={tipoUsuario === "aluno"}
          onClick={() => setTipoUsuario("aluno")}
        />
        <SwitchButton
          label="Entrar como Admin"
          active={tipoUsuario === "admin"}
          onClick={() => setTipoUsuario("admin")}
        />
      </div>

      {mensagem && <div className="mensagem-estatica">{mensagem}</div>}

      {tipoUsuario === "admin" ? (
        <div className="painel-admin">
          <h2 className="subtitulo-painel">Gestão de Cursos e Disciplinas</h2>
          <form className="form-cadastro" onSubmit={handleSubmitCurso}>
            <input
              type="text"
              placeholder="Nome do Curso"
              required
              value={formCurso.nomeCurso}
              onChange={(e) => setFormCurso({ ...formCurso, nomeCurso: e.target.value })}
            />
            <input
              type="text"
              placeholder="Disciplina Vinculada"
              required
              value={formCurso.disciplina}
              onChange={(e) => setFormCurso({ ...formCurso, disciplina: e.target.value })}
            />
            <input
              type="text"
              placeholder="Plano de Ensino"
              value={formCurso.plano}
              onChange={(e) => setFormCurso({ ...formCurso, plano: e.target.value })}
            />
            <button type="submit">Cadastrar Curso</button>
          </form>

          <h2 className="subtitulo-painel">Mensagens de Contato</h2>
          <div className="mensagens">
            <Card>
              <p><strong>Aluno João:</strong> Gostaria de mais informações sobre IA.</p>
            </Card>
            <Card>
              <p><strong>Aluno Maria:</strong> Problema para acessar notas.</p>
            </Card>
          </div>
        </div>
      ) : (
        <div className="painel-aluno">
          <h2 className="subtitulo-painel">Minhas Disciplinas</h2>
          <div className="disciplinas">
            <Card>
              <h3>Engenharia de Software</h3>
              <p>Nota: 8.5</p>
            </Card>
            <Card>
              <h3>Banco de Dados</h3>
              <p>Nota: 7.9</p>
            </Card>
            <Card>
              <h3>Inteligência Artificial</h3>
              <p>Nota: 9.0</p>
            </Card>
          </div>

          <h2 className="subtitulo-painel">Editar Perfil</h2>
          <form className="form-perfil" onSubmit={handleSubmitPerfil}>
            <input
              type="text"
              placeholder="Nome Completo"
              value={formPerfil.nome}
              onChange={(e) => setFormPerfil({ ...formPerfil, nome: e.target.value })}
            />
            <input
              type="email"
              placeholder="E-mail"
              value={formPerfil.email}
              onChange={(e) => setFormPerfil({ ...formPerfil, email: e.target.value })}
            />
            <button type="submit">Salvar</button>
          </form>
        </div> 
      )}
    </div>
  );
}

export default Painel;
