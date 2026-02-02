'use client';

import React, { useEffect, useRef } from 'react';

interface DatePickerWheelProps {
  value: { year: number | null; month: number | null; day: number | null };
  onChange: (value: { year: number; month: number; day: number }) => void;
  years: number[];
  months: number[];
  days: number[];
}

const ITEM_HEIGHT = 48; // Height of each item in px (matches h-12 which is 48px)
const VISIBLE_ITEMS = 5; // Rows visible
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

function ScrollColumn({
  items,
  selectedValue,
  onSelect,
  unit,
}: {
  items: number[];
  selectedValue: number | null;
  onSelect: (val: number) => void;
  unit: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync Scroll Position with selectedValue changes
  useEffect(() => {
    if (listRef.current && selectedValue !== null) {
      const index = items.indexOf(selectedValue);
      if (index !== -1) {
        const targetScroll = index * ITEM_HEIGHT;
        const currentScroll = listRef.current.scrollTop;
        const roundedScroll = Math.round(currentScroll / ITEM_HEIGHT) * ITEM_HEIGHT;

        // Only scroll if the target is different from where we are snapped to.
        // We avoid interfering if the user is actively scrolling (checked via isScrolling ref somewhat,
        // but relying on the diff check is usually safer for discrete updates).
        if (roundedScroll !== targetScroll && !isScrolling.current) {
          listRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      }
    }
  }, [selectedValue, items]);

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    isScrolling.current = true;

    // Clear timeout if exists
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    // Set timeout to clear scrolling flag
    scrollTimeoutRef.current = setTimeout(() => {
      isScrolling.current = false;
    }, 150);

    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);

    // Ensure index is within bounds
    const safeIndex = Math.max(0, Math.min(index, items.length - 1));
    const newValue = items[safeIndex];

    if (newValue !== selectedValue) {
      onSelect(newValue);
    }
  };

  return (
    <div className="relative flex-1 h-full overflow-hidden">
      <ul
        ref={listRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-[96px]" // 96px = 2 items padding top/bottom to center the middle
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item) => (
          <li
            key={item}
            className={`h-[48px] flex items-center justify-center snap-center text-lg transition-colors duration-200 
                            ${item === selectedValue ? 'font-bold text-[#2D2D2D]' : 'text-gray-400 font-medium'}`}
          >
            {item} <span className="ml-1 text-sm font-normal text-gray-400">{unit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DatePickerWheel({ value, onChange, years, months, days }: DatePickerWheelProps) {
  // Internal state to track scrolling values before "Done" is implicit in parent logic,
  // but here we just emit changes immediately.

  // We handle "null" by defaulting visual selection to something reasonable (e.g. middle or first)
  // but strictly we should try to honor the passed value.
  const currentYear = value.year || 1958; // Default to 1958 per requirements or mock
  const currentMonth = value.month || 1;
  const currentDay = value.day || 1;

  const handleYearChange = (y: number) =>
    onChange({ year: y, month: currentMonth, day: currentDay });
  const handleMonthChange = (m: number) =>
    onChange({ year: currentYear, month: m, day: currentDay });
  const handleDayChange = (d: number) =>
    onChange({ year: currentYear, month: currentMonth, day: d });

  return (
    <div className="relative w-full" style={{ height: CONTAINER_HEIGHT }}>
      {/* Highlight Bar */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[48px] bg-[#FFF0ED] rounded-lg pointer-events-none z-0" />

      <div className="relative z-10 grid grid-cols-3 h-full">
        <ScrollColumn
          items={years}
          selectedValue={currentYear}
          onSelect={handleYearChange}
          unit="년"
        />
        <ScrollColumn
          items={months}
          selectedValue={currentMonth}
          onSelect={handleMonthChange}
          unit="월"
        />
        <ScrollColumn
          items={days}
          selectedValue={currentDay}
          onSelect={handleDayChange}
          unit="일"
        />
      </div>
    </div>
  );
}
