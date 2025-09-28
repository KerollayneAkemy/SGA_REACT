import React from "react";
import "../styles/contato.css";

const Contato = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada!");
  };

  return (
    <div>

      <main>
        <section className="contato-container">
          <h2>Fale Conosco</h2>
          <p>Envie sua mensagem ou dúvida e entraremos em contato o mais rápido possível.</p>
          <form id="form-contato" onSubmit={handleSubmit}>
            <input type="text" id="nome" placeholder="Nome" required />
            <input type="email" id="email" placeholder="E-mail" required />
            <textarea id="mensagem" placeholder="Mensagem" rows="5" required />
            <button type="submit">Enviar Mensagem</button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Sistema de Gestão Acadêmica. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Contato;
