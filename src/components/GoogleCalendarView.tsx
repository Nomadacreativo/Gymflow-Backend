import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Dumbbell
} from 'lucide-react';
import { GoogleCalendarEvent, Instructor } from '../types';
import { 
  fetchGoogleCalendarEvents, 
  createGoogleCalendarEvent, 
  deleteGoogleCalendarEvent 
} from '../lib/googleCalendarService';
import { getCachedAccessToken } from '../lib/firestoreService';

interface GoogleCalendarViewProps {
  user: any | null;
  onLogin: () => void;
  instructors: Instructor[];
  onOpenGeminiOrganizer?: () => void;
}

export const GoogleCalendarView: React.FC<GoogleCalendarViewProps> = ({
  user,
  onLogin,
  instructors,
  onOpenGeminiOrganizer,
}) => {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Event Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [eventSummary, setEventSummary] = useState('');
  const [eventCategory, setEventCategory] = useState<'Spinning' | 'Crossfit' | 'Evaluación' | 'Personal' | 'Otro'>('Spinning');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('Salón Principal - Gymflow Central');
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [eventStartTime, setEventStartTime] = useState('08:00');
  const [eventEndTime, setEventEndTime] = useState('09:00');
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');

  // Delete Confirmation Modal (Mandatory user confirmation for Workspace destructive operations)
  const [eventToDelete, setEventToDelete] = useState<GoogleCalendarEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadEvents = async () => {
    const token = getCachedAccessToken();
    if (!token && !user) {
      setErrorMessage('Conecta tu cuenta de Google para sincronizar y visualizar tus eventos de Calendar.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchGoogleCalendarEvents();
      setEvents(data);
    } catch (err: any) {
      console.error('Error fetching calendar events:', err);
      setErrorMessage(err.message || 'No se pudieron obtener los eventos de Google Calendar.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventSummary.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const startDateTime = `${eventDate}T${eventStartTime}:00`;
    const endDateTime = `${eventDate}T${eventEndTime}:00`;

    const coachName = instructors.find(i => i.id === selectedInstructorId)?.name;
    const fullDescription = [
      eventDescription,
      coachName ? `Instructor asignado: ${coachName}` : '',
      `Categoría: ${eventCategory}`,
      'Organizado vía Gymflow Back Office'
    ].filter(Boolean).join('\n\n');

    try {
      const newEvent = await createGoogleCalendarEvent({
        summary: `[Gymflow] ${eventSummary}`,
        description: fullDescription,
        location: eventLocation,
        startDateTime,
        endDateTime,
        attendees: attendeeEmail ? [attendeeEmail] : undefined,
      });

      setEvents((prev) => [newEvent, ...prev]);
      setShowCreateModal(false);
      setSuccessMessage('¡Clase/Evento programado y sincronizado con éxito en tu Google Calendar!');
      setTimeout(() => setSuccessMessage(null), 4000);

      // Reset form
      setEventSummary('');
      setEventDescription('');
    } catch (err: any) {
      console.error('Error creating calendar event:', err);
      setErrorMessage(err.message || 'Error al agendar en Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGoogleCalendarEvent(eventToDelete.id);
      setEvents((prev) => prev.filter((ev) => ev.id !== eventToDelete.id));
      setSuccessMessage('Evento eliminado de Google Calendar.');
      setTimeout(() => setSuccessMessage(null), 3500);
      setEventToDelete(null);
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setErrorMessage(err.message || 'Error al eliminar el evento de Google Calendar.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to prefill class templates
  const applyPreset = (title: string, category: 'Spinning' | 'Crossfit' | 'Evaluación' | 'Personal', durationMinutes: number) => {
    setEventSummary(title);
    setEventCategory(category);
    setEventStartTime('09:00');
    setEventEndTime(durationMinutes === 60 ? '10:00' : '09:45');
    setEventDescription(`Sesión programada de ${title}. Favor de presentarse con 5 minutos de anticipación e hidratación.`);
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-body text-xs uppercase tracking-widest text-[#c3f400] font-bold">
              Google Workspace Integration
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#35007f] text-[#c3f400] text-[10px] font-mono font-bold">
              API v3 Sincronizada
            </span>
          </div>
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-[#c3f400]" />
            <span>Google Calendar & Clases</span>
          </h1>
          <p className="font-body text-sm text-[#c4c9ac] mt-1 max-w-2xl">
            Sincronización bidireccional directa con tu Google Calendar. Agenda clases grupales, turnos de coaches y citas de evaluación física.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {user ? (
            <>
              <button
                onClick={loadEvents}
                disabled={isLoading}
                className="h-11 px-4 rounded-full border border-[#35007f] bg-[#290065] text-[#eaddff] hover:bg-[#35007f] transition-colors flex items-center gap-2 text-xs font-semibold"
                title="Refrescar eventos de Google Calendar"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#c3f400]' : 'text-[#c4c9ac]'}`} />
                <span className="hidden sm:inline">Sincronizar</span>
              </button>

              {onOpenGeminiOrganizer && (
                <button
                  onClick={onOpenGeminiOrganizer}
                  className="h-11 px-4 rounded-full border border-[#c3f400]/40 bg-[#35007f] text-[#c3f400] hover:bg-[#42009b] transition-colors flex items-center gap-2 text-xs font-bold shadow-[0_0_12px_rgba(195,244,0,0.2)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sugerir con Gemini</span>
                </button>
              )}

              <button
                onClick={() => setShowCreateModal(true)}
                className="h-11 px-5 rounded-full bg-[#c3f400] text-[#161e00] hover:bg-[#abd600] transition-all flex items-center gap-2 text-xs font-bold shadow-[0_0_15px_rgba(195,244,0,0.25)] active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Agendar Clase / Evento</span>
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="h-11 px-5 rounded-full bg-[#c3f400] text-[#161e00] hover:bg-[#abd600] transition-all flex items-center gap-2 text-xs font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Conectar Google Calendar</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#290065] border border-[#c3f400] text-[#c3f400] text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#290065] border border-[#ffb4ab] text-[#ffb4ab] text-xs flex items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {!user && (
            <button
              onClick={onLogin}
              className="px-3 py-1 rounded-full bg-[#c3f400] text-[#161e00] text-xs font-bold hover:bg-[#abd600]"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      )}

      {/* Quick Templates Bar */}
      <div className="bg-[#290065] rounded-3xl p-4 sm:p-5 border border-[#35007f]/60 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#35007f] flex items-center justify-center text-[#c3f400] shrink-0">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline text-sm text-white">Plantillas Rápidas de Clase</h3>
            <p className="text-xs text-[#c4c9ac]">Preconfigura en 1 clic e inserta directamente en tu Google Calendar.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              applyPreset('Spinning HIIT Intenso', 'Spinning', 45);
              setShowCreateModal(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#140039] hover:bg-[#35007f] border border-[#35007f] text-xs font-medium text-[#eaddff] transition-all"
          >
            🚴 Spinning (45m)
          </button>
          <button
            onClick={() => {
              applyPreset('Crossfit WOD de Fuerza', 'Crossfit', 60);
              setShowCreateModal(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#140039] hover:bg-[#35007f] border border-[#35007f] text-xs font-medium text-[#eaddff] transition-all"
          >
            🏋️ Crossfit WOD (60m)
          </button>
          <button
            onClick={() => {
              applyPreset('Evaluación Física & Bioimpedancia', 'Evaluación', 45);
              setShowCreateModal(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#140039] hover:bg-[#35007f] border border-[#35007f] text-xs font-medium text-[#eaddff] transition-all"
          >
            🩺 Evaluación Médica
          </button>
        </div>
      </div>

      {/* Events List / Calendar Grid */}
      <div className="bg-[#290065] rounded-[2.5rem] p-6 sm:p-8 border border-[#35007f]/50 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#35007f]">
          <div>
            <h2 className="font-headline text-xl text-white">Eventos y Clases en Vivo</h2>
            <p className="text-xs text-[#c4c9ac] mt-0.5">
              {events.length} evento{events.length === 1 ? '' : 's'} sincronizado{events.length === 1 ? '' : 's'} desde la cuenta de Google.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-pulse shadow-[0_0_8px_#c3f400]" />
            <span className="text-xs text-[#c4c9ac] font-mono">
              {user ? user.email : 'Sin autenticar'}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#c3f400] animate-spin" />
            <p className="text-sm text-[#eaddff] font-medium">Conectando con Google Calendar API...</p>
          </div>
        ) : !user ? (
          <div className="py-16 px-4 text-center max-w-md mx-auto flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#35007f] text-[#c3f400] flex items-center justify-center shadow-lg border border-[#42009b]">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h3 className="font-headline text-lg text-white">Conecta tu Google Calendar</h3>
            <p className="text-xs text-[#c4c9ac] leading-relaxed">
              Inicia sesión con tu cuenta de Google de administrador para agendar clases, gestionar horarios de entrenadores y revisar tu calendario oficial.
            </p>
            <button
              onClick={onLogin}
              className="px-6 py-3 rounded-full bg-[#c3f400] text-[#161e00] font-bold text-xs shadow-[0_0_15px_rgba(195,244,0,0.3)] hover:bg-[#abd600] transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Conectar con Google</span>
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#140039] text-[#c4c9ac] flex items-center justify-center border border-[#35007f]">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-base text-white">No hay clases ni eventos programados</h3>
            <p className="text-xs text-[#c4c9ac] leading-relaxed">
              Tu Google Calendar no tiene eventos agendados para este periodo. Haz clic en "Agendar Clase" o usa el organizador de Gemini para generar tu programación semanal.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#c3f400] text-[#161e00] font-bold text-xs hover:bg-[#abd600] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Primer Evento</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev) => {
              const startRaw = ev.start.dateTime || ev.start.date || '';
              const endRaw = ev.end.dateTime || ev.end.date || '';
              const startDate = startRaw ? new Date(startRaw) : null;
              const endDate = endRaw ? new Date(endRaw) : null;

              const formattedDate = startDate
                ? startDate.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })
                : 'Fecha flexible';
              const formattedTime = startDate
                ? `${startDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} - ${endDate ? endDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : ''}`
                : 'Día completo';

              return (
                <div
                  key={ev.id}
                  className="bg-[#35007f]/50 hover:bg-[#35007f] rounded-3xl p-5 border border-[#42009b] transition-all flex flex-col justify-between group shadow-md"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#140039] text-[#c3f400] text-[11px] font-mono font-bold border border-[#42009b]">
                        {formattedDate}
                      </span>
                      <button
                        onClick={() => setEventToDelete(ev)}
                        className="text-[#c4c9ac] hover:text-[#ffb4ab] p-1.5 rounded-full transition-colors opacity-70 group-hover:opacity-100"
                        title="Eliminar evento de Google Calendar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-headline text-base text-white leading-snug mb-1">
                      {ev.summary}
                    </h4>

                    {ev.description && (
                      <p className="text-xs text-[#c4c9ac] line-clamp-2 leading-relaxed mb-3">
                        {ev.description}
                      </p>
                    )}

                    <div className="space-y-1.5 text-xs text-[#eaddff] pt-2 border-t border-[#42009b]/60">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#c3f400] shrink-0" />
                        <span>{formattedTime}</span>
                      </div>
                      {ev.location && (
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#c4c9ac] shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      )}
                      {ev.attendees && ev.attendees.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#c3f400] shrink-0" />
                          <span>{ev.attendees.length} participante(s)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {ev.htmlLink && (
                    <div className="mt-4 pt-3 border-t border-[#42009b]/60 flex items-center justify-between">
                      <a
                        href={ev.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#c3f400] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Abrir en Google Calendar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Crear Evento en Google Calendar */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#290065] border border-[#35007f] rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline text-xl text-white">Agendar en Google Calendar</h3>
                  <p className="text-xs text-[#c4c9ac]">Sincronización directa con tu cuenta oficial</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-9 h-9 rounded-full bg-[#140039] text-[#c4c9ac] hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs font-body">
              <div>
                <label className="block text-[#c4c9ac] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Título de la Clase / Evento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Spinning HIIT Potencia Matutina"
                  value={eventSummary}
                  onChange={(e) => setEventSummary(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:outline-none focus:border-[#c3f400] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c4c9ac] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:outline-none focus:border-[#c3f400] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#c4c9ac] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Instructor
                  </label>
                  <select
                    value={selectedInstructorId}
                    onChange={(e) => setSelectedInstructorId(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:outline-none focus:border-[#c3f400] transition-colors"
                  >
                    <option value="">Sin coach específico</option>
                    {instructors.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c4c9ac] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Hora de Inicio *
                  </label>
                  <input
                    type="time"
                    required
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:outline-none focus:border-[#c3f400] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#c4c9ac] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Hora de Término *
                  </label>
                  <input
                    type="time"
                    required
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:outline-none focus:border-[#c3f400] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#c4c9ac] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Ubicación / Salón
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:outline-none focus:border-[#c3f400] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#c4c9ac] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Invitado / Email de Socio (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="socio@ejemplo.com"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:outline-none focus:border-[#c3f400] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#c4c9ac] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Notas y Descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Indicaciones para los socios o protocolo de la clase..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:outline-none focus:border-[#c3f400] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)] hover:bg-[#abd600] active:scale-95 transition-all flex items-center gap-2"
                >
                  {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar en Google Calendar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Modal for Destructive Delete Operations */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#ffb4ab]/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-[#ffb4ab]/15 text-[#ffb4ab] flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-lg text-white">¿Eliminar evento de Google Calendar?</h3>
                <p className="text-xs text-[#c4c9ac]">Esta acción cancelará el evento de forma permanente en Google Calendar.</p>
              </div>
            </div>

            <div className="bg-[#140039] p-3.5 rounded-2xl border border-[#35007f] mb-5 text-xs">
              <p className="font-bold text-white mb-0.5">{eventToDelete.summary}</p>
              <p className="text-[#c4c9ac]">
                {eventToDelete.start.dateTime
                  ? new Date(eventToDelete.start.dateTime).toLocaleString('es-MX')
                  : 'Fecha flexible'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-full bg-[#93000a] hover:bg-[#b00010] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                {isDeleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirmar Eliminación</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
