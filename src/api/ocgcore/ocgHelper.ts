import { ygopro } from "./idl/ocgcore";
import socketMiddleWare, { socketCmd } from "../../middleware/socket";
import { IDeck } from "../Card";
import playerInfoPacket from "./ocgAdapter/ctosPlayerInfo";
import joinGamePacket from "./ocgAdapter/ctosJoinGame";

export function sendUpdateDeck(deck: IDeck) {
  const updateDeck = new ygopro.YgoCtosMsg({
    ctos_update_deck: new ygopro.CtosUpdateDeck({
      main: deck.main,
      extra: deck.extra,
      side: deck.side,
    }),
  });

  socketMiddleWare({ cmd: socketCmd.SEND, payload: updateDeck });
}

export function sendHsReady() {
  const hasReady = new ygopro.YgoCtosMsg({
    ctos_hs_ready: new ygopro.CtosHsReady({}),
  });

  socketMiddleWare({ cmd: socketCmd.SEND, payload: hasReady });
}

export function sendHsStart() {
  const hasStart = new ygopro.YgoCtosMsg({
    ctos_hs_start: new ygopro.CtosHsStart({}),
  });

  socketMiddleWare({ cmd: socketCmd.SEND, payload: hasStart });
}

export function sendPlayerInfo(ws: WebSocket, player: string) {
  const playerInfo = new ygopro.YgoCtosMsg({
    ctos_player_info: new ygopro.CtosPlayerInfo({
      name: player,
    }),
  });
  const packet = new playerInfoPacket(playerInfo);

  ws.send(packet.serialize());
}

export function sendJoinGame(ws: WebSocket, version: number, passWd: string) {
  const joinGame = new ygopro.YgoCtosMsg({
    ctos_join_game: new ygopro.CtosJoinGame({
      version, // todo: use config
      gameid: 0,
      passwd: passWd,
    }),
  });
  const packet = new joinGamePacket(joinGame);

  ws.send(packet.serialize());
}
