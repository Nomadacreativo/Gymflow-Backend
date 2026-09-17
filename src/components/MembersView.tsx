import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Fingerprint, 
  Clock, 
  Ban, 
  Download, 
  UserPlus, 
  Search, 
  Table as TableIcon, 
  LayoutGrid, 
  CheckCircle, 
  MapPin, 
  Edit, 
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Member } from '../types';

interface MembersViewProps {
  members: Member[];
  onOpenNewMember: () => void;
  onUpdateMemberStatus: (id: string, newStatus: 'Activo' | 'Suspendido') => void;
  searchQuery?: string;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  onOpenNewMember,
  onUpdateMemberStatus,
  searchQuery = '',
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Activo' | 'Suspendido'>('Todos');
  const [bioFilter, setBioFilter] = useState<'Todos' | 'Registrada' | 'Pendiente'>('Todos');
  const [viewLayout, setViewLayout] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter members
  const filteredMembers = useMemo(() => {
    const q = (localSearch || searchQuery).toLowerCase().trim();
    return members.filter((m) => {
      const matchesSearch = !q || 
        m.name.toLowerCase().includes(q) || 
        m.id.toLowerCase().includes(q) || 
        m.email.toLowerCase().includes(q);
      
      const matchesStatus = statusFilter === 'Todos' || m.status === statusFilter;
      const matchesBio = bioFilter === 'Todos' || m.bioStatus === bioFilter;

      return matchesSearch && matchesStatus && matchesBio;
    });
  }, [members, localSearch, searchQuery, statusFilter, bioFilter]);

  const handleExportCSV = () => {
    const headers = "ID,Nombre,Email,Plan,Renovación,Biometría,Último Acceso,Ubicación,Estado\n";
    const rows = filteredMembers.map(m => 
      `"${m.id}","${m.name}","${m.email}","${m.plan}","${m.renewalDate}","${m.bioStatus}","${m.lastAccess}","${m.location}","${m.status}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `directorio_miembros_gymflow_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Action Bar / Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="font-body text-xs uppercase tracking-widest text-[#c3f400] font-bold block mb-1">
            Padrón y Control de Accesos
          </span>
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tight">
            Directorio Maestro de Socios
          </h1>
          <p className="font-body text-sm text-[#c4c9ac] mt-1 max-w-2xl">
            Gestión centralizada de miembros, control biométrico facial y auditoría de accesos en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="h-11 px-4 rounded-full border border-[#35007f] bg-[#290065] text-[#eaddff] hover:bg-[#35007f] transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <Download className="w-4 h-4 text-[#c4c9ac]" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onOpenNewMember}
            className="h-11 px-5 rounded-full bg-[#c3f400] text-[#161e00] hover:bg-[#abd600] transition-all flex items-center gap-2 text-xs font-bold shadow-[0_0_15px_rgba(195,244,0,0.25)] active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Socio</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Activos Total */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/50 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#c4c9ac] font-bold">Activos Total</span>
              <div className="w-10 h-10 rounded-full bg-[#35007f] text-[#c3f400] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="font-headline text-2xl md:text-3xl text-white tracking-tight">4,289</div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#35007f]/40 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#c3f400]" />
            <span className="text-[#c3f400] font-bold">+12%</span>
            <span className="text-[#c4c9ac]">vs. mes anterior</span>
          </div>
        </div>

        {/* Bio Pendiente */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/50 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#c4c9ac] font-bold">Bio Pendiente</span>
              <div className="w-10 h-10 rounded-full bg-[#35007f] text-[#ffb4ab] flex items-center justify-center">
                <Fingerprint className="w-5 h-5" />
              </div>
            </div>
            <div className="font-headline text-2xl md:text-3xl text-white tracking-tight">142</div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#35007f]/40 text-xs text-[#ffb4ab] font-medium">
            <span>Requieren enrolamiento facial</span>
          </div>
        </div>

        {/* Renovaciones (7d) */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/50 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#c4c9ac] font-bold">Renovaciones (7d)</span>
              <div className="w-10 h-10 rounded-full bg-[#35007f] text-[#c3f400] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="font-headline text-2xl md:text-3xl text-white tracking-tight">384</div>
          </div>
          <div className="w-full h-2 bg-[#140039] rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-[#c3f400] w-[65%] rounded-full shadow-[0_0_8px_#c3f400]" />
          </div>
        </div>

        {/* Suspendidos */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/50 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#c4c9ac] font-bold">Suspendidos</span>
              <div className="w-10 h-10 rounded-full bg-[#35007f] text-[#ffb4ab] flex items-center justify-center">
                <Ban className="w-5 h-5" />
              </div>
            </div>
            <div className="font-headline text-2xl md:text-3xl text-white tracking-tight">89</div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#35007f]/40 text-xs text-[#c4c9ac]">
            <span>Por mora en cobro bancario</span>
          </div>
        </div>
      </div>

      {/* Filters & Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between bg-[#290065] rounded-2xl p-3 md:p-4 border border-[#35007f]/60 gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="flex items-center bg-[#140039] rounded-full px-4 py-2 w-full sm:w-80 border border-[#35007f] focus-within:border-[#c3f400] transition-colors">
            <Search className="w-4 h-4 text-[#c4c9ac] mr-2 shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="ID, Nombre o Email..."
              className="bg-transparent border-none outline-none text-[#eaddff] text-xs w-full placeholder:text-[#c4c9ac]/60"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center bg-[#140039] rounded-full px-3.5 py-2 border border-[#35007f]">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs text-[#eaddff] outline-none cursor-pointer pr-2 font-medium"
            >
              <option value="Todos" className="bg-[#140039] text-white">Estado: Todos</option>
              <option value="Activo" className="bg-[#140039] text-white">Estado: Activo</option>
              <option value="Suspendido" className="bg-[#140039] text-white">Estado: Suspendido</option>
            </select>
          </div>

          {/* Biometría Filter */}
          <div className="flex items-center bg-[#140039] rounded-full px-3.5 py-2 border border-[#35007f]">
            <Fingerprint className="w-3.5 h-3.5 text-[#c4c9ac] mr-2" />
            <select
              value={bioFilter}
              onChange={(e) => setBioFilter(e.target.value as any)}
              className="bg-transparent text-xs text-[#eaddff] outline-none cursor-pointer pr-2 font-medium"
            >
              <option value="Todos" className="bg-[#140039] text-white">Biometría: Todos</option>
              <option value="Registrada" className="bg-[#140039] text-white">Biometría: Registrada</option>
              <option value="Pendiente" className="bg-[#140039] text-white">Biometría: Pendiente</option>
            </select>
          </div>
        </div>

        {/* View Layout Switcher */}
        <div className="flex items-center gap-1 bg-[#140039] rounded-full p-1 self-end lg:self-auto border border-[#35007f]">
          <button
            onClick={() => setViewLayout('table')}
            className={`p-1.5 rounded-full transition-all ${
              viewLayout === 'table'
                ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
            title="Vista de Tabla"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewLayout('grid')}
            className={`p-1.5 rounded-full transition-all ${
              viewLayout === 'grid'
                ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
            title="Vista de Cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Members Content (Table or Grid) */}
      {viewLayout === 'table' ? (
        <div className="bg-[#290065] rounded-3xl overflow-hidden shadow-xl border border-[#35007f]/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead className="bg-[#140039] text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold border-b border-[#35007f]">
                <tr>
                  <th className="py-4 px-6 font-semibold w-24">ID</th>
                  <th className="py-4 px-6 font-semibold">Miembro</th>
                  <th className="py-4 px-6 font-semibold">Suscripción</th>
                  <th className="py-4 px-6 font-semibold">Biometría</th>
                  <th className="py-4 px-6 font-semibold">Último Acceso</th>
                  <th className="py-4 px-6 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[#35007f]/40">
                {filteredMembers.map((m) => (
                  <tr 
                    key={m.id}
                    className={`hover:bg-[#35007f]/40 transition-colors ${
                      m.status === 'Suspendido' ? 'bg-[#ffb4ab]/5 opacity-80' : ''
                    }`}
                  >
                    <td className="py-4 px-6 font-mono text-xs text-[#c4c9ac] font-semibold">{m.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        {m.avatar ? (
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#42009b] shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#35007f] flex items-center justify-center text-white font-bold text-sm shrink-0 border border-[#42009b]">
                            {m.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className={`font-semibold text-white ${m.status === 'Suspendido' ? 'line-through decoration-[#ffb4ab] text-[#ffb4ab]' : ''}`}>
                            {m.name}
                          </p>
                          <p className="text-xs text-[#c4c9ac] font-mono">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#35007f] text-[#eaddff] text-xs font-semibold w-fit border border-[#42009b]">
                          {m.plan}
                        </span>
                        <p className={`text-xs ${
                          m.renewalDate.includes('Vence en') || m.renewalDate.includes('Vencido') 
                            ? 'text-[#ffb4ab] font-bold' 
                            : 'text-[#c4c9ac]'
                        }`}>
                          {m.renewalDate}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {m.bioStatus === 'Registrada' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c3f400]/15 border border-[#c3f400]/40 text-[#c3f400] text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 text-[#c3f400]" />
                          <span>Registrada</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffb4ab]/15 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs font-medium">
                          <Fingerprint className="w-3.5 h-3.5 text-[#ffb4ab]" />
                          <span>Pendiente</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-white text-xs font-semibold">{m.lastAccess}</p>
                        <p className="text-[11px] text-[#c4c9ac] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#c3f400]" />
                          {m.location}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {m.status === 'Activo' ? (
                          <button
                            onClick={() => onUpdateMemberStatus(m.id, 'Suspendido')}
                            className="p-2 rounded-full bg-[#140039] hover:bg-[#ffb4ab]/20 text-[#c4c9ac] hover:text-[#ffb4ab] transition-colors border border-[#35007f]"
                            title="Suspender socio"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateMemberStatus(m.id, 'Activo')}
                            className="p-2 rounded-full bg-[#140039] hover:bg-[#c3f400]/20 text-[#c4c9ac] hover:text-[#c3f400] transition-colors border border-[#35007f]"
                            title="Reactivar socio"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={onOpenNewMember}
                          className="p-2 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#c4c9ac] hover:text-white transition-colors border border-[#35007f]"
                          title="Editar información"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-[#140039] p-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#35007f] gap-3 text-xs text-[#c4c9ac]">
            <p>Mostrando {filteredMembers.length} de 4,289 miembros registrados</p>
            <div className="flex items-center gap-1.5">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-full bg-[#290065] border border-[#35007f] flex items-center justify-center hover:bg-[#35007f] disabled:opacity-40 transition-colors text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-[#c3f400] text-[#161e00] font-bold">
                1
              </button>
              <button className="w-8 h-8 rounded-full bg-[#290065] border border-[#35007f] hover:bg-[#35007f] text-white transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded-full bg-[#290065] border border-[#35007f] hover:bg-[#35007f] text-white transition-colors">
                3
              </button>
              <span className="px-1 text-[#c4c9ac]">...</span>
              <button className="w-8 h-8 rounded-full bg-[#290065] border border-[#35007f] hover:bg-[#35007f] text-white transition-colors">
                86
              </button>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-8 h-8 rounded-full bg-[#290065] border border-[#35007f] flex items-center justify-center hover:bg-[#35007f] transition-colors text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((m) => (
            <div 
              key={m.id}
              className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between hover:border-[#c3f400]/40 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {m.avatar ? (
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#42009b]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#35007f] flex items-center justify-center text-white font-bold text-base border border-[#42009b]">
                        {m.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-headline text-base text-white">{m.name}</h3>
                      <p className="text-xs text-[#c4c9ac] font-mono">{m.id}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    m.status === 'Activo' 
                      ? 'bg-[#c3f400]/15 text-[#c3f400] border-[#c3f400]/40' 
                      : 'bg-[#ffb4ab]/15 text-[#ffb4ab] border-[#ffb4ab]/40'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs py-3 border-t border-b border-[#35007f]/40 my-3">
                  <div className="flex justify-between">
                    <span className="text-[#c4c9ac]">Plan:</span>
                    <span className="font-bold text-white">{m.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#c4c9ac]">Biometría:</span>
                    <span className={m.bioStatus === 'Registrada' ? 'text-[#c3f400] font-semibold' : 'text-[#ffb4ab] font-semibold'}>
                      {m.bioStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#c4c9ac]">Renovación:</span>
                    <span className="text-white font-mono">{m.renewalDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#c4c9ac]">Último Acceso:</span>
                    <span className="text-[#eaddff]">{m.lastAccess}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => onUpdateMemberStatus(m.id, m.status === 'Activo' ? 'Suspendido' : 'Activo')}
                  className="flex-1 py-2 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] text-xs font-semibold transition-colors border border-[#35007f]"
                >
                  {m.status === 'Activo' ? 'Suspender' : 'Reactivar'}
                </button>
                <button
                  onClick={onOpenNewMember}
                  className="px-4 py-2 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
