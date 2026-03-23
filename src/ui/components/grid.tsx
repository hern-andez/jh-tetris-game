import gridcss from "../styles/grid.module.css";

function Grid() {
  const blockCountX = 10; // Cantidad de columnas por fila
  const blockCountY = 19; // Cantidad de filas
  const grid: (null | 1 | 2)[][] = Array.from({ length: blockCountY }, () => Array(blockCountX).fill(null));

  return (
    <div className={gridcss.container} style={{ gridTemplateColumns: `repeat(${blockCountX}, 1fr)` }}>
      {grid.map((row, y) => {
        return row.map((col, x) => {
          return (
            <div key={`${y}-${x}`} className={gridcss.container__cell} data-y={y} data-x={x}>
              {col === null ? null : <div className={gridcss.cell__ocupied}></div>}
            </div>
          );
        });
      })}
    </div>
  );
}

export default Grid;
