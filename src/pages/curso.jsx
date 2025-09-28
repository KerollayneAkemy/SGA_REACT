import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/curso.css";

const cursos = [
  {
    nome: "Engenharia de Software",
    semestre: "1º Semestre",
    rota: "/disciplina/engenharia-software",
  },
  {
    nome: "Análise e Desenvolvimento de Sistemas",
    semestre: "1º Semestre",
    rota: "/disciplina/ads",
  },
  {
    nome: "Banco de Dados",
    semestre: "1º Semestre",
    rota: "/disciplina/banco-dados",
  },
  {
    nome: "Inteligência Artificial",
    semestre: "1º Semestre",
    rota: "/disciplina/ia",
  },
  {
    nome: "Gestão Financeira",
    semestre: "1º Semestre",
    rota: "/disciplina/gestao-financeira",
  },
];

function Curso() {
  const navigate = useNavigate();

  return (
    <div>
      <main className="cursos">
        <h2>Lista de Cursos</h2>
        <input type="text" placeholder="Filtrar por semestre ou área" />

        <div className="curso-list">
          {cursos.map((curso, index) => (
            <div className="curso-card" key={index}>
              <h3>{curso.nome}</h3>
              <p>{curso.semestre}</p>
              <button
                className="btn-detalhes"
                onClick={() => navigate(curso.rota)}
              >
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <p>© 2025 Sistema de Gestão Acadêmica. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Curso;
