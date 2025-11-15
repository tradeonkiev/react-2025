import { createSlice,  type PayloadAction } from '@reduxjs/toolkit';
import type { Presentation } from '../types';
import { initialPresentation } from '../data';

const initialState: Presentation = initialPresentation

const editorSlice = createSlice({
    name: 'ebator',
    initialState,
    reducers: {
        

    }

})