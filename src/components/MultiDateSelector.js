'use client';
import DatePicker from "react-multi-date-picker";
import { useState, useRef, useMemo } from "react";

export default function MultiDateSelector({ onSelect }) {
  const [dates, setDates] = useState([]);
  const pickerRef = useRef();

  const handleChange = (selectedDates) => {
    setDates(selectedDates);
    const formattedDates = selectedDates.map(date => date.format("YYYY-MM-DD"));
    onSelect(formattedDates);
  };

  const formattedDatesForDisplay = useMemo(
    () => dates.map(date => date.format("YYYY-MM-DD")).join(', '),
    [dates]
  );

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">Select Leave Dates</label>
      <DatePicker
        ref={pickerRef}
        multiple
        value={dates}
        onChange={handleChange}
        format="YYYY-MM-DD"
        style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }} // keep input technically present
      />
      <div
        className="border rounded-md p-2 min-h-[80px] bg-gray-50 cursor-pointer"
        onClick={() => pickerRef.current.openCalendar()}
      >
        <p className={`text-gray-400 ${formattedDatesForDisplay ? 'hidden' : ''}`}>
          Select one or multiple dates...
        </p>
        <p className="text-gray-800">{formattedDatesForDisplay}</p>
      </div>
    </div>
  );
}