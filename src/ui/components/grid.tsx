import React from "react";
import gridcss from "../styles/grid.module.css";

type GridProps = {
  gridContainer: React.MutableRefObject<HTMLDivElement | null>;
  grid: React.MutableRefObject<(1 | 2 | null)[][]>;
  blockCountX: React.MutableRefObject<number>;
  blockSize: React.MutableRefObject<string>;
};

function Grid({ gridContainer, grid, blockCountX, blockSize }: GridProps) {
  return (
    <div
      className={gridcss.container}
      ref={gridContainer}
      style={{ gridTemplateColumns: `repeat(${blockCountX.current}, 1fr)` }}
    >
      {grid.current.map((row, y) => {
        return row.map((col, x) => {
          return (
            <div
              key={`${y}-${x}`}
              className={gridcss.container__cell}
              style={{ width: blockSize.current }}
              data-y={y}
              data-x={x}
            >
              {col === null ? null : <div className={gridcss.cell__ocupied}></div>}
            </div>
          );
        });
      })}
    </div>
  );
}

export default Grid;
