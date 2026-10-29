import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <h1>404</h1>
      <p>
        Página não encontrada. <Link to="/">Ir para o início</Link>
      </p>
    </>
  );
}
