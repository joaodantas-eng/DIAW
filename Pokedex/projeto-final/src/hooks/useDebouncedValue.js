import { useEffect, useState } from "react";

// Devolve o valor só depois que ele para de mudar por "delay" ms
export default function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // mudou antes do tempo: cancela o timer antigo
  }, [value, delay]);

  return debounced;
}
