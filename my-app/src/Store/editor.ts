import type { Presentation, Slide, TextElement, ImageElement, Background } from '../types';
import { changeSlideBackground } from '../utils';

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

export const selectSlide = (editor: Presentation, params: { slideId: string }): Presentation => {
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
  
  const Images: string[] = 
  [
    'https://i.pinimg.com/736x/62/64/57/626457731d0ab3dc14118c6c4f348661.jpg', 
    'https://i.pinimg.com/1200x/1f/c7/cd/1fc7cdb1d3fc240477dc9c215fa6dc09.jpg', 
    'https://i.pinimg.com/736x/c5/fc/4a/c5fc4ad0137578f3ba6673e9426560cb.jpg', 
    'https://i.pinimg.com/736x/46/8f/5c/468f5c5140266bf9898b5d363ec5032d.jpg', 
    'https://i.pinimg.com/736x/ca/32/79/ca32795567326c5385d89dce5fb47f2f.jpg', 
    'https://i.pinimg.com/736x/29/7e/8c/297e8c19a0057ac9f2a5a479551e4b19.jpg'
  ]
  const newImageElement: ImageElement = {
    id: `image-${Date.now()}`,
    type: 'image',
    src: Images[Math.ceil(Math.random() * 5)],
    position: { x: 150, y: 150 },
    size: { width: 500, height: 500 }
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
    if (slide.id !== params.slideId) {
      return slide;
    }

    const remainingElements = slide.elements.filter(
      element => !editor.selection.elementIds.includes(element.id)
    );

    return {
      ...slide,
      elements: remainingElements
    };
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

export const cycleBackground = (editor: Presentation, params: { slideId: string }): Presentation => {
  const backgrounds: Background[] = [
    { type: 'color', value: '#ffffff' },  
    { type: 'color', value: '#f3f4f6' },   
    { type: 'color', value: '#3b82f6' },  
    { type: 'color', value: '#ef4444' },   
    { type: 'color', value: '#10b981' },    
    { type: 'color', value: '#f59e0b' },   
    { type: 'none' },                   
  ];

  const currentSlide = editor.slides.find(slide => slide.id === params.slideId);
  if (!currentSlide) return editor;
  const currentBgIndex = backgrounds.findIndex(bg => {
    if (bg.type !== currentSlide.background.type) return false;
    if (bg.type === 'color' && currentSlide.background.type === 'color') {
      return bg.value === currentSlide.background.value;
    }
    return true;
  });
  
  const nextBgIndex = currentBgIndex === -1 ? 0 : (currentBgIndex + 1) % backgrounds.length;
  const newBackground = backgrounds[nextBgIndex];

  return changeSlideBackground(editor, { 
    slideId: params.slideId, 
    background: newBackground 
  });
};

export const selectElement = (editor: Presentation, params: { elementId: string }): Presentation => {
  return {
    ...editor,
    selection: {
      ...editor.selection,
      elementIds: [params.elementId]
    }
  };
};

export const dispatch = (modifier: Function, params?: any): void => {
  if (!editor) return;

  const newEditor = modifier(editor, params);
  console.log('Old state:', editor);
  console.log('New state:', newEditor);
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