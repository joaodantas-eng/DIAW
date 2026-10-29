import { useAuth } from "../auth/AuthContext";
import tarefasIniciais from "../data/tarefasIniciais";
import useLocalStorage from "../hooks/useLocalStorage";

// Página protegida: só aparece para quem fez login
export default function Painel() {
  const { usuario } = useAuth();
  const [tarefas] = useLocalStorage("tarefas", tarefasIniciais);
  const feitas = tarefas.filter((t) => t.feita).length;

  return (
    <>
      <h1>Olá, {usuario.nome}!</h1>
      <p>
        Você concluiu {feitas} de {tarefas.length} tarefas.
      </p>
    </>
  );
}
