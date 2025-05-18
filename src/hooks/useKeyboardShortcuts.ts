import { useEffect } from 'react';

type ShortcutAction = () => void;

interface ShortcutMap {
  [key: string]: ShortcutAction;
}

const useKeyboardShortcuts = (shortcuts: ShortcutMap): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      
      // Handle key combinations (Ctrl+Key, etc.)
      let shortcutKey = '';
      
      if (event.ctrlKey) shortcutKey += 'ctrl+';
      if (event.altKey) shortcutKey += 'alt+';
      if (event.shiftKey) shortcutKey += 'shift+';
      
      shortcutKey += key;
      
      if (shortcuts[shortcutKey]) {
        event.preventDefault();
        shortcuts[shortcutKey]();
      } else if (shortcuts[key]) {
        // Also check for single key shortcuts
        event.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

export default useKeyboardShortcuts; 