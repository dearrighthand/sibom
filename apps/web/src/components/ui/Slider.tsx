import React from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({ value, min, max, step = 1, onChange, className = '' }: SliderProps) {
  // Calculate percentage for the colored track
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full h-8 flex items-center ${className}`}>
        {/* Track Background */}
      <div className="absolute w-full h-3 bg-gray-200 rounded-full overflow-hidden">
         {/* Colored Track */}
        <div 
            className="h-full bg-[#FF8B7D] transition-all" 
            style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Inputs - Native range input hidden but transparently overlaying for interaction */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      {/* Visual Thumb - positioned absolutely based on percentage */}
      <div 
        className="absolute h-7 w-7 bg-white border-2 border-[#FF8B7D] rounded-full shadow-md pointer-events-none transition-all z-0"
        style={{ left: `calc(${percentage}% - 14px)` }}
      />
    </div>
  );
}
