'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { GlobalDialog } from '../components/GlobalDialog';

type DialogType = 'alert' | 'confirm';

interface DialogOptions {
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
}

interface DialogContextType {
  openDialog: (options: DialogOptions) => Promise<boolean>;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DialogOptions>({ title: '' });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const openDialog = useCallback((options: DialogOptions) => {
    setConfig({
      type: 'alert', // default
      confirmText: '확인',
      cancelText: '취소',
      ...options,
    });
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver(false); // Default to false if closed without explicit action (though buttons usually handle this)
      setResolver(null);
    }
  }, [resolver]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver(true);
      setResolver(null);
    }
  }, [resolver]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver(false);
      setResolver(null);
    }
  }, [resolver]);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {isOpen && (
        <GlobalDialog
          isOpen={isOpen}
          title={config.title}
          description={config.description}
          type={config.type || 'alert'}
          confirmText={config.confirmText || '확인'}
          cancelText={config.cancelText || '취소'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </DialogContext.Provider>
  );
}
