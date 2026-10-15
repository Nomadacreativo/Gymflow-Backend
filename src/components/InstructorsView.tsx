import React, { useState } from 'react';
import { 
  Star, 
  Fingerprint, 
  Plus, 
  CheckCircle2, 
  Clock,
  Dumbbell,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { Instructor } from '../types';

interface InstructorsViewProps {
  instructors: Instructor[];
  onAddInstructor: (inst: Instructor) => void;
  onNavigateToCalendar?: () => void;
}

export const InstructorsView: React.FC<InstructorsViewProps> = ({
  instructors,
  onAddInstructor,
  onNavigateToCalendar,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('Todas');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Crossfit & Powerlifting');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+52 55 8920 1192');

  const handleSave = () => {
    if (!name.trim()) return;
    const newInst: Instructor = {
      id: `inst-${Date.now()}`,
      name,
      specialty,
      rating: 5.0,
      activeClasses: 6,
      attendanceRate: '100%',
      bioEnrolled: true,
      terminalsCount: 6,
      schedule: ['Lun-Vie 07:00 - 12:00'],
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gymflow.com`,
      phone
    };
    onAddInstructor(newInst);
    setShowModal(false);
    setName('');
    setActionNotice(`Coach ${newInst.name} registrado con biometría activada en tornos.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filtered = instructors.filter(i => {
    if (filterSpecialty === 'Todas') return true;
    return i.specialty.toLowerCase().includes(filterSpecialty.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-body text-xs uppercase tracking-widest text-[#c3f400] font-bold block mb-1">
            Cuerpo Docente & Certificaciones
          </span>
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tight">
            Gestión de Instructores & Coaches
          </h1>
          <p className="font-body text-sm text-[#c4c9ac] mt-1 max-w-2xl">
            Supervisión de cuerpo docente, horarios de clase, ratio de asistencia por sesión y estatus biométrico.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigateToCalendar && (
            <button
              onClick={onNavigateToCalendar}
              className="h-11 px-4 rounded-full border border-[#c3f400]/40 bg-[#290065] text-[#c3f400] hover:bg-[#35007f] transition-all flex items-center gap-2 text-xs font-bold shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver en Google Calendar</span>
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="h-11 px-5 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold shadow-[0_0_15px_rgba(195,244,0,0.25)] active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Instructor</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-[#290065] border border-[#c3f400] text-[#c3f400] text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg">
          <p className="text-[10px] font-semibold text-[#c4c9ac] uppercase tracking-wider mb-1">Staff Técnico Activo</p>
          <p className="font-headline text-2xl text-white">{instructors.length} Coaches</p>
          <p className="text-xs text-[#c3f400] mt-2 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Biometría Facial ZKTeco OK
          </p>
        </div>

        <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg">
          <p className="text-[10px] font-semibold text-[#c4c9ac] uppercase tracking-wider mb-1">Ratio Asistencia Clases</p>
          <p className="font-headline text-2xl text-[#c3f400]">
            {instructors.length > 0 ? '94.2%' : '0%'}
          </p>
          <p className="text-xs text-[#c4c9ac] mt-2">Cumplimiento en sala</p>
        </div>

        <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg">
          <p className="text-[10px] font-semibold text-[#c4c9ac] uppercase tracking-wider mb-1">Clases Semanales</p>
          <p className="font-headline text-2xl text-white">
            {instructors.reduce((sum, i) => sum + (i.activeClasses || 0), 0)} Sesiones
          </p>
          <p className="text-xs text-[#c4c9ac] mt-2">Sincronizables con Google Calendar</p>
        </div>

        <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg">
          <p className="text-[10px] font-semibold text-[#c4c9ac] uppercase tracking-wider mb-1">Calificación Promedio</p>
          <div className="flex items-center gap-2">
            <span className="font-headline text-2xl text-white">
              {instructors.length > 0 ? '4.9' : '5.0'}
            </span>
            <div className="flex text-[#c3f400]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
          <p className="text-xs text-[#c4c9ac] mt-2">Evaluación por socios</p>
        </div>
      </div>

      {/* Specialty Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Todas', 'Crossfit', 'Powerlifting', 'Spinning', 'Funcional', 'Hiit', 'Yoga'].map((spec) => (
          <button
            key={spec}
            onClick={() => setFilterSpecialty(spec)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterSpecialty === spec
                ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                : 'bg-[#290065] text-[#eaddff] hover:bg-[#35007f] border border-[#35007f]'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Instructors Grid / Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-[#290065] rounded-3xl p-12 text-center border border-[#35007f]/60 shadow-xl flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-[#140039] text-[#c3f400] flex items-center justify-center border border-[#35007f] shadow-md">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h3 className="font-headline text-lg text-white">Sin instructores registrados</h3>
          <p className="text-xs text-[#c4c9ac] max-w-md leading-relaxed">
            {instructors.length === 0
              ? 'El equipo docente está listo para ser registrado. Da de alta a tus entrenadores para asignarles clases y coordinar sus horarios con Google Calendar.'
              : 'No hay instructores que coincidan con la especialidad seleccionada.'}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 px-5 py-2.5 rounded-full bg-[#c3f400] text-[#161e00] font-bold text-xs hover:bg-[#abd600] transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Primer Instructor</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((inst) => (
            <div
              key={inst.id}
              className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg hover:border-[#c3f400]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Profile Top */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    {inst.avatar ? (
                      <img
                        src={inst.avatar}
                        alt={inst.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-[#35007f] shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[#35007f] text-[#c3f400] flex items-center justify-center font-bold text-base border border-[#42009b] shrink-0">
                        {inst.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <h3 className="font-headline text-base text-white leading-tight">{inst.name}</h3>
                      <p className="text-xs text-[#c3f400] font-semibold mt-0.5">{inst.specialty}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#c4c9ac]">
                        <Star className="w-3.5 h-3.5 text-[#c3f400] fill-current" />
                        <span className="font-bold text-white">{inst.rating || 5.0}</span>
                        <span>• {inst.activeClasses} clases activas</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-[#c3f400]/15 text-[#c3f400] text-[11px] font-bold border border-[#c3f400]/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Bio OK
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 py-3 border-t border-b border-[#35007f]/50 my-3 text-xs">
                  <div className="flex items-center gap-2 text-[#eaddff]">
                    <Mail className="w-3.5 h-3.5 text-[#c4c9ac]" />
                    <span className="font-mono">{inst.email}</span>
                  </div>
                  {inst.phone && (
                    <div className="flex items-center gap-2 text-[#c4c9ac]">
                      <Phone className="w-3.5 h-3.5 text-[#c4c9ac]" />
                      <span>{inst.phone}</span>
                    </div>
                  )}
                  {inst.schedule && inst.schedule.length > 0 && (
                    <div className="flex items-start gap-2 text-[#c4c9ac] pt-1">
                      <Clock className="w-3.5 h-3.5 text-[#c3f400] shrink-0 mt-0.5" />
                      <span>{inst.schedule.join(' | ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-2 pt-2">
                <button
                  onClick={() => {
                    setActionNotice(`Biometría de ${inst.name} confirmada en tornos ZKTeco.`);
                    setTimeout(() => setActionNotice(null), 3500);
                  }}
                  className="flex-1 py-2 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] text-xs font-semibold transition-colors border border-[#35007f]"
                >
                  Verificar Torno
                </button>
                {onNavigateToCalendar && (
                  <button
                    onClick={onNavigateToCalendar}
                    className="px-4 py-2 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold transition-all shadow-sm"
                  >
                    Agendar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Instructor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#35007f] rounded-[2.5rem] p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-headline text-xl text-white mb-1">Registrar Instructor Técnico</h3>
            <p className="text-xs text-[#c4c9ac] mb-5">Genera la ficha técnica y autoriza el enrolamiento en terminales ZKTeco.</p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Coach Diego Santana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:border-[#c3f400] outline-none placeholder:text-[#c4c9ac]/50"
                />
              </div>

              <div>
                <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Especialidad</label>
                <input
                  type="text"
                  placeholder="ej. Spinning HIIT, Halterofilia, Crossfit"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:border-[#c3f400] outline-none placeholder:text-[#c4c9ac]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Email</label>
                  <input
                    type="email"
                    placeholder="diego@gymflow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:border-[#c3f400] outline-none placeholder:text-[#c4c9ac]/50"
                  />
                </div>
                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:border-[#c3f400] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] text-xs font-semibold transition-colors border border-[#35007f]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold shadow-[0_0_15px_rgba(195,244,0,0.25)] transition-all active:scale-95"
              >
                Registrar y Enrolar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
