import React from 'react';
import type { Presentation, SlideElement } from './types';
import { Header } from './components/Header/Header';
import { SlidesList } from './components/SlidesList/SlidesList';
import { Editor } from './components/Editor/Editor';
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
  selectElement 
} from './Store/editor';
import { ToolBar } from './components/ToolBar/ToolBar';

interface AppProps {
  presentation: Presentation;
}

function App({ presentation }: AppProps) {
  const currentSlideId = presentation.selection.slideIds[0];
  const currentSlide = presentation.slides.find(slide => slide.id === currentSlideId) || presentation.slides[0];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTitle, { title: e.target.value });
  };

  const handleElementClick = (elementId: string, element: SlideElement) => {
    dispatch(selectElement, { elementId });
  };

  const handleSlideClick = (slideId: string, index: number) => {
    dispatch(selectSlide, { slideId });
  };

  const handleToolClick = (toolName: string) => {
    switch(toolName) {
      case 'текста':
        dispatch(addTextElement, { slideId: currentSlideId });
        break;
      case 'картинки':
        dispatch(addImageElement, { slideId: currentSlideId });
        break;
      case 'background':
        dispatch(cycleBackground, { slideId: currentSlideId });
        break;
      case 'мусорка':
        dispatch(deleteSelectedElements, { slideId: currentSlideId });
        break;
      default:
        console.log(`Инструмент: ${toolName}`);
    }
  };

  const handleAddSlide = () => {
    dispatch(addSlide);
  };

  const handleDeleteSlide = (slideId: string, index: number) => {
    dispatch(deleteSlide, { slideId });
  };

  const handleHeaderAction = (action: string) => {
    console.log(`Действие: ${action}`);
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
        />
        
        <Editor 
          slide={currentSlide}
          onElementClick={handleElementClick}
          width={1280}
          height={720}
          selectedElementIds={presentation.selection.elementIds}
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