import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, Clock, Target, CalendarDays } from 'lucide-react';
import { calendarAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const Calendar = () => {
  const { addToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDayStr, setSelectedDayStr] = useState('');

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1; // JS months are 0-11
      const year = currentDate.getFullYear();
      const res = await calendarAPI.getCalendarData(month, year);
      setEvents(res.data);
      
      // Auto select current day's events if same month/year
      const today = new Date();
      if (today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()) {
        const todayStr = today.toISOString().split('T')[0];
        setSelectedDayStr(todayStr);
        filterDayEvents(res.data, today);
      } else {
        // Otherwise select first day of the viewed month
        const firstDay = new Date(year, month - 1, 1);
        setSelectedDayStr(firstDay.toISOString().split('T')[0]);
        filterDayEvents(res.data, firstDay);
      }
    } catch (err) {
      console.error('Calendar load error:', err);
      addToast('Failed to load calendar milestones', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, [currentDate]);

  const filterDayEvents = (allEvents, date) => {
    const dStr = date.toISOString().split('T')[0];
    const filtered = allEvents.filter((ev) => {
      const evDateStr = new Date(ev.date).toISOString().split('T')[0];
      return evDateStr === dStr;
    });
    setSelectedDayEvents(filtered);
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newD = new Date(prev);
      newD.setMonth(prev.getMonth() - 1);
      return newD;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newD = new Date(prev);
      newD.setMonth(prev.getMonth() + 1);
      return newD;
    });
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of viewed month
    const firstDay = new Date(year, month, 1);
    const startWeekDay = firstDay.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Total days in viewed month
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    // Days from previous month to fill start of first week
    const prevMonthDays = [];
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = startWeekDay - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: prevMonthTotalDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthTotalDays - i),
      });
    }

    // Days of current month
    const currentMonthDays = [];
    for (let i = 1; i <= totalDays; i++) {
      currentMonthDays.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Days from next month to fill end of calendar (usually 42 cells total)
    const nextMonthDays = [];
    const totalCells = 42;
    const remainingCells = totalCells - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const getEventBadgeClass = (type) => {
    switch (type) {
      case 'goal-completed': return 'bg-success-500/10 text-success-400 border border-success-500/20';
      case 'goal-missed': return 'bg-danger-500/10 text-danger-400 border border-danger-500/20';
      case 'revision-completed': return 'bg-primary-500/10 text-primary-400 border border-primary-500/20';
      case 'revision-pending': return 'bg-warning-500/10 text-warning-400 border border-warning-500/20';
      case 'deadline': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      default: return 'bg-white/5 text-dark-400 border border-white/10';
    }
  };

  const calendarDays = getDaysInMonth();
  const monthsNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
          <CalendarIcon className="text-pink-400" /> Milestone Calendar
        </h1>
        <p className="text-dark-400">Review your historical daily achievements, deadlines, and scheduled revision timelines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: The Monthly Grid */}
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-1.5">
              {monthsNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="btn btn-secondary !p-1.5"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextMonth}
                className="btn btn-secondary !p-1.5"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Table Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-dark-500 border-b border-white/5 pb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-7 gap-2.5 py-4">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="skeleton h-12 w-full rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((cell, idx) => {
                const cellDateStr = cell.date.toISOString().split('T')[0];
                const isSelected = selectedDayStr === cellDateStr;
                const isToday = new Date().toISOString().split('T')[0] === cellDateStr;
                
                // Check events on this day
                const dayEvents = events.filter((ev) => {
                  const evD = new Date(ev.date).toISOString().split('T')[0];
                  return evD === cellDateStr;
                });

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDayStr(cellDateStr);
                      filterDayEvents(events, cell.date);
                    }}
                    className={`min-h-[60px] p-1.5 rounded-lg flex flex-col justify-between cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-primary-500/50 bg-primary-500/5'
                        : 'border-white/5 hover:border-white/20'
                    } ${
                      cell.isCurrentMonth ? '' : 'opacity-35 hover:opacity-50'
                    } ${
                      isToday ? 'ring-1 ring-primary-500' : ''
                    }`}
                  >
                    <span className={`text-xs font-bold self-end ${isToday ? 'text-primary-400 font-extrabold' : 'text-dark-300'}`}>
                      {cell.day}
                    </span>
                    
                    {/* Event Dots/Indicators */}
                    <div className="flex flex-wrap gap-1 mt-1 justify-start">
                      {dayEvents.slice(0, 3).map((ev, evIdx) => {
                        let dotColor = 'bg-primary-500';
                        if (ev.type === 'goal-completed') dotColor = 'bg-success-500';
                        if (ev.type === 'goal-missed') dotColor = 'bg-danger-500';
                        if (ev.type === 'revision-pending') dotColor = 'bg-warning-500';
                        if (ev.type === 'deadline') dotColor = 'bg-pink-500';
                        
                        return (
                          <div
                            key={evIdx}
                            className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
                            title={ev.title}
                          />
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] text-dark-500 font-bold">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Day details */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-bold text-sm text-dark-300 flex items-center gap-1.5">
            <CalendarDays size={16} className="text-primary-400" />
            Milestones on {selectedDayStr ? new Date(selectedDayStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Selected Day'}
          </h3>
          
          {selectedDayEvents.length === 0 ? (
            <div className="text-center py-20 text-dark-500 text-xs">
              No milestones, deadlines, or goals logged for this day.
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {selectedDayEvents.map((ev, evIdx) => (
                <div
                  key={evIdx}
                  className={`p-3 rounded-lg border text-xs leading-relaxed ${getEventBadgeClass(ev.type)}`}
                >
                  <p className="font-bold text-sm mb-1">{ev.title}</p>
                  
                  {ev.type.startsWith('goal') && ev.data && (
                    <div className="mt-2 space-y-1 opacity-90 text-[11px]">
                      <p>• DSA Target: {ev.data.dsaCompleted}/{ev.data.dsaTarget}</p>
                      <p>• Full Stack: {ev.data.fullstackCompleted}/{ev.data.fullstackTarget}</p>
                      <p>• Aptitude: {ev.data.aptitudeCompleted}/{ev.data.aptitudeTarget}</p>
                    </div>
                  )}
                  {ev.type.startsWith('revision') && ev.data && (
                    <p className="mt-1.5 font-medium opacity-80 flex items-center gap-1">
                      <Clock size={12} /> Revision Block #{ev.data.revisionNumber}
                    </p>
                  )}
                  {ev.type === 'deadline' && ev.data && (
                    <p className="mt-1.5 opacity-80">{ev.data.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
