import { ygopro } from "../../api/ocgcore/idl/ocgcore";
import { store } from "../../store";
import onMsgStart from "./start";
import onMsgDraw from "./draw";
import onMsgNewTurn from "./newTurn";
import onMsgNewPhase from "./newPhase";
import onMsgHint from "./hint";
import onMsgSelectIdleCmd from "./selectIdleCmd";
import onMsgSelectPlace from "./selectPlace";
import onMsgMove from "./move";
import onMsgSelectCard from "./selectCard";
import onMsgSelectChain from "./selectChain";
import onMsgSelectEffectYn from "./selectEffectYn";
import onMsgSelectPosition from "./selectPosition";
import onMsgSelectOption from "./selectOption";
import onMsgShuffleHand from "./shuffleHand";
import onMsgSelectBattleCmd from "./selectBattleCmd";
import onMsgPosChange from "./posChange";

export default function handleGameMsg(pb: ygopro.YgoStocMsg) {
  const dispatch = store.dispatch;
  const msg = pb.stoc_game_msg;

  switch (msg.gameMsg) {
    case "start": {
      onMsgStart(msg.start, dispatch);

      break;
    }
    case "draw": {
      onMsgDraw(msg.draw, dispatch);

      break;
    }
    case "new_turn": {
      onMsgNewTurn(msg.new_turn, dispatch);

      break;
    }
    case "new_phase": {
      onMsgNewPhase(msg.new_phase, dispatch);

      break;
    }
    case "hint": {
      onMsgHint(msg.hint, dispatch);

      break;
    }
    case "select_idle_cmd": {
      onMsgSelectIdleCmd(msg.select_idle_cmd, dispatch);

      break;
    }
    case "select_place": {
      onMsgSelectPlace(msg.select_place, dispatch);

      break;
    }
    case "move": {
      onMsgMove(msg.move, dispatch);

      break;
    }
    case "select_card": {
      onMsgSelectCard(msg.select_card, dispatch);

      break;
    }
    case "select_chain": {
      onMsgSelectChain(msg.select_chain, dispatch);

      break;
    }
    case "select_effect_yn": {
      onMsgSelectEffectYn(msg.select_effect_yn, dispatch);

      break;
    }
    case "select_position": {
      onMsgSelectPosition(msg.select_position, dispatch);

      break;
    }
    case "select_option": {
      onMsgSelectOption(msg.select_option, dispatch);

      break;
    }
    case "shuffle_hand": {
      onMsgShuffleHand(msg.shuffle_hand, dispatch);

      break;
    }
    case "select_battle_cmd": {
      onMsgSelectBattleCmd(msg.select_battle_cmd, dispatch);

      break;
    }
    case "pos_change": {
      onMsgPosChange(msg.pos_change, dispatch);

      break;
    }
    default: {
      break;
    }
  }
}
