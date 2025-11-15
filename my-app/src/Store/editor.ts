import type { Presentation, Slide, Size, TextElement, ImageElement, Background, Position} from '../types';
import { changeSlideBackground } from '../utils';

let editor: Presentation | null = null;
let editorChangeHandler: (() => void) | null = null;

export const updateTitle = (editor: Presentation, params: { title: string }): Presentation => {
  return {
    ...editor,
    title: params.title
  };
};

export const selectElement = (
  editor: Presentation,
  params: {
    elementId: string;
    addToSelection?: boolean;
  }
): Presentation => {
  if (params.addToSelection) { 
    const elementIds = editor.selection.elementIds.includes(params.elementId)
      ? editor.selection.elementIds.filter(id => id !== params.elementId)
      : [...editor.selection.elementIds, params.elementId];
    
    return {
      ...editor,
      selection: {
        ...editor.selection,
        elementIds
      }
    };
  }
  
  return {
    ...editor,
    selection: {
      ...editor.selection,
      elementIds: [params.elementId]
    }
  };
};

export const selectMultipleElements = (
  editor: Presentation,
  params: { elementIds: string[] }
): Presentation => {
  return {
    ...editor,
    selection: {
      ...editor.selection,
      elementIds: params.elementIds
    }
  };
};

export const reorderSlides = (
  editor: Presentation,
  params: { fromIndices: number[]; toIndex: number }
): Presentation => {
  const { fromIndices, toIndex } = params;
  const sortedIndices = [...fromIndices].sort((a, b) => a - b);
  
  const newSlides = [...editor.slides];
  const movedSlides = sortedIndices.map(index => newSlides[index]);
  
  for (let i = sortedIndices.length - 1; i >= 0; i--) {
    newSlides.splice(sortedIndices[i], 1);
  }

  let adjustedToIndex = toIndex;
  for (const fromIndex of sortedIndices) {
    console.log(fromIndex, toIndex)
    if (fromIndex < toIndex) {
      adjustedToIndex--;
    }
  }

  if (toIndex != 0) adjustedToIndex += 1
  newSlides.splice(adjustedToIndex, 0, ...movedSlides);

  return {
    ...editor,
    slides: newSlides,
    selection: {
      ...editor.selection,
      slideIds: movedSlides.map(s => s.id)
    }
  };
};

export const deselectAll = (editor: Presentation): Presentation => {
  return {
    ...editor,
    selection: {
      slideIds: [],
      elementIds: [],
    }
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

export const deleteSlide = (
  editor: Presentation, 
  params: { slideId: string }
): Presentation => {
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

export const selectSlide = (
  editor: Presentation, 
  params: { slideId: string; addToSelection?: boolean }
): Presentation => {
  if (params.addToSelection) {
    const slideIds = editor.selection.slideIds.includes(params.slideId)
      ? editor.selection.slideIds.filter(id => id !== params.slideId)
      : [...editor.selection.slideIds, params.slideId];
    
    return {
      ...editor,
      selection: {
        ...editor.selection,
        slideIds,
        elementIds: []
      }
    };
  }
  
  return {
    ...editor,
    selection: {
      ...editor.selection,
      slideIds: [params.slideId],
      elementIds: []
    }
  };
};

export const updateElementPosition = (
  editor: Presentation,
  params: {
    slideId: string;
    elementId: string;
    position: Position;
  }
): Presentation => {
  const updatedSlides = editor.slides.map((slide) => {
    if (slide.id !== params.slideId) return slide;

    return {
      ...slide,
      elements: slide.elements.map((element) => {
        if (element.id === params.elementId) {
          return {
            ...element,
            position: params.position,
          };
        }
        return element;
      }),
    };
  });

  return {
    ...editor,
    slides: updatedSlides,
  };
};

export const updateGroupPositions = (
  editor: Presentation,
  params: {
    slideId: string;
    updates: { elementId: string; position: Position }[];
  }
): Presentation => {
  const updatedSlides = editor.slides.map((slide) => {
    if (slide.id !== params.slideId) return slide;

    return {
      ...slide,
      elements: slide.elements.map((element) => {
        const update = params.updates.find(u => u.elementId === element.id);
        if (update) {
          return {
            ...element,
            position: update.position,
          };
        }
        return element;
      }),
    };
  });

  return {
    ...editor,
    slides: updatedSlides,
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
  const Images: string[] = [
    'https://i.pinimg.com/736x/62/64/57/626457731d0ab3dc14118c6c4f348661.jpg', 
    'https://i.pinimg.com/1200x/1f/c7/cd/1fc7cdb1d3fc240477dc9c215fa6dc09.jpg', 
    'https://i.pinimg.com/736x/c5/fc/4a/c5fc4ad0137578f3ba6673e9426560cb.jpg', 
    'https://i.pinimg.com/736x/46/8f/5c/468f5c5140266bf9898b5d363ec5032d.jpg', 
    'https://i.pinimg.com/736x/ca/32/79/ca32795567326c5385d89dce5fb47f2f.jpg', 
    'https://i.pinimg.com/736x/29/7e/8c/297e8c19a0057ac9f2a5a479551e4b19.jpg'
  ];
  
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

export const cycleBackground = (editor: Presentation, params: { slideId: string }): Presentation => {
  const backgrounds: Background[] = [
    { type: 'color', value: '#ffffff' },  
    { type: 'color', value: '#f3f4f6' },   
    { type: 'color', value: '#3b82f6' },  
    { type: 'color', value: '#ef4444' },   
    { type: 'color', value: '#10b981' },    
    { type: 'color', value: '#f59e0b' },
    { type: 'image', src: 'https://i.pinimg.com/736x/76/88/51/768851d3863fc7d8403d43e572ceb350.jpg'},
    { type: 'image', src: 'https://i.pinimg.com/736x/c9/55/6c/c9556c51f8732bdeac67eafebdaeb6d3.jpg'},
    { type: 'none' },                   
  ];

  const newBackground = backgrounds[Math.ceil(Math.random() * (backgrounds.length - 1))];

  return changeSlideBackground(editor, { 
    slideId: params.slideId, 
    background: newBackground 
  });
};

export const dispatch = (modifier: Function, params?: any): void => {
  if (!editor) return;

  const newEditor = modifier(editor, params);
  editor = newEditor;

  if (editorChangeHandler) {
    editorChangeHandler();
  }
};

export const setEditor = (newEditor: Presentation): Presentation => {
  editor = newEditor;
  return editor;
};

export const getEditor = (): Presentation | null => {
  return editor;
};

export const addEditorChangeHandler = (handler: () => void): void => {
  editorChangeHandler = handler;
};

export const updateElementSize = (
  editor: Presentation,
  params: {
    slideId: string;
    elementId: string;
    size: Size;
    position: Position;
  }
): Presentation => {
  const updatedSlides = editor.slides.map((slide) => {
    if (slide.id !== params.slideId) return slide;

    return {
      ...slide,
      elements: slide.elements.map((element) => {
        if (element.id === params.elementId) {
          return {
            ...element,
            size: params.size,
            position: params.position,
          };
        }
        return element;
      }),
    };
  });

  return {
    ...editor,
    slides: updatedSlides,
  };
};