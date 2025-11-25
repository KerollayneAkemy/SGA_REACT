import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/contato.css";

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('mensagens_contato')
        .insert([
          {
            nome: formData.nome,
            email: formData.email,
            mensagem: formData.mensagem,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({ nome: "", email: "", mensagem: "" });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Erro ao enviar mensagem: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main>
        <section className="contato-container">
          <h2>Fale Conosco</h2>
          <p>
            Envie sua mensagem ou dúvida e entraremos em contato o mais rápido possível.
          </p>
          
          {success && (
            <div className="success-message">
              ✅ Mensagem enviada com sucesso!
            </div>
          )}
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
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Mensagem"}
            </button>
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
