import React, { useEffect, useRef, useState } from 'react';

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

interface EventRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'audiencia' | 'prazo' | 'reuniao' | 'outro';
}

export const Agenda: React.FC<{ events: EventRecord[], onAdd: () => void }> = ({ events, onAdd }) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendarInstance, setCalendarInstance] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<EventRecord>>({
    type: 'outro',
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const FullCalendar = (window as any).FullCalendar;
    if (!FullCalendar) return;

    if (calendarRef.current && !calendarInstance) {
      const calendar = new FullCalendar.Calendar(calendarRef.current, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        height: 'auto',
        selectable: true,
        headerToolbar: {
          left: 'today',
          center: 'title',
          right: 'prev,next dayGridMonth,timeGridWeek'
        },
        buttonText: { today: 'Hoje', month: 'Mês', week: 'Semana' },
        events: events.map(e => ({
          id: e.id,
          title: e.title,
          start: `${e.date}T${e.time}`,
          backgroundColor: getEventColor(e.type),
          borderColor: getEventBorder(e.type),
          textColor: '#334155',
          extendedProps: { ...e }
        })),
        dateClick: (info: any) => {
          setFormData({ title: '', description: '', type: 'outro', date: info.dateStr, time: '09:00' });
          setIsModalOpen(true);
        }
      });
      calendar.render();
      setCalendarInstance(calendar);
    } else if (calendarInstance) {
      calendarInstance.removeAllEvents();
      calendarInstance.addEventSource(events.map(e => ({
        id: e.id,
        title: e.title,
        start: `${e.date}T${e.time}`,
        backgroundColor: getEventColor(e.type),
        borderColor: getEventBorder(e.type),
        textColor: '#334155',
        extendedProps: { ...e }
      })));
    }
  }, [events, calendarInstance]);

  const getEventColor = (type: string) => {
    switch(type) {
      case 'audiencia': return '#fee2e2'; 
      case 'prazo': return '#fff7ed';
      case 'reuniao': return '#f0fdf4';
      default: return '#f1f5f9';
    }
  };

  const getEventBorder = (type: string) => {
    switch(type) {
      case 'audiencia': return '#f87171'; 
      case 'prazo': return '#fbbf24';
      case 'reuniao': return '#4ade80';
      default: return '#cbd5e1';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const session = localStorage.getItem('lexflow_session');
      const token = session ? JSON.parse(session).token : '';
      
      const res = await fetch(`${API_URL}/agenda`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onAdd();
        setIsModalOpen(false);
      } else {
        alert('Erro ao salvar compromisso.');
      }
    } catch (e) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Agenda Jurídica</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Gestão centralizada de prazos e eventos.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="dynamic-btn px-6 py-3 text-sm flex items-center gap-2">
          <i className="fas fa-plus text-[10px]"></i> Novo Agendamento
        </button>
      </header>
      
      <div className="soft-glass p-8 bg-white/5">
        <div ref={calendarRef}></div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="soft-glass w-full max-w-md p-8 bg-slate-900 border-white/10">
            <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Compromisso</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Assunto" className="w-full p-4 bg-white/5 border border-white/5 rounded-xl outline-none text-sm text-white" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" className="w-full p-4 bg-white/5 border border-white/5 rounded-xl outline-none text-sm text-white" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                <input required type="time" className="w-full p-4 bg-white/5 border border-white/5 rounded-xl outline-none text-sm text-white" value={formData.time || '09:00'} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
              <select className="w-full p-4 bg-white/5 border border-white/5 rounded-xl outline-none text-sm text-white" value={formData.type || 'outro'} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                <option value="audiencia">Audiência</option>
                <option value="prazo">Prazo Fatal</option>
                <option value="reuniao">Reunião</option>
                <option value="outro">Outro</option>
              </select>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cancelar</button>
                <button type="submit" disabled={isLoading} className="dynamic-btn px-8 py-3 rounded-xl text-xs uppercase tracking-widest">
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};