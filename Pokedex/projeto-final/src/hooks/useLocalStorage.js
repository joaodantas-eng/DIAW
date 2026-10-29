import { useEffect, useState } from "react";

// Igual ao useState, mas o valor fica salvo no navegador
export default function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave);
      return salvo !== null ? JSON.parse(salvo) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      /* aba anônima ou armazenamento cheio: segue só na memória */
    }
  }, [chave, valor]);

  return [valor, setValor];
}
