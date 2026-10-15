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
  AlertTriangle, 
  ArrowUpRight,
  Receipt,
  RotateCcw,
  Fingerprint,
  Server,
  CreditCard,
  Package,
  Calendar,
  Sparkles
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

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewMember,
  onOpenReceipt,
  alerts,
  members = [],
  plans = [],
  terminals = [],
}) => {
  const [chartPeriod, setChartPeriod] = useState<'Mensual' | 'Trimestral'>('Mensual');
  const [edgeRestarting, setEdgeRestarting] = useState(false);
  const [edgeStatus, setEdgeStatus] = useState<'offline' | 'online'>('online');

  // Compute dynamic metrics
  const activeMembers = members.filter(m => m.status === 'Activo');
  const activeCount = activeMembers.length;
  const suspendedCount = members.filter(m => m.status === 'Suspendido').length;

  // Real MRR calculated from active members' plans
  const computedMRR = activeMembers.reduce((sum, member) => {
    const matchingPlan = plans.find(
      p => p.name.toLowerCase() === member.plan.toLowerCase() || p.id === member.plan
    );
    return sum + (matchingPlan ? matchingPlan.price : 899);
  }, 0);

  const churnRate = members.length > 0
    ? ((suspendedCount / members.length) * 100).toFixed(1)
    : '0.0';

  const occupancyRate = members.length > 0
    ? Math.min(100, Math.round((activeCount / 450) * 100))
    : 0;

  const handleRestartEdge = () => {
    setEdgeRestarting(true);
    setTimeout(() => {
      setEdgeRestarting(false);
      setEdgeStatus('online');
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full gap-8 animate-in fade-in duration-300">
      {/* Header / KPIs Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {/* KPI 1: MRR */}
        <div className="bg-[#290065] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/40 hover:border-[#c3f400]/40 transition-colors shadow-lg">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#c3f400]/10 rounded-full blur-2xl group-hover:bg-[#c3f400]/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-[#35007f] rounded-full w-12 h-12 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#c3f400]" />
            </div>
            <span className="inline-flex items-center gap-1 bg-[#35007f] px-3 py-1 rounded-full font-body text-xs font-bold text-[#c3f400]">
              <TrendingUp className="w-3.5 h-3.5" />
              {members.length > 0 ? '+12.5%' : '0%'}
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">MRR (Mensual Activo)</p>
            <h2 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
              ${computedMRR.toLocaleString('es-MX')} MXN
            </h2>
          </div>
        </div>

        {/* KPI 2: Churn Rate */}
        <div className="bg-[#290065] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/40 hover:border-[#ffb4ab]/40 transition-colors shadow-lg">
          <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-[#ffb4ab]/10 rounded-full blur-2xl group-hover:bg-[#ffb4ab]/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-[#35007f] rounded-full w-12 h-12 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-[#ffb4ab]" />
            </div>
            <span className="inline-flex items-center gap-1 bg-[#35007f] px-3 py-1 rounded-full font-body text-xs font-bold text-[#ffb4ab]">
              <TrendingUp className="w-3.5 h-3.5" />
              {churnRate}%
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">Tasa de Suspensión</p>
            <h2 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">{churnRate}%</h2>
          </div>
        </div>

        {/* KPI 3: Nuevas Altas */}
        <div className="bg-[#290065] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/40 hover:border-[#c3f400]/40 transition-colors shadow-lg">
          <div className="absolute -left-12 -top-12 w-32 h-32 bg-[#c3f400]/10 rounded-full blur-2xl group-hover:bg-[#c3f400]/20 transition-all duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-[#35007f] rounded-full w-12 h-12 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-[#c3f400]" />
            </div>
            <span className="inline-flex items-center gap-1 bg-[#35007f] px-3 py-1 rounded-full font-body text-xs font-bold text-[#c3f400]">
              <TrendingUp className="w-3.5 h-3.5" />
              {activeCount}
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">Socios Registrados</p>
            <h2 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">{members.length}</h2>
          </div>
        </div>

        {/* KPI 4: Ocupación */}
        <div className="bg-[#290065] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/40 hover:border-[#c3f400]/40 transition-colors shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c3f400]/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-[#c3f400] rounded-full w-12 h-12 flex items-center justify-center shadow-[0_0_20px_rgba(195,244,0,0.35)]">
              <Flame className="w-6 h-6 text-[#161e00]" />
            </div>
            <span className="inline-flex items-center gap-1 bg-[#42009b] px-3 py-1 rounded-full font-body text-xs text-white font-medium">
              Aforo
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold mb-1">Ocupación</p>
            <div className="flex items-baseline gap-2">
              <h2 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">{occupancyRate}%</h2>
              <span className="font-body text-sm text-[#c4c9ac]">/ cap. 450</span>
            </div>
            <div className="w-full bg-[#42009b] h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-[#c3f400] h-full rounded-full shadow-[0_0_8px_#c3f400] transition-all duration-500" 
                style={{ width: `${occupancyRate}%` }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart & Terminals */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Chart Area */}
          <div className="bg-[#290065] rounded-[2.5rem] p-6 sm:p-8 flex flex-col min-h-[400px] border border-[#35007f]/50 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-headline text-2xl text-white tracking-tight">Flujo Financiero</h3>
                <p className="font-body text-sm text-[#c4c9ac] mt-0.5">Ingresos Recurrentes vs Gastos Operativos</p>
              </div>
              <div className="flex items-center gap-2 bg-[#35007f] rounded-full p-1 self-start sm:self-auto">
                <button 
                  onClick={() => setChartPeriod('Mensual')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    chartPeriod === 'Mensual' 
                      ? 'bg-[#1a0046] text-white shadow-sm' 
                      : 'text-[#c4c9ac] hover:text-white'
                  }`}
                >
                  Mensual
                </button>
                <button 
                  onClick={() => setChartPeriod('Trimestral')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    chartPeriod === 'Trimestral' 
                      ? 'bg-[#1a0046] text-white shadow-sm' 
                      : 'text-[#c4c9ac] hover:text-white'
                  }`}
                >
                  Trimestral
                </button>
              </div>
            </div>

            {/* SVG Chart Area */}
            <div className="flex-1 relative w-full min-h-[240px] flex items-end pt-4 pb-8">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                {/* Grid Lines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#444933" strokeOpacity="0.4" strokeDasharray="1 1" strokeWidth="0.2" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#444933" strokeOpacity="0.4" strokeDasharray="1 1" strokeWidth="0.2" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="#444933" strokeOpacity="0.4" strokeDasharray="1 1" strokeWidth="0.2" />

                {/* Income Line */}
                <path 
                  d="M0,45 Q15,38 30,28 T60,20 T85,12 T100,8" 
                  fill="none" 
                  stroke="#c3f400" 
                  strokeWidth="2"
                  className="drop-shadow-[0_4px_10px_rgba(195,244,0,0.5)]" 
                />

                {/* Expenses Line */}
                <path 
                  d="M0,48 Q20,44 40,40 T70,35 T90,32 T100,30" 
                  fill="none" 
                  stroke="#ffb4ab" 
                  strokeOpacity="0.6"
                  strokeWidth="1.2" 
                />

                <circle cx="30" cy="28" r="1.8" fill="#1a0046" stroke="#c3f400" strokeWidth="0.8" />
                <circle cx="60" cy="20" r="1.8" fill="#1a0046" stroke="#c3f400" strokeWidth="0.8" />
                <circle cx="100" cy="8" r="1.8" fill="#1a0046" stroke="#c3f400" strokeWidth="0.8" />
              </svg>

              <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2 font-body text-xs text-[#c4c9ac]">
                <span>Ene</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          {/* Terminals Widget */}
          <div className="bg-[#290065] rounded-[2.5rem] p-6 sm:p-8 border border-[#35007f]/50 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-xl text-white flex items-center gap-3">
                <Router className="w-5 h-5 text-[#c3f400]" />
                Terminales Edge ZKTeco
              </h3>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c3f400] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c3f400]" />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {terminals.slice(0, 3).map((term) => (
                <div 
                  key={term.id}
                  onClick={() => onNavigate('terminales')}
                  className="bg-[#35007f] rounded-3xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer border border-[#42009b]/50 shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#c3f400]/10 flex items-center justify-center">
                      <Fingerprint className="w-5 h-5 text-[#c3f400]" />
                    </div>
                    <span className="px-2.5 py-1 bg-[#c3f400]/20 text-[#c3f400] rounded-lg font-body text-xs font-bold">
                      {term.status}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-white">{term.name}</p>
                    <p className="font-mono text-xs text-[#c4c9ac] mt-1">IP: {term.ip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Quick Shortcuts */}
        <div className="flex flex-col gap-6">
          {/* Critical Alerts Dynamic Box */}
          <div className="bg-[#290065] rounded-[2.5rem] p-6 flex flex-col relative overflow-hidden border border-[#35007f]/50 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffb4ab]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="flex justify-between items-center mb-5 relative z-10">
              <h3 className="font-headline text-xl text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#ffb4ab]" />
                Alertas del Sistema
              </h3>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                alerts.length > 0 
                  ? 'bg-[#ffb4ab] text-[#690005]' 
                  : 'bg-[#c3f400] text-[#161e00]'
              }`}>
                {alerts.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 relative z-10">
              {alerts.length === 0 ? (
                <div className="p-5 rounded-2xl bg-[#35007f]/50 border border-[#42009b] text-center flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-[#c3f400]" />
                  <p className="text-sm font-semibold text-white">Sistemas al 100%</p>
                  <p className="text-xs text-[#c4c9ac] leading-relaxed">
                    No hay alertas pendientes. Terminales ZKTeco y pagos sincronizados con normalidad.
                  </p>
                </div>
              ) : (
                alerts.map((alt) => (
                  <div key={alt.id} className="bg-[#42009b] p-4 rounded-2xl flex gap-3.5 items-start border-l-4 border-[#ffb4ab]">
                    <div className="w-9 h-9 rounded-full bg-[#ffb4ab]/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <CreditCard className="w-4 h-4 text-[#ffb4ab]" />
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

          {/* Google Workspace & Gemini Quick Action Modules */}
          <div className="bg-[#290065] rounded-[2.5rem] p-6 border border-[#35007f]/50 shadow-xl space-y-3">
            <h3 className="font-headline text-lg text-white mb-2">Herramientas Conectadas</h3>

            {/* Google Calendar banner */}
            <div 
              onClick={() => onNavigate('calendar')}
              className="p-4 rounded-2xl bg-[#140039] hover:bg-[#35007f] border border-[#35007f] cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#35007f] group-hover:bg-[#c3f400] text-[#c3f400] group-hover:text-[#161e00] flex items-center justify-center transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Google Calendar</p>
                  <p className="text-[10px] text-[#c4c9ac]">Sincronizar agenda y clases</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#c3f400] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            {/* Gemini AI banner */}
            <div 
              onClick={() => onNavigate('gemini')}
              className="p-4 rounded-2xl bg-[#140039] hover:bg-[#35007f] border border-[#35007f] cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#35007f] group-hover:bg-[#c3f400] text-[#c3f400] group-hover:text-[#161e00] flex items-center justify-center transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Agente Gemini AI</p>
                  <p className="text-[10px] text-[#c4c9ac]">Organizador ejecutivo del club</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#c3f400] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Quick Actions (Nuevo Socio / Facturar) */}
          <div className="bg-[#c3f400] rounded-[2.5rem] p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(195,244,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-headline text-xl text-[#161e00] font-bold mb-4">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onOpenNewMember}
                  className="bg-black/10 hover:bg-black/20 text-[#161e00] p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all h-28 hover:scale-[1.02] active:scale-95"
                >
                  <UserPlus className="w-6 h-6" />
                  <span className="font-body text-xs font-bold">Nuevo Socio</span>
                </button>
                <button 
                  onClick={onOpenReceipt}
                  className="bg-black/10 hover:bg-black/20 text-[#161e00] p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all h-28 hover:scale-[1.02] active:scale-95"
                >
                  <Receipt className="w-6 h-6" />
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
