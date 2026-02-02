import React from 'react';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, label, disabled }: SwitchProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={`
          relative inline-flex h-9 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8B7D] focus:ring-offset-2
          ${checked ? 'bg-[#FF8B7D]' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-7 w-7 transform rounded-full bg-white transition-transform shadow-sm
            ${checked ? 'translate-x-8' : 'translate-x-1'}
          `}
        />
      </button>
      {label && <span className="text-lg font-medium text-[#2D2D2D]">{label}</span>}
    </div>
  );
}
