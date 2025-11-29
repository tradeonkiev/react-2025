import { ElementComponent } from "./ElementComponent"
import { getBackgroundStyle } from "../../utils"
import type { Slide, DragState, ResizeState, ResizeHandle, GroupDragState, Position, Size } from "../../types"
import styles from './Viewport.module.css'

interface ViewportProps {
  slide: Slide;
  width: number;
  height: number;
  selectedElementIds?: string[];
  onElementClick?: (elementId: string, ctrlKey: boolean) => void;
  onDragStart: (e: React.MouseEvent, elementId: string) => void;
  onDragEnd: () => void;
  dragState: DragState | null;
  groupDragState?: GroupDragState | null;
  onResizeStart: (e: React.MouseEvent, elementId: string, handle: ResizeHandle) => void;
  onResizeEnd: () => void;
  resizeState: ResizeState | null;
  tempPositions?: Map<string, Position>;
  tempSize?: { elementId: string; size: Size; position: Position } | null;
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
  groupDragState,
  onResizeStart,
  onResizeEnd,
  resizeState,
  tempPositions,
  tempSize
}: ViewportProps) => {
  const canvasScale = Math.min(width / slide.size.width, height / slide.size.height);

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    if (onElementClick) {
      onElementClick(elementId, e.ctrlKey || e.metaKey);
    }
  };

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
        ...getBackgroundStyle(slide.background)
      }}
    >
      {slide.elements.map((element) => {
        const isDragging = dragState?.elementId === element.id || 
                          (groupDragState?.elementIds.includes(element.id) ?? false);
        
        const tempPosition = tempPositions?.get(element.id);
        const elementTempSize = tempSize?.elementId === element.id ? tempSize : undefined;
        
        return (
          <ElementComponent
            key={element.id}
            element={element}
            onClick={(e) => handleElementClick(element.id, e)}
            canvasScale={canvasScale}
            isSelected={selectedElementIds.includes(element.id)}
            onDragStart={onDragStart}
            isDragging={isDragging}
            onResizeStart={onResizeStart}
            resizeState={resizeState}
            tempPosition={tempPosition}
            tempSize={elementTempSize}
          />
        );
      })}
    </div>
  )
}