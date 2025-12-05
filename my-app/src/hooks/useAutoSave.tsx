import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { presentationService } from '../services/presentationService';

export const useAutoSave = () => {
  const presentation = useAppSelector((state) => state.history.present);
  const user = useAppSelector((state) => state.auth.user);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  
  const timeoutRef = useRef<number | null>(null);
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!user) return;

    const currentData = JSON.stringify(presentation);
    
    if (currentData === lastSavedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        await presentationService.savePresentation(presentation, user.$id);
        lastSavedRef.current = currentData;
        setSaveStatus('saved');
      } catch (error) {
        console.error('Autosave error:', error);
        setSaveStatus('error');
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [presentation, user]);

  return { saveStatus };
};