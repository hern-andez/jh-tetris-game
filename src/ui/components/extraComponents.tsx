import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { root } from "./utilidades";
import game from "../styles/game.module.css";

type StatusProps = {
  blockSize: number;
  points: number;
  h4: null | React.RefObject<HTMLHeadingElement>;
  button: null | React.RefObject<HTMLButtonElement>;
  pointsGame: null | React.RefObject<HTMLSpanElement>;
  newFigure: null | React.RefObject<HTMLDivElement>;
  modal: () => void;
};
export function StatusGame({ points, h4, button, pointsGame, newFigure, modal, blockSize }: StatusProps) {
  // Indica los puntos, la próxima figura y el botón de pausa
  return (
    <div className={game.status}>
      <h4 style={{ fontSize: `${blockSize * 1.3}px` }} ref={h4}>
        Score: <span ref={pointsGame}>{points}</span>
      </h4>
      <div className={game.status__figure} ref={newFigure}></div>
      <button
        className={`material-symbols-outlined ${game.paused}`}
        ref={button}
        style={{
          fontSize: `${blockSize * 1.2}px`,
          padding: `${blockSize / 2.5}px`,
        }}
        onClick={() => {
          modal();
        }}
      >
        {" "}
        pause
      </button>
    </div>
  );
}

type ControlsProps = {
  functions: [(eje: "x" | "y", val: 1 | -1, isMoveAutomatic?: boolean) => void, () => void, () => void];
  button: null | React.RefObject<HTMLButtonElement>;
};
export function GameControls({ functions, button }: ControlsProps) {
  // Los controles adaptados para móviles
  const [mover, rotarFigura, puntoMaximo] = functions;

  return (
    <div className={game.controls}>
      <button
        className={`${game.controls__btn} ${game.rotate} material-symbols-outlined`}
        onClick={() => rotarFigura()}
        role="button"
      >
        Autorenew
      </button>
      <button
        className={`${game.controls__btn} ${game.left} material-symbols-outlined`}
        onClick={() => mover("x", -1)}
        role="button"
      >
        Keyboard_Arrow_Left
      </button>
      <button
        className={`${game.controls__btn} ${game.fall} material-symbols-outlined`}
        ref={button}
        onClick={() => puntoMaximo()}
        role="button"
      >
        Keyboard_Double_Arrow_Down
      </button>
      <button
        className={`${game.controls__btn} ${game.right} material-symbols-outlined`}
        onClick={() => mover("x", 1)}
        role="button"
      >
        Keyboard_Arrow_Right
      </button>
      <button
        className={`${game.controls__btn} ${game.bottom} material-symbols-outlined`}
        onClick={() => mover("y", 1)}
        role="button"
      >
        Keyboard_Arrow_Down
      </button>
    </div>
  );
}

type OverProps = { setOver: (newState: boolean) => void };
export function GameOver({ setOver }: OverProps) {
  // Modal de game over con interface dinámica dependiendo de los puntos
  const modal = useRef<null | HTMLDivElement>(null);
  const h2 = useRef<null | HTMLHeadingElement>(null);
  const gScore = sessionStorage.getItem("score-game");
  const sPoints = localStorage.getItem("score-points");
  let gameScore = 0;
  let scorePoints = 0;
  let writeTitle: undefined | number = undefined;

  if (gScore && sPoints) {
    gameScore = parseInt(gScore);
    scorePoints = parseInt(sPoints);
  }

  useEffect(() => {
    setTimeout(() => {
      write();
    }, 300);
  });

  function write() {
    if (!writeTitle) {
      writeTitle = 1;

      const title = !scorePoints ? "Record Set" : gameScore <= scorePoints ? "Game Over" : "New Récord!!";
      let indexLetter = 0;

      writeTitle = setInterval(() => {
        if (indexLetter === title.length) {
          clearInterval(writeTitle);

          if (modal.current) modal.current.style.boxShadow = "0px 0px 15px 0px white";
        } else {
          if (h2.current) h2.current.textContent += title[indexLetter];
          indexLetter++;
        }
      }, 100);
    }
  }

  if (root) {
    return createPortal(
      <div className={game.modal__score} aria-label="Juego Terminado">
        <div className={game.score} ref={modal}>
          <h2 ref={h2}></h2>
          <div className={game.score_points_container}>
            <p>Points: {gameScore}</p>
            {!scorePoints ? null : gameScore > scorePoints ? <p>Previous Record: {scorePoints}</p> : null}
          </div>
          <button
            className={game.controls__btn}
            onClick={() => setOver(false)}
            role="button"
            aria-label="Jugar de nuevo"
          >
            Play
          </button>
          <button className={game.controls__btn} onClick={() => history.go(-1)} role="button" aria-label="Salir">
            Back
          </button>
        </div>
      </div>,
      root,
    );
  }
}
