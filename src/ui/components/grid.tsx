import React from "react";
import gridcss from "../styles/grid.module.css";

type GridProps = {
  gridContainer: React.MutableRefObject<HTMLDivElement | null>;
  grid: React.MutableRefObject<(1 | 2 | null)[][]>;
  blockCountX: React.MutableRefObject<number>;
  blockCountY: React.MutableRefObject<number>;
  blockSize: React.MutableRefObject<string>;
};

function Grid({ gridContainer, grid, blockCountX, blockCountY, blockSize }: GridProps) {
  return (
    <div
      className={gridcss.container}
      ref={gridContainer}
      style={{ gridTemplateRows: `repeat(${blockCountY.current}, 1fr)` }}
    >
      {grid.current.map((row, y) => {
        return (
          <div
            key={y}
            className={gridcss.container__row}
            style={{ gridTemplateColumns: `repeat(${blockCountX.current}, 1fr)` }}
            data-y={y}
          >
            {row.map((col, x) => {
              return (
                <div key={`${y}-${x}`} className={gridcss.row__col} style={{ width: blockSize.current }} data-x={x}>
                  {col === null ? null : <div className={gridcss.cell__ocupied}></div>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Grid;
