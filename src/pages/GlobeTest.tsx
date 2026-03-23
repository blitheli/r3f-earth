// R3F, DREI and LEVA imports
import { Environment } from "@react-three/drei";
import { WebGPUCanvas } from "../components/WebGPUCanvas";
import { EnvironmentControls } from "3d-tiles-renderer/r3f";
import { CesiumGlobe } from "../components/CesiumGlobe";

/*

  测试东京是可以的
  若为Cesium
*/

// Aerometrex San Francisco High Resolution 3D Model with Street Level Enhanced 3D (Non-Commercial Trial)
//const assetId = 1415196; //2275207
const assetId = 2275207;    // Cesium全球, fps不高，也不流畅
const apiToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4M2ZhYzM4My1lN2NhLTRjNTktODY1OC1jZDdmOTU3Y2ZjMGEiLCJpZCI6MTMwNTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjI0NzA5NzB9.rRTs6chsWJdo9KNYe5VjJj2fUzMHeniIJvFQOd0aLJU";

export default function GlobeTest() {
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
        position: [-2e7, 0, 0],  // 距离地心 2000 万米
        //up: [0, 0, 1],            // Z 轴向上
        near: 1e3,                // 1 公里 - 防止太近时出现精度问题
        far: 1e9,                 // 10 亿米 - 足够看到整个地球
      }}
    >
      <CesiumGlobe
        apiToken={apiToken as string}
        assetId={assetId as number}
      />

      {/* Controls - 允许更近的距离 */}
      <EnvironmentControls 
        enableDamping={true} 
        minDistance={1e3}      // 最近 1 公里
        maxDistance={1e8}      // 最远 1 亿米
      />

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
