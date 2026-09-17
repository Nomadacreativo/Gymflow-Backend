import React, { useState } from 'react';
import { 
  Star, 
  Fingerprint, 
  Plus, 
  CheckCircle2, 
  Clock
} from 'lucide-react';
import { Instructor } from '../types';

interface InstructorsViewProps {
  instructors: Instructor[];
  onAddInstructor: (inst: Instructor) => void;
}

export const InstructorsView: React.FC<InstructorsViewProps> = ({
  instructors,
  onAddInstructor,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('Todas');

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
      activeClasses: 8,
      attendanceRate: '95%',
      bioEnrolled: true,
      terminalsCount: 12,
      schedule: ['Lun-Vie 06:00 - 12:00'],
      email: email || `${name.toLowerCase().replace(' ', '.')}@gymflow.com`,
      phone
    };
    onAddInstructor(newInst);
    setShowModal(false);
    setName('');
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

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(195,244,0,0.25)] active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Instructor</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg">
          <p className="text-[10px] font-semibold text-[#c4c9ac] uppercase tracking-wider mb-1">Staff Técnico Activo</p>
          <p className="font-headline text-2xl text-white">{instructors.length} Coaches</p>
          <p className="text-xs text-[#c3f400] mt-2 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Bio Sincronizada
          </p>
        </div>

        <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg">
          <p className="text-[10px] font-semibold text-[#c4c9ac] uppercase tracking-wider mb-1">Ratio Asistencia Clases</p>
          <p className="font-headline text-2xl text-[#c3f400]">92.4%</p>
          <p className="text-xs text-[#c4c9ac] mt-2">+3.8% vs trimestre anterior</p>
        </div>

        <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg">
          <p className="text-[10px] font-semibold text-[#c4c9ac] uppercase tracking-wider mb-1">Sesiones Programadas</p>
          <p className="font-headline text-2xl text-white">48 Clases</p>
          <p className="text-xs text-[#c4c9ac] mt-2">Spinning, Crossfit &amp; Funcional</p>
        </div>

        <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg">
          <p className="text-[10px] font-semibold text-[#c4c9ac] uppercase tracking-wider mb-1">Calificación Promedio</p>
          <div className="flex items-center gap-2">
            <span className="font-headline text-2xl text-white">4.92</span>
            <div className="flex text-[#c3f400]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
          <p className="text-xs text-[#c4c9ac] mt-2">1,480 reseñas de socios</p>
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

      {/* Instructors Grid */}
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
                      className="w-13 h-13 rounded-2xl object-cover border border-[#35007f] shadow-md shrink-0"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-2xl bg-[#35007f] text-[#c3f400] flex items-center justify-center font-bold text-base border border-[#42009b] shrink-0">
                      {inst.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <h3 className="font-headline text-base text-white leading-tight">{inst.name}</h3>
                    <p className="text-xs text-[#c3f400] font-semibold mt-0.5">{inst.specialty}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-[#c4c9ac]">
                      <Star className="w-3.5 h-3.5 text-[#c3f400] fill-current" />
                      <span className="font-bold text-white">{inst.rating.toFixed(1)}</span>
                      <span>• {inst.activeClasses} clases activas</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-2xl bg-[#140039] text-[#c3f400] border border-[#35007f]" title="Bio Sincronizada">
                  <Fingerprint className="w-4 h-4" />
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-3 bg-[#140039] p-3.5 rounded-2xl border border-[#35007f] my-3.5 text-xs">
                <div>
                  <p className="text-[#c4c9ac] text-[10px] uppercase tracking-wider">Asistencia Media</p>
                  <p className="text-sm font-bold text-[#c3f400] font-headline">{inst.attendanceRate}</p>
                </div>
                <div>
                  <p className="text-[#c4c9ac] text-[10px] uppercase tracking-wider">Terminales Staff</p>
                  <p className="text-sm font-bold text-white font-mono">{inst.terminalsCount} / 12</p>
                </div>
              </div>

              {/* Horarios de Clase */}
              <div className="space-y-1.5 text-xs text-[#c4c9ac] mb-4">
                <p className="uppercase tracking-widest text-[10px] font-bold text-[#c3f400]">Horarios Habituales:</p>
                {inst.schedule.map((sch, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#eaddff]">
                    <Clock className="w-3.5 h-3.5 text-[#c3f400]" />
                    <span>{sch}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#35007f]/40 flex items-center justify-between gap-2 text-xs">
              <span className="text-[#c4c9ac] truncate font-mono text-[11px]">{inst.email}</span>
              <button
                onClick={() => alert(`Enviando notificación biométrica a ${inst.name}`)}
                className="px-4 py-1.5 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] hover:text-[#c3f400] font-semibold transition-colors border border-[#35007f]"
              >
                Gestionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Instructor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#140039]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#35007f] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-headline text-xl text-white mb-1">Registrar Instructor Técnico</h3>
            <p className="text-xs text-[#c4c9ac] mb-5">Genera la ficha técnica y autoriza el enrolamiento en terminales ZKTeco.</p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="ej. Coach Diego Santana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#c3f400] outline-none placeholder:text-[#c4c9ac]/50"
                />
              </div>

              <div>
                <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Especialidad</label>
                <input
                  type="text"
                  placeholder="ej. Spinning HIIT, Halterofilia"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#c3f400] outline-none placeholder:text-[#c4c9ac]/50"
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
                    className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#c3f400] outline-none placeholder:text-[#c4c9ac]/50"
                  />
                </div>
                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#c3f400] outline-none"
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
