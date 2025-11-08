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

export type Presentation = {
  id: string;
  title: string;
  slides: Slide[];
  selection: Selection;
};

export type DragState = {
  elementId: string;
  startX: number;
  startY: number;
  initialElementX: number;
  initialElementY: number;
};

export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e';

export type ResizeState = {
  elementId: string;
  handle: ResizeHandle;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startPosX: number;
  startPosY: number;
};