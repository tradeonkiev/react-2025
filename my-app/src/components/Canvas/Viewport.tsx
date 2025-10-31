import { ElementComponent } from "./ElementComponent"
import { getBackgroundStyle } from "../../utils"
import type { Slide, SlideElement } from "../../types"
import styles from './Viewport.module.css'

interface ViewportProps {
  slide: Slide;
  width: number;
  height: number;
  selectedElementIds?: string[];
  onElementClick?: (elementId: string, element: SlideElement) => void;
}

export const Viewport = (
  { slide, width, height, selectedElementIds = [], onElementClick }: ViewportProps
) => {
  const canvasScale = Math.min(width / slide.size.width, height / slide.size.height);

  return (
    <div
      className={styles['viewport-wrapper']}
      style={{
        width: width,
        height: height,
        overflow: "hidden",
        ...getBackgroundStyle(slide.background)
      }}
    >
      {slide.elements.map((element) => (
        <ElementComponent
          key={element.id}
          element={element}
          onClick={() => onElementClick?.(element.id, element)}
          canvasScale={canvasScale}
          isSelected={selectedElementIds.includes(element.id)}
        />
      ))}
    </div>
  )
}