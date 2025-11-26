import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/meus-cursos.css";

export default function MeusCursos() {
  const [matriculas, setMatriculas] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMeusCursos() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setMatriculas("nologin");
        setLoading(false);
        return;
      }

      // BUSCA AS MATRÍCULAS DO ALUNO
      const { data: mats, error } = await supabase
        .from("matriculas")
        .select("id, curso_id")
        .eq("aluno_id", session.user.id);

      if (error) {
        setMatriculas("erro");
        setLoading(false);
        return;
      }

      let resultado = [];

      for (const m of mats) {
        // BUSCA CURSO
        const { data: curso } = await supabase
          .from("cursos")
          .select("id, nome, duracao, descricao, professor_id")
          .eq("id", m.curso_id)
          .single();

        if (!curso) continue;

        // BUSCA PROFESSOR
        let professorNome = "—";

        if (curso.professor_id) {
          const { data: prof } = await supabase
            .from("usuarios")
            .select("nome")
            .eq("id", curso.professor_id)
            .single();

          professorNome = prof?.nome ?? "—";
        }

        resultado.push({
          id: m.id,
          curso: {
            ...curso,
            professorNome,
          },
        });
      }

      setMatriculas(resultado);
      setLoading(false);
    }

    carregarMeusCursos();
  }, []);

  async function abrirDetalhes(cursoId) {
    const { data: curso } = await supabase
      .from("cursos")
      .select("id, nome, duracao, descricao, professor_id")
      .eq("id", cursoId)
      .single();

    if (!curso) return;

    let professorNome = "—";

    if (curso.professor_id) {
      const { data: prof } = await supabase
        .from("usuarios")
        .select("nome")
        .eq("id", curso.professor_id)
        .single();

      professorNome = prof?.nome ?? "—";
    }

    setCursoSelecionado({ ...curso, professorNome });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setCursoSelecionado(null);
  }

  function irParaPainel() {
    window.location.href = "/painel-aluno";
  }

  return (
    <>
      <header className="meuscursos-header">
        <div className="meuscursos-logo">SGA — Aluno</div>
      </header>

      <main className="meuscursos-container">
        <h1 className="meuscursos-title">📚 Meus Cursos</h1>

        <div className="meuscursos-grid">
          {loading && <p>Carregando…</p>}

          {!loading && matriculas === "nologin" && (
            <p>Você não está logado.</p>
          )}

          {!loading && matriculas === "erro" && (
            <p>Erro ao carregar seus cursos.</p>
          )}

          {!loading && matriculas.length === 0 && (
            <p>Você ainda não está matriculado em nenhum curso.</p>
          )}

          {!loading &&
            matriculas.map((m) => (
              <div key={m.id} className="meuscursos-card">
                <h3>{m.curso.nome}</h3>
                <p>
                  <strong>Professor:</strong> {m.curso.professorNome}
                </p>
                <p>
                  <strong>Duração:</strong> {m.curso.duracao}
                </p>

                <button
                  className="meuscursos-btn"
                  onClick={() => abrirDetalhes(m.curso.id)}
                >
                  Ver Detalhes
                </button>
              </div>
            ))}
        </div>
      </main>

      {modalAberto && cursoSelecionado && (
        <div className="meuscursos-modal">
          <div className="meuscursos-modal-content">
            <span className="meuscursos-close" onClick={fecharModal}>
              &times;
            </span>

            <h2 className="meuscursos-modal-title">{cursoSelecionado.nome}</h2>

            <div className="meuscursos-info-grid">
              <div>
                <strong>Professor:</strong>
                <p>{cursoSelecionado.professorNome}</p>
              </div>

              <div>
                <strong>Carga Horária:</strong>
                <p>{cursoSelecionado.duracao}</p>
              </div>
            </div>

            <h3>📄 Ementa</h3>
            <p
              className="meuscursos-plano"
              dangerouslySetInnerHTML={{
                __html: cursoSelecionado.descricao.replace(/\n/g, "<br>"),
              }}
            />

            <button className="meuscursos-btn" onClick={irParaPainel}>
              Ir para o Painel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
