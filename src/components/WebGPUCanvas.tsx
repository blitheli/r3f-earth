import styled from '@emotion/styled'
// 使用type表示只导出类型，不导入实际代码，这样可以避免引入不必要的代码。
import { Canvas, type CanvasProps } from '@react-three/fiber'
import { atom, useAtomValue } from 'jotai'
import { useEffect, useRef, type FC } from 'react'
import type { WebGPURendererParameters } from 'three/src/renderers/webgpu/WebGPURenderer.js'
import { WebGPURenderer, type Renderer } from 'three/webgpu'
import { Stats } from './Stats'

/*availableAtom 是一个异步 atom，表示 WebGPU 是否可用。
  atom 用于创建一个“原子”状态单元，可以被 React 组件读取和订阅。
  你可以把它理解为一个可响应的变量，组件可以用 useAtom 读取它的值。
*/
export const availableAtom = atom(
  async () =>
    typeof navigator !== 'undefined' &&
    navigator.gpu !== undefined &&
    (await navigator.gpu.requestAdapter()) != null
)

// 一个用于 React 的 CSS-in-JS 库 Emotion 的子模块，提供 styled 组件的写法，类似于 styled-components。
const MessageElement = styled('div')`
  position: absolute;
  top: 16px;
  right: 16px;
  left: 16px;
  color: white;
  font-size: small;
  letter-spacing: 0.02em;
  text-align: center;
`

// 若不支持WebGPU或强制WebGL, 则显示WebGL2替代方案的提示信息。
// const 组件名: FC<props类型> = (props) => { ... } 就是声明一个带类型的函数组件。
const Message: FC<{ forceWebGL: boolean }> = ({ forceWebGL }) => {
  const available = useAtomValue(availableAtom)
  if (!available) {
    return (
      <MessageElement>
        你的浏览器还不支持 WebGPU, 正在使用 WebGL2 作为替代方案。
      </MessageElement>
    )
  }
  if (forceWebGL) {
    return <MessageElement>正在使用 WebGL2 作为替代方案。</MessageElement>
  }
  return null
}

//声明了 WebGPUCanvas 组件的 props 类型，继承了大部分 Canvas 的属性(除了gl)，增加了自定义的 renderer 配置和初始化回调。
// renderer 既有 WebGPURendererParameters 的属性，也有 onInit 方法。
// onInit 是可选方法，参数是 WebGPURenderer，返回值可以是 void 或 Promise<void>
export interface WebGPUCanvasProps extends Omit<CanvasProps, 'gl'> {
  renderer?: WebGPURendererParameters & {
    onInit?: (renderer: WebGPURenderer) => void | Promise<void>
  }
  forceWebGL?: boolean  // 是否强制使用 WebGL，即使 WebGPU 可用
  pixelRatio?: number   // 设备像素比，默认为 1，可以根据需要调整以提高渲染质量或性能
}

// WebGPUCanvas 是一个 React 函数组件，接受 WebGPUCanvasProps 作为 props
export const WebGPUCanvas: FC<WebGPUCanvasProps> = ({
  renderer: { onInit, ...otherProps } = {},
  forceWebGL: forceWebGLProp = false,  // 默认使用 WebGPU，除非 forceWebGLProp 为 true 或 WebGPU 不可用
  pixelRatio: pixelRatioProp = 1,      // 默认像素比为 1，可以根据需要调整
  children,
  ...canvasProps
}) => {
  const available = useAtomValue(availableAtom)
  // 如果forceWebGL为true或WebGPU不可用，则强制使用WebGL
  const forceWebGL = forceWebGLProp || !available
  const pixelRatio = pixelRatioProp

  // 创建一个可变的引用对象，可以在组件内存储任意值，且不会因组件重新渲染而丢失
  const ref = useRef<Renderer>(null)
  useEffect(() => {
    return () => {
      // WORKAROUND: Renderer won't be disposed when used in Storybook.
      setTimeout(() => {
        ref.current?.dispose()
      }, 500)
    }
  }, [])

  return (
    <>
      <Canvas
        key={forceWebGL ? 'webgl' : 'webgpu'}
        {...canvasProps}
        gl={async props => {
          const renderer = new WebGPURenderer({
            ...(props as any),
            ...otherProps,
            forceWebGL
          })
          ref.current = renderer
          await renderer.init()
          renderer.highPrecision = true
          // 如果 onInit 存在，则调用它并传入 renderer 作为参数，等待其完成（如果返回 Promise）。
          // 这样可以让用户在 renderer 初始化后执行一些自定义的逻辑。
          await onInit?.(renderer)
          return renderer
        }}
        dpr={pixelRatio}
      >
        {children}  
        <Stats />
      </Canvas>
      <Message forceWebGL={forceWebGL} />
    </>
  )
}
