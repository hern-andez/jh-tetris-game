import React from "react";
import { getDivCell, removeClass } from "../features/features";

type UseTetrisProps = {
  className: CSSModuleClasses;
  gridContainer: React.MutableRefObject<null | HTMLDivElement>;
  figureCells: React.MutableRefObject<(null | HTMLDivElement)[][]>; // Indica la nueva posición de cada celda cuando rota la figura
  figure: React.MutableRefObject<(null | 1 | 2)[][]>;
  grid: React.MutableRefObject<(null | 1 | 2)[][]>;
  blockSize: React.MutableRefObject<string>;
  coorX: React.MutableRefObject<number>;
  coorY: React.MutableRefObject<number>;
  reflectionCoor: React.MutableRefObject<number>;
  coorXPrevious: React.MutableRefObject<number>;
  couldItFall: React.MutableRefObject<boolean>;
};

// Hook que tendrá las funciones principales del juego
function useTetrisFunctions({
  className,
  gridContainer,
  figureCells,
  figure,
  grid,
  blockSize,
  coorX,
  coorY,
  reflectionCoor,
  coorXPrevious,
  couldItFall,
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
          grid.current[y + coorY.current][x + coorX.current] = col; // Guarda cada celda de la nueva figura en su espacio correspondiente

          // Crea la figura en el container
          const div = document.createElement("div");
          div.classList.add(`${className.figure__created}`);

          // Le da medidas y la posiciona visualmente donde debería de ir (la figura cambiara su posición en la cuadricula solo con modificar las variables --coor)
          div.style.width = blockSize.current;
          div.style.setProperty("--coor-x", (coorX.current + x) as unknown as string);
          div.style.setProperty("--coor-y", (coorY.current + y) as unknown as string);
          div.style.transform = `translate(
            calc(${blockSize.current} * var(--coor-x) + calc(var(--coor-x) * 1px)),
            calc(${blockSize.current} * var(--coor-y) + calc(var(--coor-y) * 1px))
          )`;

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

    // Evita mostrar el reflejo y tumbarla en su punto bajo si la figura llega a la coordenada 'Y' donde estaba el reflejo
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
              const divRow = getDivCell({ container: gridContainer.current as Element, dataY, dataX, className });

              if (divRow) divRow.classList.add(className["figure--reflex"]);
            }
          });
        });
      } else couldItFall.current = false; // Deshabilita el botón de caída rápida si la figura esta en su punto máximo
    }
  }

  /**
   * Actualiza la posición de la figura cuando se mueve, rota, etc
   */
  function updateFigure(): void {
    // Actualiza la posición
    figure.current.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col !== null) {
          const cell = figureCells.current[y][x]; // Div representando la celda

          if (cell) {
            grid.current[coorY.current + y][coorX.current + x] = col; // Actualiza en la cuadricula

            // Actualiza las variables
            cell.style.setProperty("--coor-x", (coorX.current + x) as unknown as string);
            cell.style.setProperty("--coor-y", (coorY.current + y) as unknown as string);
          }
        }
      });
    });

    if (
      coorY.current + figure.current.length - 1 === grid.current.length - figure.current.length ||
      coorY.current + figure.current.length - 1 === reflectionCoor.current
    ) {
      // Remueve el reflejo y deshabilita la caída rápida cuando la figura llega a la coordenada del reflejo
      removeClass({ container: gridContainer.current, cssModule: className, className: "figure--reflex" });
      couldItFall.current = false;
    }

    if (coorXPrevious !== coorX) fallingReflex(); // Agrega el reflejo cuando cambia coorX (por que si cambia coorY el reflejo deberia ser el mismo)
  }

  console.log(updateFigure);
  return { create };
}

export default useTetrisFunctions;
