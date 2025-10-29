import { ElementComponent } from "./ElementComponent"
import { getBackgroundStyle } from "../../utils"
import type { Slide } from "../../types"
import styles from './Viewport.module.css'
export const Viewport = (
    {slide, width, height} :
    {slide: Slide, width: number, height: number}
)  => {
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
            onClick={() => console.log(`${element.id}  ${element.size}`)}
            canvasScale={Math.min(width / slide.size.width, height / slide.size.height)}
          />
        ))}
      </div>
    )
}