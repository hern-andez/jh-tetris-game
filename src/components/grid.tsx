import React from "react";
import gridcss from "./styles/grid.module.css";

type GridProps = {
  gridContainer: React.MutableRefObject<HTMLDivElement | null>;
  grid: React.MutableRefObject<(1 | null)[][]>;
  blockCountX: React.MutableRefObject<number>;
  blockCountY: React.MutableRefObject<number>;
};

function Grid({ gridContainer, grid, blockCountX, blockCountY }: GridProps) {
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
            {row.map((_, x) => (
              <div key={`${y}-${x}`} className={gridcss.row__col} data-x={x}></div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Grid;
