//! 透传协议

import PenetrateData from "./penetrate.json";
import { BufferReader } from "../../bufferIO";
import { ygopro } from "../../../idl/ocgcore";
import { numberToCardPosition } from "../../util";

type Constructor<T = any> = new (...args: any[]) => T;

const ReadFieldHandlerMap: Map<string, readFieldHandler> = new Map([
  ["uint8", ((reader) => reader.readUint8()) as readFieldHandler],
  ["uint16", (reader) => reader.readUint16()],
  ["uint32", (reader) => reader.readUint32()],
  ["CardLocation", (reader) => reader.readCardLocation()],
  ["CardInfo", (reader) => reader.readCardInfo()],
  ["CardPosition", (reader) => numberToCardPosition(reader.readUint8())],
]);
const MsgConstructorMap: Map<string, Constructor> = new Map([
  ["move", ygopro.StocGameMessage.MsgMove as Constructor],
  ["shuffle_hand", ygopro.StocGameMessage.MsgShuffleHand],
  ["pos_change", ygopro.StocGameMessage.MsgPosChange],
  ["select_yes_no", ygopro.StocGameMessage.MsgSelectYesNo],
]);

export interface penetrateType {
  protoType: string;
  fields: {
    fieldName: string;
    fieldType: string;
    repeatedType?: string;
  }[];
}

interface readFieldHandler {
  (reader: BufferReader): any;
}

class PenetrateManager {
  config: Map<string, penetrateType>;
  readFieldHandlerMap: Map<string, readFieldHandler> = ReadFieldHandlerMap;
  msgConstructorMap: Map<string, Constructor> = MsgConstructorMap;

  constructor(config: any) {
    this.config = _objToMap(config);
  }

  private readField(reader: BufferReader, fieldType: string): any {
    const handler = this.readFieldHandlerMap.get(fieldType);

    if (handler) {
      return handler(reader);
    }
    return undefined;
  }

  private readRepeatedField(reader: BufferReader, repeatedType: string): any {
    const handler = this.readFieldHandlerMap.get(repeatedType);

    if (handler) {
      const count = reader.readUint8();
      let repeated = [];

      for (let i = 0; i < count; i++) {
        repeated.push(handler(reader));
      }

      return repeated;
    }
    return undefined;
  }

  private constructMsg(protoType: string, object: any): any {
    const constructor = this.msgConstructorMap.get(protoType);

    if (constructor) {
      return new constructor(object);
    }
    return undefined;
  }

  penetrate(msgKey: number, gameMsg: any, gameData: Uint8Array): boolean {
    const config = this.config.get(msgKey.toString());
    const reader = new BufferReader(gameData, true);

    if (config) {
      const protoType = config.protoType;
      const fields = config.fields;

      let object: any = {};
      for (let field of fields) {
        object[field.fieldName] =
          field.fieldType === "repeated" && field.repeatedType
            ? this.readRepeatedField(reader, field.repeatedType)
            : this.readField(reader, field.fieldType);
      }

      gameMsg[protoType] = this.constructMsg(protoType, object);
    }

    return config ? true : false;
  }
}

function _objToMap(obj: any): Map<string, penetrateType> {
  let map = new Map();

  for (let key of Object.keys(obj)) {
    map.set(key, obj[key]);
  }

  return map;
}

const PENETRATE = new PenetrateManager(PenetrateData);
export default PENETRATE;
