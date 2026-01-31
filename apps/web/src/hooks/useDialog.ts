import { useContext } from 'react';
import { DialogContext } from '../context/DialogContext';

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }

  const { openDialog } = context;

  const alert = (title: string, description?: string, confirmText = '확인') => {
    return openDialog({
      type: 'alert',
      title,
      description,
      confirmText,
    });
  };

  const confirm = (
    title: string,
    description?: string,
    confirmText = '확인',
    cancelText = '취소',
  ) => {
    return openDialog({
      type: 'confirm',
      title,
      description,
      confirmText,
      cancelText,
    });
  };

  return { alert, confirm };
}
