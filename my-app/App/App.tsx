import React from 'react';
import type { Presentation, Position, Size } from '../src/types';
import { Header } from '../src/components/Header/Header';
import { SlidesList } from '../src/components/SlidesList/SlidesList';
import { Editor } from '../src/components/Editor/Editor';
import { 
  dispatch, 
  updateTitle, 
  addSlide, 
  deleteSlide, 
  selectSlide, 
  addTextElement, 
  addImageElement, 
  deleteSelectedElements,
  cycleBackground,
  selectElement,
  deselectAll,
  updateElementPosition,
  updateElementSize,
  reorderSlides
} from '../src/Store/editor';
import { ToolBar } from '../src/components/ToolBar/ToolBar';

interface AppProps {
  presentation: Presentation;
}

function App({ presentation }: AppProps) {
  const currentSlideId = presentation.selection.slideIds[0];
  const currentSlide = presentation.slides.find(slide => slide.id === currentSlideId) || presentation.slides[0];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTitle, { title: e.target.value });
  };

  const handleElementClick = (elementId: string) => {
    dispatch(selectElement, { elementId });
  };

  const handleSlideClick = (slideId: string) => {
    dispatch(selectSlide, { slideId });
  };

  const handleDeselectAll = () => {
    dispatch(deselectAll)
  }

  const handleUpdateElementPosition = (elementId: string, position: Position) => {
    dispatch(updateElementPosition, {slideId: currentSlideId, elementId, position})
  }

  const handleUpdateElementSize = (elementId: string, size: Size, position: Position) => {
    dispatch(updateElementSize, {slideId: currentSlideId, elementId, size, position})
  }

  const handleToolClick = (toolName: string) => {
    switch(toolName) {
      case 'text':
        dispatch(addTextElement, { slideId: currentSlideId });
        break;
      case 'image':
        dispatch(addImageElement, { slideId: currentSlideId });
        break;
      case 'background':
        dispatch(cycleBackground, { slideId: currentSlideId });
        break;
      case 'trash':
        dispatch(deleteSelectedElements, { slideId: currentSlideId });
        break;
      default:
        console.log(`tool: ${toolName}`);
    }
  };

  const handleAddSlide = () => {
    dispatch(addSlide);
  };

  const handleDeleteSlide = (slideId: string) => {
    dispatch(deleteSlide, { slideId });
  };

  const handleHeaderAction = (action: string) => {
    console.log(`Действие: ${action}`);
  };

  const handleReorderSlides = (fromIndex: number, toIndex: number) => {
    dispatch(reorderSlides, { fromIndex, toIndex });
  };

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: "Segoe UI",
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <Header 
        title={presentation.title} 
        onTitleChange={handleTitleChange} 
        onClickElement={handleHeaderAction}
      />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SlidesList 
          slides={presentation.slides}
          currentSlideIndex={presentation.slides.findIndex(slide => slide.id === currentSlideId)}
          onSlideClick={handleSlideClick}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
          onReorderSlides={handleReorderSlides}
        />
        
        <Editor 
          slide={currentSlide}
          onElementClick={handleElementClick}
          width={1280}
          height={720}
          selectedElementIds={presentation.selection.elementIds}
          onUpdateElementPosition={handleUpdateElementPosition}
          onUpdateElementSize={handleUpdateElementSize}
          onDeselectAll={handleDeselectAll}
        />
        <ToolBar
          onToolClick={handleToolClick}
          selectedElementIds={presentation.selection.elementIds}
        />
      </div>
    </div>
  );
}

export default App;