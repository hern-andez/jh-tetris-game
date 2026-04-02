import { Icon } from "@iconify/react";
import controlscss from "./styles/controls.module.css";

type ControlsProps = {
  move: (eje: "x" | "y", val: 1 | -1, isMoveAutomatic?: boolean) => Promise<void>;
  rotate: () => void;
  collide: () => void;
};

function Controls({ move, rotate, collide }: ControlsProps) {
  return (
    <div className={controlscss.container} id="controls">
      <button className={controlscss.container__btn} onClick={async () => await move("x", -1)}>
        <Icon icon={"ic:baseline-keyboard-arrow-left"} />
      </button>
      <button className={controlscss.container__btn}>
        <Icon icon={"ic:baseline-keyboard-arrow-down"} onClick={async () => await move("y", 1)} />
      </button>
      <button className={controlscss.container__btn} onClick={() => rotate()}>
        <Icon icon={"ic:round-rotate-left"} />
      </button>
      <button className={controlscss.container__btn} onClick={() => collide()}>
        <Icon icon={"ic:baseline-keyboard-double-arrow-down"} />
      </button>
      <button className={controlscss.container__btn} onClick={async () => await move("x", 1)}>
        <Icon icon={"ic:baseline-keyboard-arrow-right"} />
      </button>
    </div>
  );
}

export default Controls;
