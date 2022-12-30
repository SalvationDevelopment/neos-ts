import * as BABYLON from "@babylonjs/core";
import { useAppSelector } from "../../hook";
import { selectMeHands } from "../../reducers/duel/handsSlice";
import * as CONFIG from "../../config/ui";
import { Hand, InteractType } from "../../reducers/duel/util";
import {
  setCardModalImgUrl,
  setCardModalIsOpen,
  setCardModalText,
  setCardModalInteractivies,
} from "../../reducers/duel/mod";
import { store } from "../../store";
import { useHover } from "react-babylonjs";
import { useClick } from "./hook";
import { useState, useRef } from "react";

const Hands = () => {
  const hands = useAppSelector(selectMeHands).cards;

  return (
    <>
      {hands.map((hand, idx) => {
        return <CHand state={hand} idx={idx} key={idx} />;
      })}
    </>
  );
};

const CHand = (props: { state: Hand; idx: number }) => {
  const handShape = CONFIG.HandShape();
  const hoverScale = CONFIG.HandHoverScaling();
  const defaultScale = new BABYLON.Vector3(1, 1, 1);
  const planeRef = useRef(null);
  const [state, idx] = [props.state, props.idx];
  const [hovered, setHovered] = useState(false);
  const dispatch = store.dispatch;

  useHover(
    () => setHovered(true),
    () => setHovered(false),
    planeRef
  );

  useClick(
    () => {
      dispatch(setCardModalText([state.meta.text.name, state.meta.text.desc]));
      dispatch(
        setCardModalImgUrl(
          `https://cdn02.moecube.com:444/images/ygopro-images-zh-CN/${state.meta.id}.jpg`
        )
      );
      dispatch(
        setCardModalInteractivies(
          state.interactivities.map((interactive) => {
            return {
              desc: interactTypeToString(interactive.interactType),
              response: interactive.response,
            };
          })
        )
      );
      dispatch(setCardModalIsOpen(true));
    },
    planeRef,
    [state]
  );
  return (
    <>
      <plane
        name={`hand-${idx}`}
        ref={planeRef}
        width={handShape.width}
        height={handShape.height}
        scaling={hovered ? hoverScale : defaultScale}
        position={
          new BABYLON.Vector3(
            state.transform.position?.x,
            state.transform.position?.y,
            state.transform.position?.z
          )
        }
        rotation={
          new BABYLON.Vector3(
            state.transform.rotation?.x,
            state.transform.rotation?.y,
            state.transform.rotation?.z
          )
        }
      >
        <standardMaterial
          name={`hand-mat-${idx}`}
          diffuseTexture={
            new BABYLON.Texture(
              `https://cdn02.moecube.com:444/images/ygopro-images-zh-CN/${state.meta.id}.jpg`
            )
          }
        />
      </plane>
    </>
  );
};

function interactTypeToString(t: InteractType): string {
  switch (t) {
    case InteractType.SUMMON: {
      return "普通召唤";
    }
    case InteractType.SP_SUMMON: {
      return "特殊召唤";
    }
    case InteractType.POS_CHANGE: {
      return "改变表示形式";
    }
    case InteractType.MSET: {
      return "前场放置";
    }
    case InteractType.SSET: {
      return "后场放置";
    }
    case InteractType.ACTIVATE: {
      return "发动效果";
    }
    default: {
      return "未知选项";
    }
  }
}

export default Hands;