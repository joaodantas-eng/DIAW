import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext({ usuario: null, login: () => false, logout: () => {} });

// Lê a sessão salva (sessionStorage some quando a aba fecha)
function lerSessao() {
  try {
    return JSON.parse(sessionStorage.getItem("sessao"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerSessao);

  const value = useMemo(
    () => ({
      usuario,
      // Login de mentira, só para estudar: aceita senha "1234"
      login(nome, senha) {
        if (senha !== "1234") return false;
        const sessao = { nome };
        sessionStorage.setItem("sessao", JSON.stringify(sessao));
        setUsuario(sessao);
        return true;
      },
      logout() {
        sessionStorage.removeItem("sessao");
        setUsuario(null);
      },
    }),
    [usuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
