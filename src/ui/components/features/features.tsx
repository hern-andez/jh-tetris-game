import { gameFigures } from "../utils/utils";

/**
 * Devuelve una figura aleatorio
 * @returns Figura
 */
export function getFigure(): (null | 1 | 2)[][] {
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
    container.querySelectorAll(`.${cssModule[className]}`).forEach((element) => element.classList.remove(className));
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
