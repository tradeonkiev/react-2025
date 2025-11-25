import type { Presentation } from "../../types";
import type { PayloadAction } from "@reduxjs/toolkit";

export const selectElement = (
  state: Presentation,
  action: PayloadAction<{ elementId: string; addToSelection?: boolean }>
) => {
  const { elementId, addToSelection } = action.payload;
  
  if (addToSelection) {
    if (state.selection.elementIds.includes(elementId)) {
      state.selection.elementIds = state.selection.elementIds.filter(
        id => id !== elementId
      );
    } else {
      state.selection.elementIds.push(elementId);
    }
  } else {
    state.selection.elementIds = [elementId];
  }
}

export const selectMultipleElements =  (
  state: Presentation,
  action: PayloadAction<{ elementIds: string[] }>
) => {
  state.selection.elementIds = action.payload.elementIds;
}

export const selectSlide =  (
  state: Presentation,
  action: PayloadAction<{ slideId: string; addToSelection?: boolean }>
) => {
  const { slideId, addToSelection } = action.payload;

  if (addToSelection) {
    if (state.selection.slideIds.includes(slideId)) {
      state.selection.slideIds = state.selection.slideIds.filter(
        id => id !== slideId
      );
    } else {
      state.selection.slideIds.push(slideId);
    }
  } else {
    state.selection.slideIds = [slideId];
  }
  
  state.selection.elementIds = [];
}

export const deselectAll = (state: Presentation) => {
  state.selection.slideIds = [];
  state.selection.elementIds = [];
}