// components/CalendarPicker.jsx
"use client";

const ALL_PERIODS = ["8","9","9L","10","10+","10A","11","12","2","2A","3A","3B","6A","6B","ARR"];

export default function CalendarPicker({ selectedPeriods, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_PERIODS.map(period => {
        const isSelected = selectedPeriods.includes(period);
        return (
          <button
            key={period}
            onClick={() => {
              // toggle
              let newSelection;
              if (isSelected) {
                newSelection = selectedPeriods.filter(p => p !== period);
              } else {
                newSelection = [...selectedPeriods, period];
              }
              onChange(newSelection);
            }}
            className={
              "px-2 py-1 border rounded " +
              (isSelected ? "bg-blue-500 text-white" : "bg-white text-black")
            }
          >
            {period}
          </button>
        );
      })}
    </div>
  );
}
