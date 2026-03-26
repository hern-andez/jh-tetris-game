import { useRef } from "react";
import { Icon } from "@iconify/react";

// import { figurasFondo } from "./utilidades";
import homecss from "./styles/home.module.css";

type HomeProps = {
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  setControls: React.Dispatch<React.SetStateAction<boolean>>;
  controls: boolean;
};

// Interfaz de inicio
function Home({ setStart, setControls, controls }: HomeProps) {
  // const [quantityX, setQuantityX] = useState(Math.floor(innerWidth / 50)); // Cantidad de columnas
  // const [quantityY, setQuantityY] = useState(Math.floor(innerHeight / 50)); // Cantidad de filas
  // let blockCountX = quantityX;
  // let blockCountY = quantityY;
  // const modal = useRef<null | HTMLDivElement>(null); // Contenedor
  const btnControls = useRef<null | HTMLButtonElement>(null); // Botón de controles
  // const firstRender = useRef(false);
  // const grid: (null | 1)[][] = Array.from({ length: blockCountY }, () => Array(blockCountX).fill(null));
  // let isGameOver = false; // Detiene la aparición de figuras en el fondo
  // let iniciador: undefined | number = undefined; // Temporizador que muestra la interface
  // let showFigure: undefined | number = undefined; // Temporizador que va mostrando las figuras en el fondo
  // let dibujador: undefined | number = undefined; // Temporizador que va dibujando el logo
  // let isRender = true; // Renderiza solo una vez la aparición de las figuras
  // Empieza a dibujar el logo en una coordenada x, y central
  // let paintBlocksX = Math.round(blockCountX / 2) - 11;
  // let paintBlocksY = Math.round(blockCountY / 2) - 4;

  // // Muestra la interface inicial
  // useEffect(() => {
  //   if (!firstRender.current) {
  //     firstRender.current = true;
  //     mostrarInterface();
  //   }
  // }, []);

  // // Cuando la altura de screen aumenta las figuras que ya están estáticas pasan a estar en las nuevas filas que van apareciendo mientras que las que van cayendo siguen igual
  // useEffect(() => {
  //   let rowForCols = blockCountY - 1; // Cantidad de nuevas filas

  //   // Empieza desde las nuevas filas hasta la primera fila de abajo a arriba
  //   for (let row = blockCountY - 1; row >= 0; row--) {
  //     const cellsCollisioned: NodeListOf<HTMLDivElement> = document.querySelectorAll(`
  //       .${homecss.cell__ocupied}[data-collision='true'][data-y='${row}']
  //     `); // Busca celdas colisionadas en todas las filas

  //     if (cellsCollisioned.length > 0) {
  //       cellsCollisioned.forEach((cell) => {
  //         const dataX = cell.getAttribute("data-x");

  //         // Deja la celda actual vacia
  //         cell.classList.remove(`${homecss.cell__ocupied}`);
  //         cell.setAttribute("data-collision", `false`);

  //         if (dataX) {
  //           const numDataX = parseInt(dataX);

  //           const newContainer = document.querySelector(
  //             `.${homecss.modal__cell}[data-x='${numDataX}'][data-y='${rowForCols}']`,
  //           ); // Nuevo lugar de la celda ocupada

  //           // Deja la nueva celda ocupada
  //           if (newContainer) {
  //             newContainer.classList.add(`${homecss.cell__ocupied}`);
  //             newContainer.setAttribute("data-collision", `true`);
  //           }
  //         }
  //       });

  //       rowForCols--;
  //     }
  //   }
  // }, [blockCountY]);

  // function handleResizeChange(): void {
  //   // Cantidad de filas y columnas luego del resize
  //   const newBlockCountX = Math.round(innerWidth / 25);
  //   const newBlockCountY = Math.round(innerHeight / 25);

  //   if (blockCountX !== newBlockCountX || blockCountY !== newBlockCountY) {
  //     // Si hubo un cambio
  //     clearInterval(dibujador);
  //     document.querySelectorAll(`.${homecss.modal__cell}`).forEach((cell) => (cell.textContent = "")); // Elimina el logo

  //     // Ajusta la cantidad de filas y columnas
  //     if (blockCountX !== newBlockCountX) setBlockCountX(newBlockCountX);
  //     else if (blockCountY !== newBlockCountY) setBlockCountY(newBlockCountY);

  //     // Establece la data para dibujar el logo en su nueva posicion
  //     blockCountX = newBlockCountX;
  //     blockCountY = newBlockCountY;
  //     paintBlocksX = Math.round(blockCountX / 2) - 11;
  //     paintBlocksY = Math.round(blockCountY / 2) - 4;

  //     if (blockCountX > 22 && blockCountY > 13) dibujarLogo(0); // Dibuja el logo en su nueva posicion
  //   }
  // }

  // function dibujarLogo(ms: number): void {
  //   let letra = 0; // Índice de letra del logo
  //   let fila = 0; // Índice  de fila de la letra
  //   let columna = 0; // Índice de columna de la fila

  //   dibujador = setInterval(() => {
  //     // Cuando encuentra una columna de la fila de la letra la muestra
  //     if (logo[letra][fila][columna]) {
  //       const cell = document.querySelector(
  //         `.${homecss.modal__cell}[data-y='${paintBlocksY + fila}'][data-x='${paintBlocksX + columna}']`,
  //       );
  //       const cellAnimation = document.createElement("div");

  //       cellAnimation.classList.add(homecss.cell__animation);
  //       if (cell instanceof HTMLDivElement) cell.appendChild(cellAnimation);
  //     }

  //     // Luego de mostrarse se actualiza la siguiente columna, fila o letra  si es que hay y si no, se empieza a mostrar las figuras de fondo
  //     if (logo[letra][fila][columna + 1] !== undefined) {
  //       columna++;
  //     } else if (logo[letra][fila + 1] !== undefined) {
  //       fila++;
  //       columna = 0;
  //     } else if (logo[letra + 1] !== undefined) {
  //       paintBlocksX += logo[letra][0].length + 1;
  //       letra++;
  //       fila = 0;
  //       columna = 0;
  //     } else if (logo[letra + 1] === undefined) {
  //       Math.round(blockCountX / 2 - 11);

  //       clearInterval(dibujador);
  //       if (!showFigure) infoFiguras();
  //     }
  //   }, ms);
  // }

  // function mostrarInterface(): void {
  //   if (!iniciador) {
  //     window.addEventListener("resize", handleResizeChange);

  //     // Dibuja el logo 'TETRIS' si cumple con un width y height, si no renderiza un modal
  //     if (blockCountX > 22 && blockCountY > 13) {
  //       iniciador = setTimeout(() => dibujarLogo(70), 1000);
  //     } else {
  //       // Muestra las figuras aunque el logo no cumpla con el screen deseado
  //       if (isRender) {
  //         isRender = false;
  //         infoFiguras();
  //       }
  //     }
  //   }
  // }

  // // Obtiene la figura, sus coordenadas y se verifica si puede aparcer en la cuadricula
  // function infoFiguras(): void {
  //   showFigure = setInterval(() => {
  //     const figura = figurasFondo[Math.floor(Math.random() * figurasFondo.length)];
  //     const coorX = Math.floor(Math.random() * (blockCountX - 1 - figura[0].length));
  //     const coorY = 0;

  //     canShowFigure(figura, coorX, coorY);
  //   }, 5000);
  // }

  // // Muestra la figura si todas sus celdas están vacías en el tablero si no finaliza la aparición de nuevas figuras y opaca las celdas existentes
  // function canShowFigure(figura: (number | null)[][], coorX: number, coorY: 0): void {
  //   // Si una celda (div) de la figura ya esta ocupada en el tablero finaliza la aparición de las figuras
  //   for (let y = 0; y < figura.length; y++) {
  //     if (isGameOver) break;

  //     for (let x = 0; x < figura[y].length; x++) {
  //       if (figura[y][x]) {
  //         const cell = document.querySelector(`.${homecss.modal__cell}[data-x='${x + coorX}'][data-y='${y + coorY}']`);

  //         if (cell instanceof HTMLDivElement) {
  //           if (cell.getAttribute("data-collision") === "true") {
  //             isGameOver = true;
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if (!isGameOver)
  //     mostrarFigura(figura, coorX, coorY); // Muestra la figura si se puede
  //   else {
  //     // Opaca las celdas existentes
  //     let index = 0;
  //     const cellsOcupied = document.querySelectorAll(`.${homecss.cell__ocupied}`);

  //     const over = setInterval(() => {
  //       if (index === cellsOcupied.length) clearInterval(over);
  //       else {
  //         const cell = cellsOcupied[index];

  //         if (cell instanceof HTMLDivElement) {
  //           cell.style.backgroundColor = "#777d";
  //           index++;
  //         }
  //       }
  //     }, 20);

  //     clearInterval(showFigure);
  //   }
  // }

  // // Muestra la figura, la mueve en eje Y, la coliciona y guarda las celdas ocupadas en la cuadricula
  // function mostrarFigura(figura: (number | null)[][], coorX: number, coorY: 0): void {
  //   addOrDeleteClass(figura, "add", coorX, coorY); // Dibuja la primera posición de la figura

  //   const figureDown: number[][] = []; // Guarda las coordenadas de los puntos mas bajo
  //   let isStatic = false; // Indica si la figura ha colicionado

  //   // Obtiene los puntos mas bajos de una figura para comprobar si puede seguir bajando
  //   for (let y = 0; y < figura.length; y++) {
  //     for (let x = 0; x < figura[y].length; x++) {
  //       if (figura[y][x] && figura[y + 1]) {
  //         if (figura[y + 1][x]) continue;
  //         else figureDown.push([x, y + 1]);
  //       } else if (figura[y][x]) {
  //         figureDown.push([x, y + 1]);
  //       }
  //     }
  //   }

  //   // Mueve la figura hacia abajo si es que el juego no ha terminado y comprueba si puede seguir bajando
  //   const movedorY = setInterval(() => {
  //     if (!isGameOver) {
  //       // Indica que la figura coliciono
  //       for (let i = 0; i < figureDown.length; i++) {
  //         const coorDown = figureDown[i];

  //         if (coorDown[0] + coorX < blockCountX) {
  //           const cell = document.querySelector(
  //             `.${homecss.modal__cell}[data-x='${coorDown[0] + coorX}'][data-y='${coorDown[1] + coorY}']`,
  //           );

  //           if (!cell) {
  //             isStatic = true;
  //             break; // Si coliciono en la ultima fila
  //           } else if (cell.getAttribute("data-collision") === "true") {
  //             isStatic = true;
  //             break; // Si coliciono con una celda ocupada
  //           }
  //         }
  //       }

  //       if (!isStatic) {
  //         // Si niguna celda de la figura coliciono se borra la posición actual y luego se dibuja la nueva
  //         addOrDeleteClass(figura, "remove", coorX, coorY);
  //         coorY++;
  //         addOrDeleteClass(figura, "add", coorX, coorY);
  //       } else {
  //         // Si colisiono se guardan la celdas en la cuadricula y se detiene el movedorY
  //         for (let y = 0; y < figura.length; y++) {
  //           for (let x = 0; x < figura[y].length; x++) {
  //             if (figura[y][x]) {
  //               const cell = document.querySelector(
  //                 `.${homecss.cell__ocupied}[data-x='${x + coorX}'][data-y='${y + coorY}']`,
  //               );

  //               if (cell instanceof HTMLDivElement) cell.setAttribute("data-collision", "true");
  //             }
  //           }
  //         }

  //         clearInterval(movedorY);
  //         return;
  //       }
  //     }
  //   }, 1000);
  // }

  // // Función que agrega o elimina clases a las celdas de la figura
  // function addOrDeleteClass(figura: (number | null)[][], metodo: "add" | "remove", coorX: number, coorY: number) {
  //   for (let y = 0; y < figura.length; y++) {
  //     for (let x = 0; x < figura[y].length; x++) {
  //       if (figura[y][x]) {
  //         const div = document.querySelector(`.${homecss.modal__cell}[data-x='${x + coorX}'][data-y='${y + coorY}']`);

  //         if (div instanceof HTMLDivElement) div.classList[metodo](`${homecss.cell__ocupied}`);
  //       }
  //     }
  //   }
  // }

  // Agrega o no los controles para el juego y detiene el intervalo de las figuras de fondo
  function handleClick(): void {
    // window.removeEventListener("resize", handleResizeChange);
    // isGameOver = true;
    // clearInterval(showFigure);
    setStart(true);
  }

  return (
    <div className={homecss.home}>
      {/* <div className={homecss.home__grid} style={{ width: `${blockCountX * 50}px`, height: `${blockCountY * 50}px` }}> */}
      {/* {grid.map((row, y) => {
          return row.map((_, x) => (
            <div key={`${x}-${y}`} className={homecss.modal__cell} data-collision={false} data-x={x} data-y={y}></div>
          ));
        })} */}
      {/* </div> */}
      <div className={homecss.home__container}>
        <h1 className={homecss.container__title}>TETRIS</h1>
        <Icon icon="lucide:biceps-flexed" className={`${homecss.container__icon} ${homecss["icon--bicep"]}`} />
        <div className={homecss.container__btns}>
          <button className={homecss.btns__item} onClick={handleClick}>
            PLAY
          </button>
          <button
            className={`${homecss.btns__item} ${controls ? homecss["item--actived"] : ""}`}
            ref={btnControls}
            onClick={() => setControls((prev) => !prev)}
          >
            CONTROLS
          </button>
        </div>
        <Icon icon="lucide:gamepad-2" className={`${homecss.container__icon} ${homecss["icon--game"]}`} />
      </div>
    </div>
  );
}

export default Home;
