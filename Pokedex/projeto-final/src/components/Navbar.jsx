import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function sair() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        {import.meta.env.VITE_APP_TITLE || "Minhas Tarefas"}
      </Link>
      <Link to="/">Tarefas</Link>
      <Link to="/cep">CEP</Link>
      <Link to="/painel">Painel</Link>
      {usuario ? (
        <button onClick={sair}>Sair ({usuario.nome})</button>
      ) : (
        <Link to="/login">Entrar</Link>
      )}
    </nav>
  );
}
