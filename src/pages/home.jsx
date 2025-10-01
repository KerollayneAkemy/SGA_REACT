import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  // Array com cursos e rota da disciplina
  const cursosDestaque = [
    {
      nome: "Engenharia de Software",
      descricao: "Aprenda a desenvolver sistemas robustos e modernos.",
      rota: "/disciplina/engenharia-software",
    },
    {
      nome: "Análise de Sistemas",
      descricao: "Domine a análise de requisitos e modelagem de sistemas.",
      rota: "/disciplina/ads",
    },
    {
      nome: "Banco de Dados",
      descricao:
        "Gerencie e otimize bancos de dados relacionais e não-relacionais.",
      rota: "/disciplina/banco-dados",
    },
    {
      nome: "Inteligência Artificial",
      descricao: "Explore IA e aprendizado de máquina em projetos práticos.",
      rota: "/disciplina/ia",
    },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-container">
          <h1>Sistema de Gestão Acadêmica</h1>
          <p>
            Organize suas disciplinas, notas e informações acadêmicas com
            praticidade e segurança.
          </p>
          <button className="btn" onClick={() => navigate("/curso")}>
            Ver Cursos
          </button>
        </div>
      </section>

      {/* CURSOS EM DESTAQUE */}
      <section className="cursos-preview">
        <h2>Cursos em Destaque</h2>
        <div className="curso-list">
          {cursosDestaque.map((curso, index) => (
            <div
              className="curso-card"
              key={index}
              onClick={() => navigate(curso.rota)}
              style={{ cursor: "pointer" }}
            >
              <h3>{curso.nome}</h3>
              <p>{curso.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSÃO E VALORES */}
      <section className="missao-valores">
        <h2>Missão e Valores</h2>
        <div className="valores-container">
          <div className="valor-card">
            <h3>Missão</h3>
            <p>
              Oferecer educação de excelência, preparando alunos para se
              destacarem no mercado com ética, inovação e conhecimento prático.
            </p>
          </div>
          <div className="valor-card">
            <h3>Valores</h3>
            <ul>
              <li>Excelência acadêmica</li>
              <li>Respeito e inclusão</li>
              <li>Inovação tecnológica</li>
              <li>Ética profissional</li>
            </ul>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 Sistema de Gestão Acadêmica. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
