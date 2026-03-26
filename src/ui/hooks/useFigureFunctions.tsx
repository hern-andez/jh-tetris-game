import React, { SetStateAction } from "react";
import { getDivCell, removeClass } from "../../features/features";
import { soundMove } from "../../utils/utils";

type UseTetrisProps = {
  nextFigure: (null | 1 | 2)[][];
  setNextFigure: React.Dispatch<SetStateAction<(null | 1 | 2)[][]>>;
  className: CSSModuleClasses;
  gridContainer: React.MutableRefObject<null | HTMLDivElement>;
  figureCells: React.MutableRefObject<(null | HTMLDivElement)[][]>; // Indica la nueva posición de cada celda cuando rota la figura
  figure: React.MutableRefObject<(null | 1 | 2)[][]>;
  grid: React.MutableRefObject<(null | 1 | 2)[][]>;
  blockCountX: React.MutableRefObject<number>;
  coorX: React.MutableRefObject<number>;
  coorY: React.MutableRefObject<number>;
  reflectionCoor: React.MutableRefObject<number>;
  coorXPrevious: React.MutableRefObject<number>;
  couldItFall: React.MutableRefObject<boolean>;
  countStopMove: React.MutableRefObject<Date>;
  updateTime: React.MutableRefObject<number>;
  soundsEnabled: React.MutableRefObject<boolean>;
};

// Hook que tendrá las funciones principales del juego
function useFigureFunctions({
  nextFigure,
  setNextFigure,
  className,
  gridContainer,
  figureCells,
  figure,
  grid,
  blockCountX,
  coorX,
  coorY,
  reflectionCoor,
  coorXPrevious,
  couldItFall,
  countStopMove,
  updateTime,
  soundsEnabled,
}: UseTetrisProps) {
  /**
   * Crea la figura y la renderiza en el DOM
   */
  function create(): void {
    figureCells.current = []; // Vaciar para guardar el estado de la nueva figura

    figure.current.forEach((row, y) => {
      figureCells.current[y] = []; // Crea la fila de la figura

      row.forEach((col, x) => {
        if (col === null) figureCells.current[y].push(null);
        else {
          // Crea la figura en el container
          const div = document.createElement("div");
          div.classList.add(`${className.figure__created}`);

          // La posiciona visualmente (la figura cambiara su posición en la cuadricula solo con modificar las variables --coor)
          div.style.setProperty("--coor-x", (coorX.current + x) as unknown as string);
          div.style.setProperty("--coor-y", (coorY.current + y) as unknown as string);

          // Guarda cada div en el mismo estado en el que esta la figura
          figureCells.current[y].push(div);
          if (gridContainer.current) gridContainer.current.appendChild(div);
        }
      });
    });

    fallingReflex(); // Se muestra el reflejo al crearse la figura
  }

  /**
   * Muestra el reflejo de la figura en su punto mas bajo
   */
  function fallingReflex(): void {
    removeClass({ container: gridContainer.current, cssModule: className, className: "figure--reflex" }); // Borra el reflejo anterior

    // Evita mostrar el reflejo cuando la figura llaga a la coorY del reflejo que colisiono con el borde inferior del grid
    if (
      gridContainer.current &&
      coorY.current + figure.current.length - 1 < grid.current.length - figure.current.length
    ) {
      const cellCoors: number[][] = []; // Coordenadas de las celdas ocupadas mas bajas de la figura
      let reflecCoor = 0;

      // Obtiene las coordenadas ocupadas mas bajas de la figura, Ejemplo de figura
      // [1, 1, 1,]
      // [1, null, null], cellCoor = [[1,0], [2,0], [0,1]] por que son las coordenada donde abajo no hay otra celda (abajo de [0,0] esta la celda [0,1] por eso no se guarda en cellCoors)
      figure.current.forEach((row, y) => {
        row.forEach((col, x) => {
          if (col && figure.current[y + 1]) {
            if (figure.current[y + 1][x] === null) cellCoors.push([x, y]);
          } else if (col) {
            cellCoors.push([x, y]);
          }
        });
      });

      // obtiene la coordenada máxima en 'Y'
      for (let row = coorY.current + figure.current.length; row < grid.current.length; row++) {
        if (reflecCoor) break;

        for (let coorFigure = 0; coorFigure < cellCoors.length; coorFigure++) {
          if (
            row === grid.current.length - figure.current.length &&
            coorFigure === cellCoors.length - 1 &&
            grid.current[cellCoors[coorFigure][1] + row][cellCoors[coorFigure][0] + coorX.current] === null
          ) {
            // Mostrara el reflejo de la figura en la ultima capa de la cuadricula por que no encontró celdas ocupadas con las que pudiera colisionar la figura al caer
            reflecCoor = grid.current.length - figure.current.length;
            break;
          } else if (grid.current[cellCoors[coorFigure][1] + row]) {
            if (grid.current[cellCoors[coorFigure][1] + row][cellCoors[coorFigure][0] + coorX.current] !== null) {
              // Mostrara el reflejo por encima de una figura ya estática que encontró debajo de la figura en movimiento
              reflecCoor = row - 1;
              break;
            }
          }
        }
      }

      if (coorY.current + figure.current.length - 1 < reflecCoor) {
        // Muestra el reflejo si la figura no ha llegado a la coordenada del reflejo (por que el reflejo se mostraría incompleto)
        reflectionCoor.current = reflecCoor; // guarda la coordenada máxima para la función puntoMáximo
        couldItFall.current = true; // Indica que la figura si puede caer

        figure.current.forEach((row, y) => {
          row.forEach((col, x) => {
            if (col) {
              const [dataX, dataY] = [x + coorX.current, y + reflecCoor];
              const divCell = getDivCell({ container: gridContainer.current as Element, dataY, dataX, className });

              // Da tiempo para que se quite el reflejo anterior (por que en este nuevo reflejo las celdas no tienen la animación sincronizada)
              setTimeout(() => {
                if (divCell) divCell.classList.add(className["figure--reflex"]);
              }, 1);
            }
          });
        });
      } else couldItFall.current = false; // Deshabilita el botón de caída rápida si la figura esta en su punto máximo
    }
  }

  /**
   * Actualiza la posición de la figura cuando se mueve, rota, etc
   */
  function updatePosition(): void {
    // Actualiza la posición
    figure.current.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col !== null) {
          const cell = figureCells.current[y][x]; // Div representando la celda

          if (cell) {
            // Actualiza las variables
            cell.style.setProperty("--coor-x", (coorX.current + x) as unknown as string);
            cell.style.setProperty("--coor-y", (coorY.current + y) as unknown as string);
          }
        }
      });
    });

    const coorFigure = coorY.current + figure.current.length - 1;

    if (coorFigure === grid.current.length - figure.current.length || coorFigure === reflectionCoor.current) {
      // Remueve el reflejo y deshabilita la caída rápida cuando la figura llega a la coordenada del reflejo
      removeClass({ container: gridContainer.current, cssModule: className, className: "figure--reflex" });
      couldItFall.current = false;
    }

    if (coorXPrevious.current !== coorX.current) fallingReflex(); // Agrega el reflejo cuando cambia coorX (por que si cambia coorY el reflejo debería ser el mismo)
  }

  /**
   * Valida si una figura puede moverse en un eje (X o Y) sin colisionar ni salirse del grid
   * @param eje Eje donde se moverá la figura, lados (x), abajo (y)
   * @param val Valor de si aumentara o disminuirá la coorX o coorY, movimiento a la izquierda -1 (por que disminuirá la coorX), derecha 1 (por que aumentara la coorX), abajo 1 (por que esta aumentando la coorY para hacer que la figura baje)
   * @returns Booleano que indica si puede hacer el movimiento deseado (a los lados o abajo)
   */
  function canMove(eje: "x" | "y", val: 1 | -1): boolean {
    const dx = eje === "x" ? val : 0;
    const dy = eje === "y" ? val : 0;

    for (let y = 0; y < figure.current.length; y++) {
      for (let x = 0; x < figure.current[0].length; x++) {
        if (!figure.current[y][x]) continue; // Si esta celda de la figura está vacía, ignorar

        const newX = coorX.current + x + dx;
        const newY = coorY.current + y + dy;

        // Validar límites del grid
        if (newX < 0 || newX >= grid.current[0].length || newY < 0 || newY >= grid.current.length) return false;

        // Validar colisión
        if (grid.current[newY][newX] !== null) return false;
      }
    }

    return true; // Si se puede mover
  }

  /**
   * Mueve o establece la figura, indica si el juego a terminado y llama otras funciones
   * @param eje Eje en el que se moverá la figura
   * @param val Valor de si aumentara o disminuirá la coorX o coorY, movimiento a la izquierda -1 (por que disminuirá la coorX), derecha 1 (por que aumentara la coorX), abajo 1 (por que esta aumentando la coorY para hacer que la figura baje)
   * @param isMoveAutomatic Indica si el movimiento fue por caída automatica
   */
  async function move(eje: "x" | "y", val: 1 | -1, isMoveAutomatic = false): Promise<void> {
    // if (countStopMove.current.getSeconds() === 0) return;

    const mover = canMove(eje, val);
    if (mover) {
      // Actualiza las coordenadas
      coorXPrevious.current = coorX.current;

      if (eje === "x") coorX.current += val;
      else if (eje === "y") {
        coorY.current += val;
        updateTime.current = 0;
      }

      updatePosition(); // Actualiza la posición de la figura

      // Reproduce sonido y resetea el conteo solo si el movimiento fue manual y no automatico
      if (soundsEnabled.current === true) soundMove.play();
      if (isMoveAutomatic === false) countStopMove.current.setSeconds(0);
    } else if (eje === "y" && !mover) {
      staticPiece();

      // Data para la nueva figura
      figure.current = nextFigure;
      coorX.current = Math.floor((blockCountX.current - figure.current[0].length) / 2);
      coorY.current = 0;
      updateTime.current = 0;

      if (canShow()) {
        // await deleteRow();
        // Permite que se establezca el valor de timeStop
        // setTimeout(() => {
        // figurePaused = false;
        updateTime.current = 0;
        console.log(setNextFigure);
        // enabledBtns("addEventListener", false);
        create();
        if (isMoveAutomatic === false) countStopMove.current.setSeconds(0);
        // }, timeStop);
      }
      // else {gameOver = true}
    }
  }

  function staticPiece() {
    if (gridContainer.current === null) return;

    for (let y = 0; y < figure.current.length; y++) {
      const divRow = gridContainer.current.querySelector(`.${className.container__row}[data-y="${y + coorY.current}"]`);

      for (let x = 0; x < figure.current[y].length; x++) {
        if (figure.current[y][x] && divRow) {
          const divCol = divRow.querySelector(`.${className.row__col}[data-x="${x + coorX.current}"]`);

          if (divCol) {
            const divCell = document.createElement("div");
            divCell.classList.add(className.cell__ocupied);

            grid.current[y + coorY.current][x + coorX.current] = 1;
            divCol.appendChild(divCell);
          }
        }
      }
    }
  }

  /**
   * Finaliza el juego si una celda de la nueva figura ya esta ocupada en el tablero
   * @returns
   */
  function canShow(): boolean {
    for (let y = coorY.current; y - coorY.current < figure.current.length; y++) {
      for (let x = coorX.current; x - coorX.current < figure.current[y - coorY.current].length; x++) {
        if (grid.current[y][x] && figure.current[y - coorY.current][x - coorX.current]) return false;
      }
    }

    return true;
  }

  // // Verifica si hay filas enteras ocupadas, si es que hay las elimina y suma los puntos
  // async function deleteRow(): Promise<void> {
  //   return new Promise((res) => {
  //     enabledBtns("removeEventListener", true);
  //     timeStop = 200;
  //     let sumPoints = points; // Puntos actuales
  //     let filasBorradas = 0; // Hace un conteo de las filas borradas para ver que audio va a sonar
  //     let lastIndexRows: number; // Índices de la ultima fila borrada

  //     for (let row = 0; row < grid.current.length; row++) {
  //       if (grid.current[row].every((val) => !!val)) {
  //         figurePaused = true;
  //         timeStop = 1000;
  //         filasBorradas++;
  //         lastIndexRows = row;

  //         grid.current[row].forEach((point) => (points += point === 1 ? 13 : 19)); // Suma los puntos de las celdas comunes y especiales
  //         grid.current.splice(row, 1); // Borra la fila
  //         grid.current.unshift(Array.from({ length: blockCountX.current }, () => null)); // Agrega una nueva al principio la nueva fila

  //         // Activa el sonido
  //         if (soundsEnabled === true) {
  //           if (filasBorradas === 1) soundCompleteLine.play();
  //           if (filasBorradas === 3) {
  //             soundCompleteLine2.currentTime = 0.2;
  //             soundCompleteLine2.play();
  //           }
  //         }

  //         // Anima todas las columnas de la fila del tablero
  //         document.querySelectorAll(`.${className.background__cell}[data-y='${row}']`).forEach((cell) => {
  //           setTimeout(() => cell.classList.add(`${className["background-cell-delete"]}`), 0.0001);
  //         });

  //         // Remueve todas las columnas
  //         document.querySelectorAll(`.${className.cell__figure}[data-y='${row}']`).forEach((cell) => cell.remove());

  //         // Dibuja las celdas ocupadas en su nueva posición
  //         if (filasBorradas === 1) {
  //           setTimeout(() => {
  //             let setCellPosition = lastIndexRows; // Establece las filas en su nueva posición

  //             // Recorre las filas desde la ultima fila borrada hasta la primera fila del tablero
  //             for (let y = lastIndexRows - 1; y >= 0; y--) {
  //               const cells: NodeListOf<HTMLDivElement> = document.querySelectorAll(
  //                 `.${className.cell__figure}[data-y='${y}']`,
  //               );

  //               if (cells.length > 0) {
  //                 // Si hay filas con una o mas celdas
  //                 cells.forEach((cell) => {
  //                   const dataX = cell.getAttribute("data-x");

  //                   if (dataX) {
  //                     const numberDataX = parseInt(dataX);

  //                     cell.setAttribute("data-y", `${setCellPosition}`);
  //                     cell.style.transform = `translate(${numberDataX * blockSize}px, ${setCellPosition * blockSize}px)`;
  //                   }
  //                 });

  //                 setCellPosition--;
  //               }
  //             }
  //           }, 500);
  //         }
  //       }
  //     }

  //     setTimeout(() => {
  //       removeClass(`${className["background-cell-delete"]}`); // Desactiva la animación de filas borradas

  //       if (sumPoints !== points) {
  //         // Anima el incremento de puntos
  //         const sumador = setInterval(() => {
  //           if (sumPoints > points) {
  //             clearInterval(sumador);
  //             res(true);
  //           } else {
  //             if (pointsgamecss.current) {
  //               pointsgamecss.current.textContent = `${sumPoints}`;
  //               sumPoints++;
  //             }
  //           }
  //         }, 5);
  //       }
  //     }, 500);
  //   });
  // }

  return { create, move };
}

export default useFigureFunctions;
