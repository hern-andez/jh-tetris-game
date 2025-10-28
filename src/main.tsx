import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { root } from "./scripts/utilidades";
import { Game } from "./scripts/tetris";
import { GameModal } from "./scripts/startModal";
import "./styles/tetris.css";

export function GameApp() {
  const [player, setPlayer] = useState<number>(0); // Inicia el juego
  const [controls, setControls] = useState<boolean>(false); // Activa los controles
  const [over, setOver] = useState<boolean>(false); // Termina el juego

  return (
    <StrictMode>
      {player === 0 ? (
        <GameModal setPlayer={setPlayer} setControls={setControls} /> // Modal de inicio
      ) : (
        <Game controls={controls} gameState={[over, setOver]} />
      )}
    </StrictMode>
  );
}

if (root instanceof HTMLDivElement) {
  createRoot(root).render(<GameApp />);
}
