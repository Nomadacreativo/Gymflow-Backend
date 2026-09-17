import React, { useState, useEffect } from 'react';
import { 
  RotateCw, 
  Search, 
  Download, 
  LogIn, 
  Users, 
  Ban, 
  Radio, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowUp, 
  DoorOpen, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { AccessEvent } from '../types';

interface AccessAuditViewProps {
  events: AccessEvent[];
  onAddSimulatedEvent: (event: AccessEvent) => void;
  searchQuery?: string;
}

export const AccessAuditView: React.FC<AccessAuditViewProps> = ({
  events,
  onAddSimulatedEvent,
  searchQuery = '',
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [terminalFilter, setTerminalFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Auto simulate event every 20 seconds if live stream is on
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      triggerSimulatedAccess();
    }, 18000);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const triggerSimulatedAccess = () => {
    const candidates = [
      {
        name: 'Marcus Vance',
        id: 'ID: GYM-9942',
        terminal: 'VIP Lounge',
        status: 'APROBADO' as const,
        detail: 'VIP Acceso (Membresía Elite Active)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Carlos Mendoza',
        id: 'ID: GYM-1029',
        terminal: 'Main Gate - A1',
        status: 'APROBADO' as const,
        detail: 'Membresía Activa (Titanio Pro)'
      },
      {
        name: 'Valeria Méndez',
        id: 'ID: GYM-6621',
        terminal: 'Locker Room Damas',
        status: 'APROBADO' as const,
        detail: 'Acceso Estándar Concedido'
      },
      {
        name: 'Desconocido',
        id: 'ID: SIN-REGISTRO',
        terminal: 'Puerta Staff & Backroom',
        status: 'RECHAZADO' as const,
        detail: 'Rostro no enrolado en base local'
      }
    ];

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const newEv: AccessEvent = {
      id: `ev-${Date.now()}`,
      time: timeStr,
      memberName: pick.name,
      memberId: pick.id,
      avatar: pick.avatar,
      terminal: pick.terminal,
      status: pick.status,
      detail: pick.detail,
      isNew: true
    };

    onAddSimulatedEvent(newEv);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerSimulatedAccess();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredLogs = events.filter((ev) => {
    const q = (localSearch || searchQuery).toLowerCase().trim();
    const matchesSearch = !q || 
      ev.memberName.toLowerCase().includes(q) || 
      ev.memberId.toLowerCase().includes(q) || 
      ev.terminal.toLowerCase().includes(q);

    const matchesTerminal = terminalFilter === 'Todas' || ev.terminal.includes(terminalFilter);
    const matchesStatus = statusFilter === 'Todos' || ev.status === statusFilter;

    return matchesSearch && matchesTerminal && matchesStatus;
  });

  const handleExport = () => {
    const headers = "Hora,Socio,ID,Terminal,Estado,Detalle\n";
    const rows = filteredLogs.map(l => 
      `"${l.time}","${l.memberName}","${l.memberId}","${l.terminal}","${l.status}","${l.detail}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `auditoria_accesos_gymflow_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-body text-xs uppercase tracking-widest text-[#c3f400] font-bold block mb-1">
            Monitoreo en Tiempo Real & Torniquetes
          </span>
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tight">
            Auditoría de Accesos & Flujo de Socios
          </h1>
          <p className="font-body text-sm text-[#c4c9ac] mt-1 max-w-2xl">
            Historial de eventos de torniquetes, reconocimiento facial y aforo en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Live Stream Pulse Badge */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
              isLiveStreaming 
                ? 'bg-[#c3f400]/15 border-[#c3f400]/40 text-[#c3f400]' 
                : 'bg-[#140039] border-[#35007f] text-[#c4c9ac]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              isLiveStreaming ? 'bg-[#c3f400] animate-pulse shadow-[0_0_8px_#c3f400]' : 'bg-[#c4c9ac]'
            }`} />
            <span>{isLiveStreaming ? 'EN VIVO' : 'PAUSADO'}</span>
          </button>

          {/* Simulate Action button */}
          <button
            onClick={triggerSimulatedAccess}
            className="bg-[#290065] hover:bg-[#35007f] text-[#eaddff] hover:text-[#c3f400] border border-[#35007f] text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md active:scale-95"
            title="Simular paso por torniquete"
          >
            <Zap className="w-4 h-4 text-[#c3f400]" />
            <span>Simular Entrada</span>
          </button>

          {/* Actualizar Button */}
          <button
            onClick={handleRefresh}
            className="bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(195,244,0,0.25)] active:scale-95"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </header>

      {/* Top Stats Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1: Total Entradas */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">Total Entradas (Hoy)</span>
            <div className="w-10 h-10 rounded-full bg-[#35007f] flex items-center justify-center text-[#c3f400]">
              <LogIn className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline text-3xl text-white">342</span>
            <span className="text-xs text-[#c3f400] font-bold flex items-center">
              <ArrowUp className="w-3 h-3 mr-0.5" /> 12%
            </span>
          </div>
          <p className="text-[11px] text-[#c4c9ac] mt-2 font-medium">Mayor afluencia entre 18:00 - 20:00</p>
        </div>

        {/* Stat Card 2: Ocupación Actual */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">Ocupación Actual</span>
            <div className="w-10 h-10 rounded-full bg-[#35007f] flex items-center justify-center text-[#c3f400]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline text-3xl text-[#c3f400]">78%</span>
            <span className="text-xs text-[#c4c9ac] font-medium">de capacidad máxima</span>
          </div>
          <div className="w-full h-2 bg-[#140039] rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-[#c3f400] w-[78%] rounded-full shadow-[0_0_8px_#c3f400] transition-all duration-500" />
          </div>
        </div>

        {/* Stat Card 3: Rechazos */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">Rechazos</span>
            <div className="w-10 h-10 rounded-full bg-[#35007f] flex items-center justify-center text-[#ffb4ab]">
              <Ban className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline text-3xl text-[#ffb4ab]">12</span>
            <span className="text-xs text-[#c4c9ac] font-medium">intentos bloqueados</span>
          </div>
          <p className="text-[11px] text-[#ffb4ab] mt-2 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse" />
            Requieren revisión en recepción
          </p>
        </div>

        {/* Stat Card 4: Terminales Activas */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">Terminales en Línea</span>
            <div className="w-10 h-10 rounded-full bg-[#35007f] flex items-center justify-center text-[#c3f400]">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline text-3xl text-white">12</span>
            <span className="text-base font-bold text-[#c4c9ac]">/12</span>
          </div>
          <div className="flex gap-1.5 mt-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-[#c3f400]" 
                title={`Terminal ${i + 1} operando normalmente`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area: Filters Toolbar & Table */}
      <div className="bg-[#290065] rounded-3xl p-5 md:p-6 shadow-xl border border-[#35007f]/60 flex flex-col gap-5">
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center bg-[#140039] p-3 rounded-2xl border border-[#35007f]">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#c4c9ac] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Buscar por ID, socio o terminal..."
              className="w-full bg-[#290065] text-white text-xs rounded-full pl-10 pr-3.5 py-2.5 border border-[#35007f] focus:outline-none focus:border-[#c3f400] transition-colors placeholder:text-[#c4c9ac]/50"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Terminal Select */}
            <div className="flex items-center bg-[#290065] text-[#eaddff] text-xs px-3.5 py-2 rounded-full border border-[#35007f]">
              <DoorOpen className="w-3.5 h-3.5 text-[#c4c9ac] mr-2" />
              <select
                value={terminalFilter}
                onChange={(e) => setTerminalFilter(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer pr-1"
              >
                <option value="Todas" className="bg-[#140039]">Todas las Terminales</option>
                <option value="Main Gate" className="bg-[#140039]">Main Gate (Tornos)</option>
                <option value="VIP" className="bg-[#140039]">VIP Lounge</option>
                <option value="Locker" className="bg-[#140039]">Vestidores</option>
                <option value="Staff" className="bg-[#140039]">Staff Backroom</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="flex items-center bg-[#290065] text-[#eaddff] text-xs px-3.5 py-2 rounded-full border border-[#35007f]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer pr-1"
              >
                <option value="Todos" className="bg-[#140039]">Estado: Todos</option>
                <option value="APROBADO" className="bg-[#140039]">Aprobado</option>
                <option value="RECHAZADO" className="bg-[#140039]">Rechazado</option>
                <option value="VERIFICANDO" className="bg-[#140039]">Verificando</option>
              </select>
            </div>

            {/* Export */}
            <button
              onClick={handleExport}
              className="p-2 rounded-full bg-[#290065] hover:bg-[#35007f] text-[#c4c9ac] hover:text-white border border-[#35007f] transition-colors"
              title="Descargar registro CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap border-collapse min-w-[720px]">
            <thead>
              <tr className="text-[11px] text-[#c4c9ac] font-bold uppercase tracking-wider border-b border-[#35007f]">
                <th className="py-3.5 px-4">Hora</th>
                <th className="py-3.5 px-4">Socio</th>
                <th className="py-3.5 px-4">Terminal</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Detalle</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#35007f]/40">
              {filteredLogs.map((ev) => (
                <tr
                  key={ev.id}
                  className={`group transition-all hover:bg-[#35007f]/40 ${
                    ev.isNew ? 'bg-[#c3f400]/10' : ''
                  }`}
                >
                  {/* Hora */}
                  <td className="py-4 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        ev.isNew ? 'bg-[#c3f400] animate-pulse shadow-[0_0_6px_#c3f400]' : 'bg-transparent'
                      }`} />
                      <span className={ev.isNew ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac]'}>
                        {ev.time}
                      </span>
                    </div>
                  </td>

                  {/* Socio */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {ev.avatar ? (
                        <img
                          src={ev.avatar}
                          alt={ev.memberName}
                          className="w-9 h-9 rounded-full object-cover border border-[#42009b]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#35007f] border border-[#42009b] flex items-center justify-center font-bold text-xs text-white">
                          {ev.memberName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white leading-snug">{ev.memberName}</p>
                        <p className="text-[11px] text-[#c4c9ac] font-mono">{ev.memberId}</p>
                      </div>
                    </div>
                  </td>

                  {/* Terminal */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-[#eaddff]">
                      <DoorOpen className="w-3.5 h-3.5 text-[#c4c9ac]" />
                      <span>{ev.terminal}</span>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4">
                    {ev.status === 'APROBADO' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#c3f400]/15 border border-[#c3f400]/40 text-[#c3f400] text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c3f400]" />
                        APROBADO
                      </span>
                    )}
                    {ev.status === 'RECHAZADO' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffb4ab]/15 border border-[#ffb4ab]/40 text-[#ffb4ab] text-[11px] font-bold">
                        <XCircle className="w-3.5 h-3.5 text-[#ffb4ab]" />
                        RECHAZADO
                      </span>
                    )}
                    {ev.status === 'VERIFICANDO' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eaddff]/15 border border-[#eaddff]/40 text-[#eaddff] text-[11px] font-medium">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c3f400]" />
                        VERIFICANDO
                      </span>
                    )}
                  </td>

                  {/* Detalle */}
                  <td className="py-4 px-4 text-[#c4c9ac]">
                    {ev.detail}
                  </td>

                  {/* Acción */}
                  <td className="py-4 px-4 text-right">
                    <button className="text-[#c4c9ac] hover:text-[#c3f400] p-2 rounded-full hover:bg-[#140039] transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-[#35007f]/40 pt-4 gap-4 text-xs text-[#c4c9ac]">
          <span>Mostrando {filteredLogs.length} de 342 registros de acceso hoy</span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-full bg-[#140039] flex items-center justify-center hover:bg-[#35007f] text-white disabled:opacity-40 transition-colors border border-[#35007f]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#c3f400] text-[#161e00] font-bold text-xs">
              1
            </button>
            <button className="w-8 h-8 rounded-full bg-[#140039] hover:bg-[#35007f] text-white transition-colors text-xs border border-[#35007f]">
              2
            </button>
            <button className="w-8 h-8 rounded-full bg-[#140039] hover:bg-[#35007f] text-white transition-colors text-xs border border-[#35007f]">
              3
            </button>
            <span className="px-1 text-[#c4c9ac]">...</span>
            <button className="w-8 h-8 rounded-full bg-[#140039] hover:bg-[#35007f] text-white transition-colors text-xs border border-[#35007f]">
              86
            </button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="w-8 h-8 rounded-full bg-[#140039] flex items-center justify-center hover:bg-[#35007f] text-white transition-colors border border-[#35007f]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
