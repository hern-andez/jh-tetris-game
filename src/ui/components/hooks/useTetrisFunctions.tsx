// function useTetrisFunctions() {
//   // Dibuja la figura y la guarda en la cuadricula
//   function crearFigura(): void {
//     figura.forEach((fila, y) => {
//       figureCells[y] = []; // En vez de tener 1 o 2 tiene los divs en su orden especifico

//       fila.forEach((columna, x) => {
//         if (columna !== null) {
//           cuadricula[y + coorY][x + coorX] = columna;

//           // Dibuja la figura y agrega la imagen a celdas especiales
//           const div = document.createElement("div");
//           div.classList.add(`${game.cell__figure}`);
//           div.setAttribute("data-x", `${coorX + x}`);
//           div.setAttribute("data-y", `${coorY + y}`);

//           div.style.backgroundColor = columna === 1 ? "red" : "#0ff";
//           if (columna === 2) div.style.backgroundImage = `url('${star.src}')`;
//           div.style.width = `${blockSize - 0.5}px`;
//           div.style.height = `${blockSize - 0.5}px`;
//           div.style.transform = `translate(${(coorX + x) * blockSize}px, ${(coorY + y) * blockSize}px)`;

//           figureCells[y].push(div);
//           if (container.current) container.current.appendChild(div);
//         } else {
//           figureCells[y].push(null);
//         }
//       });
//     });

//     calcularPuntoMaximo(); // Se muestra el reflejo al crearse la figura
//   }

//   return;
// }

// export default useTetrisFunctions;
