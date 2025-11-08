import { ElementComponent } from "./ElementComponent"
import { getBackgroundStyle } from "../../utils"
import type { Slide, SlideElement, DragState, ResizeState, ResizeHandle } from "../../types"
import styles from './Viewport.module.css'

interface ViewportProps {
  slide: Slide;
  width: number;
  height: number;
  selectedElementIds?: string[];
  onElementClick?: (elementId: string, element: SlideElement) => void;
  onDragStart: (e: React.MouseEvent, elementId: string) => void;
  onDragEnd: () => void;
  dragState: DragState | null;
  onResizeStart: (e: React.MouseEvent, elementId: string, handle: ResizeHandle) => void;
  onResizeEnd: () => void;
  resizeState: ResizeState | null;
}

export const Viewport = ({
  slide,
  width,
  height,
  selectedElementIds = [],
  onElementClick,
  onDragStart,
  onDragEnd,
  dragState,
  onResizeStart,
  onResizeEnd,
  resizeState
}: ViewportProps) => {
  const canvasScale = Math.min(width / slide.size.width, height / slide.size.height);

  return (
    <div
      className={styles['viewport-wrapper']}
      onMouseUp={() => {
        onDragEnd();
        onResizeEnd();
      }}
      onMouseLeave={() => {
        onDragEnd();
        onResizeEnd();
      }}
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
          isDragging={dragState?.elementId === element.id}
          onResizeStart={onResizeStart}
          resizeState={resizeState}
        />
      ))}
    </div>
  )
}