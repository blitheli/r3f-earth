import {
  GLTFExtensionsPlugin,
  ReorientationPlugin,
  UpdateOnChangePlugin,
} from "3d-tiles-renderer/plugins";
import { CesiumIonAuthPlugin } from "3d-tiles-renderer/core/plugins";
import {
  TilesPlugin,
  TilesRenderer,
  TilesAttributionOverlay,
} from "3d-tiles-renderer/r3f";
import type { FC, ReactNode } from "react";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

/*
  1. 使用Cesium Ion的API Token和资产ID加载3D Tiles, 数据源: Cesium ION

  2026-03-23 blitheli
*/

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

export interface CesiumGlobeProps {
  apiToken?: string;
  assetId?: number;
  showAttribution?: boolean;
  children?: ReactNode;
}

export const CesiumGlobe: FC<CesiumGlobeProps> = ({
  // Cesium Ion 默认 token (公共示例 token)
  apiToken = import.meta.env.CESIUM_ION_TOKEN ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4M2ZhYzM4My1lN2NhLTRjNTktODY1OC1jZDdmOTU3Y2ZjMGEiLCJpZCI6MTMwNTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjI0NzA5NzB9.rRTs6chsWJdo9KNYe5VjJj2fUzMHeniIJvFQOd0aLJU",
  // Aerometrex San Francisco High Resolution 3D Model (默认)
  assetId = 1415196,
  showAttribution = true,
  children,
}) => (
  <TilesRenderer key={assetId}>
    <TilesPlugin plugin={CesiumIonAuthPlugin} args={[{ apiToken, assetId }]} />
    <TilesPlugin plugin={GLTFExtensionsPlugin} dracoLoader={dracoLoader} />
    <TilesPlugin plugin={ReorientationPlugin} />
    <TilesPlugin plugin={UpdateOnChangePlugin} />
    {showAttribution && <TilesAttributionOverlay />}
    {children}
  </TilesRenderer>
);
