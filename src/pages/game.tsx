import { useState, useRef, useEffect } from "react";

// import { StatusGame, GameControls, GameOver } from "./extraComponents";
import useFigureFunctions from "../hooks/useFigureFunctions";
import Points from "@components/points";
import Next from "@components/next";
import Controls from "@components/controls";
import Grid from "@components/grid";
import gridcss from "@components/styles/grid.module.css";
import gamecss from "./styles/game.module.css";
import { getFigure } from "../features/features";
// import { seconds, figuras } from "./utilidades";
// import {
//   soundGame,
//   soundGameOver,
//   soundNoMoreFigure,
//   soundCount,
//   soundStart,
//   soundMove,
//   soundFall,
//   soundCompleteLine,
//   soundCompleteLine2,
//   soundBtnPaused,
//   star,
// } from "./utilidades";

type GameProps = {
  controls: boolean;
  gameState: [boolean, (newState: boolean) => void];
};

// Juego, puntos, controles, modal de Juego pausado y Game Over
function Game({ controls, gameState }: GameProps) {
  const [points, setPoints] = useState<number>(0);
  // const [over, setOver] = gameState; // Determina si el juego a acabado
  const gridContainer: React.RefObject<HTMLDivElement> = useRef(null);
  // const modalPaused: React.RefObject<HTMLDivElement> = useRef(null); // Modal de Juego Pausado
  // const btnSound: React.RefObject<HTMLButtonElement> = useRef(null); // Icono de sonido del modal de Juego Pausado
  // const pointsGame: React.RefObject<HTMLDivElement> = useRef(null); //Sección de puntos en tiempo real
  // const fallEnabled: React.RefObject<HTMLButtonElement> = useRef(null); // Botón de caída rápida del componente controles
  // const statusH4: React.RefObject<HTMLHeadingElement> = useRef(null); // Titulo del status
  // const statusButton: React.RefObject<HTMLButtonElement> = useRef(null); // Botón de pausa
  // Medidas dinamicas
  const blockCountX = useRef(11); // Cantidad de columnas por fila
  const blockCountY = useRef(18); // Cantidad de filas
  // const medidasContenedo = useRef<number>(0); // Medidas dinámicas del contenedor
  // Estado
  const render = useRef<boolean>(false); // Renderiza el juego una sola vez
  // const gameOver = useRef(false); // Finaliza el juego
  // const gamePaused = useRef<boolean>(false); // Indica que el juego esta pausado
  // points: number = 0, // Puntos en tiempo real
  const figure = useRef<(null | 1)[][]>(getFigure()); // Primer figura
  const [nextFigure, setNextFigure] = useState<(null | 1)[][]>(getFigure()); // Figura siguiente
  const figurePaused = useRef<boolean>(false); // Pausa la aparición de la nueva figura cuando colisiona
  const timeStop = useRef<number>(0); // Determina el tiempo que va a pasar para que vuelva a aparecer la nueva figura
  const reflectionCoor = useRef<number>(0); // La coordenada 'Y' máxima de la figura actual
  const couldItFall = useRef<boolean>(false); // Indica si la figura puede caer en donde indique reflectionCoor
  const grid = useRef<(null | 1)[][]>(
    Array.from({ length: blockCountY.current }, () => Array(blockCountX.current).fill(null)),
  );
  const coorX = useRef<number>(Math.floor((blockCountX.current - figure.current[0].length) / 2));
  const coorY = useRef<number>(0);
  const coorXPrevious = useRef<number>(0); // Coordenadas y copia de 'X' para ejecutar el reflejo
  const updateTime = useRef<number>(0);
  // const moreSpeed = useRef<number>(0); // Hace caer en 'Y' la figura cuando updateTime >= moreSpeed
  // const countMoreSpeed = useRef<Date>(new Date()); // Tiempo que aumenta la velocidad de caída automática de la figura
  // const intervalTime = useRef<undefined | number>(undefined); // Temporizador que actualiza countMoreSpeed
  const countStopMove = useRef<Date>(new Date()); // Tiempo que debe pasar para ejecutar la funcione mover
  // const moveTimeStop = useRef<undefined | number>(undefined); // Temporizador que actualiza countStopMove
  // const sumTimeStop = useRef(160); // Milisegundo para ejecutar moveTimeStop
  const soundsEnabled = useRef<boolean>(false); // Habilita o deshabilita los sonidos
  const figureCells = useRef<(null | HTMLDivElement)[][]>([]);

  const { create, move, rotate, collide } = useFigureFunctions({
    nextFigure,
    setNextFigure,
    setPoints,
    figureCells,
    gridContainer,
    className: gridcss,
    figure,
    grid,
    blockCountY,
    blockCountX,
    coorX,
    coorY,
    reflectionCoor,
    coorXPrevious,
    couldItFall,
    countStopMove,
    updateTime,
    timeStop,
    figurePaused,
    soundsEnabled,
  });

  useEffect(() => {
    if (!render.current) {
      document.addEventListener("keydown", handleKeyDown);
      render.current = true;

      create();
      setInterval(() => countStopMove.current.setSeconds(1), 100);

      // startGame();
    }

    return () => {
      document.onkeydown = null;
    };
  }, []);

  // // Comienza el juego, agregando en eventos, estado inicial, comienza los temporizadores y dibuja la primer figura
  // function startGame() {
  //   if (!over && !isStart) {
  //     isStart = true; // Evita doble renderización

  //     const btnPaused = document.querySelector(`.${gamecss.status} button`); // Deshabilita el control de pausa
  //     if (btnPaused instanceof HTMLButtonElement) btnPaused.disabled = true;
  //     document.querySelectorAll(`.${gamecss.cell__figure}`).forEach((cell) => cell.remove()); // Remueve las celdas del juego anterior

  //     // Estado inicial del juego
  //     cuadricula = Array.from({ length: blockCountY }, () => Array(blockCountX).fill(null));
  //     gameOver = false;
  //     gamePaused = false;
  //     figurePaused = false;
  //     figura = obtenerFigura();
  //     coorXPrevious = coorX;
  //     coorFigurebellow = 0;
  //     itMayFall = true;
  //     updateTime = 0;
  //     moreSpeed = 70;
  //     countMoreSpeed = new Date();
  //     countMoreSpeed.setSeconds(0);
  // countStopMove = new Date();
  //     countStopMove.setSeconds(0);

  //     // Habilita los sonidos por primera vez al entrar en la pagina
  //     if (localStorage.getItem("sounds-enabled") === null) {
  //       localStorage.setItem("sounds-enabled", "true");
  //       soundsEnabled = true;
  //     } else {
  //       soundsEnabled = localStorage.getItem("sounds-enabled") === "true" ? true : false; // Se obtiene el estado establecido
  //     }

  //     if (soundsEnabled) soundgamecss.currentTime = 0;

  //     // Muestra segundos para empezar el juego
  //     setTimeout(() => {
  //       let number = 0; // Índice del numero
  //       const secondsCoorY = Math.floor(blockCountY / 2 - 4); // Coordenada Y donde aparecerán

  //       const second = setInterval(() => {
  //         document
  //           .querySelectorAll(`.${game["cell--count"]}`)
  //           .forEach((element) => element.classList.remove(`${game["cell--count"]}`)); // Borra los segundos

  //         if (number === seconds.length) {
  //           // Inicia el juego
  //           intervalTime = setInterval(() => countMoreSpeed.setSeconds(countMoreSpeed.getSeconds() + 1), 1000);
  //           moveTimeStop = setInterval(() => countStopMove.setSeconds(countStopMove.getSeconds() + 1), sumTimeStop);

  //           window.addEventListener("resize", handleResizeChange);
  //           enabledBtns("addEventListener", false);
  //           crearFigura();
  //           updateGame();
  //           showNewFigure();
  //           clearInterval(second);

  //           if (btnPaused instanceof HTMLButtonElement) btnPaused.disabled = false;
  //           if (soundsEnabled === true) {
  //             soundStart.play();
  //             setTimeout(() => soundgamecss.play(), 1000);
  //           }
  //         } else {
  //           setTimeout(() => {
  //             const secondsCoorX = Math.floor(blockCountX / 2 - seconds[number][0].length / 2); // Coordenada X donde aparecen

  //             // Accede a las celdas del fondo del tablero para ir dibujando el conteo mediante divs
  //             for (let fila = 0; fila < seconds[number].length; fila++) {
  //               for (let columna = 0; columna < seconds[number][fila].length; columna++) {
  //                 if (seconds[number][fila][columna] === 1) {
  //                   const div = document.querySelector(
  //                     `.${gamecss.background__cell}[data-x='${secondsCoorX + columna}'][data-y='${secondsCoorY + fila}']`,
  //                   );

  //                   if (div instanceof HTMLDivElement) div.classList.add(`${game["cell--count"]}`);
  //                 }
  //               }
  //             }

  //             if (soundsEnabled === true) {
  //               soundCount.currentTime = 0.6;
  //               soundCount.play();
  //             }

  //             number++;
  //           }, 100);
  //         }
  //       }, 1000);
  //     }, 250);
  //   }
  // }

  // // Mantiene el juego actualizado y realiza acciones como mover figura en 'Y' y finalizar el juego
  // function updateGame() {
  //   if (gamePaused === false) {
  //     // Si no esta pausado el juego
  //     if (gameOver) {
  //       clearInterval(moveTimeStop);
  //       removeClass(`${game["background-cell-down"]}`); // Elimina los reflejos
  //       enabledBtns("removeEventListener", true); // Deshabilita controles
  //       sessionStorage.setItem("score-game", `${points}`); // Guarda el valor actual temporalmente
  //       if (newFigure.current) newFigure.current.textContent = ""; // Elimina la siguiente figura

  //       // Suena sonido de game over
  //       if (soundsEnabled === true) {
  //         soundgamecss.pause();
  //         soundNoMoreFigure.currentTime = 0.6;
  //         soundNoMoreFigure.play();
  //       }

  //       let fila = 0;
  //       const opacador = setInterval(() => {
  //         if (fila === cuadricula.length) {
  //           if (soundsEnabled === true) soundGameOver.play();

  //           clearInterval(opacador);
  //           setTimeout(() => setOver(true), 300); // Muestra el componente de game over
  //           setTimeout(() => {
  //             const pointSave = localStorage.getItem("score-points");

  //             if (pointSave) {
  //               const previousRecord = parseInt(pointSave);

  //               if (points > previousRecord) {
  //                 // Si el puntaje actual supera el récord anterior
  //                 localStorage.setItem("score-points", `${points}`);
  //               }
  //             } else {
  //               // Si es el primer  juego se establece el puntaje actual como récord establecido
  //               localStorage.setItem("score-points", `${points}`);
  //             }

  //             points = 0;
  //             if (pointsgamecss.current) pointsgamecss.current.textContent = `${points}`;
  //           }, 1000);
  //         } else {
  //           // Opaca las celdas existentes
  //           for (let columna = 0; columna < cuadricula[fila].length; columna++) {
  //             if (cuadricula[fila][columna]) {
  //               const cell = document.querySelector(`.${gamecss.cell__figure}[data-x='${columna}'][data-y='${fila}']`);

  //               if (cell instanceof HTMLDivElement) {
  //                 cell.style.opacity = `0.5`;
  //                 cell.style.backgroundColor = "red";
  //               }
  //             }
  //           }
  //         }

  //         fila++;
  //       }, 40);

  //       return;
  //     }

  //     if (!figurePaused && updateTime >= moreSpeed) mover("y", 1, true); // Mueve en 'Y' automáticamente
  //     if (moreSpeed < 30) clearInterval(intervalTime); // Desactiva el intervalo al llegar a la velocidad de caída mínima
  //     if (countMoreSpeed.getSeconds() >= 40 && moreSpeed >= 30) {
  //       // Acelera la caída rápida y tiempo para llamar la función mover
  //       countMoreSpeed.setSeconds(0);
  //       moreSpeed -= 10;
  //       sumTimeStop -= 12;

  //       clearTimeout(moveTimeStop);
  //       moveTimeStop = setInterval(() => countStopMove.setSeconds(countStopMove.getSeconds() + 1), sumTimeStop);
  //     }
  //     if (fallEnabled.current) {
  //       // Abilita o desabilita el baton de caida rapida
  //       if (!itMayFall && fallEnabled.current.disabled === false) fallEnabled.current.disabled = true;
  //       else if (itMayFall && fallEnabled.current.disabled === true) fallEnabled.current.disabled = false;
  //     }

  //     updateTime++;
  //   }

  //   requestAnimationFrame(updateGame);
  // }

  // // Devuelve la figura con celdas especiales que dan mas puntos
  // function pointsFigure(figure: (null | 1 | 2)[][]): (null | 1 | 2)[][] {
  //   let pointsDoubleMax = 2; // Máximo 2 celdas especiales por figura

  //   // Cada celda tiene una probabilidad del 20% de ser celdas especiales
  //   figure.forEach((fila, y) => {
  //     fila.forEach((columna, x) => {
  //       const pointsDeclarate = parseFloat((Math.random() * 1).toFixed(2));

  //       if (columna) {
  //         if (pointsDeclarate > 0.8 && pointsDoubleMax > 0) {
  //           figure[y][x] = 2;
  //           pointsDoubleMax--;
  //         } else figure[y][x] = 1;
  //       } else figure[y][x] = null;
  //     });
  //   });

  //   return figure;
  // }

  // Function actualizar

  // Indica la accion basada en los eventos de teclado
  async function handleKeyDown(e: KeyboardEvent): Promise<void> {
    const keyDown: string = e.code;
    // Mover en eje 'X, Y', rotar y establecer la figura a su punto Y máximo

    if (figurePaused.current === false) {
      if (keyDown === "ArrowUp") rotate();
      // else if (countStopMove.getSeconds() > 0) {
      if (keyDown === "ArrowLeft") await move("x", -1);
      else if (keyDown === "ArrowRight") await move("x", 1);
      else if (keyDown === "ArrowDown") await move("y", 1);
      else if (keyDown === "Space") collide();
      // }
    }
  }

  // // Habilita o des habilita los sonidos
  // function setSoundsGame() {
  //   soundsEnabled = soundsEnabled === true ? false : true; // Si esta habilitado lo des habilita o viceversa
  //   localStorage.setItem("sounds-enabled", `${soundsEnabled}`);

  //   if (btnSound.current) {
  //     btnSound.current.classList.remove(soundsEnabled === true ? `${gamecss.red}` : `${gamecss.green}`);
  //     btnSound.current.classList.add(soundsEnabled === true ? `${gamecss.green}` : `${gamecss.red}`);
  //   }

  //   if (soundsEnabled === true) {
  //     soundgamecss.currentTime = 0;
  //     soundgamecss.play();
  //   } else soundgamecss.pause();
  // }

  // // Muestra el modal remueve eventos y detiene temporizadores
  // function handleModalPaused(): void {
  //   if (gamePaused === false) {
  //     // Pause totalmente el juego
  //     if (soundsEnabled === true) soundBtnPaused.play();

  //     gamePaused = true;
  //     enabledBtns("removeEventListener", true);

  //     if (modalPaused.current && btnSound.current) {
  //       modalPaused.current.style.display = "grid";
  //       btnSound.current.classList.add(soundsEnabled === true ? `${gamecss.green}` : `${gamecss.red}`); // Si el icono esta habilitado o no
  //     }

  //     clearInterval(intervalTime);
  //     clearInterval(moveTimeStop);
  //   } else if (gamePaused === true) {
  //     // Des pausa el juego
  //     enabledBtns("addEventListener", true);
  //     gamePaused = false;

  //     if (modalPaused.current) modalPaused.current.style.display = "none";
  //     intervalTime = setInterval(() => countMoreSpeed.setSeconds(countMoreSpeed.getSeconds() + 1), 1000);
  //     moveTimeStop = setInterval(() => countStopMove.setSeconds(countStopMove.getSeconds() + 1), sumTimeStop);
  //   }
  // }

  return (
    <div className={gamecss.game}>
      <div className={gamecss.game__container}>
        <Points points={points} />
        <Grid gridContainer={gridContainer} grid={grid} blockCountX={blockCountX} blockCountY={blockCountY} />
        <Next nextFigure={nextFigure} />
        {controls ? <Controls move={move} rotate={rotate} collide={collide} /> : null}
      </div>
    </div>
  );
}

export default Game;
