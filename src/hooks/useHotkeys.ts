
import { useEffect, useCallback } from 'react';

type KeyHandler = (e: KeyboardEvent) => void;

export function useHotkeys(
  key: string | string[],
  callback: KeyHandler,
  deps: React.DependencyList = []
) {
  const keyArray = Array.isArray(key) ? key : [key];
  
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const pressedKey = event.key.toLowerCase();
      const ctrlKey = event.ctrlKey || event.metaKey;
      
      for (const k of keyArray) {
        const parts = k.toLowerCase().split('+');
        const needsCtrl = parts.includes('ctrl') || parts.includes('cmd');
        const targetKey = parts[parts.length - 1];
        
        if (
          pressedKey === targetKey && 
          (!needsCtrl || ctrlKey)
        ) {
          callback(event);
          break;
        }
      }
    },
    [callback, keyArray]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, ...deps]);
}
