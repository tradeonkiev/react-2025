import React, { useState } from 'react';
import type { Presentation, SlideElement } from './types';
import { initialPresentation } from './data';
import { Header } from './components/Header/Header';
import { SlidesList } from './components/SlidesList/SlidesList';
import { Editor } from './components/Editor/Editor';
import { ToolBar } from './components/ToolBar/ToolBar';

function App() {
  const [presentation, setPresentation] = useState<Presentation>(initialPresentation);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = presentation.slides[currentSlideIndex];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    console.log('Новое название:', newTitle);
    setPresentation({ ...presentation, title: newTitle });
  };

  const handleElementClick = (elementId: string, element: SlideElement) => {
    const bgColor = element.type === 'text' ? element.color : '#ffffff';
    console.log(`ID элемента: ${elementId}, Цвет фона: ${bgColor}`);
  };

  const handleSlideClick = (slideId: string, index: number) => {
    console.log(`ID слайда: ${slideId}, Порядковый номер: ${index + 1}`);
    setCurrentSlideIndex(index);
  };

  const handleToolClick = (buttonName: string) => {
    console.log(`Нажата кнопка: ${buttonName}`);
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
      onClickElement={handleToolClick}
      />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SlidesList 
          slides={presentation.slides}
          currentSlideIndex={currentSlideIndex}
          onSlideClick={handleSlideClick}
        />
        
        <Editor 
          slide={currentSlide}
          onElementClick={handleElementClick}
          onToolClick={handleToolClick}
          width={1280}
          height={720}
        />
        
        <ToolBar
          onToolClick={(tool) => {console.log(tool)}}
        />
        
        {/* <PropertiesPanel 
          slide={currentSlide}
          currentSlideIndex={currentSlideIndex}
          totalSlides={presentation.slides.length}
        /> */}
      </div>
    </div>
  );
}

export default App;