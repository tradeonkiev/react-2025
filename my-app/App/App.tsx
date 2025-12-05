import { useEffect } from 'react';
import { Header } from '../src/components/Header/Header';
import { SlidesList } from '../src/components/SlidesList/SlidesList';
import { Editor } from '../src/components/Editor/Editor';
import { ToolBar } from '../src/components/ToolBar/ToolBar';
import { AuthForm } from '../src/components/Auth/AuthForm';
import { useKeyboardShortcuts } from '../src/hooks/useUndoHotkeys';
import { useAutoSave } from '../src/hooks/useAutoSave';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { checkAuth } from '../src/store/auth/authSlice';
import { syncWithHistory } from '../src/store/editorSlice/editorSlice';
import { initHistory } from '../src/store/history/historySlice';
import { presentationService } from '../src/services/presentationService';

const App = () => {
  useKeyboardShortcuts();
  const { saveStatus } = useAutoSave();
  
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadPresentation = async () => {
        try {
          const saved = await presentationService.loadPresentation(user.$id);
          if (saved) {
            dispatch(initHistory(saved));
            dispatch(syncWithHistory(saved));
          }
        } catch (error) {
          console.error('Load presentation error:', error);
        }
      };
      
      loadPresentation();
    }
  }, [isAuthenticated, user, dispatch]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Segoe UI',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Загрузка...
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <AuthForm />;
  }

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
      <Header saveStatus={saveStatus} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SlidesList />
        <Editor />
        <ToolBar />
      </div>
    </div>
  );
};

export default App;