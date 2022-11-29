import * as BABYLON from "@babylonjs/core";
import * as CONFIG from "./config";

export default (scene: BABYLON.Scene) => {
  // 除外区
  const shape = CONFIG.ExclusionSlotShape();
  const exclusion = BABYLON.MeshBuilder.CreateBox("exclusion", shape);
  // 位置
  exclusion.position = new BABYLON.Vector3(3.2, CONFIG.Floating, -0.7);
  // 旋转
  exclusion.rotation = CONFIG.ExclusionSlotRotation();
  // 材质
  const exclusionMaterial = new BABYLON.StandardMaterial(
    "exclusionMaterial",
    scene
  );
  exclusionMaterial.diffuseColor = CONFIG.ExclusionColor();
  exclusion.material = exclusionMaterial;
};