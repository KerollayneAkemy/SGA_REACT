import { useState } from "react";
import { supabase } from "../services/supabaseClient"; // Ajuste o caminho conforme necessário

import "../styles/contato.css";

export default function Contato() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetar mensagens
    setErrors({});
    setApiError("");
    setSuccess(false);

    // Validação simples
    let newErrors = {};
    if (!nome.trim()) newErrors.nome = "Nome é obrigatório.";
    if (!email.trim()) newErrors.email = "E-mail inválido.";
    if (!mensagem.trim()) newErrors.mensagem = "Mensagem não pode ficar vazia.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Inserção no Supabase
    try {
      const { error } = await supabase
        .from("contatos")
        .insert([{ nome, email, mensagem }]);

      if (error) {
        console.error("Erro no Supabase:", error);
        setApiError(`Erro: ${error.message}. Verifique a RLS.`);
        return;
      }

      setSuccess(true);
      setNome("");
      setEmail("");
      setMensagem("");

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error("Erro de rede ou inicialização:", err);
      setApiError("Ocorreu um erro inesperado. Verifique sua conexão.");
    }
  };

  return (
    <div className="contato-container-page">

      <main>
        <section className="contato-container">
          <h2>Fale Conosco</h2>
          <p>
            Tem dúvidas, sugestões ou precisa de ajuda? Preencha o formulário
            abaixo e retornaremos o mais rápido possível.
          </p>

          <form className="form-profissional" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {errors.nome && <small className="error-msg">{errors.nome}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <small className="error-msg">{errors.email}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                placeholder="Escreva sua mensagem aqui..."
                rows={6}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
              {errors.mensagem && <small className="error-msg">{errors.mensagem}</small>}
            </div>

            <button type="submit" className="btn-submit">Enviar Mensagem</button>

            {success && (
              <div className="success-msg">
                Mensagem enviada com sucesso! Obrigado pelo contato.
              </div>
            )}

            {apiError && (
              <div id="form-error-message" style={{ color: "red", marginTop: "10px" }}>
                {apiError}
              </div>
            )}
          </form>
        </section>
      </main>

      
    </div>
  );
}
