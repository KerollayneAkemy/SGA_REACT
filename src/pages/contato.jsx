import React, { useState } from "react";
import "../styles/contato.css";

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada!");

    // limpa os campos
    setFormData({ nome: "", email: "", mensagem: "" });
  };

  return (
    <div>
      <main>
        <section className="contato-container">
          <h2>Fale Conosco</h2>
          <p>
            Envie sua mensagem ou dúvida e entraremos em contato o mais rápido possível.
          </p>
          <form id="form-contato" onSubmit={handleSubmit}>
            <input
              type="text"
              id="nome"
              placeholder="Nome"
              required
              value={formData.nome}
              onChange={handleChange}
            />
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <textarea
              id="mensagem"
              placeholder="Mensagem"
              rows="5"
              required
              value={formData.mensagem}
              onChange={handleChange}
            />
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
