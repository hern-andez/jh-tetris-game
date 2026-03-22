import React, { useEffect, useRef } from "react";

import { StatusGame, GameControls, GameOver } from "./extraComponents";
import game from "../styles/game.module.css";
import { seconds, figuras } from "./utilidades";
import {
  soundGame,
  soundGameOver,
  soundNoMoreFigure,
  soundCount,
  soundStart,
  soundMove,
  soundFall,
  soundCompleteLine,
  soundCompleteLine2,
  soundBtnPaused,
  star,
} from "./utilidades";

type GameProps = {
  controls: boolean;
  gameState: [boolean, (newState: boolean) => void];
};

// Juego, puntos, controles, modal de Juego pausado y Game Over
function Game({ controls, gameState }: GameProps) {
  const [over, setOver] = gameState; // Determina si el juego a acabado
  const container: React.RefObject<HTMLDivElement> = useRef(null);
  const modalPaused: React.RefObject<HTMLDivElement> = useRef(null); // Modal de Juego Pausado
  const btnSound: React.RefObject<HTMLButtonElement> = useRef(null); // Icono de sonido del modal de Juego Pausado
  const pointsGame: React.RefObject<HTMLDivElement> = useRef(null); //Sección de puntos en tiempo real
  const newFigure: React.RefObject<HTMLDivElement> = useRef(null); // Contenedor que indica la siguiente figura
  const fallEnabled: React.RefObject<HTMLButtonElement> = useRef(null); // Botón de caída rápida del componente controles
  const statusH4: React.RefObject<HTMLHeadingElement> = useRef(null); // Titulo del status
  const statusButton: React.RefObject<HTMLButtonElement> = useRef(null); // Botón de pausa
  // Medidas dinamicas
  const blockCountX = 13; // Cantidad de columnas por fila
  const blockCountY = 18; // Cantidad de filas
  let medidasContenedor: number; // Medidas dinámicas del contenedor
  let blockSize: number; // Medidas para cada celda
  // Estado
  let isStart: boolean, // Renderiza el juego una sola vez
    gameOver = false, // Finaliza el juego
    gamePaused: boolean, // Indica que el juego esta pausado
    points: number = 0, // Puntos en tiempo real
    figura: (null | 1 | 2)[][], // Primer figura
    cellNewFigure: (null | 1 | 2)[][], // Figura siguiente
    figurePaused: boolean, // Pausa la aparición de la nueva figura cuando colisiona
    timeStop: number, // Determina el tiempo que va a pasar para que vuelva a aparecer la nueva figura
    coorFigurebellow: number, // La coordenada 'Y' máxima de la figura actual
    itMayFall: boolean, // Indica si la figura puede caer en donde indique coorFigurebellow
    cuadricula: (null | 1 | 2)[][] = Array.from({ length: blockCountY }, () => Array(blockCountX).fill(null));
  let coorX: number, coorY: number, coorXPrevious: number; // Coordenadas y copia de 'X' para ejecutar el reflejo
  let updateTime: number, moreSpeed: number; // Hace caer en 'Y' la figura cuando updateTime >= moreSpeed
  let countMoreSpeed: Date, // Tiempo que aumenta la velocidad de caída automática de la figura
    intervalTime: undefined | number, // Temporizador que actualiza countMoreSpeed
    countStopMove: Date, // Tiempo que debe pasar para ejecutar la funcione mover
    moveTimeStop: undefined | number, // Temporizador que actualiza countStopMove
    sumTimeStop: number = 160; // Milisegundo para ejecutar moveTimeStop
  let soundsEnabled: boolean; // Habilita o deshabilita los sonidos
  let figureCells: (null | HTMLDivElement)[][] = []; // Indica la nueva posición de cada celda cuando rota la figura

  // Es pacifica el tamaño de cada celda dinámicamente
  if (controls) {
    medidasContenedor = Math.round(innerHeight / 2.2);
    blockSize = Math.round(medidasContenedor / blockCountY + 3);
  } else {
    medidasContenedor = Math.round(innerHeight / 1.9);
    blockSize = Math.round(medidasContenedor / blockCountY + 3);
  }

  useEffect(() => {
    if (newFigure.current) {
      newFigure.current.style.height = `${2 * blockSize}px`;
      startGame();
    }
  });

  // Comienza el juego, agregando en eventos, estado inicial, comienza los temporizadores y dibuja la primer figura
  function startGame() {
    if (!over && !isStart) {
      isStart = true; // Evita doble renderización

      const btnPaused = document.querySelector(`.${game.status} button`); // Deshabilita el control de pausa
      if (btnPaused instanceof HTMLButtonElement) btnPaused.disabled = true;
      document.querySelectorAll(`.${game.cell__figure}`).forEach((cell) => cell.remove()); // Remueve las celdas del juego anterior

      // Estado inicial del juego
      cuadricula = Array.from({ length: blockCountY }, () => Array(blockCountX).fill(null));
      gameOver = false;
      gamePaused = false;
      figurePaused = false;
      figura = obtenerFigura();
      coorX = Math.floor((blockCountX - figura[0].length) / 2);
      coorY = 0;
      coorXPrevious = coorX;
      coorFigurebellow = 0;
      itMayFall = true;
      updateTime = 0;
      moreSpeed = 70;
      countMoreSpeed = new Date();
      countMoreSpeed.setSeconds(0);
      countStopMove = new Date();
      countStopMove.setSeconds(0);

      // Habilita los sonidos por primera vez al entrar en la pagina
      if (localStorage.getItem("sounds-enabled") === null) {
        localStorage.setItem("sounds-enabled", "true");
        soundsEnabled = true;
      } else {
        soundsEnabled = localStorage.getItem("sounds-enabled") === "true" ? true : false; // Se obtiene el estado establecido
      }

      if (soundsEnabled) soundGame.currentTime = 0;

      // Muestra segundos para empezar el juego
      setTimeout(() => {
        let number = 0; // Índice del numero
        const secondsCoorY = Math.floor(blockCountY / 2 - 4); // Coordenada Y donde aparecerán

        const second = setInterval(() => {
          document
            .querySelectorAll(`.${game["cell--count"]}`)
            .forEach((element) => element.classList.remove(`${game["cell--count"]}`)); // Borra los segundos

          if (number === seconds.length) {
            // Inicia el juego
            intervalTime = setInterval(() => countMoreSpeed.setSeconds(countMoreSpeed.getSeconds() + 1), 1000);
            moveTimeStop = setInterval(() => countStopMove.setSeconds(countStopMove.getSeconds() + 1), sumTimeStop);

            window.addEventListener("resize", handleResizeChange);
            enabledBtns("addEventListener", false);
            crearFigura();
            updateGame();
            showNewFigure();
            clearInterval(second);

            if (btnPaused instanceof HTMLButtonElement) btnPaused.disabled = false;
            if (soundsEnabled === true) {
              soundStart.play();
              setTimeout(() => soundGame.play(), 1000);
            }
          } else {
            setTimeout(() => {
              const secondsCoorX = Math.floor(blockCountX / 2 - seconds[number][0].length / 2); // Coordenada X donde aparecen

              // Accede a las celdas del fondo del tablero para ir dibujando el conteo mediante divs
              for (let fila = 0; fila < seconds[number].length; fila++) {
                for (let columna = 0; columna < seconds[number][fila].length; columna++) {
                  if (seconds[number][fila][columna] === 1) {
                    const div = document.querySelector(
                      `.${game.background__cell}[data-x='${secondsCoorX + columna}'][data-y='${secondsCoorY + fila}']`,
                    );

                    if (div instanceof HTMLDivElement) div.classList.add(`${game["cell--count"]}`);
                  }
                }
              }

              if (soundsEnabled === true) {
                soundCount.currentTime = 0.6;
                soundCount.play();
              }

              number++;
            }, 100);
          }
        }, 1000);
      }, 250);
    }
  }

  // Mantiene el juego actualizado y realiza acciones como mover figura en 'Y' y finalizar el juego
  function updateGame() {
    if (gamePaused === false) {
      // Si no esta pausado el juego
      if (gameOver) {
        clearInterval(moveTimeStop);
        removeClass(`${game["background-cell-down"]}`); // Elimina los reflejos
        enabledBtns("removeEventListener", true); // Deshabilita controles
        sessionStorage.setItem("score-game", `${points}`); // Guarda el valor actual temporalmente
        if (newFigure.current) newFigure.current.textContent = ""; // Elimina la siguiente figura

        // Suena sonido de game over
        if (soundsEnabled === true) {
          soundGame.pause();
          soundNoMoreFigure.currentTime = 0.6;
          soundNoMoreFigure.play();
        }

        let fila = 0;
        const opacador = setInterval(() => {
          if (fila === cuadricula.length) {
            if (soundsEnabled === true) soundGameOver.play();

            clearInterval(opacador);
            setTimeout(() => setOver(true), 300); // Muestra el componente de game over
            setTimeout(() => {
              const pointSave = localStorage.getItem("score-points");

              if (pointSave) {
                const previousRecord = parseInt(pointSave);

                if (points > previousRecord) {
                  // Si el puntaje actual supera el récord anterior
                  localStorage.setItem("score-points", `${points}`);
                }
              } else {
                // Si es el primer  juego se establece el puntaje actual como récord establecido
                localStorage.setItem("score-points", `${points}`);
              }

              points = 0;
              if (pointsGame.current) pointsGame.current.textContent = `${points}`;
            }, 1000);
          } else {
            // Opaca las celdas existentes
            for (let columna = 0; columna < cuadricula[fila].length; columna++) {
              if (cuadricula[fila][columna]) {
                const cell = document.querySelector(`.${game.cell__figure}[data-x='${columna}'][data-y='${fila}']`);

                if (cell instanceof HTMLDivElement) {
                  cell.style.opacity = `0.5`;
                  cell.style.backgroundColor = "red";
                }
              }
            }
          }

          fila++;
        }, 40);

        return;
      }

      if (!figurePaused && updateTime >= moreSpeed) mover("y", 1, true); // Mueve en 'Y' automáticamente
      if (moreSpeed < 30) clearInterval(intervalTime); // Desactiva el intervalo al llegar a la velocidad de caída mínima
      if (countMoreSpeed.getSeconds() >= 40 && moreSpeed >= 30) {
        // Acelera la caída rápida y tiempo para llamar la función mover
        countMoreSpeed.setSeconds(0);
        moreSpeed -= 10;
        sumTimeStop -= 12;

        clearTimeout(moveTimeStop);
        moveTimeStop = setInterval(() => countStopMove.setSeconds(countStopMove.getSeconds() + 1), sumTimeStop);
      }
      if (fallEnabled.current) {
        // Abilita o desabilita el baton de caida rapida
        if (!itMayFall && fallEnabled.current.disabled === false) fallEnabled.current.disabled = true;
        else if (itMayFall && fallEnabled.current.disabled === true) fallEnabled.current.disabled = false;
      }

      updateTime++;
    }

    requestAnimationFrame(updateGame);
  }

  // Hace responsivo el juego
  function handleResizeChange() {
    let newBlockSize: number; // Nuevas medidas del bloque

    if (controls) {
      // Ocupa menos si los controles están habilitados
      medidasContenedor = Math.round(innerHeight / 2.2);
      newBlockSize = Math.round(medidasContenedor / blockCountY + 3);
    } else {
      // Ocupa mas si los controles están habilitados
      medidasContenedor = Math.round(innerHeight / 1.9);
      newBlockSize = Math.round(medidasContenedor / blockCountY + 3);
    }

    // Hace responsivo si la nueva medida es diferente a la medida actual
    if (newBlockSize !== blockSize && container.current && newFigure.current && !figurePaused && cellNewFigure) {
      blockSize = newBlockSize;

      container.current.style.width = `${blockSize * blockCountX + 2}px`;
      container.current.style.height = `${blockSize * blockCountY + 2}px`;

      cuadricula.forEach((fila, y) => {
        fila.forEach((columna, x) => {
          if (columna !== null) {
            // Modifica el tamaño y posicion de cada celda en el tablero
            const cell = document.querySelector(`.${game.cell__figure}[data-x='${x}'][data-y='${y}']`);

            if (cell instanceof HTMLDivElement) {
              cell.style.width = `${blockSize - 0.5}px`;
              cell.style.height = `${blockSize - 0.5}px`;
              cell.style.transform = `translate(${x * blockSize}px, ${y * blockSize}px)`;
            }
          }
        });
      });

      // Contenedor de la siguiente figura
      newFigure.current.style.width = `${cellNewFigure[0].length * blockSize}px`;
      newFigure.current.style.height = `${cellNewFigure.length * blockSize}px`;
      newFigure.current.style.marginBottom = `${cellNewFigure.length === 1 ? blockSize : 0}px`;

      const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
        `.${game.controls} .${game.controls__btn}`,
      ); // Controles

      if (statusH4.current && statusButton.current) {
        statusH4.current.style.fontSize = `${blockSize * 1.3}px`;
        statusButton.current.style.fontSize = `${blockSize * 1.2}px`;
        statusButton.current.style.padding = `${blockSize / 2.5}px`;
        buttons.forEach((button) => (button.style.fontSize = `${blockSize / 2 + blockSize}px`));
      }
    }
  }

  // Remueve clases de una lista de elementos como las del reflejo o cuando se elimina un fila completa
  function removeClass(clases: string): void {
    document.querySelectorAll(`.${clases}`).forEach((element) => element.classList.remove(clases));
  }

  // Devuelve una figura aleatoria
  function obtenerFigura(): (null | 1 | 2)[][] {
    return pointsFigure(figuras[Math.floor(Math.random() * figuras.length)]);
  }

  // Devuelve la figura con celdas especiales que dan mas puntos
  function pointsFigure(figure: (null | 1 | 2)[][]): (null | 1 | 2)[][] {
    let pointsDoubleMax = 2; // Máximo 2 celdas especiales por figura

    // Cada celda tiene una probabilidad del 20% de ser celdas especiales
    figure.forEach((fila, y) => {
      fila.forEach((columna, x) => {
        const pointsDeclarate = parseFloat((Math.random() * 1).toFixed(2));

        if (columna) {
          if (pointsDeclarate > 0.8 && pointsDoubleMax > 0) {
            figure[y][x] = 2;
            pointsDoubleMax--;
          } else figure[y][x] = 1;
        } else figure[y][x] = null;
      });
    });

    return figure;
  }

  // Dibuja la figura y la guarda en la cuadricula
  function crearFigura(): void {
    figura.forEach((fila, y) => {
      figureCells[y] = []; // En vez de tener 1 o 2 tiene los divs en su orden especifico

      fila.forEach((columna, x) => {
        if (columna !== null) {
          cuadricula[y + coorY][x + coorX] = columna;

          // Dibuja la figura y agrega la imagen a celdas especiales
          const div = document.createElement("div");
          div.classList.add(`${game.cell__figure}`);
          div.setAttribute("data-x", `${coorX + x}`);
          div.setAttribute("data-y", `${coorY + y}`);

          div.style.backgroundColor = columna === 1 ? "red" : "#0ff";
          if (columna === 2) div.style.backgroundImage = `url('${star.src}')`;
          div.style.width = `${blockSize - 0.5}px`;
          div.style.height = `${blockSize - 0.5}px`;
          div.style.transform = `translate(${(coorX + x) * blockSize}px, ${(coorY + y) * blockSize}px)`;

          figureCells[y].push(div);
          if (container.current) container.current.appendChild(div);
        } else {
          figureCells[y].push(null);
        }
      });
    });

    calcularPuntoMaximo(); // Se muestra el reflejo al crearse la figura
  }

  // Actualiza su nueva posición
  function actualizarFigura(): void {
    figura.forEach((fila, y) => {
      fila.forEach((columna, x) => {
        if (columna !== null) {
          const cell = figureCells[y][x];

          if (cell) {
            cell.style.transform = `translate(${(coorX + x) * blockSize}px, ${(coorY + y) * blockSize}px)`;
            cuadricula[coorY + y][coorX + x] = columna;

            cell.setAttribute("data-x", `${coorX + x}`);
            cell.setAttribute("data-y", `${coorY + y}`);
          }
        }
      });
    });

    if (
      coorY + figura.length - 1 === cuadricula.length - figura.length ||
      coorY + figura.length - 1 === coorFigurebellow
    ) {
      // Remueve la clase y deshabilita el botón de caída rápida cuando la figura llega a su punto máximo
      removeClass(`${game["background-cell-down"]}`);
      itMayFall = false;
    }
    if (coorXPrevious !== coorX) calcularPuntoMaximo(); // Agrega el reflejo cuando cambia coorX
  }

  // Elimina la figura de la matriz
  function eliminarFigura(): void {
    figura.forEach((fila, y) => {
      fila.forEach((columna, x) => {
        if (columna !== null) cuadricula[y + coorY][x + coorX] = null;
      });
    });
  }

  // Muestra un reflejo de la figura actual en su coordenada 'Y' máxima que puede llegar
  function calcularPuntoMaximo(): void {
    removeClass(`${game["background-cell-down"]}`); // Borra el reflejo anterior

    // Obtiene los índices de las celdas ocupadas de la figura
    if (coorY + figura.length - 1 < cuadricula.length - figura.length) {
      const cCF: number[][] = []; // Son las coordenadas de las celdas ocupadas mas bajas de la figura
      let coorReflejoY = 0;

      figura.forEach((fila, y) => {
        fila.forEach((columna, x) => {
          if (columna && figura[y + 1]) {
            if (figura[y + 1][x] === null) {
              cCF.push([x, y]);
            }
          } else if (columna) {
            cCF.push([x, y]);
          }
        });
      });

      // obtiene la coordenada máxima en 'Y'
      for (let fila = coorY + figura.length; fila < cuadricula.length; fila++) {
        if (coorReflejoY) break;

        for (let coorFigure = 0; coorFigure < cCF.length; coorFigure++) {
          if (
            fila === cuadricula.length - figura.length &&
            coorFigure === cCF.length - 1 &&
            cuadricula[cCF[coorFigure][1] + fila][cCF[coorFigure][0] + coorX] === null
          ) {
            // Cuando llega a la ultima fila de la cuadricula
            coorReflejoY = cuadricula.length - figura.length;
            break;
          } else if (cuadricula[cCF[coorFigure][1] + fila]) {
            if (cuadricula[cCF[coorFigure][1] + fila][cCF[coorFigure][0] + coorX] !== null) {
              // Cuando encuentra la primera celda ocupada
              coorReflejoY = fila - 1;
              break;
            }
          }
        }
      }

      if (coorY + figura.length - 1 < coorReflejoY) {
        // Dibuja el reflejo de la figura y guarda la coordenada máxima para la función puntoMáximo
        coorFigurebellow = coorReflejoY;
        itMayFall = true;

        figura.forEach((fila, y) => {
          fila.forEach((columna, x) => {
            if (columna) {
              const dataX = x + coorX;
              const dataY = y + coorReflejoY;
              const div = document.querySelector(`.${game.background__cell}[data-x='${dataX}'][data-y='${dataY}']`);

              setTimeout(() => {
                if (div instanceof HTMLDivElement) div.classList.add(`${game["background-cell-down"]}`);
              }, 0.0001);
            }
          });
        });
      } else itMayFall = false; // Deshabilita el botón de caída rápida si la figura esta en su punto máximo
    }
  }

  // Finaliza el juego si una celda de la nueva figura ya esta ocupada en el tablero
  function canShow(): boolean {
    for (let y = coorY; y - coorY < figura.length; y++) {
      for (let x = coorX; x - coorX < figura[y - coorY].length; x++) {
        if (cuadricula[y][x] && figura[y - coorY][x - coorX]) return false;
      }
    }

    return true;
  }

  // Determina si una figura es capaz de moverse en eje 'X, Y'
  function canMove(eje: "x" | "y", val: 1 | -1): boolean {
    if (
      (eje === "x" && coorX + val >= 0 && coorX + figura[0].length - 1 + val < cuadricula[0].length) ||
      (eje === "y" && coorY + figura.length < cuadricula.length)
    ) {
      // No se ejecuta si la figura esta en los limites 'X, Y' del tablero
      const move: number[][] = [];

      for (let y = coorY; y < coorY + figura.length; y++) {
        for (let x = coorX; x < coorX + figura[0].length; x++) {
          if (eje === "x" && figura[y - coorY][x - coorX] && cuadricula[y][x + val] === null) {
            move.push([y, x + val]);
            break; // Guarda las nuevas coordenadas en eje 'X' si las celdas + o - 1 están vacías
          }

          if (eje === "y" && figura[y - coorY][x - coorX]) {
            if (cuadricula[y + val]) {
              if (figura[y - coorY + val]) {
                if (figura[y - coorY + val][x - coorX]) continue; // Cuando la figura tiene la celda 'X' en diferentes 'Y' ocupada, Ejemplo: figura[0][0] = 1, figura[1][0] = 1;
              }
              if (cuadricula[y + val][x] === null) move.push([y + val, x]); // Guarda las nuevas coordenadas en 'Y' si las celdas + 1 están vacías
            } else if (y + val === cuadricula.length || cuadricula[y + val][x]) return false; // Indica que no se puede mover si llega al limite del tablero o si la celda de la cuadricula esta ocupada
          }
        }
      }

      // Si los longitudes coinciden indica que se puede mover
      if (eje === "x" && move.length === figura.length) return true;
      else if (eje === "y" && move.length === figura[0].length) return true;
      else return false;
    } else {
      return false; // No se puede mover si se encuentra en los límites del tablero
    }
  }

  // Mueve o establece la figura, indica si el juego a terminado y llama otras funciones
  function mover(eje: "x" | "y", val: 1 | -1, isMoveAutomatic = false): void {
    if (countStopMove.getSeconds() > 0) {
      const mover = canMove(eje, val);

      if (mover) {
        // Si la figura se puede mover se borra la posición, se actualizan las coordenadas, se dibuja en su nueva posición, y se reinicia el tiempo para volver a llamar la función
        eliminarFigura();

        coorXPrevious = coorX;
        if (eje === "x") coorX += val;
        else if (eje === "y") {
          coorY += val;
          updateTime = 0;
        }

        actualizarFigura();

        if (soundsEnabled === true) soundMove.play();
        if (isMoveAutomatic === false) countStopMove.setSeconds(0); // Resetea el conteo si el movimiento no fue automático (Función updateGame)
      } else if (eje === "y" && !mover) {
        actualizarFigura(); // Actualiza los atributos data- de la figura actual

        // Data para la nueva figura
        figura = cellNewFigure;
        coorX = Math.floor((blockCountX - figura[0].length) / 2);
        coorY = 0;
        updateTime = 0;

        if (canShow()) {
          deleteRow();

          // Permite que se establezca el valor de timeStop
          setTimeout(() => {
            setTimeout(() => {
              if (newFigure.current) newFigure.current.textContent = "";
              figurePaused = false;
              updateTime = 0;

              enabledBtns("addEventListener", false);
              crearFigura();
              showNewFigure();

              if (isMoveAutomatic === false) countStopMove.setSeconds(0);
            }, timeStop);
          }, 10);
        } else {
          gameOver = true;
        }
      }
    }
  }

  // Verifica si hay filas enteras ocupadas, si es que hay las elimina y suma los puntos
  function deleteRow(): void {
    enabledBtns("removeEventListener", true);
    timeStop = 200;
    let sumPoints = points; // Puntos actuales
    let filasBorradas = 0; // Hace un conteo de las filas borradas para ver que audio va a sonar
    let lastIndexRows: number; // Índices de la ultima fila borrada

    for (let row = 0; row < cuadricula.length; row++) {
      if (cuadricula[row].every((val) => !!val)) {
        figurePaused = true;
        timeStop = 1000;
        filasBorradas++;
        lastIndexRows = row;

        cuadricula[row].forEach((point) => (points += point === 1 ? 13 : 19)); // Suma los puntos de las celdas comunes y especiales
        cuadricula.splice(row, 1); // Borra la fila
        cuadricula.unshift(Array.from({ length: blockCountX }, () => null)); // Agrega una nueva al principio la nueva fila

        // Activa el sonido
        if (soundsEnabled === true) {
          if (filasBorradas === 1) soundCompleteLine.play();
          if (filasBorradas === 3) {
            soundCompleteLine2.currentTime = 0.2;
            soundCompleteLine2.play();
          }
        }

        // Anima todas las columnas de la fila del tablero
        document.querySelectorAll(`.${game.background__cell}[data-y='${row}']`).forEach((cell) => {
          setTimeout(() => cell.classList.add(`${game["background-cell-delete"]}`), 0.0001);
        });

        // Remueve todas las columnas
        document.querySelectorAll(`.${game.cell__figure}[data-y='${row}']`).forEach((cell) => cell.remove());

        // Dibuja las celdas ocupadas en su nueva posición
        if (filasBorradas === 1) {
          setTimeout(() => {
            let setCellPosition = lastIndexRows; // Establece las filas en su nueva posición

            // Recorre las filas desde la ultima fila borrada hasta la primera fila del tablero
            for (let y = lastIndexRows - 1; y >= 0; y--) {
              const cells: NodeListOf<HTMLDivElement> = document.querySelectorAll(
                `.${game.cell__figure}[data-y='${y}']`,
              );

              if (cells.length > 0) {
                // Si hay filas con una o mas celdas
                cells.forEach((cell) => {
                  const dataX = cell.getAttribute("data-x");

                  if (dataX) {
                    const numberDataX = parseInt(dataX);

                    cell.setAttribute("data-y", `${setCellPosition}`);
                    cell.style.transform = `translate(${numberDataX * blockSize}px, ${setCellPosition * blockSize}px)`;
                  }
                });

                setCellPosition--;
              }
            }
          }, 500);
        }
      }
    }

    setTimeout(() => {
      removeClass(`${game["background-cell-delete"]}`); // Desactiva la animación de filas borradas

      if (sumPoints !== points) {
        // Anima el incremento de puntos
        const sumador = setInterval(() => {
          if (sumPoints > points) clearInterval(sumador);
          else {
            if (pointsGame.current) {
              pointsGame.current.textContent = `${sumPoints}`;
              sumPoints++;
            }
          }
        }, 5);
      }
    }, 500);
  }

  // Rota la figura si es que puede hacerlo
  function rotarFigura(): void {
    let comodinX = 0; // Índices de la figuraRotada
    const figuraRotada: (null | 1 | 2)[][] = [];
    const figureCellRotate: (HTMLDivElement | null)[][] = [];

    // Rota la figura empezando en la ultima columna hasta la primera
    for (let y = 0; y < figura.length; y++) {
      for (let x = figura[y].length - 1; x >= 0; x--) {
        if (!figuraRotada[comodinX]) figuraRotada[comodinX] = [figura[y][x]];
        else figuraRotada[comodinX].push(figura[y][x]);

        if (!figureCellRotate[comodinX]) figureCellRotate[comodinX] = [figureCells[y][x]];
        else figureCellRotate[comodinX].push(figureCells[y][x]);

        if (x - 1 !== -1) comodinX += 1;
        else comodinX = 0;
      }
    }

    const yLess = figura.length - figuraRotada.length; // Evita que al rotar la figura pueda haber errores en la coordenada Y
    if (cuadricula[coorY + yLess] && coorX + figuraRotada[0].length - 1 < cuadricula[0].length) {
      // Verifica si la fila existe y si la columna de la figura rotada no sobrepasa los limites del canvas
      eliminarFigura();

      if (cuadricula[coorY + yLess][coorX + figuraRotada.length - 1] === null) {
        for (let y = 0; y < figuraRotada.length; y++) {
          for (let x = 0; x < figuraRotada[y].length; x++) {
            if (cuadricula[coorY + y + yLess][coorX + x] !== null && figuraRotada[y][x]) {
              actualizarFigura();
              return; // Si alguna celda de la figura rotada ya esta ocupada no rota
            }
          }
        }

        // Si todas están vacías se establece la coordenada 'Y' fija actual y se dibuja la la figura
        coorY += yLess;
        figura = figuraRotada;
        figureCells = figureCellRotate;
        actualizarFigura();
        calcularPuntoMaximo();
      }
    }
  }

  // Mueve la figura hasta su punto máximo en 'Y'
  function puntoMaximo(): void {
    if (itMayFall && !figurePaused && countStopMove.getSeconds() > 0) {
      if (soundsEnabled) {
        soundFall.currentTime = 1;
        soundFall.playbackRate = 0.6;
        soundFall.play();
      }

      figurePaused = true;
      enabledBtns("removeEventListener", true);
      removeClass(`${game["background-cell-down"]}`);
      eliminarFigura();

      const countRows = coorFigurebellow + figura.length - 1 - coorY; // Cantidad de filas que tendrán la animación
      const countOpacity = parseFloat((1 / countRows).toFixed(3)); // Cantidad de opacidad
      let opacidad = countOpacity; // Baja la opacidad a medida que llega a las ultimas filas

      for (let fila = coorY; fila < coorFigurebellow + figura.length; fila++) {
        for (let columna = coorX; columna < coorX + figura[0].length; columna++) {
          const cell = document.querySelector(`.${game.background__cell}[data-x='${columna}'][data-y='${fila}']`);
          if (cell instanceof HTMLDivElement) cell.style.backgroundColor = `rgba(0, 0, 255, ${opacidad})`;
        }

        opacidad += countOpacity;
      }

      // Baja la figura hasta su punto máximo
      coorY = coorFigurebellow;
      actualizarFigura();

      setTimeout(() => {
        // Establece la figura como fija y restablece la animacion
        mover("y", 1);

        const cells: NodeListOf<HTMLDivElement> = document.querySelectorAll(`.${game.background__cell}[style]`);
        cells.forEach((cell) => (cell.style.backgroundColor = "#000d"));
      }, 250);
    }
  }

  // Dibuja la siguiente figura al lado de los puntos
  function showNewFigure(): void {
    cellNewFigure = obtenerFigura(); // Obtiene la siguiente figura

    // Da las dimensiones y celdas en css al contenedor
    if (newFigure.current) {
      newFigure.current.style.width = `${cellNewFigure[0].length * blockSize}px`;
      newFigure.current.style.height = `${cellNewFigure.length * blockSize}px`;
      newFigure.current.style.marginBottom = `${cellNewFigure.length === 1 ? blockSize : 0}px`;
      newFigure.current.style.gridTemplateColumns = `repeat(${cellNewFigure[0].length}, 1fr)`;
      newFigure.current.style.gridTemplateRows = `repeat(${cellNewFigure.length}, 1fr)`;
    }

    // Agrega los estilos parecidos del tablero a los hijos y animación de flasheo a celdas especiales
    for (let y = 0; y < cellNewFigure.length; y++) {
      for (let x = 0; x < cellNewFigure[y].length; x++) {
        const div = document.createElement("div");

        div.classList.add(cellNewFigure[y][x] ? `${game.occupied_cell}` : `${game.empty_cell}`);
        if (cellNewFigure[y][x] === 2) div.style.animation = "cell_flash .7s infinite";

        if (newFigure.current) newFigure.current.appendChild(div);
      }
    }
  }

  // Indica la accion basada en los eventos de teclado
  function handleKeyDown(e: React.KeyboardEvent<Document>): void {
    const keyDown: string = e.code;

    // Mover en eje 'X, Y', rotar y establecer la figura a su punto Y máximo
    if (keyDown === "ArrowUp") rotarFigura();
    else if (countStopMove.getSeconds() > 0) {
      if (keyDown === "ArrowLeft") mover("x", -1);
      else if (keyDown === "ArrowRight") mover("x", 1);
      else if (keyDown === "ArrowDown") mover("y", 1);
      else if (keyDown === "Space") puntoMaximo();
    }
  }

  // Habilita o deshabilita los botones y eventos del juego
  function enabledBtns(event: "addEventListener" | "removeEventListener", valueBtns: boolean): void {
    document[event]("keydown", handleKeyDown as unknown as EventListener);
    document.querySelectorAll(`.${game.controls} button`).forEach((btn) => {
      if (btn instanceof HTMLButtonElement) btn.disabled = valueBtns;
    });
  }

  // Habilita o des habilita los sonidos
  function setSoundsGame() {
    soundsEnabled = soundsEnabled === true ? false : true; // Si esta habilitado lo des habilita o viceversa
    localStorage.setItem("sounds-enabled", `${soundsEnabled}`);

    if (btnSound.current) {
      btnSound.current.classList.remove(soundsEnabled === true ? `${game.red}` : `${game.green}`);
      btnSound.current.classList.add(soundsEnabled === true ? `${game.green}` : `${game.red}`);
    }

    if (soundsEnabled === true) {
      soundGame.currentTime = 0;
      soundGame.play();
    } else soundGame.pause();
  }

  // Muestra el modal remueve eventos y detiene temporizadores
  function handleModalPaused(): void {
    if (gamePaused === false) {
      // Pause totalmente el juego
      if (soundsEnabled === true) soundBtnPaused.play();

      gamePaused = true;
      enabledBtns("removeEventListener", true);

      if (modalPaused.current && btnSound.current) {
        modalPaused.current.style.display = "grid";
        btnSound.current.classList.add(soundsEnabled === true ? `${game.green}` : `${game.red}`); // Si el icono esta habilitado o no
      }

      clearInterval(intervalTime);
      clearInterval(moveTimeStop);
    } else if (gamePaused === true) {
      // Des pausa el juego
      enabledBtns("addEventListener", true);
      gamePaused = false;

      if (modalPaused.current) modalPaused.current.style.display = "none";
      intervalTime = setInterval(() => countMoreSpeed.setSeconds(countMoreSpeed.getSeconds() + 1), 1000);
      moveTimeStop = setInterval(() => countStopMove.setSeconds(countStopMove.getSeconds() + 1), sumTimeStop);
    }
  }

  return (
    <div className={game.game__tetris}>
      <div className={game.pausedBackground} ref={modalPaused}>
        <div className={game.paused__panel}>
          <h1>Game Paused</h1>
          <button
            onClick={() => {
              handleModalPaused();
            }}
            role="button"
            aria-label="Continuar Juego"
          >
            Continue
          </button>
          <button
            onClick={() => {
              gameOver = true;
              handleModalPaused();
            }}
            role="button"
            aria-label="Resetear Juego"
          >
            Reset
          </button>
          <button
            className={`material-symbols-outlined ${game.panel_btn_sound}`}
            onClick={() => {
              setSoundsGame();
            }}
            ref={btnSound}
            role="button"
            aria-label="Volumen"
          >
            volume_up
          </button>
        </div>
      </div>{" "}
      {/* Modal de Juego pausado */}
      <StatusGame
        blockSize={blockSize}
        points={points}
        h4={statusH4}
        button={statusButton}
        pointsGame={pointsGame}
        newFigure={newFigure}
        modal={() => handleModalPaused()}
      />{" "}
      {/* Estado del juego */}
      <div
        className={game.background}
        style={{ width: `${blockSize * blockCountX + 2}px`, height: `${blockSize * blockCountY + 2}px` }}
        ref={container}
      >
        {cuadricula.map((fila, filaIndex) => {
          return fila.map((_, columnaIndex) => {
            return (
              <div
                key={`${filaIndex}-${columnaIndex}`}
                className={game.background__cell}
                data-x={columnaIndex}
                data-y={filaIndex}
              ></div>
            );
          });
        })}
      </div>{" "}
      {/* Tablero */}
      {controls ? <GameControls functions={[mover, rotarFigura, puntoMaximo]} button={fallEnabled} /> : []}
      {over ? <GameOver setOver={setOver} /> : null} {/* Modal de juego terminado */}
    </div>
  );
}

export default Game;
