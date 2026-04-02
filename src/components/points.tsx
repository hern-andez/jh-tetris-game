import { useEffect, useRef } from "react";
import gsap from "gsap";

import gamecss from "@pages/styles/game.module.css";

type PointsProps = { points: number };

function Points({ points }: PointsProps) {
  const pointElement = useRef<null | HTMLParagraphElement>(null); // Elemento de los puntos
  const prevPoints = useRef(points); // Puntos antes de que suban

  useEffect(() => {
    if (prevPoints.current === points) return;

    // Animación que aumenta los puntos gradualmente
    gsap.to(prevPoints, {
      duration: 1,
      current: points,
      onUpdate: () => {
        if (pointElement.current) pointElement.current.textContent = prevPoints.current.toFixed(0); // Sin decimales
      },
    });
  }, [points]);

  return (
    <div className={gamecss.child__container} style={{ gridArea: "points" }}>
      <div className={gamecss.container__score}>
        <p className={gamecss.score__title}>Score</p>
      </div>
      <div className={`${gamecss.container__score} ${gamecss["value"]}`}>
        <p ref={pointElement} style={{ fontSize: "clamp(15px, 4dvw, 18px)", fontWeight: "bold" }}>
          {prevPoints.current}
        </p>
      </div>
    </div>
  );
}

export default Points;
