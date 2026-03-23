# React + TypeScript + Vite Three.js + webGPU测试

# webgpu 渲染管线
完美!现在我可以详细解释 `RenderPipeline` 的用法了。

## `RenderPipeline` 详解

### 基本概念

`RenderPipeline` 是 **Three.js WebGPU 渲染管线**,用于替代默认的渲染流程,实现自定义的后处理效果链。

### 在你代码中的使用

```188:197:e:\r3f-earth\src\pages\Atmosphere.tsx
  // 6. 最终后处理(附加 Dithering 去色带)
  const renderPipeline = useResource(
    () => new RenderPipeline(renderer, taaNode.add(dithering)),
    [renderer, taaNode],
  );

  // 渲染循环 —— 优先级 1 接管 R3F 默认渲染,由 RenderPipeline 全权负责绘制
  useGuardedFrame(() => {
    renderPipeline.render();
  }, 1);
```

### 工作原理

#### 1. **构造函数**
```typescript
new RenderPipeline(renderer, finalNode)
```
- **`renderer`** - WebGPU 渲染器
- **`finalNode`** - 最终的后处理节点(TSL 节点图的输出端)

#### 2. **你的后处理管线流程**

你的代码构建了一个完整的后处理链:

```
Scene → Pass → Aerial Perspective → Lens Flare → Tone Mapping → TAA → Dithering → 屏幕
```

让我逐步解释:

```143:192:e:\r3f-earth\src\pages\Atmosphere.tsx
  // ---- WebGPU 后处理管线 -------------------------------------------------------------

  // 1. 主渲染 pass(启用 MRT:颜色 + 高精度速度缓冲)
  // pass为WebGPU 后处理管线的节点函数,全称 Pass Node,本质是一个渲染通道节点。
  // 它把 scene + camera 的渲染结果捕获到 GPU 纹理缓冲区中,而不是直接输出到屏幕。之后可以从这个缓冲区里取出各种数据:
  const passNode = useResource(
    () =>
      pass(scene, camera, { samples: 0 }).setMRT(
        mrt({ output, velocity: highpVelocity }),
      ),
    [scene, camera],
  );

  const colorNode = passNode.getTextureNode("output");
  const depthNode = passNode.getTextureNode("depth");
  const velocityNode = passNode.getTextureNode("velocity");

  // 2. 空气透视 (Aerial Perspective)
  const aerialNode = useResource(
    () => aerialPerspective(atmosphereContext, colorNode, depthNode),
    [atmosphereContext, colorNode, depthNode],
  );

  // 3. 镜头光晕 (Lens Flare)
  const lensFlareNode = useResource(() => lensFlare(aerialNode), [aerialNode]);

  // 4. 色调映射 (AgX Tone Mapping, 曝光度 = 2)
  // story.js 原版通过 useToneMappingControls 交互调节,这里固定为 2
  const toneMappingNode = useResource(
    () => toneMapping(AgXToneMapping, uniform(2), lensFlareNode),
    [lensFlareNode],
  );

  // 5. 时域抗锯齿 (Temporal Anti-Aliasing)
  const taaNode = useResource(
    () =>
      temporalAntialias(highpVelocity)(
        toneMappingNode,
        depthNode,
        velocityNode,
        camera,
      ),
    [camera, depthNode, velocityNode, toneMappingNode],
  );

  // 6. 最终后处理(附加 Dithering 去色带)
  const renderPipeline = useResource(
    () => new RenderPipeline(renderer, taaNode.add(dithering)),
    [renderer, taaNode],
  );
```

**处理流程:**

1. **Pass Node** - 渲染场景到多个纹理(颜色、深度、速度)
2. **Aerial Perspective** - 添加大气透视效果(远处物体会有大气散射)
3. **Lens Flare** - 添加镜头光晕(太阳/光源的眩光效果)
4. **Tone Mapping** - 色调映射,将 HDR 颜色映射到屏幕范围
5. **TAA** - 时域抗锯齿,通过多帧混合减少锯齿
6. **Dithering** - 抖动去色带,避免渐变产生的色带

#### 3. **渲染执行**
```typescript
useGuardedFrame(() => {
  renderPipeline.render();
}, 1);
```
- 每一帧调用 `renderPipeline.render()` 执行整个管线
- 优先级 `1` 确保在 R3F 默认渲染之前执行,完全接管渲染流程

### 核心优势

1. **声明式后处理** - 通过 TSL 节点图构建,不需要手动管理 RenderTarget 和 Pass
2. **GPU 优化** - WebGPU 原生支持,性能优于传统 WebGL PostProcessing
3. **模块化** - 每个效果都是独立的节点,易于组合和调整
4. **自动资源管理** - RenderPipeline 自动处理纹理和缓冲区的生命周期

### 简单类比

把 `RenderPipeline` 想象成一个**图像处理工厂的流水线**:
- 原始场景渲染 → 传送带上的原材料
- 各种后处理节点 → 流水线上的加工站
- RenderPipeline → 整条流水线的控制系统
- `render()` → 启动流水线按钮

这样你就能用声明式的方式构建复杂的视觉效果,而不需要手动管理每个渲染步骤!