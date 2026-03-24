import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GlobeControls, TilesRenderer } from "3d-tiles-renderer";
import * as THREE from "three";

/*
  2026-03-24 blitheli
  
  相机控制器，用于控制相机在 globe 模式和 local 模式下的移动和旋转
  globe 模式下，使用 GlobeControls 控制相机在地球表面上的移动和旋转
  local 模式下，使用 OrbitControls 控制相机在飞行器周围的移动和旋转
*/
interface CameraControllerProps {
  tilesRenderer: TilesRenderer | null;
  scRef: React.RefObject<THREE.Object3D>;
  mode: "globe" | "local";
  initRelativePosition?: THREE.Vector3;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  tilesRenderer,
  scRef: aircraftRef,
  mode,
  initRelativePosition = new THREE.Vector3(100, 0, 0),
}) => {
  const { camera, gl, scene } = useThree();
  const orbitRef = useRef<any>(null);

  useEffect(() => {
    // 初始设置局部坐标系的相机位置
    console.log("组件挂载完成, 视角模式:", mode);
    if (mode === "local" && aircraftRef.current && camera) {      
      const worldPos = new THREE.Vector3();
      aircraftRef.current.getWorldPosition(worldPos);
      camera.position.copy(worldPos).add(initRelativePosition);
    } else {
      camera.position.copy(new THREE.Vector3(0, -2e7, 0));
    }
    console.log("相机初始位置:", camera.position.toArray());
  }, [mode]);

  // 1. 初始化 GlobeControls (仅在 globe 模式下激活逻辑)
  const globeControls = useMemo(() => {
    const ctrl = new GlobeControls(scene, camera, gl.domElement);
    if (tilesRenderer) ctrl.setTilesRenderer(tilesRenderer);
    return ctrl;
  }, [tilesRenderer, scene, camera, gl]);

  // 2. 核心逻辑循环
  useFrame(() => {
    if (mode === "globe") {
      globeControls.update();
    } else if (mode === "local" && aircraftRef.current && orbitRef.current) {
      // 获取飞行器的世界坐标 (ECEF)
      const worldPos = new THREE.Vector3();
      aircraftRef.current.getWorldPosition(worldPos);

      // 将 OrbitControls 的旋转中心锁定在飞行器上
      orbitRef.current.target.copy(worldPos);

      // 重要：更新相机的 Up 向量为该点的地表法线
      // 否则在地球侧面观察时，地平线会是歪的
      const normal = worldPos.clone().normalize();
      camera.up.lerp(normal, 0.1);

      orbitRef.current.update();
    }
  });

  // 销毁
  React.useEffect(() => {
    return () => globeControls.dispose();
  }, [globeControls]);

  return (
    <>
      {mode === "local" && (
        <OrbitControls
          ref={orbitRef}
          args={[camera, gl.domElement]}
          enableDamping
          // 防止缩放穿透地球表面（可选）
          minDistance={0.1}
          maxDistance={5000000}
        />
      )}
    </>
  );
};
