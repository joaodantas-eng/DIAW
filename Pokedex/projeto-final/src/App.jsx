import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Cep from "./pages/Cep";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Painel from "./pages/Painel";
import TarefaDetalhe from "./pages/TarefaDetalhe";
import Tarefas from "./pages/Tarefas";

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Tarefas />} />
          <Route path="/tarefa/:id" element={<TarefaDetalhe />} />
          <Route path="/cep" element={<Cep />} />
          <Route path="/login" element={<Login />} />
          {/* Só entra quem estiver logado */}
          <Route
            path="/painel"
            element={
              <ProtectedRoute>
                <Painel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
