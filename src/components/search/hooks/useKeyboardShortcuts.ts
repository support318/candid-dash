import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutsOptions {
  onOpen: () => void;
  onClose: () => void;
  onToggleMode: () => void;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  onSelect: () => void;
  isOpen: boolean;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onOpen,
  onClose,
  onToggleMode,
  onNavigateUp,
  onNavigateDown,
  onSelect,
  isOpen,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Cmd/Ctrl + K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
        return;
      }

      // Only handle these when search is open
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;

        case 'Tab':
          // Toggle between Quick Search and AI Chat
          event.preventDefault();
          onToggleMode();
          break;

        case 'ArrowUp':
          event.preventDefault();
          onNavigateUp();
          break;

        case 'ArrowDown':
          event.preventDefault();
          onNavigateDown();
          break;

        case 'Enter':
          // Enter is handled differently for Quick Search vs AI Chat
          // Quick Search: select result
          // AI Chat: submit message (handled by input)
          if (!event.shiftKey) {
            onSelect();
          }
          break;
      }
    },
    [enabled, isOpen, onOpen, onClose, onToggleMode, onNavigateUp, onNavigateDown, onSelect]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
