import React from "react";

type UseTetrisProps = {
  className: CSSModuleClasses;
  gridContainer: React.MutableRefObject<null | HTMLDivElement>;
  figureCells: React.MutableRefObject<(null | HTMLDivElement)[][]>; // Indica la nueva posición de cada celda cuando rota la figura
  figure: React.MutableRefObject<(null | 1 | 2)[][]>;
  grid: React.MutableRefObject<(null | 1 | 2)[][]>;
  blockSize: React.MutableRefObject<string>;
  coorX: React.MutableRefObject<number>;
  coorY: React.MutableRefObject<number>;
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
}: UseTetrisProps) {
  /**
   * Crea la figura y la renderiza en el DOM
   */
  function create(): void {
    figureCells.current = []; // Vaciar para guardar el estado de la nueva figura
    console.log(figure.current);

    figure.current.forEach((row, y) => {
      figureCells.current[y] = []; // Crea la fila de la figura

      row.forEach((col, x) => {
        if (col === null) figureCells.current[y].push(null);
        else {
          grid.current[y + coorY.current][x + coorX.current] = col; // Guarda cada celda de la nueva figura en su espacio correspondiente

          // Crea la figura en el container y la posiciona visualmente donde debería de ir
          const div = document.createElement("div");
          div.classList.add(`${className.figure}`);

          div.style.backgroundColor = col === 1 ? "red" : "#0ff";
          div.style.width = blockSize.current;
          div.style.transform = `translate(calc(${blockSize.current} * ${coorX.current + x} + ${coorX.current + x}px), calc(${blockSize.current} * ${coorY.current + y} + ${coorY.current + y}px))`;

          // Guarda cada div en el mismo estado en el que esta la figura
          figureCells.current[y].push(div);
          if (gridContainer.current) gridContainer.current.appendChild(div);
        }
      });
    });

    // calcularPuntoMaximo(); // Se muestra el reflejo al crearse la figura
  }

  return { create };
}

export default useTetrisFunctions;
