import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  UserPlus, 
  Flame, 
  Router, 
  Megaphone, 
  CheckCircle2, 
  ArrowUpRight,
  Receipt,
  RotateCcw,
  Fingerprint,
  Server,
  CreditCard,
  Sparkles,
  Activity,
  Plus
} from 'lucide-react';
import { SystemAlert, NavigationTab, Member, PlanItem, TerminalDevice } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenNewMember: () => void;
  onOpenReceipt: () => void;
  alerts: SystemAlert[];
  members?: Member[];
  plans?: PlanItem[];
  terminals?: TerminalDevice[];
  onDismissAlert?: (id: string) => void;
}

// Single Source of Truth: Capacidad máxima unificada de la sede
export const MAX_GYM_CAPACITY = 220;

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewMember,
  onOpenReceipt,
  alerts,
  members = [],
  plans = [],
  terminals = [],
}) => {
  // Toggle: Datos Demo vs Estado Cero
  const [dataMode, setDataMode] = useState<'demo' | 'zero'>('demo');
  const [chartPeriod, setChartPeriod] = useState<'Mensual' | 'Trimestral'>('Mensual');
  const [edgeRestarting, setEdgeRestarting] = useState(false);
  const [edgeStatus, setEdgeStatus] = useState<'offline' | 'online'>('online');

  // Cálculo de métricas según el modo seleccionado
  const isDemo = dataMode === 'demo';

  // KPIs congruentes y unificados
  // Datos Demo: MRR: $242,500 MXN, 485 Socios Activos, Aforo: 143 / 220 (65%)
  // Estado Cero: MRR: $0 MXN, Socios: 0, Aforo: 0 / 220 (0%)
  const displayMRR = isDemo ? 242500 : 0;
  const mrrTrend = isDemo ? '+12.5%' : '0%';
  const displayActiveMembers = isDemo ? 485 : 0;
  const displaySuspendedMembers = isDemo ? 10 : 0;
  const displayChurnRate = isDemo ? '2.1' : '0.0';
  const displayOccupancyCount = isDemo ? 143 : 0;
  const occupancyPercentage = Math.round((displayOccupancyCount / MAX_GYM_CAPACITY) * 100);

  const handleRestartEdge = () => {
    setEdgeRestarting(true);
    setTimeout(() => {
      setEdgeRestarting(false);
      setEdgeStatus('online');
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full gap-7 animate-in fade-in duration-300">
      {/* Top Bar: Título del Dashboard & Switch "Datos Demo / Estado Cero" */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#180736] p-4 sm:p-5 rounded-3xl border border-[#35007f]/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
            <h1 className="font-headline text-lg sm:text-xl text-white tracking-wide uppercase">
              Panel Administrativo Principal
            </h1>
          </div>
          <p className="font-body text-xs text-[#c4c9ac] mt-1">
            Control de aforo, finanzas recurrentes y telemetría de hardware biométrico ZKTeco
          </p>
        </div>

        {/* Toggle de Datos Demo / Estado Cero */}
        <div className="flex items-center gap-1.5 bg-[#240E4B] p-1.5 rounded-full border border-[#35007f] shadow-inner self-stretch sm:self-auto justify-between sm:justify-start">
          <span className="text-[11px] font-semibold text-[#c4c9ac] px-2.5 hidden sm:inline">
            Modo de datos:
          </span>
          <button
            onClick={() => setDataMode('demo')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              isDemo
                ? 'bg-[#CCFF00] text-[#0D0221] shadow-[0_0_15px_rgba(204,255,0,0.35)]'
                : 'text-[#eaddff] hover:text-white'
            }`}
          >
            Datos Demo
          </button>
          <button
            onClick={() => setDataMode('zero')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              !isDemo
                ? 'bg-[#CCFF00] text-[#0D0221] shadow-[0_0_15px_rgba(204,255,0,0.35)]'
                : 'text-[#eaddff] hover:text-white'
            }`}
          >
            Estado Cero
          </button>
        </div>
      </div>

      {/* Header / KPIs Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* KPI 1: MRR */}
        <div className="bg-[#180736] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/50 hover:border-[#CCFF00]/40 transition-colors shadow-lg">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#CCFF00]/10 rounded-full blur-2xl group-hover:bg-[#CCFF00]/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-[#240E4B] rounded-2xl w-12 h-12 flex items-center justify-center border border-[#35007f]">
              <DollarSign className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <span className="inline-flex items-center gap-1 bg-[#240E4B] px-3 py-1 rounded-full font-mono text-xs font-bold text-[#CCFF00] border border-[#35007f]">
              <TrendingUp className="w-3.5 h-3.5" />
              {mrrTrend}
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
              MRR (Ingresos Recurrentes)
            </p>
            <h2 className="font-mono text-2xl sm:text-3xl text-white tracking-tight font-bold">
              ${displayMRR.toLocaleString('es-MX')} <span className="text-sm font-normal text-[#c4c9ac]">MXN</span>
            </h2>
          </div>
        </div>

        {/* KPI 2: Tasa de Suspensión (Churn) */}
        <div className="bg-[#180736] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/50 hover:border-[#FFB4AB]/40 transition-colors shadow-lg">
          <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-[#FFB4AB]/10 rounded-full blur-2xl group-hover:bg-[#FFB4AB]/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-[#240E4B] rounded-2xl w-12 h-12 flex items-center justify-center border border-[#35007f]">
              <TrendingDown className="w-6 h-6 text-[#FFB4AB]" />
            </div>
            <span className="inline-flex items-center gap-1 bg-[#240E4B] px-3 py-1 rounded-full font-mono text-xs font-bold text-[#FFB4AB] border border-[#35007f]">
              {displayChurnRate}%
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
              Tasa de Suspensión
            </p>
            <h2 className="font-mono text-2xl sm:text-3xl text-white tracking-tight font-bold">
              {displayChurnRate}%
            </h2>
          </div>
        </div>

        {/* KPI 3: Socios Activos */}
        <div className="bg-[#180736] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/50 hover:border-[#CCFF00]/40 transition-colors shadow-lg">
          <div className="absolute -left-12 -top-12 w-32 h-32 bg-[#CCFF00]/10 rounded-full blur-2xl group-hover:bg-[#CCFF00]/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-[#240E4B] rounded-2xl w-12 h-12 flex items-center justify-center border border-[#35007f]">
              <UserPlus className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <span className="inline-flex items-center gap-1 bg-[#240E4B] px-3 py-1 rounded-full font-mono text-xs font-bold text-[#CCFF00] border border-[#35007f]">
              {isDemo ? 'Al día' : '0 altas'}
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
              Socios Activos
            </p>
            <h2 className="font-mono text-2xl sm:text-3xl text-white tracking-tight font-bold">
              {displayActiveMembers}
            </h2>
          </div>
        </div>

        {/* KPI 4: Aforo Actual (Unificado con MAX_GYM_CAPACITY = 220) */}
        <div className="bg-[#180736] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/50 hover:border-[#00E5FF]/40 transition-colors shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-[#240E4B] rounded-2xl w-12 h-12 flex items-center justify-center border border-[#35007f]">
              <Flame className="w-6 h-6 text-[#00E5FF]" />
            </div>
            <span className="inline-flex items-center gap-1 bg-[#240E4B] px-3 py-1 rounded-full font-mono text-xs font-bold text-[#00E5FF] border border-[#35007f]">
              {occupancyPercentage}%
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold mb-1">
              Aforo en Sede
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="font-mono text-2xl sm:text-3xl text-white tracking-tight font-bold">
                {displayOccupancyCount}
              </h2>
              <span className="font-mono text-sm text-[#c4c9ac]">
                / {MAX_GYM_CAPACITY} socios
              </span>
            </div>
            <div className="w-full bg-[#240E4B] h-2.5 rounded-full mt-3 overflow-hidden border border-[#35007f]/80">
              <div 
                className="bg-gradient-to-r from-[#00E5FF] to-[#CCFF00] h-full rounded-full shadow-[0_0_8px_#00E5FF] transition-all duration-500" 
                style={{ width: `${occupancyPercentage}%` }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Gráfica de Flujo Financiero & Terminales Edge ZKTeco */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card: Flujo Financiero */}
          <div className="bg-[#180736] rounded-[2.5rem] p-6 sm:p-8 flex flex-col min-h-[420px] border border-[#35007f]/50 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 relative z-10">
              <div>
                <h3 className="font-headline text-xl sm:text-2xl text-white tracking-wide uppercase">
                  Flujo Financiero
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#c4c9ac] mt-0.5">
                  Ingresos Recurrentes vs Gastos Operativos de Sede
                </p>
              </div>

              {/* Controles de Periodicidad */}
              {isDemo && (
                <div className="flex items-center gap-2 bg-[#240E4B] rounded-full p-1 self-start sm:self-auto border border-[#35007f]">
                  <button 
                    onClick={() => setChartPeriod('Mensual')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      chartPeriod === 'Mensual' 
                        ? 'bg-[#180736] text-white shadow-sm font-bold border border-[#35007f]' 
                        : 'text-[#c4c9ac] hover:text-white'
                    }`}
                  >
                    Mensual
                  </button>
                  <button 
                    onClick={() => setChartPeriod('Trimestral')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      chartPeriod === 'Trimestral' 
                        ? 'bg-[#180736] text-white shadow-sm font-bold border border-[#35007f]' 
                        : 'text-[#c4c9ac] hover:text-white'
                    }`}
                  >
                    Trimestral
                  </button>
                </div>
              )}
            </div>

            {/* Renderizado condicional: Curva poblada si está en Demo vs Empty State limpio si está en Estado Cero */}
            {isDemo ? (
              <div className="flex-1 flex flex-col justify-between pt-2">
                {/* Leyenda Financiera */}
                <div className="flex items-center gap-6 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]" />
                    <span className="text-white">Ingresos: <strong className="text-[#CCFF00]">$242,500 MXN</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FFB4AB] opacity-80" />
                    <span className="text-[#c4c9ac]">Gastos: <strong className="text-[#FFB4AB]">$98,200 MXN</strong></span>
                  </div>
                </div>

                {/* SVG Chart con curvas y datos congruentes */}
                <div className="relative w-full h-56 flex items-end pt-4 pb-6">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                    {/* Grid horizontal */}
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#35007f" strokeOpacity="0.6" strokeDasharray="1 1" strokeWidth="0.3" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#35007f" strokeOpacity="0.6" strokeDasharray="1 1" strokeWidth="0.3" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="#35007f" strokeOpacity="0.6" strokeDasharray="1 1" strokeWidth="0.3" />

                    {/* Curva de Ingresos (Verde Volt) */}
                    <path 
                      d="M0,44 Q18,36 35,28 T70,18 T90,12 T100,7" 
                      fill="none" 
                      stroke="#CCFF00" 
                      strokeWidth="2.2"
                      className="drop-shadow-[0_4px_12px_rgba(204,255,0,0.45)]" 
                    />

                    {/* Curva de Gastos (Rosa Tonal) */}
                    <path 
                      d="M0,48 Q20,44 42,41 T72,36 T92,34 T100,32" 
                      fill="none" 
                      stroke="#FFB4AB" 
                      strokeOpacity="0.7"
                      strokeWidth="1.4" 
                    />

                    {/* Nodos de datos */}
                    <circle cx="35" cy="28" r="2.2" fill="#180736" stroke="#CCFF00" strokeWidth="1.2" />
                    <circle cx="70" cy="18" r="2.2" fill="#180736" stroke="#CCFF00" strokeWidth="1.2" />
                    <circle cx="100" cy="7" r="2.4" fill="#CCFF00" stroke="#0D0221" strokeWidth="1" />
                  </svg>

                  {/* Etiquetas de meses */}
                  <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2 font-mono text-xs text-[#c4c9ac]">
                    <span>Ene</span>
                    <span>Mar</span>
                    <span>May</span>
                    <span>Jul</span>
                    <span>Sep</span>
                    <span>Nov</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State Limpio para "Estado Cero" */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-[#240E4B]/40 border border-[#35007f]/50 my-auto">
                <div className="w-16 h-16 rounded-3xl bg-[#240E4B] flex items-center justify-center mb-4 border border-[#35007f] shadow-inner">
                  <Activity className="w-8 h-8 text-[#c4c9ac]" />
                </div>
                <h4 className="font-headline text-lg sm:text-xl text-white uppercase tracking-wide mb-2">
                  Sin Ingresos Registrados en Este Ciclo
                </h4>
                <p className="font-body text-xs sm:text-sm text-[#c4c9ac] max-w-md mb-6 leading-relaxed">
                  El sistema se encuentra en Estado Cero inicial. Registra el primer pago de cuota o da de alta un nuevo socio para habilitar la telemetría del flujo financiero.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={onOpenNewMember}
                    className="px-6 py-3 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-[#0D0221] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.35)] transition-all active:scale-95 hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Registrar Primer Pago o Membresía</span>
                  </button>
                  <button
                    onClick={onOpenReceipt}
                    className="px-5 py-3 rounded-full bg-[#240E4B] hover:bg-[#35007f] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-[#35007f] transition-all active:scale-95"
                  >
                    <Receipt className="w-4 h-4 text-[#CCFF00]" />
                    <span>Emitir Comprobante</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Terminales Edge ZKTeco Widget */}
          <div className="bg-[#180736] rounded-[2.5rem] p-6 sm:p-8 border border-[#35007f]/50 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#240E4B] flex items-center justify-center border border-[#35007f]">
                  <Router className="w-5 h-5 text-[#CCFF00]" />
                </div>
                <div>
                  <h3 className="font-headline text-lg sm:text-xl text-white tracking-wide uppercase">
                    Terminales Edge ZKTeco (LAN)
                  </h3>
                  <p className="font-body text-xs text-[#c4c9ac]">
                    Protocolo Push SDK biométrico en red local
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestartEdge}
                  disabled={edgeRestarting}
                  title="Reiniciar Edge Connector LAN"
                  className="p-2 rounded-xl bg-[#240E4B] hover:bg-[#35007f] text-[#c4c9ac] hover:text-white transition-colors border border-[#35007f]"
                >
                  <RotateCcw className={`w-4 h-4 ${edgeRestarting ? 'animate-spin text-[#CCFF00]' : ''}`} />
                </button>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E676]" />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {terminals.slice(0, 3).map((term) => (
                <div 
                  key={term.id}
                  onClick={() => onNavigate('terminales')}
                  className="bg-[#240E4B] rounded-3xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer border border-[#35007f]/60 hover:border-[#CCFF00]/40 shadow-md group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#180736] flex items-center justify-center border border-[#35007f] group-hover:border-[#CCFF00]/30 transition-colors">
                      <Fingerprint className="w-5 h-5 text-[#CCFF00]" />
                    </div>
                    <span className="px-2.5 py-1 bg-[#00E676]/20 text-[#00E676] rounded-lg font-mono text-xs font-bold border border-[#00E676]/30">
                      {term.status}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-white group-hover:text-[#CCFF00] transition-colors">{term.name}</p>
                    <p className="font-mono text-xs text-[#c4c9ac] mt-1">IP: {term.ip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Alertas, Servicios y Acciones Rápidas */}
        <div className="flex flex-col gap-6">
          {/* Alertas del Sistema */}
          <div className="bg-[#180736] rounded-[2.5rem] p-6 flex flex-col relative overflow-hidden border border-[#35007f]/50 shadow-xl">
            <div className="flex justify-between items-center mb-5 relative z-10">
              <h3 className="font-headline text-lg sm:text-xl text-white flex items-center gap-2 tracking-wide uppercase">
                <Megaphone className="w-5 h-5 text-[#FFB4AB]" />
                Alertas del Sistema
              </h3>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                alerts.length > 0 
                  ? 'bg-[#FFB4AB] text-[#690005]' 
                  : 'bg-[#CCFF00] text-[#0D0221]'
              }`}>
                {alerts.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 relative z-10">
              {alerts.length === 0 ? (
                <div className="p-5 rounded-2xl bg-[#240E4B]/50 border border-[#35007f] text-center flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-[#00E676]" />
                  <p className="text-sm font-semibold text-white">Sistemas al 100%</p>
                  <p className="text-xs text-[#c4c9ac] leading-relaxed">
                    No hay incidencias. API NestJS, base PostgreSQL y terminales ZKTeco sincronizados con normalidad.
                  </p>
                </div>
              ) : (
                alerts.map((alt) => (
                  <div key={alt.id} className="bg-[#240E4B] p-4 rounded-2xl flex gap-3.5 items-start border-l-4 border-[#FFB4AB]">
                    <div className="w-9 h-9 rounded-xl bg-[#FFB4AB]/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <CreditCard className="w-4 h-4 text-[#FFB4AB]" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-body text-xs font-bold text-white">{alt.title}</p>
                      <p className="font-body text-[11px] text-[#c4c9ac] leading-snug">{alt.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Módulos de Inteligencia y Edge (Sin acceso redundante a Google Calendar) */}
          <div className="bg-[#180736] rounded-[2.5rem] p-6 border border-[#35007f]/50 shadow-xl space-y-3">
            <h3 className="font-headline text-base text-white tracking-wide uppercase mb-3">
              Herramientas Conectadas
            </h3>

            {/* Agente Gemini AI */}
            <div 
              onClick={() => onNavigate('gemini')}
              className="p-4 rounded-2xl bg-[#240E4B] hover:bg-[#35007f] border border-[#35007f] cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#180736] group-hover:bg-[#CCFF00] text-[#CCFF00] group-hover:text-[#0D0221] flex items-center justify-center transition-colors border border-[#35007f]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Agente Gemini AI</p>
                  <p className="text-[10px] text-[#c4c9ac]">Organizador inteligente y análisis de sede</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#CCFF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            {/* Monitor Edge ZKTeco LAN */}
            <div 
              onClick={() => onNavigate('terminales')}
              className="p-4 rounded-2xl bg-[#240E4B] hover:bg-[#35007f] border border-[#35007f] cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#180736] group-hover:bg-[#00E5FF] text-[#00E5FF] group-hover:text-[#0D0221] flex items-center justify-center transition-colors border border-[#35007f]">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Edge Connector LAN</p>
                  <p className="text-[10px] text-[#c4c9ac]">6 terminales biométricas sincronizadas</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#00E5FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Quick Actions (Acciones Rápidas) */}
          <div className="bg-[#CCFF00] rounded-[2.5rem] p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(204,255,0,0.25)]">
            <div className="relative z-10">
              <h3 className="font-headline text-lg text-[#0D0221] font-bold mb-4 uppercase tracking-wide">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onOpenNewMember}
                  className="bg-[#0D0221]/15 hover:bg-[#0D0221]/25 text-[#0D0221] p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all h-28 hover:scale-[1.02] active:scale-95 font-semibold"
                >
                  <UserPlus className="w-6 h-6 stroke-[2.2]" />
                  <span className="font-body text-xs font-bold">Nuevo Socio</span>
                </button>
                <button 
                  onClick={onOpenReceipt}
                  className="bg-[#0D0221]/15 hover:bg-[#0D0221]/25 text-[#0D0221] p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all h-28 hover:scale-[1.02] active:scale-95 font-semibold"
                >
                  <Receipt className="w-6 h-6 stroke-[2.2]" />
                  <span className="font-body text-xs font-bold">Facturar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
