import type { Presentation, Slide, SlideElement, Background, TextElement, ImageElement } from '../../types';

// Модель редактора
let editor: Presentation | null = null;
let editorChangeHandler: (() => void) | null = null;

// Функции-модификаторы
export const setEditor = (newEditor: Presentation): Presentation => {
  editor = newEditor;
  return editor;
};

export const updateTitle = (editor: Presentation, params: { title: string }): Presentation => {
  return {
    ...editor,
    title: params.title
  };
};

export const addSlide = (editor: Presentation): Presentation => {
  const newSlide: Slide = {
    id: `slide-${Date.now()}`,
    size: { width: 1280, height: 720 },
    background: { type: 'color', value: '#ffffff' },
    elements: []
  };

  return {
    ...editor,
    slides: [...editor.slides, newSlide],
    selection: {
      ...editor.selection,
      slideIds: [newSlide.id]
    }
  };
};

export const deleteSlide = (editor: Presentation, params: { slideId: string }): Presentation => {
  if (editor.slides.length <= 1) {
    return editor;
  }

  const updatedSlides = editor.slides.filter(slide => slide.id !== params.slideId);
  const currentSelection = editor.selection;

  return {
    ...editor,
    slides: updatedSlides,
    selection: {
      ...currentSelection,
      slideIds: currentSelection.slideIds.filter(id => id !== params.slideId)
    }
  };
};

export const selectSlide = (editor: Presentation, params: { slideId: string; slideIndex: number }): Presentation => {
  return {
    ...editor,
    selection: {
      ...editor.selection,
      slideIds: [params.slideId],
      elementIds: []
    }
  };
};

export const addTextElement = (editor: Presentation, params: { slideId: string }): Presentation => {
  const newTextElement: TextElement = {
    id: `text-${Date.now()}`,
    type: 'text',
    content: 'Новый текст',
    position: { x: 100, y: 100 },
    size: { width: 200, height: 50 },
    color: '#000000',
    fontFamily: 'Arial',
    fontSize: 24
  };

  const updatedSlides = editor.slides.map(slide => {
    if (slide.id === params.slideId) {
      return {
        ...slide,
        elements: [...slide.elements, newTextElement]
      };
    }
    return slide;
  });

  return {
    ...editor,
    slides: updatedSlides,
    selection: {
      ...editor.selection,
      elementIds: [newTextElement.id]
    }
  };
};

export const addImageElement = (editor: Presentation, params: { slideId: string }): Presentation => {
  const newImageElement: ImageElement = {
    id: `image-${Date.now()}`,
    type: 'image',
    src: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Image',
    position: { x: 150, y: 150 },
    size: { width: 300, height: 200 }
  };

  const updatedSlides = editor.slides.map(slide => {
    if (slide.id === params.slideId) {
      return {
        ...slide,
        elements: [...slide.elements, newImageElement]
      };
    }
    return slide;
  });

  return {
    ...editor,
    slides: updatedSlides,
    selection: {
      ...editor.selection,
      elementIds: [newImageElement.id]
    }
  };
};

export const deleteSelectedElements = (editor: Presentation, params: { slideId: string }): Presentation => {
  const updatedSlides = editor.slides.map(slide => {
    if (slide.id === params.slideId) {
      // Удаляем только выбранные элементы
      const elementsToKeep = slide.elements.filter(
        element => !editor.selection.elementIds.includes(element.id)
      );
      
      return {
        ...slide,
        elements: elementsToKeep
      };
    }
    return slide;
  });

  return {
    ...editor,
    slides: updatedSlides,
    selection: {
      ...editor.selection,
      elementIds: []
    }
  };
};

export const deleteAllElements = (editor: Presentation, params: { slideId: string }): Presentation => {
  const updatedSlides = editor.slides.map(slide => {
    if (slide.id === params.slideId) {
      return {
        ...slide,
        elements: []
      };
    }
    return slide;
  });

  return {
    ...editor,
    slides: updatedSlides,
    selection: {
      ...editor.selection,
      elementIds: []
    }
  };
};

export const changeBackground = (editor: Presentation, params: { slideId: string }): Presentation => {
  const backgrounds: Background[] = [
    { type: 'none' },
    { type: 'color', value: '#ffffff' },
    { type: 'color', value: '#f3f4f6' },
    { type: 'color', value: '#3b82f6' },
    { type: 'color', value: '#ef4444' },
    { type: 'color', value: '#10b981' },
    { type: 'color', value: '#f59e0b' },
  ];

  const currentSlide = editor.slides.find(slide => slide.id === params.slideId);
  if (!currentSlide) return editor;

  const currentBgIndex = backgrounds.findIndex(bg => {
    if (bg.type !== currentSlide.background.type) return false;
    if (bg.type === 'color' && currentSlide.background.type === 'color') {
      return bg.value === currentSlide.background.value;
    }
    if (bg.type === 'image' && currentSlide.background.type === 'image') {
      return bg.src === currentSlide.background.src;
    }
    return bg.type === currentSlide.background.type;
  });
  
  const nextBgIndex = (currentBgIndex + 1) % backgrounds.length;
  const newBackground = backgrounds[nextBgIndex];

  const updatedSlides = editor.slides.map(slide => {
    if (slide.id === params.slideId) {
      return {
        ...slide,
        background: newBackground
      };
    }
    return slide;
  });

  return {
    ...editor,
    slides: updatedSlides
  };
};

export const selectElement = (editor: Presentation, params: { elementId: string; slideId: string }): Presentation => {
  return {
    ...editor,
    selection: {
      ...editor.selection,
      elementIds: [params.elementId]
    }
  };
};

// Dispatch функция
export const dispatch = (modifier: Function, params?: any): void => {
  if (!editor) return;

  const newEditor = modifier(editor, params);
  editor = newEditor;

  if (editorChangeHandler) {
    editorChangeHandler();
  }
};

export const getEditor = (): Presentation | null => {
  return editor;
};

export const addEditorChangeHandler = (handler: () => void): void => {
  editorChangeHandler = handler;
};