import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { root } from "@utils/utils";
import Home from "@pages/home";
import Game from "@pages/game";
import "./tetris.css";

export function App() {
  const [start, setStart] = useState<boolean>(false); // Inicia el juego
  const [controls, setControls] = useState<boolean>(false); // Activa los controles
  const [ending, setEnding] = useState<boolean>(false); // Termina el juego

  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register("/sw.js");
  }

  return (
    <StrictMode>
      {start ? (
        <Game controls={controls} gameState={[ending, setEnding]} /> // Componente de juego
      ) : (
        <Home setStart={setStart} setControls={setControls} controls={controls} /> // Interfaz de inicio
      )}
    </StrictMode>
  );
}

// Renderiza la aplicación si el root existe
if (root instanceof HTMLDivElement) createRoot(root).render(<App />);
else throw new Error("Root element was not found");
