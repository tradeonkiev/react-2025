import { useEffect } from 'react';
import { Header } from '../src/components/Header/Header';
import { SlidesList } from '../src/components/SlidesList/SlidesList';
import { Editor } from '../src/components/Editor/Editor';
import { ToolBar } from '../src/components/ToolBar/ToolBar';
import { useAppDispatch } from '../src/store/hooks';
import { undo, redo } from "../src/store/historySlice";

const App = () => {
  const dispatch = useAppDispatch();

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
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SlidesList />
        <Editor />
        <ToolBar />
      </div>
    </div>
  );
};

export default App;