import * as BABYLON from "@babylonjs/core";
import * as CONFIG from "../../config/ui";
import { useAppSelector } from "../../hook";
import { selectMeField, selectOpField } from "../../reducers/duel/fieldSlice";
import { clearFieldPlaceInteractivities } from "../../reducers/duel/mod";
import FixedSlot from "./fixedSlot";
import { Depth } from "./singleSlot";

const Field = () => {
  const meField = useAppSelector(selectMeField)?.inner;
  const opField = useAppSelector(selectOpField)?.inner;

  return (
    <>
      {meField ? (
        <FixedSlot
          state={meField}
          sequence={0}
          position={fieldPosition(0)}
          rotation={CONFIG.CardSlotRotation(false)}
          clearPlaceInteractivitiesAction={clearFieldPlaceInteractivities}
        />
      ) : (
        <></>
      )}
      {opField ? (
        <FixedSlot
          state={opField}
          sequence={0}
          position={fieldPosition(1)}
          rotation={CONFIG.CardSlotRotation(true)}
          clearPlaceInteractivitiesAction={clearFieldPlaceInteractivities}
        />
      ) : (
        <></>
      )}
    </>
  );
};

const fieldPosition = (player: number) => {
  const x = player == 0 ? -3.3 : 3.3;
  const y = Depth / 2 + CONFIG.Floating;
  const z = player == 0 ? -2.0 : 2.0;

  return new BABYLON.Vector3(x, y, z);
};

export default Field;
