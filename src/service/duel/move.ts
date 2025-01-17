import { ygopro } from "../../api/ocgcore/idl/ocgcore";
import MsgMove = ygopro.StocGameMessage.MsgMove;
import { AppDispatch } from "../../store";
import {
  fetchMonsterMeta,
  fetchOverlayMeta,
} from "../../reducers/duel/monstersSlice";
import {
  removeCemetery,
  removeExclusion,
  removeExtraDeck,
  removeHand,
  removeMagic,
  removeMonster,
  removeOverlay,
} from "../../reducers/duel/mod";
import { fetchMagicMeta } from "../../reducers/duel/magicSlice";
import { fetchCemeteryMeta } from "../../reducers/duel/cemeretySlice";
import { insertHandMeta } from "../../reducers/duel/handsSlice";
import { fetchExclusionMeta } from "../../reducers/duel/exclusionSlice";
import { fetchExtraDeckMeta } from "../../reducers/duel/extraDeckSlice";

const OVERLAY_STACK: { code: number; sequence: number }[] = [];

export default (move: MsgMove, dispatch: AppDispatch) => {
  const code = move.code;
  const from = move.from;
  const to = move.to;
  // TODO: reason

  switch (from.location) {
    case ygopro.CardZone.HAND: {
      dispatch(removeHand([from.controler, from.sequence]));

      break;
    }
    case ygopro.CardZone.MZONE: {
      dispatch(
        removeMonster({ controler: from.controler, sequence: from.sequence })
      );

      break;
    }
    case ygopro.CardZone.SZONE: {
      dispatch(
        removeMagic({ controler: from.controler, sequence: from.sequence })
      );

      break;
    }
    case ygopro.CardZone.GRAVE: {
      dispatch(
        removeCemetery({ controler: from.controler, sequence: from.sequence })
      );

      break;
    }
    case ygopro.CardZone.REMOVED: {
      dispatch(
        removeExclusion({ controler: from.controler, sequence: from.sequence })
      );

      break;
    }
    case ygopro.CardZone.EXTRA: {
      dispatch(
        removeExtraDeck({ controler: from.controler, sequence: from.sequence })
      );

      break;
    }
    case ygopro.CardZone.OVERLAY: {
      dispatch(
        removeOverlay({
          controler: from.controler,
          sequence: from.sequence,
          overlaySequence: from.overlay_sequence,
        })
      );

      break;
    }
    default: {
      console.log(`Unhandled zone type ${from.location}`);
      break;
    }
  }

  switch (to.location) {
    case ygopro.CardZone.MZONE: {
      dispatch(
        fetchMonsterMeta({
          controler: to.controler,
          sequence: to.sequence,
          position: to.position,
          code,
        })
      );

      // 处理超量素材
      const overlayMetarials = OVERLAY_STACK.splice(0, OVERLAY_STACK.length);
      let sorted = overlayMetarials
        .sort((a, b) => a.sequence - b.sequence)
        .map((overlay) => overlay.code);
      dispatch(
        fetchOverlayMeta({
          controler: to.controler,
          sequence: to.sequence,
          overlayCodes: sorted,
        })
      );

      break;
    }
    case ygopro.CardZone.SZONE: {
      dispatch(
        fetchMagicMeta({
          controler: to.controler,
          sequence: to.sequence,
          position: to.position,
          code,
        })
      );

      break;
    }
    case ygopro.CardZone.GRAVE: {
      dispatch(
        fetchCemeteryMeta({
          controler: to.controler,
          sequence: to.sequence,
          code,
        })
      );

      break;
    }
    case ygopro.CardZone.HAND: {
      dispatch(
        insertHandMeta({ controler: to.controler, sequence: to.sequence, code })
      );

      break;
    }
    case ygopro.CardZone.REMOVED: {
      dispatch(
        fetchExclusionMeta({
          controler: to.controler,
          sequence: to.sequence,
          code,
        })
      );

      break;
    }
    case ygopro.CardZone.EXTRA: {
      dispatch(
        fetchExtraDeckMeta({
          controler: to.controler,
          sequence: to.sequence,
          code,
        })
      );

      break;
    }
    case ygopro.CardZone.OVERLAY: {
      if (to.sequence > 6) {
        // 超量素材在进行超量召唤时，若玩家未选择超量怪兽的位置，会“沉到决斗盘下面”，这时候素材们的sequence会暂时大于6
        // 这时候将它们放到一个栈中，待超量怪兽的Move消息到来时从栈中获取超量素材补充到状态中
        OVERLAY_STACK.push({ code, sequence: to.overlay_sequence });
      } else {
        // 其他情况下，比如“宵星的机神 丁吉尔苏”的“补充超量素材”效果，直接更新状态中
        dispatch(
          fetchOverlayMeta({
            controler: to.controler,
            sequence: to.sequence,
            overlayCodes: [code],
            append: true,
          })
        );
      }

      break;
    }
    default: {
      console.log(`Unhandled zone type ${to.location}`);

      break;
    }
  }
};
