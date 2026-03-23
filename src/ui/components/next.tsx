import gamecss from "../styles/game.module.css";

type NextProps = { figure: (null | 1 | 2)[][] };

function Next({ figure }: NextProps) {
  return (
    <div className={gamecss.child__container} style={{ gridArea: "next" }}>
      <div className={gamecss.container__next}>
        <p className={gamecss.next__title}>Next</p>
      </div>
      <div
        className={`${gamecss.container__next} ${gamecss["value"]}`}
        style={{ gridTemplateColumns: `repeat(${figure[0].length}, 10px)` }}
      >
        {figure.map((row, y) => {
          return row.map((col, x) => {
            return <div key={`${y}-${x}`} className={col === null ? "" : gamecss.figure__cell}></div>;
          });
        })}
      </div>
    </div>
  );
}

export default Next;
