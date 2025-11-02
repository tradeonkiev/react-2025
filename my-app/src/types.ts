export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

type BaseElement = {
  id: string;
  position: Position;
  size: Size;
};
export type TextElement = BaseElement & {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
};

export type ImageElement = BaseElement & {
  type: 'image';
  src: string;
};

export type SlideElement = TextElement | ImageElement;

export type Background =
  | { type: 'none' }
  | { type: 'color'; value: string }
  | { type: 'image'; src: string };

export type Slide = {
  id: string;
  size: Size;
  background: Background;
  elements: SlideElement[];
};

type Selection = {
  slideIds: string[];
  elementIds: string[];
};

// types.ts - добавим новые типы
export type DragState = {
  isDragging: boolean;
  dragElementId: string | null;
  startPosition: Position;
  currentPosition: Position;
  offset: Position;
};

export type Presentation = {
  id: string;
  title: string;
  slides: Slide[];
  selection: Selection;
  dragState?: DragState; 
};