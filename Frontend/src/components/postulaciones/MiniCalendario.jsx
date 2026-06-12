import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Send } from 'lucide-react';

export default function MiniCalendario({ nombreCandidato, onSchedule, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  const { days, month, year } = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysArray = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);
    return {
      days: daysArray,
      month: new Date(y, m).toLocaleString('es', { month: 'long' }),
      year: y,
    };
  }, [currentMonth]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleSubmit = () => {
    if (selectedDate) {
      onSchedule(selectedDate, selectedTime, message);
      setSent(true);
      setTimeout(onClose, 1500);
    }
  };

  const navMonth = (dir) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir, 1));
    setSelectedDate(null);
  };

  if (sent) {
    return (
      <div className="p-6 w-80 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
          <Send className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-sm font-semibold text-gray-900">¡Invitación enviada!</p>
        <p className="text-xs text-gray-500 mt-1">Se notificará a {nombreCandidato}</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-80">
      <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">
        Agendar entrevista — {nombreCandidato}
      </p>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => navMonth(-1)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <span className="text-sm font-semibold text-gray-800 capitalize">{month} {year}</span>
        <button onClick={() => navMonth(1)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((d) => (
          <span key={d} className="text-[10px] font-medium text-gray-400 text-center">{d}</span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((day, i) => {
          if (!day) return <span key={`e-${i}`} />;
          const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isPast = dateStr < todayStr;
          const estaSeleccionado = selectedDate === dateStr;
          const isToday = dateStr === todayStr;
          return (
            <button
              key={dateStr}
              disabled={isPast}
              onClick={() => setSelectedDate(dateStr)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-brand-50 cursor-pointer'}
                ${estaSeleccionado ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md' : ''}
                ${isToday && !estaSeleccionado ? 'ring-2 ring-brand-300 text-brand-700 font-bold' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <>
          {/* Time selection */}
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500">Hora:</span>
            <div className="flex flex-wrap gap-1.5">
              {times.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all
                    ${selectedTime === t ? 'bg-brand-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mensaje opcional para el candidato..."
            rows={2}
            className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent mb-3"
          />

          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar Invitación
          </button>
        </>
      )}
    </div>
  );
}
