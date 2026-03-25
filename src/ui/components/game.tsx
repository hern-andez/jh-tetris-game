import { useState, useRef, useEffect } from "react";

// import { StatusGame, GameControls, GameOver } from "./extraComponents";
import useTetrisFunctions from "./hooks/useTetrisFunctions";
import Points from "./points";
import Next from "./next";
import Controls from "./controls";
import Grid from "./grid";
import gamecss from "../styles/game.module.css";
import gridcss from "../styles/grid.module.css";
import { getFigure } from "./features/features";
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
  console.log(gameState, setPoints);
  // const [over, setOver] = gameState; // Determina si el juego a acabado
  const gridContainer: React.RefObject<HTMLDivElement> = useRef(null);
  // const modalPaused: React.RefObject<HTMLDivElement> = useRef(null); // Modal de Juego Pausado
  // const btnSound: React.RefObject<HTMLButtonElement> = useRef(null); // Icono de sonido del modal de Juego Pausado
  // const pointsGame: React.RefObject<HTMLDivElement> = useRef(null); //Sección de puntos en tiempo real
  // const newFigure: React.RefObject<HTMLDivElement> = useRef(null); // Contenedor que indica la siguiente figura
  // const fallEnabled: React.RefObject<HTMLButtonElement> = useRef(null); // Botón de caída rápida del componente controles
  // const statusH4: React.RefObject<HTMLHeadingElement> = useRef(null); // Titulo del status
  // const statusButton: React.RefObject<HTMLButtonElement> = useRef(null); // Botón de pausa
  // Medidas dinamicas
  const blockCountX = useRef(11); // Cantidad de columnas por fila
  const blockCountY = useRef(18); // Cantidad de filas
  // const medidasContenedo = useRef<number>(0); // Medidas dinámicas del contenedor
  const blockSize = useRef<string>(
    `clamp(${controls ? "12px, min(3dvw, 3dvh), 30px" : "14px, min(3.1dvw, 3.1dvh), 32px"})`,
  ); // Medidas para cada celda
  // Estado
  const render = useRef<boolean>(false); // Renderiza el juego una sola vez
  // const gameOver = useRef(false); // Finaliza el juego
  // const gamePaused = useRef<boolean>(false); // Indica que el juego esta pausado
  // points: number = 0, // Puntos en tiempo real
  const figure = useRef<(null | 1 | 2)[][]>(getFigure()); // Primer figura
  const nextFigure = useRef<(null | 1 | 2)[][]>(getFigure()); // Figura siguiente
  // const figurePaused = useRef<boolean>(false); // Pausa la aparición de la nueva figura cuando colisiona
  // const timeStop = useRef<number>(0); // Determina el tiempo que va a pasar para que vuelva a aparecer la nueva figura
  const reflectionCoor = useRef<number>(0); // La coordenada 'Y' máxima de la figura actual
  const couldItFall = useRef<boolean>(false); // Indica si la figura puede caer en donde indique reflectionCoor
  const grid = useRef<(null | 1 | 2)[][]>(
    Array.from({ length: blockCountY.current }, () => Array(blockCountX.current).fill(null)),
  );
  const coorX = useRef<number>(Math.floor((blockCountX.current - figure.current[0].length) / 2));
  const coorY = useRef<number>(0);
  const coorXPrevious = useRef<number>(0); // Coordenadas y copia de 'X' para ejecutar el reflejo
  // const updateTime = useRef<number>(0);
  // const moreSpeed = useRef<number>(0); // Hace caer en 'Y' la figura cuando updateTime >= moreSpeed
  // const countMoreSpeed = useRef<Date>(new Date()); // Tiempo que aumenta la velocidad de caída automática de la figura
  // const intervalTime = useRef<undefined | number>(undefined); // Temporizador que actualiza countMoreSpeed
  // const countStopMove = useRef<Date>(new Date()); // Tiempo que debe pasar para ejecutar la funcione mover
  // const moveTimeStop = useRef<undefined | number>(undefined); // Temporizador que actualiza countStopMove
  // const sumTimeStop = useRef(160); // Milisegundo para ejecutar moveTimeStop
  // const soundsEnabled = useRef<boolean>(false); // Habilita o deshabilita los sonidos
  const figureCells = useRef<(null | HTMLDivElement)[][]>([]);

  const { create } = useTetrisFunctions({
    figureCells,
    gridContainer,
    className: gridcss,
    figure,
    grid,
    coorX,
    coorY,
    blockSize,
    reflectionCoor,
    coorXPrevious,
    couldItFall,
  });

  useEffect(() => {
    if (!render.current) {
      render.current = true;
      // newFigure.current.style.height = `${2 * blockSize}px`;
      // startGame();
      create();
    }
  });

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
  //     countStopMove = new Date();
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

  // // Elimina la figura de la matriz
  // function eliminarFigura(): void {
  //   figura.forEach((fila, y) => {
  //     fila.forEach((columna, x) => {
  //       if (columna !== null) cuadricula[y + coorY][x + coorX] = null;
  //     });
  //   });
  // }

  // // Finaliza el juego si una celda de la nueva figura ya esta ocupada en el tablero
  // function canShow(): boolean {
  //   for (let y = coorY; y - coorY < figura.length; y++) {
  //     for (let x = coorX; x - coorX < figura[y - coorY].length; x++) {
  //       if (cuadricula[y][x] && figura[y - coorY][x - coorX]) return false;
  //     }
  //   }

  //   return true;
  // }

  // // Determina si una figura es capaz de moverse en eje 'X, Y'
  // function canMove(eje: "x" | "y", val: 1 | -1): boolean {
  //   if (
  //     (eje === "x" && coorX + val >= 0 && coorX + figura[0].length - 1 + val < cuadricula[0].length) ||
  //     (eje === "y" && coorY + figura.length < cuadricula.length)
  //   ) {
  //     // No se ejecuta si la figura esta en los limites 'X, Y' del tablero
  //     const move: number[][] = [];

  //     for (let y = coorY; y < coorY + figura.length; y++) {
  //       for (let x = coorX; x < coorX + figura[0].length; x++) {
  //         if (eje === "x" && figura[y - coorY][x - coorX] && cuadricula[y][x + val] === null) {
  //           move.push([y, x + val]);
  //           break; // Guarda las nuevas coordenadas en eje 'X' si las celdas + o - 1 están vacías
  //         }

  //         if (eje === "y" && figura[y - coorY][x - coorX]) {
  //           if (cuadricula[y + val]) {
  //             if (figura[y - coorY + val]) {
  //               if (figura[y - coorY + val][x - coorX]) continue; // Cuando la figura tiene la celda 'X' en diferentes 'Y' ocupada, Ejemplo: figura[0][0] = 1, figura[1][0] = 1;
  //             }
  //             if (cuadricula[y + val][x] === null) move.push([y + val, x]); // Guarda las nuevas coordenadas en 'Y' si las celdas + 1 están vacías
  //           } else if (y + val === cuadricula.length || cuadricula[y + val][x]) return false; // Indica que no se puede mover si llega al limite del tablero o si la celda de la cuadricula esta ocupada
  //         }
  //       }
  //     }

  //     // Si los longitudes coinciden indica que se puede mover
  //     if (eje === "x" && move.length === figura.length) return true;
  //     else if (eje === "y" && move.length === figura[0].length) return true;
  //     else return false;
  //   } else {
  //     return false; // No se puede mover si se encuentra en los límites del tablero
  //   }
  // }

  // // Mueve o establece la figura, indica si el juego a terminado y llama otras funciones
  // function mover(eje: "x" | "y", val: 1 | -1, isMoveAutomatic = false): void {
  //   // if (countStopMove.getSeconds() > 0) {
  //   //   const mover = canMove(eje, val);
  //   //   if (mover) {
  //   //     // Si la figura se puede mover se borra la posición, se actualizan las coordenadas, se dibuja en su nueva posición, y se reinicia el tiempo para volver a llamar la función
  //   //     eliminarFigura();
  //   //     coorXPrevious = coorX;
  //   //     if (eje === "x") coorX += val;
  //   //     else if (eje === "y") {
  //   //       coorY += val;
  //   //       updateTime = 0;
  //   //     }
  //   //     actualizarFigura();
  //   //     if (soundsEnabled === true) soundMove.play();
  //   //     if (isMoveAutomatic === false) countStopMove.setSeconds(0); // Resetea el conteo si el movimiento no fue automático (Función updateGame)
  //   //   } else if (eje === "y" && !mover) {
  //   //     actualizarFigura(); // Actualiza los atributos data- de la figura actual
  //   //     // Data para la nueva figura
  //   //     figura = cellNewFigure;
  //   //     coorX = Math.floor((blockCountX - figura[0].length) / 2);
  //   //     coorY = 0;
  //   //     updateTime = 0;
  //   //     if (canShow()) {
  //   //       deleteRow();
  //   //       // Permite que se establezca el valor de timeStop
  //   //       setTimeout(() => {
  //   //         setTimeout(() => {
  //   //           if (newFigure.current) newFigure.current.textContent = "";
  //   //           figurePaused = false;
  //   //           updateTime = 0;
  //   //           enabledBtns("addEventListener", false);
  //   //           crearFigura();
  //   //           showNewFigure();
  //   //           if (isMoveAutomatic === false) countStopMove.setSeconds(0);
  //   //         }, timeStop);
  //   //       }, 10);
  //   //     } else {
  //   //       gameOver = true;
  //   //     }
  //   //   }
  //   // }
  // }

  // // Verifica si hay filas enteras ocupadas, si es que hay las elimina y suma los puntos
  // function deleteRow(): void {
  //   enabledBtns("removeEventListener", true);
  //   timeStop = 200;
  //   let sumPoints = points; // Puntos actuales
  //   let filasBorradas = 0; // Hace un conteo de las filas borradas para ver que audio va a sonar
  //   let lastIndexRows: number; // Índices de la ultima fila borrada

  //   for (let row = 0; row < cuadricula.length; row++) {
  //     if (cuadricula[row].every((val) => !!val)) {
  //       figurePaused = true;
  //       timeStop = 1000;
  //       filasBorradas++;
  //       lastIndexRows = row;

  //       cuadricula[row].forEach((point) => (points += point === 1 ? 13 : 19)); // Suma los puntos de las celdas comunes y especiales
  //       cuadricula.splice(row, 1); // Borra la fila
  //       cuadricula.unshift(Array.from({ length: blockCountX }, () => null)); // Agrega una nueva al principio la nueva fila

  //       // Activa el sonido
  //       if (soundsEnabled === true) {
  //         if (filasBorradas === 1) soundCompleteLine.play();
  //         if (filasBorradas === 3) {
  //           soundCompleteLine2.currentTime = 0.2;
  //           soundCompleteLine2.play();
  //         }
  //       }

  //       // Anima todas las columnas de la fila del tablero
  //       document.querySelectorAll(`.${gamecss.background__cell}[data-y='${row}']`).forEach((cell) => {
  //         setTimeout(() => cell.classList.add(`${game["background-cell-delete"]}`), 0.0001);
  //       });

  //       // Remueve todas las columnas
  //       document.querySelectorAll(`.${gamecss.cell__figure}[data-y='${row}']`).forEach((cell) => cell.remove());

  //       // Dibuja las celdas ocupadas en su nueva posición
  //       if (filasBorradas === 1) {
  //         setTimeout(() => {
  //           let setCellPosition = lastIndexRows; // Establece las filas en su nueva posición

  //           // Recorre las filas desde la ultima fila borrada hasta la primera fila del tablero
  //           for (let y = lastIndexRows - 1; y >= 0; y--) {
  //             const cells: NodeListOf<HTMLDivElement> = document.querySelectorAll(
  //               `.${gamecss.cell__figure}[data-y='${y}']`,
  //             );

  //             if (cells.length > 0) {
  //               // Si hay filas con una o mas celdas
  //               cells.forEach((cell) => {
  //                 const dataX = cell.getAttribute("data-x");

  //                 if (dataX) {
  //                   const numberDataX = parseInt(dataX);

  //                   cell.setAttribute("data-y", `${setCellPosition}`);
  //                   cell.style.transform = `translate(${numberDataX * blockSize}px, ${setCellPosition * blockSize}px)`;
  //                 }
  //               });

  //               setCellPosition--;
  //             }
  //           }
  //         }, 500);
  //       }
  //     }
  //   }

  //   setTimeout(() => {
  //     removeClass(`${game["background-cell-delete"]}`); // Desactiva la animación de filas borradas

  //     if (sumPoints !== points) {
  //       // Anima el incremento de puntos
  //       const sumador = setInterval(() => {
  //         if (sumPoints > points) clearInterval(sumador);
  //         else {
  //           if (pointsgamecss.current) {
  //             pointsgamecss.current.textContent = `${sumPoints}`;
  //             sumPoints++;
  //           }
  //         }
  //       }, 5);
  //     }
  //   }, 500);
  // }

  // // Rota la figura si es que puede hacerlo
  // function rotarFigura(): void {
  //   let comodinX = 0; // Índices de la figuraRotada
  //   const figuraRotada: (null | 1 | 2)[][] = [];
  //   const figureCellRotate: (HTMLDivElement | null)[][] = [];

  //   // Rota la figura empezando en la ultima columna hasta la primera
  //   for (let y = 0; y < figura.length; y++) {
  //     for (let x = figura[y].length - 1; x >= 0; x--) {
  //       if (!figuraRotada[comodinX]) figuraRotada[comodinX] = [figura[y][x]];
  //       else figuraRotada[comodinX].push(figura[y][x]);

  //       if (!figureCellRotate[comodinX]) figureCellRotate[comodinX] = [figureCells[y][x]];
  //       else figureCellRotate[comodinX].push(figureCells[y][x]);

  //       if (x - 1 !== -1) comodinX += 1;
  //       else comodinX = 0;
  //     }
  //   }

  //   const yLess = figura.length - figuraRotada.length; // Evita que al rotar la figura pueda haber errores en la coordenada Y
  //   if (cuadricula[coorY + yLess] && coorX + figuraRotada[0].length - 1 < cuadricula[0].length) {
  //     // Verifica si la fila existe y si la columna de la figura rotada no sobrepasa los limites del canvas
  //     eliminarFigura();

  //     if (cuadricula[coorY + yLess][coorX + figuraRotada.length - 1] === null) {
  //       for (let y = 0; y < figuraRotada.length; y++) {
  //         for (let x = 0; x < figuraRotada[y].length; x++) {
  //           if (cuadricula[coorY + y + yLess][coorX + x] !== null && figuraRotada[y][x]) {
  //             actualizarFigura();
  //             return; // Si alguna celda de la figura rotada ya esta ocupada no rota
  //           }
  //         }
  //       }

  //       // Si todas están vacías se establece la coordenada 'Y' fija actual y se dibuja la la figura
  //       coorY += yLess;
  //       figura = figuraRotada;
  //       figureCells = figureCellRotate;
  //       actualizarFigura();
  //       calcularPuntoMaximo();
  //     }
  //   }
  // }

  // // Mueve la figura hasta su punto máximo en 'Y'
  // function puntoMaximo(): void {
  //   if (itMayFall && !figurePaused && countStopMove.getSeconds() > 0) {
  //     if (soundsEnabled) {
  //       soundFall.currentTime = 1;
  //       soundFall.playbackRate = 0.6;
  //       soundFall.play();
  //     }

  //     figurePaused = true;
  //     enabledBtns("removeEventListener", true);
  //     removeClass(`${game["background-cell-down"]}`);
  //     eliminarFigura();

  //     const countRows = coorFigurebellow + figura.length - 1 - coorY; // Cantidad de filas que tendrán la animación
  //     const countOpacity = parseFloat((1 / countRows).toFixed(3)); // Cantidad de opacidad
  //     let opacidad = countOpacity; // Baja la opacidad a medida que llega a las ultimas filas

  //     for (let fila = coorY; fila < coorFigurebellow + figura.length; fila++) {
  //       for (let columna = coorX; columna < coorX + figura[0].length; columna++) {
  //         const cell = document.querySelector(`.${gamecss.background__cell}[data-x='${columna}'][data-y='${fila}']`);
  //         if (cell instanceof HTMLDivElement) cell.style.backgroundColor = `rgba(0, 0, 255, ${opacidad})`;
  //       }

  //       opacidad += countOpacity;
  //     }

  //     // Baja la figura hasta su punto máximo
  //     coorY = coorFigurebellow;
  //     actualizarFigura();

  //     setTimeout(() => {
  //       // Establece la figura como fija y restablece la animacion
  //       mover("y", 1);

  //       const cells: NodeListOf<HTMLDivElement> = document.querySelectorAll(`.${gamecss.background__cell}[style]`);
  //       cells.forEach((cell) => (cell.style.backgroundColor = "#000d"));
  //     }, 250);
  //   }
  // }

  // // Dibuja la siguiente figura al lado de los puntos
  // function showNewFigure(): void {
  //   cellNewFigure = obtenerFigura(); // Obtiene la siguiente figura

  //   // Da las dimensiones y celdas en css al contenedor
  //   if (newFigure.current) {
  //     newFigure.current.style.width = `${cellNewFigure[0].length * blockSize}px`;
  //     newFigure.current.style.height = `${cellNewFigure.length * blockSize}px`;
  //     newFigure.current.style.marginBottom = `${cellNewFigure.length === 1 ? blockSize : 0}px`;
  //     newFigure.current.style.gridTemplateColumns = `repeat(${cellNewFigure[0].length}, 1fr)`;
  //     newFigure.current.style.gridTemplateRows = `repeat(${cellNewFigure.length}, 1fr)`;
  //   }

  //   // Agrega los estilos parecidos del tablero a los hijos y animación de flasheo a celdas especiales
  //   for (let y = 0; y < cellNewFigure.length; y++) {
  //     for (let x = 0; x < cellNewFigure[y].length; x++) {
  //       const div = document.createElement("div");

  //       div.classList.add(cellNewFigure[y][x] ? `${gamecss.occupied_cell}` : `${gamecss.empty_cell}`);
  //       if (cellNewFigure[y][x] === 2) div.style.animation = "cell_flash .7s infinite";

  //       if (newFigure.current) newFigure.current.appendChild(div);
  //     }
  //   }
  // }

  // // Indica la accion basada en los eventos de teclado
  // function handleKeyDown(e: React.KeyboardEvent<Document>): void {
  //   const keyDown: string = e.code;

  //   // Mover en eje 'X, Y', rotar y establecer la figura a su punto Y máximo
  //   if (keyDown === "ArrowUp") rotarFigura();
  //   else if (countStopMove.getSeconds() > 0) {
  //     if (keyDown === "ArrowLeft") mover("x", -1);
  //     else if (keyDown === "ArrowRight") mover("x", 1);
  //     else if (keyDown === "ArrowDown") mover("y", 1);
  //     else if (keyDown === "Space") puntoMaximo();
  //   }
  // }

  // // Habilita o deshabilita los botones y eventos del juego
  // function enabledBtns(event: "addEventListener" | "removeEventListener", valueBtns: boolean): void {
  //   document[event]("keydown", handleKeyDown as unknown as EventListener);
  //   document.querySelectorAll(`.${gamecss.controls} button`).forEach((btn) => {
  //     if (btn instanceof HTMLButtonElement) btn.disabled = valueBtns;
  //   });
  // }

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

  // return (
  //   <div className={gamecss.game__tetris}>
  //     <div className={gamecss.pausedBackground} ref={modalPaused}>
  //       <div className={gamecss.paused__panel}>
  //         <h1>Game Paused</h1>
  //         <button
  //           onClick={() => {
  //             handleModalPaused();
  //           }}
  //           role="button"
  //           aria-label="Continuar Juego"
  //         >
  //           Continue
  //         </button>
  //         <button
  //           onClick={() => {
  //             gameOver = true;
  //             handleModalPaused();
  //           }}
  //           role="button"
  //           aria-label="Resetear Juego"
  //         >
  //           Reset
  //         </button>
  //         <button
  //           className={`material-symbols-outlined ${gamecss.panel_btn_sound}`}
  //           onClick={() => {
  //             setSoundsGame();
  //           }}
  //           ref={btnSound}
  //           role="button"
  //           aria-label="Volumen"
  //         >
  //           volume_up
  //         </button>
  //       </div>
  //     </div>{" "}
  //     {/* Modal de Juego pausado */}
  //     <StatusGame
  //       blockSize={blockSize}
  //       points={points}
  //       h4={statusH4}
  //       button={statusButton}
  //       pointsGame={pointsGame}
  //       newFigure={newFigure}
  //       modal={() => handleModalPaused()}
  //     />{" "}
  //     {/* Estado del juego */}
  //     <div
  //       className={gamecss.background}
  //       style={{ width: `${blockSize * blockCountX + 2}px`, height: `${blockSize * blockCountY + 2}px` }}
  //       ref={container}
  //     >
  //       {cuadricula.map((fila, filaIndex) => {
  //         return fila.map((_, columnaIndex) => {
  //           return (
  //             <div
  //               key={`${filaIndex}-${columnaIndex}`}
  //               className={gamecss.background__cell}
  //               data-x={columnaIndex}
  //               data-y={filaIndex}
  //             ></div>
  //           );
  //         });
  //       })}
  //     </div>{" "}
  //     {/* Tablero */}
  //     {controls ? <GameControls functions={[mover, rotarFigura, puntoMaximo]} button={fallEnabled} /> : []}
  //     {over ? <GameOver setOver={setOver} /> : null} {/* Modal de juego terminado */}
  //   </div>
  // );

  return (
    <div className={gamecss.game}>
      <div className={gamecss.game__container}>
        <Points points={points} />
        <Grid
          gridContainer={gridContainer}
          grid={grid}
          blockCountX={blockCountX}
          blockCountY={blockCountY}
          blockSize={blockSize}
        />
        <Next nextFigure={nextFigure} />
        {controls ? <Controls /> : null}
      </div>
    </div>
  );
}

export default Game;
