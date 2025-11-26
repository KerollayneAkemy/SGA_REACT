import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/curso.css";

// CARD DE CURSO
function CursoCard({ curso, abrirModal }) {
  return (
    <div className="cursos-card">
      <h3>{curso.nome}</h3>
      <p><strong>Professor:</strong> {curso.professorNome}</p>
      <p><strong>Duração:</strong> {curso.duracao}</p>
      <button className="cursos-btn-detalhes" onClick={() => abrirModal(curso)}>
        Ver Detalhes
      </button>
    </div>
  );
}

// MODAL DE CURSO
function ModalCurso({ curso, fecharModal, inscreverCurso }) {
  if (!curso) return null;

  return (
    <div className="cursos-modal" onClick={fecharModal}>
      <div className="cursos-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="cursos-close-btn" onClick={fecharModal}>
          &times;
        </span>

        <h3 className="cursos-modal-title">{curso.nome}</h3>

        <p className="cursos-modal-duration">
          <strong>Duração:</strong> {curso.duracao}
        </p>

        <p className="cursos-modal-description">{curso.descricao}</p>

        <button
          className="cursos-btn-inscrever-modal"
          onClick={inscreverCurso}
        >
          Inscrever-se
        </button>
      </div>
    </div>
  );
}

// COMPONENTE PRINCIPAL
export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [cursoAtual, setCursoAtual] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // BUSCAR CURSOS
  useEffect(() => {
    const fetchCursos = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("cursos")
          .select(`
            id,
            nome,
            duracao,
            descricao,
            professor_id,
            usuarios:professor_id ( id, nome )
          `);

        if (error) throw error;

        const cursosFormatados = data.map((c) => ({
          id: String(c.id),
          nome: c.nome,
          duracao: c.duracao,
          descricao: c.descricao,
          professorNome: c.usuarios?.nome ?? "—",
        }));

        setCursos(cursosFormatados);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setCursos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const cursosFiltrados = cursos.filter(
    (c) =>
      c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      c.professorNome.toLowerCase().includes(filtro.toLowerCase())
  );

  const abrirModal = (curso) => setCursoAtual(curso);
  const fecharModal = () => setCursoAtual(null);

  // FUNÇÃO DE INSCRIÇÃO
  const inscreverCurso = async () => {
    if (!cursoAtual) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert("Você precisa estar logado para se inscrever.");
        return;
      }

      // VERIFICA ROLE
      const { data: usuario } = await supabase
        .from("usuarios")
        .select("user_role")
        .eq("id", session.user.id)
        .single();

      if (!usuario || usuario.user_role !== "aluno") {
        alert("Somente alunos podem se inscrever.");
        return;
      }

      // VERIFICA SE JÁ ESTÁ MATRICULADO
      const { data: jaMatriculado } = await supabase
        .from("matriculas")
        .select("id")
        .eq("aluno_id", session.user.id)
        .eq("curso_id", cursoAtual.id)
        .limit(1);

      if (jaMatriculado?.length > 0) {
        alert("Você já está inscrito neste curso.");
        fecharModal();
        return;
      }

      // INSERE MATRÍCULA
      const { error } = await supabase
        .from("matriculas")
        .insert([{ aluno_id: session.user.id, curso_id: cursoAtual.id }]);

      if (error) throw error;

      alert(`Inscrição realizada com sucesso no curso: ${cursoAtual.nome}`);

      fecharModal();

      // 🔥 REDIRECIONA PARA MEUS CURSOS
      window.location.href = "/meuscursos";

    } catch (err) {
      console.error("Erro ao inscrever:", err);
      alert("Erro ao se inscrever: " + err.message);
    }
  };

  return (
    <div className="cursos-container">
      <main className="cursos-main">
        <section className="cursos-section">
          <h2 className="cursos-title">Nossos cursos de Tecnologia</h2>

          <input
            type="text"
            className="cursos-input"
            placeholder="Pesquisar por área, nome ou professor..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            disabled={isLoading}
          />

          <div className="cursos-list">
            {isLoading ? (
              <p>Carregando cursos...</p>
            ) : cursosFiltrados.length === 0 ? (
              <p>Nenhum curso encontrado.</p>
            ) : (
              cursosFiltrados.map((c) => (
                <CursoCard key={c.id} curso={c} abrirModal={abrirModal} />
              ))
            )}
          </div>
        </section>

        {cursoAtual && (
          <ModalCurso
            curso={cursoAtual}
            fecharModal={fecharModal}
            inscreverCurso={inscreverCurso}
          />
        )}
      </main>
    </div>
  );
}