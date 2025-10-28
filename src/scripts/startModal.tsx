import { useEffect, useRef, useState } from "react";
import { figurasFondo, logo } from "./utilidades";
import modalcss from "../styles/start.module.css";

type GameModalProps = {
  setPlayer: (newState: number) => void;
  setControls: (newState: boolean) => void;
};

// Modal Inicial
export function GameModal({ setPlayer, setControls }: GameModalProps) {
  const [bCX, setBlockCountX] = useState(Math.floor(innerWidth / 25)); // Cantidad de columnas
  const [bCY, setBlockCountY] = useState(Math.floor(innerHeight / 25)); // Cantidad de filas
  let blockCountX = bCX;
  let blockCountY = bCY;
  const modal = useRef<null | HTMLDivElement>(null); // Contenedor
  const cuadricula: (null | 1)[][] = Array.from({ length: blockCountY }, () => Array(blockCountX).fill(null));
  let isGameOver = false; // Detiene la aparición de figuras en el fondo
  let iniciador: undefined | number = undefined; // Temporizador que muestra la interface
  let showFigure: undefined | number = undefined; // Temporizador que va mostrando las figuras en el fondo
  let dibujador: undefined | number = undefined; // Temporizador que va dibujando el logo
  let isRender = true; // Renderiza solo una vez la aparición de las figuras
  let firstRender = false;
  // Empieza a dibujar el logo en una coordenada x, y central
  let paintBlocksX = Math.round(blockCountX / 2) - 11;
  let paintBlocksY = Math.round(blockCountY / 2) - 4;

  // Muestra la interface inicial
  useEffect(() => {
    if (!firstRender) mostrarInterface();
  }, []);

  // Cuando la altura de screen aumenta las figuras que ya están estáticas pasan a estar en las nuevas filas que van apareciendo mientras que las que van cayendo siguen igual
  useEffect(() => {
    let rowForCols = blockCountY - 1; // Cantidad de nuevas filas

    // Empieza desde las nuevas filas hasta la primera fila de abajo a arriba
    for (let row = blockCountY - 1; row >= 0; row--) {
      const cellsCollisioned: NodeListOf<HTMLDivElement> = document.querySelectorAll(`
        .${modalcss.cell__ocupied}[data-collision='true'][data-y='${row}']
      `); // Busca celdas colisionadas en todas las filas

      if (cellsCollisioned.length > 0) {
        cellsCollisioned.forEach((cell) => {
          const dataX = cell.getAttribute("data-x");

          // Deja la celda actual vacia
          cell.classList.remove(`${modalcss.cell__ocupied}`);
          cell.setAttribute("data-collision", `false`);

          if (dataX) {
            const numDataX = parseInt(dataX);

            const newContainer = document.querySelector(
              `.${modalcss.modal__cell}[data-x='${numDataX}'][data-y='${rowForCols}']`
            ); // Nuevo lugar de la celda ocupada

            // Deja la nueva celda ocupada
            if (newContainer) {
              newContainer.classList.add(`${modalcss.cell__ocupied}`);
              newContainer.setAttribute("data-collision", `true`);
            }
          }
        });

        rowForCols--;
      }
    }
  }, [blockCountY]);

  function handleResizeChange(): void {
    // Cantidad de filas y columnas luego del resize
    const newBlockCountX = Math.round(innerWidth / 25);
    const newBlockCountY = Math.round(innerHeight / 25);

    if (blockCountX !== newBlockCountX || blockCountY !== newBlockCountY) {
      // Si hubo un cambio
      clearInterval(dibujador);
      document.querySelectorAll(`.${modalcss.modal__cell}`).forEach((cell) => (cell.textContent = "")); // Elimina el logo

      // Ajusta la cantidad de filas y columnas
      if (blockCountX !== newBlockCountX) setBlockCountX(newBlockCountX);
      else if (blockCountY !== newBlockCountY) setBlockCountY(newBlockCountY);

      // Establece la data para dibujar el logo en su nueva posicion
      blockCountX = newBlockCountX;
      blockCountY = newBlockCountY;
      paintBlocksX = Math.round(blockCountX / 2) - 11;
      paintBlocksY = Math.round(blockCountY / 2) - 4;

      if (blockCountX > 22 && blockCountY > 13) dibujarLogo(0); // Dibuja el logo en su nueva posicion
    }
  }

  function dibujarLogo(ms: number): void {
    let letra = 0; // Índice de letra del logo
    let fila = 0; // Índice  de fila de la letra
    let columna = 0; // Índice de columna de la fila

    dibujador = setInterval(() => {
      // Cuando encuentra una columna de la fila de la letra la muestra
      if (logo[letra][fila][columna]) {
        const cell = document.querySelector(
          `.${modalcss.modal__cell}[data-y='${paintBlocksY + fila}'][data-x='${paintBlocksX + columna}']`
        );
        const cellAnimation = document.createElement("div");

        cellAnimation.classList.add(modalcss.cell__animation);
        if (cell instanceof HTMLDivElement) cell.appendChild(cellAnimation);
      }

      // Luego de mostrarse se actualiza la siguiente columna, fila o letra  si es que hay y si no, se empieza a mostrar las figuras de fondo
      if (logo[letra][fila][columna + 1] !== undefined) {
        columna++;
      } else if (logo[letra][fila + 1] !== undefined) {
        fila++;
        columna = 0;
      } else if (logo[letra + 1] !== undefined) {
        paintBlocksX += logo[letra][0].length + 1;
        letra++;
        fila = 0;
        columna = 0;
      } else if (logo[letra + 1] === undefined) {
        Math.round(blockCountX / 2 - 11);

        clearInterval(dibujador);
        if (!showFigure) infoFiguras();
      }
    }, ms);
  }

  function mostrarInterface(): void {
    if (!iniciador) {
      window.addEventListener("resize", handleResizeChange);
      firstRender = true;

      // Dibuja el logo 'TETRIS' si cumple con un width y height, si no renderiza un modal
      if (blockCountX > 22 && blockCountY > 13) {
        iniciador = setTimeout(() => dibujarLogo(70), 1000);
      } else {
        // Muestra las figuras aunque el logo no cumpla con el screen deseado
        if (isRender) {
          isRender = false;
          infoFiguras();
        }
      }
    }
  }

  // Obtiene la figura, sus coordenadas y se verifica si puede aparcer en la cuadricula
  function infoFiguras(): void {
    showFigure = setInterval(() => {
      const figura = figurasFondo[Math.floor(Math.random() * figurasFondo.length)];
      const coorX = Math.floor(Math.random() * (blockCountX - 1 - figura[0].length));
      const coorY = 0;

      canShowFigure(figura, coorX, coorY);
    }, 5000);
  }

  // Muestra la figura si todas sus celdas están vacías en el tablero si no finaliza la aparición de nuevas figuras y opaca las celdas existentes
  function canShowFigure(figura: (number | null)[][], coorX: number, coorY: 0): void {
    // Si una celda (div) de la figura ya esta ocupada en el tablero finaliza la aparición de las figuras
    for (let y = 0; y < figura.length; y++) {
      if (isGameOver) break;

      for (let x = 0; x < figura[y].length; x++) {
        if (figura[y][x]) {
          const cell = document.querySelector(`.${modalcss.modal__cell}[data-x='${x + coorX}'][data-y='${y + coorY}']`);

          if (cell instanceof HTMLDivElement) {
            if (cell.getAttribute("data-collision") === "true") {
              isGameOver = true;
              break;
            }
          }
        }
      }
    }

    if (!isGameOver) mostrarFigura(figura, coorX, coorY); // Muestra la figura si se puede
    else {
      // Opaca las celdas existentes
      let index = 0;
      const cellsOcupied = document.querySelectorAll(`.${modalcss.cell__ocupied}`);

      const over = setInterval(() => {
        if (index === cellsOcupied.length) clearInterval(over);
        else {
          const cell = cellsOcupied[index];

          if (cell instanceof HTMLDivElement) {
            cell.style.backgroundColor = "#777d";
            index++;
          }
        }
      }, 20);

      clearInterval(showFigure);
    }
  }

  // Muestra la figura, la mueve en eje Y, la coliciona y guarda las celdas ocupadas en la cuadricula
  function mostrarFigura(figura: (number | null)[][], coorX: number, coorY: 0): void {
    addOrDeleteClass(figura, "add", coorX, coorY); // Dibuja la primera posición de la figura

    const figureDown: number[][] = []; // Guarda las coordenadas de los puntos mas bajo
    let isStatic = false; // Indica si la figura ha colicionado

    // Obtiene los puntos mas bajos de una figura para comprobar si puede seguir bajando
    for (let y = 0; y < figura.length; y++) {
      for (let x = 0; x < figura[y].length; x++) {
        if (figura[y][x] && figura[y + 1]) {
          if (figura[y + 1][x]) continue;
          else figureDown.push([x, y + 1]);
        } else if (figura[y][x]) {
          figureDown.push([x, y + 1]);
        }
      }
    }

    // Mueve la figura hacia abajo si es que el juego no ha terminado y comprueba si puede seguir bajando
    const movedorY = setInterval(() => {
      if (!isGameOver) {
        // Indica que la figura coliciono
        for (let i = 0; i < figureDown.length; i++) {
          const coorDown = figureDown[i];

          if (coorDown[0] + coorX < blockCountX) {
            const cell = document.querySelector(
              `.${modalcss.modal__cell}[data-x='${coorDown[0] + coorX}'][data-y='${coorDown[1] + coorY}']`
            );

            if (!cell) {
              isStatic = true;
              break; // Si coliciono en la ultima fila
            } else if (cell.getAttribute("data-collision") === "true") {
              isStatic = true;
              break; // Si coliciono con una celda ocupada
            }
          }
        }

        if (!isStatic) {
          // Si niguna celda de la figura coliciono se borra la posición actual y luego se dibuja la nueva
          addOrDeleteClass(figura, "remove", coorX, coorY);
          coorY++;
          addOrDeleteClass(figura, "add", coorX, coorY);
        } else {
          // Si colisiono se guardan la celdas en la cuadricula y se detiene el movedorY
          for (let y = 0; y < figura.length; y++) {
            for (let x = 0; x < figura[y].length; x++) {
              if (figura[y][x]) {
                const cell = document.querySelector(
                  `.${modalcss.cell__ocupied}[data-x='${x + coorX}'][data-y='${y + coorY}']`
                );

                if (cell instanceof HTMLDivElement) cell.setAttribute("data-collision", "true");
              }
            }
          }

          clearInterval(movedorY);
          return;
        }
      }
    }, 1000);
  }

  // Función que agrega o elimina clases a las celdas de la figura
  function addOrDeleteClass(figura: (number | null)[][], metodo: "add" | "remove", coorX: number, coorY: number) {
    for (let y = 0; y < figura.length; y++) {
      for (let x = 0; x < figura[y].length; x++) {
        if (figura[y][x]) {
          const div = document.querySelector(`.${modalcss.modal__cell}[data-x='${x + coorX}'][data-y='${y + coorY}']`);

          if (div instanceof HTMLDivElement) div.classList[metodo](`${modalcss.cell__ocupied}`);
        }
      }
    }
  }

  // Agrega o no los controles para el juego y detiene el intervalo de las figuras de fondo
  function handleClick(controls: boolean): void {
    window.removeEventListener("resize", handleResizeChange);
    isGameOver = true;
    clearInterval(showFigure);
    setPlayer(1);
    setControls(controls);
  }

  return (
    <div className={modalcss.modal} ref={modal} style={{ gridTemplateColumns: `repeat(${blockCountX}, 1fr)` }}>
      {bCX < 23 || bCY < 14 ? (
        <div className={modalcss.panel}>
          <h1>Play Tetris</h1>
          <button onClick={() => handleClick(true)}>Controls</button>
          <button onClick={() => handleClick(false)}>No Controls</button>
        </div> // Modal si es que el screen no cumple con medidas adecuadas
      ) : (
        <div
          className={modalcss.modal_btn_container}
          style={{ width: `${25 * 15}px`, top: `${(paintBlocksY + logo[0].length + 1) * 25}px` }}
        >
          <button
            className={modalcss.modal__btn}
            onClick={() => {
              handleClick(true);
            }}
          >
            Controls
          </button>
          <button
            className={modalcss.modal__btn}
            onClick={() => {
              handleClick(false);
            }}
          >
            No Controls
          </button>
        </div> // Los puros botones luego de que se dibuja el logo de TETRIS
      )}
      {cuadricula.map((fila, y) => {
        return fila.map((_, x) => (
          <div key={`${x}-${y}`} className={modalcss.modal__cell} data-collision={false} data-x={x} data-y={y}></div>
        )); // Cuadricula de fondo
      })}
    </div>
  );
}
