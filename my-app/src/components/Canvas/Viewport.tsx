import { ElementComponent } from "./ElementComponent"
import { getBackgroundStyle } from "../../utils"
import type { Slide, SlideElement, DragState } from "../../types"
import styles from './Viewport.module.css'

interface ViewportProps {
  slide: Slide;
  width: number;
  height: number;
  selectedElementIds?: string[];
  onElementClick?: (elementId: string, element: SlideElement) => void;
  onDragStart: (e: React.MouseEvent, elementId: string) => void;
  onDrag: (e: React.MouseEvent) => void;
  onDragEnd: () => void;
  dragState: DragState | null;
}

export const Viewport = (
  { 
    slide,
    width, 
    height, 
    selectedElementIds = [], 
    onElementClick,
    onDragStart,
    onDrag,
    onDragEnd,
    dragState
  } : ViewportProps
) => {
  const canvasScale = Math.min(width / slide.size.width, height / slide.size.height);

  return (
    <div
      className={styles['viewport-wrapper']}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
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
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          isDragging={dragState?.elementId === element.id}
        />
      ))}
    </div>
  )
}