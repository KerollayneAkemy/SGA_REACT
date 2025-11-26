import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/sobre.css";

function Sobre() {
  const navigate = useNavigate(); 

  return (
    <div className="sobre-page">
      <main>
        <section className="sobre-container">
          <h2>Sobre a Instituição</h2>
          <p>
            Somos uma instituição comprometida com a excelência acadêmica, oferecendo cursos de
            qualidade e infraestrutura moderna.
          </p>
          <p>
            Nossos alunos são preparados para se destacarem no mercado de trabalho com habilidades
            práticas e teóricas atualizadas.
          </p>

          <div className="missao-valor">
            <div className="card">
              <h3>Missão</h3>
              <p>
                Oferecer educação de excelência, preparando alunos para se destacarem no mercado com
                ética e inovação.
              </p>
            </div>
            <div className="card">
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
      </main>

     
    </div>
  );
}

export default Sobre;
