export const root = document.querySelector(".root"); // main.tsx & tetris.tsx

// startModal.tsx
// Figuras de fondo
export const figurasFondo = [
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, null],
    [null, 1, 1],
  ],
  [
    [null, 1],
    [1, 1],
    [1, null],
  ],
  [
    [null, 1, 1],
    [1, 1, null],
  ],
  [
    [1, null],
    [1, 1],
    [null, 1],
  ],
  [
    [1, 1, 1],
    [null, 1, null],
  ],
  [
    [null, 1, null],
    [1, 1, 1],
  ],
  [
    [1, null],
    [1, 1],
    [1, null],
  ],
  [
    [null, 1],
    [1, 1],
    [null, 1],
  ],
  [
    [1, 1, 1],
    [1, null, null],
  ],
  [
    [1, null],
    [1, null],
    [1, 1],
  ],
  [
    [null, null, 1],
    [1, 1, 1],
  ],
  [
    [1, 1],
    [null, 1],
    [null, 1],
  ],
  [
    [1, 1, 1],
    [null, null, 1],
  ],
  [
    [1, 1],
    [1, null],
    [1, null],
  ],
  [
    [1, null, null],
    [1, 1, 1],
  ],
  [
    [null, 1],
    [null, 1],
    [1, 1],
  ],
];

// tetris.tsx
// Conteo para empezar el juego
export const seconds = [
  [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [null, null, null, null, 1, 1],
    [null, null, null, 1, 1, null],
    [null, null, 1, 1, 1, 1],
    [null, null, null, null, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [null, 1, 1, 1, 1, null],
  ], // 3
  [
    [null, 1, 1, 1, 1, null],
    [1, 1, 1, 1, 1, 1],
    [1, 1, null, null, 1, 1],
    [null, null, null, 1, 1, 1],
    [null, null, 1, 1, 1, null],
    [null, 1, 1, 1, null, null],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ], // 2
  [
    [1, 1, 1],
    [1, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
  ], // 1
];

// Figuras en juego
export const figuras: (null | 1)[][][] = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [1, 1, null],
    [null, 1, 1],
  ], // Z
  [
    [null, 1, 1],
    [1, 1, null],
  ], // S
  [
    [1, 1, 1],
    [null, 1, null],
  ], // T
  [
    [1, 1, 1],
    [1, null, null],
  ], // L
  [
    [1, 1, 1],
    [null, null, 1],
  ], // J
];

// Toda la musical e imágenes
const {
  VITE_SOUND_GAME,
  VITE_SOUND_OVER,
  VITE_SOUND_COUNT,
  VITE_SOUND_START,
  VITE_SOUND_MOVE,
  VITE_SOUND_FALL,
  VITE_SOUND_COMPLETELINE,
  VITE_SOUND_COMPLETELINE2,
  VITE_SOUND_PAUSED,
  VITE_SOUND_NOMOREFIGURE,
  VITE_IMAGE_CELLSPECIAL,
} = import.meta.env;

export const soundGame = new Audio(VITE_SOUND_GAME);
export const soundGameOver = new Audio(VITE_SOUND_OVER);
export const soundCount = new Audio(VITE_SOUND_COUNT);
export const soundStart = new Audio(VITE_SOUND_START);
export const soundMove = new Audio(VITE_SOUND_MOVE);
export const soundFall = new Audio(VITE_SOUND_FALL);
export const soundCompleteLine = new Audio(VITE_SOUND_COMPLETELINE);
export const soundCompleteLine2 = new Audio(VITE_SOUND_COMPLETELINE2);
export const soundBtnPaused = new Audio(VITE_SOUND_PAUSED);
export const soundNoMoreFigure = new Audio(VITE_SOUND_NOMOREFIGURE);
export const star = new Image(); // Imagen para celdas especiales
star.src = VITE_IMAGE_CELLSPECIAL;

// Configuracion de los audios
soundGame.loop = true;
soundGame.volume = 0.2;
soundGameOver.volume = 0.5;
soundNoMoreFigure.volume = 0.4;
soundCount.volume = 0.5;
soundStart.volume = 0.5;
soundMove.volume = 0.5;
soundCompleteLine.volume = 0.7;
soundCompleteLine2.volume = 1;
soundFall.volume = 0.5;
soundBtnPaused.volume = 0.5;
soundBtnPaused.volume = 0.5;