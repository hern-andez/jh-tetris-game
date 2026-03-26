import { Icon } from "@iconify/react";

import controlscss from "./styles/controls.module.css";

function Controls() {
  return (
    <div className={controlscss.container} id="controls">
      <button className={controlscss.container__btn}>
        <Icon icon={"ic:baseline-keyboard-arrow-left"} />
      </button>
      <button className={controlscss.container__btn}>
        <Icon icon={"ic:baseline-keyboard-arrow-down"} />
      </button>
      <button className={controlscss.container__btn}>
        <Icon icon={"ic:round-rotate-left"} />
      </button>
      <button className={controlscss.container__btn}>
        <Icon icon={"ic:baseline-keyboard-double-arrow-down"} />
      </button>
      <button className={controlscss.container__btn}>
        <Icon icon={"ic:baseline-keyboard-arrow-right"} />
      </button>
    </div>
  );
}

export default Controls;
