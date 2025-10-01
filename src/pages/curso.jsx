import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/curso.css";

const cursos = [
  {
    nome: "Engenharia de Software",
    semestre: "1° Semestre",
    rota: "/disciplina/engenharia-software",
  },
  {
    nome: "Análise e Desenvolvimento de Sistemas",
    semestre: "1° Semestre",
    rota: "/disciplina/ads",
  },
  {
    nome: "Banco de Dados",
    semestre: "1° Semestre",
    rota: "/disciplina/banco-dados",
  },
  {
    nome: "Inteligência Artificial",
    semestre: "1° Semestre",
    rota: "/disciplina/ia",
  },
  {
    nome: "Gestão Financeira",
    semestre: "1° Semestre",
    rota: "/disciplina/gestao-financeira",
  },
];

function Curso() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");

  // Cursos filtrados conforme o que o usuário digitar
  const cursosFiltrados = cursos.filter(
    (curso) =>
      curso.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      curso.semestre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <main className="cursos">
        <h2>Lista de Cursos</h2>
        <input
          type="text"
          placeholder="Filtrar por semestre ou área"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div className="curso-list">
          {cursosFiltrados.length > 0 ? (
            cursosFiltrados.map((curso, index) => (
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
            ))
          ) : (
            <p>Nenhum curso encontrado.</p>
          )}
        </div>
      </main>

      <footer>
        <p>© 2025 Sistema de Gestão Acadêmica. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Curso;
