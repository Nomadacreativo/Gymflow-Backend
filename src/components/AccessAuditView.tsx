import React, { useState } from 'react';
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
  DoorOpen, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Fingerprint
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const triggerSimulatedAccess = (isSuccess = true) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newEv: AccessEvent = {
      id: `ev-${Date.now()}`,
      time: timeStr,
      memberName: isSuccess ? 'Socio Verificado (Prueba)' : 'Rostro Desconocido / Denegado',
      memberId: isSuccess ? 'ID: GYM-01' : 'ID: SIN-REGISTRO',
      terminal: 'Torno Principal A',
      status: isSuccess ? 'APROBADO' : 'RECHAZADO',
      detail: isSuccess ? 'Biometría facial SpeedFace verificada' : 'Mora en cuota o rostro no enrolado',
      isNew: true
    };

    onAddSimulatedEvent(newEv);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredLogs = events.filter((ev) => {
    const q = (localSearch || searchQuery).toLowerCase().trim();
    const matchesQuery = !q || 
      ev.memberName.toLowerCase().includes(q) || 
      ev.memberId.toLowerCase().includes(q) || 
      ev.terminal.toLowerCase().includes(q);

    const matchesTerminal = terminalFilter === 'Todas' || ev.terminal.toLowerCase().includes(terminalFilter.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || ev.status === statusFilter;

    return matchesQuery && matchesTerminal && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dynamic Metrics
  const totalApproved = events.filter(e => e.status === 'APROBADO').length;
  const totalRejected = events.filter(e => e.status === 'RECHAZADO').length;
  const approvalRate = events.length > 0 ? Math.round((totalApproved / events.length) * 100) : 100;

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Hora,Socio,ID,Terminal,Estado,Detalle\n"
      + filteredLogs.map(e => `"${e.time}","${e.memberName}","${e.memberId}","${e.terminal}","${e.status}","${e.detail}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gymflow_accesos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Title & Live Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="font-body text-xs uppercase tracking-widest text-[#c3f400] font-bold block mb-1">
            Biometría y Control Físico Edge
          </span>
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tight">
            Auditoría de Accesos en Vivo
          </h1>
          <p className="font-body text-sm text-[#c4c9ac] mt-1 max-w-xl">
            Monitoreo en tiempo real de torniquetes SpeedFace y terminales de reconocimiento facial.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => triggerSimulatedAccess(true)}
            className="h-11 px-4 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#c3f400] border border-[#35007f] transition-all flex items-center gap-2 text-xs font-semibold shadow-sm active:scale-95"
            title="Registrar un acceso de prueba"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pase de Prueba</span>
          </button>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="h-11 px-4 rounded-full border border-[#35007f] bg-[#290065] text-[#eaddff] hover:bg-[#35007f] transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#c3f400]' : 'text-[#c4c9ac]'}`} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={handleExport}
            disabled={filteredLogs.length === 0}
            className="h-11 px-5 rounded-full bg-[#c3f400] text-[#161e00] hover:bg-[#abd600] disabled:opacity-40 transition-all flex items-center gap-2 text-xs font-bold shadow-[0_0_15px_rgba(195,244,0,0.25)] active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1 */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">Total Accesos</span>
            <div className="w-10 h-10 rounded-full bg-[#35007f] flex items-center justify-center text-[#c3f400]">
              <LogIn className="w-5 h-5" />
            </div>
          </div>
          <div className="font-headline text-3xl text-white">{events.length}</div>
          <p className="text-xs text-[#c4c9ac] mt-2">Registrados en el sistema</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">Accesos Aprobados</span>
            <div className="w-10 h-10 rounded-full bg-[#35007f] flex items-center justify-center text-[#c3f400]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-headline text-3xl text-[#c3f400]">{totalApproved}</div>
          <p className="text-xs text-[#c4c9ac] mt-2">
            {events.length > 0 ? `${approvalRate}% de tasa de aprobación` : 'Sin accesos registrados'}
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">Rechazos</span>
            <div className="w-10 h-10 rounded-full bg-[#35007f] flex items-center justify-center text-[#ffb4ab]">
              <Ban className="w-5 h-5" />
            </div>
          </div>
          <div className="font-headline text-3xl text-[#ffb4ab]">{totalRejected}</div>
          <p className="text-xs text-[#c4c9ac] mt-2">Mora o falta de biometría</p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">Terminales Edge</span>
            <div className="w-10 h-10 rounded-full bg-[#35007f] flex items-center justify-center text-[#c3f400]">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline text-3xl text-white">6</span>
            <span className="text-base font-bold text-[#c4c9ac]">/6</span>
          </div>
          <div className="flex gap-1.5 mt-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="w-2.5 h-2.5 rounded-full bg-[#c3f400] shadow-[0_0_6px_#c3f400]" 
                title={`Terminal ${i + 1} en línea`}
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
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
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
                onChange={(e) => {
                  setTerminalFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-white outline-none cursor-pointer pr-1"
              >
                <option value="Todas" className="bg-[#140039]">Todas las Terminales</option>
                <option value="Torno Principal" className="bg-[#140039]">Tornos Principales</option>
                <option value="VIP" className="bg-[#140039]">VIP Lounge</option>
                <option value="Locker" className="bg-[#140039]">Vestidores</option>
                <option value="Staff" className="bg-[#140039]">Staff Backroom</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="flex items-center bg-[#290065] text-[#eaddff] text-xs px-3.5 py-2 rounded-full border border-[#35007f]">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-white outline-none cursor-pointer pr-1"
              >
                <option value="Todos" className="bg-[#140039]">Estado: Todos</option>
                <option value="APROBADO" className="bg-[#140039]">Aprobado</option>
                <option value="RECHAZADO" className="bg-[#140039]">Rechazado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table / Empty State */}
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#140039] text-[#c4c9ac] flex items-center justify-center border border-[#35007f]">
              <Fingerprint className="w-7 h-7 text-[#c3f400]" />
            </div>
            <h3 className="font-headline text-base text-white">Sin registros de acceso todavía</h3>
            <p className="text-xs text-[#c4c9ac] max-w-md leading-relaxed">
              Los eventos de acceso aparecerán en tiempo real cuando los socios pasen por los torniquetes o puedes pulsar "Pase de Prueba" para verificar la conexión.
            </p>
            <button
              onClick={() => triggerSimulatedAccess(true)}
              className="mt-2 px-4 py-2 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#c3f400] font-bold text-xs border border-[#35007f] transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Ejecutar Pase de Prueba</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap border-collapse min-w-[720px]">
              <thead>
                <tr className="text-[11px] text-[#c4c9ac] font-bold uppercase tracking-wider border-b border-[#35007f]">
                  <th className="py-3.5 px-4">Hora</th>
                  <th className="py-3.5 px-4">Socio</th>
                  <th className="py-3.5 px-4">Terminal</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Detalle</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#35007f]/40">
                {paginatedLogs.map((ev) => (
                  <tr
                    key={ev.id}
                    className={`group transition-all hover:bg-[#35007f]/40 ${
                      ev.isNew ? 'bg-[#c3f400]/10' : ''
                    }`}
                  >
                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          ev.isNew ? 'bg-[#c3f400] animate-pulse shadow-[0_0_6px_#c3f400]' : 'bg-transparent'
                        }`} />
                        <span className="text-white font-medium">{ev.time}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#35007f] flex items-center justify-center font-bold text-xs text-[#c3f400] border border-[#42009b]">
                          {ev.memberName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{ev.memberName}</p>
                          <p className="text-[11px] text-[#c4c9ac] font-mono">{ev.memberId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#eaddff]">
                      {ev.terminal}
                    </td>

                    <td className="py-4 px-4">
                      {ev.status === 'APROBADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c3f400]/15 border border-[#c3f400]/40 text-[#c3f400] text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          APROBADO
                        </span>
                      )}
                      {ev.status === 'RECHAZADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffb4ab]/15 border border-[#ffb4ab]/40 text-[#ffb4ab] text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          RECHAZADO
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-[#c4c9ac]">
                      {ev.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dynamic Pagination Footer */}
        {filteredLogs.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-[#35007f]/40 pt-4 gap-4 text-xs text-[#c4c9ac]">
            <span>
              Mostrando {paginatedLogs.length} de {filteredLogs.length} registros de acceso hoy
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-full bg-[#140039] flex items-center justify-center hover:bg-[#35007f] text-white disabled:opacity-40 transition-colors border border-[#35007f]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-[#140039] rounded-full text-white font-mono text-xs">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-full bg-[#140039] flex items-center justify-center hover:bg-[#35007f] text-white transition-colors border border-[#35007f]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
