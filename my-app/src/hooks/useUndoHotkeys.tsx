import { useAppDispatch } from '../Store/hooks';
import { undo, redo } from "../Store/history/historySlice";
import { useEffect } from 'react';

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const isMac = navigator.userAgent.toUpperCase().includes("MAC");
      const mode = isMac ? e.metaKey : e.ctrlKey;

      if (!mode) return;

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
};