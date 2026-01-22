import { useState, useEffect, useRef } from 'react';

function DatePicker({ value, onChange, required }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value ? new Date(value) : new Date()));
  const [selectedDate, setSelectedDate] = useState(value);
  const [inputValue, setInputValue] = useState(value ? formatDateDisplay(value) : '');
  const calendarRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  function formatDateDisplay(dateString) {
    if (!dateString) return '';
    // Parse the YYYY-MM-DD format correctly
    const [year, month, day] = dateString.split('-').map(Number);
    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  }

  function parseDateInput(inputStr) {
    const parts = inputStr.trim().split('-');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2000 || year > 2100) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    if (date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null; // Invalid date like 31-02
    }

    date.setHours(0, 0, 0, 0);
    return date >= today ? date : null;
  }

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);

    if (input.length === 10 && input[2] === '-' && input[5] === '-') {
      const parsedDate = parseDateInput(input);
      if (parsedDate) {
        const dateString = parsedDate.toISOString().split('T')[0];
        setSelectedDate(dateString);
        onChange(dateString);
        setCurrentMonth(parsedDate);
      }
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    if (prev >= today) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (selected >= today) {
      // Create date string in YYYY-MM-DD format without timezone conversion
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;
      
      setSelectedDate(dateString);
      setInputValue(formatDateDisplay(dateString));
      onChange(dateString);
      setShowCalendar(false);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isDisabled = date < today;
      
      // Create date string in YYYY-MM-DD format for comparison
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;
      const isSelected = selectedDate === dateString;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isDisabled && handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="date-picker-container" ref={calendarRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="dd-mm-yyyy"
        className={`date-picker-input ${required && !value ? 'required-field' : ''}`}
        onFocus={() => setShowCalendar(true)}
        maxLength="10"
        required={required}
      />

      {showCalendar && (
        <div className="calendar-popup">
          <div className="calendar-header">
            <button type="button" onClick={handlePrevMonth} className="calendar-nav-btn">‹</button>
            <h3>{monthYear}</h3>
            <button type="button" onClick={handleNextMonth} className="calendar-nav-btn">›</button>
          </div>

          <div className="calendar-weekdays">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
          </div>

          <div className="calendar-days">
            {renderCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
