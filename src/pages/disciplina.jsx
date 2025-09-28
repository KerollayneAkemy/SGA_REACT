import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/disciplina.css";

const disciplinas = {
  "engenharia-software": {
    nome: "Engenharia de Software",
    professor: "Ana Paula",
    cargaHoraria: "60h",
    semestre: "1º Semestre",
    preRequisitos: "Lógica de Programação",
    ementa:
      "Estudo de metodologias de desenvolvimento, análise de requisitos, modelagem e implementação de sistemas.",
  },
  ads: {
    nome: "Análise e Desenvolvimento de Sistemas",
    professor: "João Silva",
    cargaHoraria: "60h",
    semestre: "1º Semestre",
    preRequisitos: "Lógica de Programação",
    ementa:
      "Introdução à programação, estruturas de controle, algoritmos e desenvolvimento de sistemas.",
  },
  "banco-dados": {
    nome: "Banco de Dados",
    professor: "Carlos Eduardo",
    cargaHoraria: "60h",
    semestre: "1º Semestre",
    preRequisitos: "Lógica de Programação",
    ementa:
      "Fundamentos de bancos de dados relacionais, SQL, modelagem de dados e normalização.",
  },
  ia: {
    nome: "Inteligência Artificial",
    professor: "Mariana Costa",
    cargaHoraria: "60h",
    semestre: "1º Semestre",
    preRequisitos: "Programação em Python",
    ementa:
      "Conceitos de IA, aprendizado de máquina, redes neurais, algoritmos inteligentes e aplicações.",
  },
  "gestao-financeira": {
    nome: "Gestão Financeira",
    professor: "Fernanda Lima",
    cargaHoraria: "60h",
    semestre: "1º Semestre",
    preRequisitos: "Matemática Financeira",
    ementa:
      "Fundamentos de gestão financeira, orçamento, análise de custos e fluxo de caixa.",
  },
};

function Disciplina() {
  const { cursoId } = useParams();
  const navigate = useNavigate();

  const disciplina = disciplinas[cursoId];

  if (!disciplina) return <p>Disciplina não encontrada.</p>;

  return (
    <div>
      <main className="disciplina-container">
        <div className="disciplina-card">
          <h2>{disciplina.nome}</h2>
          <p><strong>Professor:</strong> {disciplina.professor}</p>
          <p><strong>Carga Horária:</strong> {disciplina.cargaHoraria}</p>
          <p><strong>Semestre:</strong> {disciplina.semestre}</p>
          <p><strong>Pré-requisitos:</strong> {disciplina.preRequisitos}</p>
          <p><strong>Ementa:</strong> {disciplina.ementa}</p>
          <button className="btn-voltar" onClick={() => navigate("/curso")}>
            Voltar para Cursos
          </button>
        </div>
      </main>
    </div>
  );
}

export default Disciplina;
