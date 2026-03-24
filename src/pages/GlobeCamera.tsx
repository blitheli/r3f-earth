// R3F, DREI and LEVA imports
import { Environment } from "@react-three/drei";
import { WebGPUCanvas } from "../components/WebGPUCanvas";
import { CesiumGlobe } from "../components/CesiumGlobe";
import { Suspense, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { Geodetic, radians } from "@takram/three-geospatial";
import { useGLTF } from "../hooks/useGLTF";
import { CameraController } from "../components/CameraController";

/*
  CesiumGlobe + ISS 模型 + 相机跟随
  
  ISS 位置: 经度110°, 纬度40°, 高度400km
  相机跟随 ISS 并始终保持地平线水平
*/

// Cesium Ion 配置
const assetId = 2275207; // 全球 3D Tiles

// ISS 组件
function ISSModel() {
  const gltf = useGLTF("/models/iss.glb");

  return (
    <primitive
      object={gltf.scene.clone()}
      rotation-x={Math.PI / 2}
      rotation-y={Math.PI / 2}
      rotation-z={-Math.PI / 2}
      scale={1}
    />
  );
}

// ISS 位置: 经度110°, 纬度40°, 高度400km
const issPosition = new Geodetic(
  radians(110), // 经度
  radians(40), // 纬度
  400000, // 400 公里高度
).toECEF();
console.log("ISS位置:", issPosition.toArray());

export default function GlobeCamera() {
  const [viewMode, setViewMode] = useState<"globe" | "local">("local");
  const issRef = useRef<Group>(null);

  return (
    <>
      {/* 视角切换 UI */}
      <div style={{ position: "absolute", zIndex: 10, padding: 20, top: 200 }}>
        <button onClick={() => setViewMode("globe")}>全球视角</button>
        <button onClick={() => setViewMode("local")}>锁定飞行器</button>
      </div>
      <WebGPUCanvas
        forceWebGL={false}
        shadows
        renderer={{
          logarithmicDepthBuffer: true,
        }}
        camera={{
          fov: 60,
          // 相机位置由 CameraController 统一管理，避免与 controls 抢状态
          position: [0, -2e7, 0],
          near: 0.1,
          far: 1e9,
        }}
      >
        {/* Cesium 3D Tiles 全球地形 */}
        <CesiumGlobe assetId={assetId as number} />

        {/* ISS 模型 */}
        <Suspense fallback={null}>
          <group ref={issRef} position={issPosition}>
            <ISSModel />
          </group>
        </Suspense>

        {/* 智能相机控制器 */}
        <CameraController
          tilesRenderer={null}
          scRef={issRef}
          mode={viewMode}
        />

        {/* 环境光照 */}
        <Environment
          preset="sunset"
          background={true}
          backgroundBlurriness={0.9}
          environmentIntensity={1}
        />
      </WebGPUCanvas>
    </>
  );
}
