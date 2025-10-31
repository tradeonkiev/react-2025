import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setEditor, addEditorChangeHandler, getEditor } from './Store/editor';
import { initialPresentation } from './data';

setEditor(initialPresentation);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const renderApp = () => {
  const editor = getEditor();
  if (!editor) return;

  root.render(
    <React.StrictMode>
      <App presentation={editor}/>
    </React.StrictMode>
  );
};

renderApp();
addEditorChangeHandler(renderApp);