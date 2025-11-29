import { Header } from '../src/components/Header/Header';
import { SlidesList } from '../src/components/SlidesList/SlidesList';
import { Editor } from '../src/components/Editor/Editor';
import { ToolBar } from '../src/components/ToolBar/ToolBar';
// import { account } from "../appwrite"
import { useKeyboardShortcuts } from '../src/hooks/useUndoHotkeys';

const App = () => {
  useKeyboardShortcuts();

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