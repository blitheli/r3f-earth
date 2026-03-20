import { Canvas } from "@react-three/fiber";
// TilesRenderer, controls and attribution imports
import {
  TilesPlugin,
  TilesRenderer,
  TilesAttributionOverlay,
  EnvironmentControls,
} from "3d-tiles-renderer/r3f";
import {
  UpdateOnChangePlugin,
  GLTFExtensionsPlugin,
  ReorientationPlugin,
} from "3d-tiles-renderer/plugins";
import { CesiumIonAuthPlugin } from "3d-tiles-renderer/core/plugins";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// R3F, DREI and LEVA imports
import { Environment, GizmoHelper, GizmoViewport } from "@react-three/drei";

/*
  1. 使用Cesium Ion的API Token和资产ID加载3D Tiles, 数据源: Cesium ION
     只能加载一个城市

*/
//Plugins

const dracoLoader = new DRACOLoader().setDecoderPath(
  "https://www.gstatic.com/draco/v1/decoders/",
);

// Aerometrex San Francisco High Resolution 3D Model with Street Level Enhanced 3D (Non-Commercial Trial)
const assetId = 1415196; //2275207
//const assetId = 2275207;
const apiToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4M2ZhYzM4My1lN2NhLTRjNTktODY1OC1jZDdmOTU3Y2ZjMGEiLCJpZCI6MTMwNTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjI0NzA5NzB9.rRTs6chsWJdo9KNYe5VjJj2fUzMHeniIJvFQOd0aLJU";

export default function Cesium3Dtiles() {
  //  加载glb模型,并使用Drei的html标注进行兴趣点标注
  //-----------------------------------------------------------------
  return (
      <Canvas
        frameloop="demand"
        camera={{
          position: [300, 300, 300],
          near: 1,
          far: 1e5,
        }}
      >
      <TilesRenderer key={assetId}>
        <TilesPlugin
          plugin={CesiumIonAuthPlugin}
          args={{ apiToken: apiToken, assetId }}
        />
        <TilesPlugin plugin={GLTFExtensionsPlugin} dracoLoader={dracoLoader} />
        <TilesPlugin plugin={ReorientationPlugin} />
        <TilesPlugin plugin={UpdateOnChangePlugin} />

        <TilesAttributionOverlay />
      </TilesRenderer>

      {/* Controls */}
      <EnvironmentControls enableDamping={true} maxDistance={5000} />

      {/* other r3f staging */}
      <Environment
        preset="sunset"
        background={true}
        backgroundBlurriness={0.9}
        environmentIntensity={1}
      />
      <GizmoHelper alignment="bottom-right">
        <GizmoViewport />
      </GizmoHelper>
    </Canvas>
  );
}
