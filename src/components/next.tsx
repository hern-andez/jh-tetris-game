import gamecss from "@pages/styles/game.module.css";

function Next({ nextFigure }: { nextFigure: (null | 1)[][] }) {
  return (
    <div className={gamecss.child__container} style={{ gridArea: "next" }}>
      <div className={gamecss.container__next}>
        <p className={gamecss.next__title}>Next</p>
      </div>
      <div
        className={`${gamecss.container__next} ${gamecss["value"]}`}
        style={{ gridTemplateColumns: `repeat(${nextFigure[0].length}, 10px)` }}
      >
        {nextFigure.map((row, y) => {
          return row.map((col, x) => {
            return <div key={`${y}-${x}`} className={col === null ? "" : gamecss.figure__cell}></div>;
          });
        })}
      </div>
    </div>
  );
}

export default Next;
