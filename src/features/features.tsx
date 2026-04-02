import { gameFigures } from "@utils/utils";

/**
 * Devuelve una figura aleatorio
 * @returns Figura
 */
export function getFigure(): (null | 1)[][] {
  return gameFigures[Math.floor(Math.random() * gameFigures.length)];
}

interface RemoveClassProps {
  container: HTMLDivElement | null;
  cssModule: CSSModuleClasses;
  className: "figure--reflex";
}
/**
 * Remueve clases de una lista de elementos como las del reflejo o cuando se elimina un fila completa
 * @param clases
 * figure--reflex > background-cell-down
 */
export function removeClass({ container, cssModule, className }: RemoveClassProps): void {
  if (container) {
    container
      .querySelectorAll(`.${cssModule[className]}`)
      .forEach((element) => element.classList.remove(cssModule[className]));
  }
}

interface GetDivCellProps {
  container: Element;
  dataY: number;
  dataX: number;
  className: CSSModuleClasses;
}
export function getDivCell({ container, dataY, dataX, className }: GetDivCellProps): HTMLDivElement {
  const divRow = container.querySelector(`.${className.container__row}[data-y="${dataY}"]`);

  if (divRow instanceof HTMLDivElement) {
    const cell = divRow.querySelector(`.${className.row__col}[data-x="${dataX}"]`);
    if (cell instanceof HTMLDivElement) return cell;
  }

  throw new Error("Cell not found");
}

interface GameProps {
  grid: React.MutableRefObject<(1 | null)[][]>;
  figure: React.MutableRefObject<(1 | null)[][]>;
  coorY: React.MutableRefObject<number>;
  coorX: React.MutableRefObject<number>;
}

/**
 * Finaliza el juego cuando la nueva figura a crear ya no cabe en la cuadricula (si alguna celda de la nueva figura ya esta ocupada en el tablero)
 * @returns Booleano que indica si el juego aun puede seguir
 */
export function canShow({ grid, figure, coorY, coorX }: GameProps): boolean {
  for (let y = coorY.current; y - coorY.current < figure.current.length; y++) {
    for (let x = coorX.current; x - coorX.current < figure.current[y - coorY.current].length; x++) {
      if (grid.current[y][x] && figure.current[y - coorY.current][x - coorX.current]) {
        return false; // Game Over
      }
    }
  }

  return true;
}

// Habilita o deshabilita los botones y eventos del juego
// export function enabledBtns(event: "addEventListener" | "removeEventListener", valueBtns: boolean): void {
//   document[event]("keydown", handleKeyDown as unknown as EventListener);
//   document.querySelectorAll(`.${gamecss.controls} button`).forEach((btn) => {
//     if (btn instanceof HTMLButtonElement) btn.disabled = valueBtns;
//   });
// }
