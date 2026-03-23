// R3F, DREI and LEVA imports
import { Environment } from "@react-three/drei";
import { WebGPUCanvas } from "../components/WebGPUCanvas";
import { EnvironmentControls } from "3d-tiles-renderer/r3f";
import { CesiumGlobe } from "../components/CesiumGlobe";

/*

  测试东京是可以的
*/

// Aerometrex San Francisco High Resolution 3D Model with Street Level Enhanced 3D (Non-Commercial Trial)
const assetId = 1415196; //2275207
//const assetId = 2275207;
const apiToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4M2ZhYzM4My1lN2NhLTRjNTktODY1OC1jZDdmOTU3Y2ZjMGEiLCJpZCI6MTMwNTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjI0NzA5NzB9.rRTs6chsWJdo9KNYe5VjJj2fUzMHeniIJvFQOd0aLJU";

export default function GlobeTest() {
  //  加载glb模型,并使用Drei的html标注进行兴趣点标注
  //-----------------------------------------------------------------
  return (
    <WebGPUCanvas
      frameloop="demand"
      forceWebGL={false}
      shadows
      renderer={{
        logarithmicDepthBuffer: true,
      }}
      camera={{
        fov: 60,
        // position: [-2e7, 0, 0],
        position: [300, 300, 300],
        // up: [0, 0, 1],
        near: 1,
        far: 1e5,
      }}
    >
      <CesiumGlobe
        apiToken={apiToken as string}
        assetId={assetId as number}
      />

      {/* Controls */}
      <EnvironmentControls enableDamping={true} maxDistance={5000} />

      {/* other r3f staging */}
      <Environment
        preset="sunset"
        background={true}
        backgroundBlurriness={0.9}
        environmentIntensity={1}
      />
    </WebGPUCanvas>
  );
}
