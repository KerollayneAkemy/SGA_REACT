import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const entrarAluno = (e) => {
    e.preventDefault();
    navigate("/painel", { state: { tipo: "aluno" } });
  };

  const entrarAdmin = (e) => {
    e.preventDefault();
    navigate("/painel", { state: { tipo: "admin" } });
  };

  return (
    <div className="page-container">
      <main>
        <section className="login-container">
          <div className="login-card">
            <h2>Login</h2>

            <form onSubmit={entrarAluno}>
              <input type="email" placeholder="E-mail" required />
              <input type="password" placeholder="Senha" required />
              <button type="submit">Entrar</button>
            </form>

            <p>
              Não possui conta? <Link to="/cadastro">Cadastre-se aqui</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;