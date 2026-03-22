import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { root } from "./ui/components/utilidades";
import Game from "./ui/components/tetris";
import Home from "./ui/components/home";
import "./ui/styles/tetris.css";

export function App() {
  const [start, setStart] = useState<boolean>(false); // Inicia el juego
  const [controls, setControls] = useState<boolean>(false); // Activa los controles
  const [ending, setEnding] = useState<boolean>(false); // Termina el juego

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
