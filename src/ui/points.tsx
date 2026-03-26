import gamecss from "./styles/game.module.css";

type PointsProps = { points: number };

function Points({ points }: PointsProps) {
  return (
    <div className={gamecss.child__container} style={{ gridArea: "points" }}>
      <div className={gamecss.container__score}>
        <p className={gamecss.score__title}>Score</p>
      </div>
      <div className={`${gamecss.container__score} ${gamecss["value"]}`}>
        <p style={{ fontSize: "clamp(15px, 4dvw, 18px)", fontWeight: "bold" }}>{points}</p>
      </div>
    </div>
  );
}

export default Points;
