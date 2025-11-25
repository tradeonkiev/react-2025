import React, { useEffect } from 'react';
import type { Position, Size } from '../src/types';
import { Header } from '../src/components/Header/Header';
import { SlidesList } from '../src/components/SlidesList/SlidesList';
import { Editor } from '../src/components/Editor/Editor';
import { ToolBar } from '../src/components/ToolBar/ToolBar';
import { useAppDispatch, useAppSelector } from '../src/Store/hooks';

import {
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
  updateGroupPositions,
  reorderSlides
} from '../src/Store/editorSlice';

import { undo, redo } from "../src/Store/historySlice";

const App = () => {
  const dispatch = useAppDispatch();

  const presentation = useAppSelector((state) => state.history.present);

  const currentSlideId = presentation.selection.slideIds[0];
  const currentSlide = presentation.slides.find(slide => slide.id === currentSlideId) || presentation.slides[0];

  //TODO: вынести в хук
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const isMac = navigator.userAgent.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (!mod) return;

      if (e.key === "z") {
        e.preventDefault();
        if (isMac && e.shiftKey) {
          dispatch(redo());
        } else {
          dispatch(undo());
        }
      }

      if (e.key === "y") {
        e.preventDefault();
        dispatch(redo());
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTitle({ title: e.target.value }));
  };

  const handleElementClick = (elementId: string, ctrlKey: boolean) => {
    dispatch(selectElement({ elementId, addToSelection: ctrlKey }));
  };

  const handleSlideClick = (slideId: string, index: number, ctrlKey: boolean) => {
    dispatch(selectSlide({ slideId, addToSelection: ctrlKey }));
  };

  const handleDeselectAll = () => {
    dispatch(deselectAll());
  };

  const handleUpdateElementPosition = (elementId: string, position: Position) => {
    dispatch(updateElementPosition({ slideId: currentSlideId, elementId, position }));
  };

  const handleUpdateElementSize = (elementId: string, size: Size, position: Position) => {
    dispatch(updateElementSize({ slideId: currentSlideId, elementId, size, position }));
  };

  const handleUpdateGroupPositions = (updates: Array<{ elementId: string; position: Position }>) => {
    dispatch(updateGroupPositions({ slideId: currentSlideId, updates }));
  };

  const handleToolClick = (toolName: string) => {
    switch (toolName) {
      case "undo":
        dispatch(undo());
        break;
      case "redo":
        dispatch(redo());
        break;
      case "text":
        dispatch(addTextElement({ slideId: currentSlideId }));
        break;
      case "image":
        dispatch(addImageElement({ slideId: currentSlideId }));
        break;
      case "background":
        dispatch(cycleBackground({ slideId: currentSlideId }));
        break;
      case "trash":
        dispatch(deleteSelectedElements({ slideId: currentSlideId }));
        break;
      default:
        console.log("Unknown tool:", toolName);
    }
  };

  const handleAddSlide = () => {
    dispatch(addSlide());
  };

  const handleDeleteSlide = (slideId: string) => {
    dispatch(deleteSlide({ slideId }));
  };

  const handleHeaderAction = (action: string) => {
    console.log(`Действие: ${action}`);
  };

  const handleReorderSlides = (fromIndices: number[], toIndex: number) => {
    dispatch(reorderSlides({ fromIndices, toIndex }));
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
          selectedSlideIds={presentation.selection.slideIds}
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
          onUpdateGroupPositions={handleUpdateGroupPositions}
          onDeselectAll={handleDeselectAll}
        />

        <ToolBar
          onToolClick={handleToolClick}
          selectedElementIds={presentation.selection.elementIds}
        />
      </div>
    </div>
  );
};

export default App;


//TODO:  избавиться от пропсов через слайсы
// костыль: тротул и дебаунсер