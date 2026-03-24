import { gameFigures } from "../utils/utils";

// Devuelve una figura aleatoria
export function getFigure(): (null | 1 | 2)[][] {
  return gameFigures[Math.floor(Math.random() * gameFigures.length)];
}
