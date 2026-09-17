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
  Package
} from 'lucide-react';
import { SystemAlert, NavigationTab } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenNewMember: () => void;
  onOpenReceipt: () => void;
  alerts: SystemAlert[];
  onDismissAlert?: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewMember,
  onOpenReceipt,
  alerts,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'Mensual' | 'Trimestral'>('Mensual');
  const [edgeRestarting, setEdgeRestarting] = useState(false);
  const [edgeStatus, setEdgeStatus] = useState<'offline' | 'online'>('offline');

  const handleRestartEdge = () => {
    setEdgeRestarting(true);
    setTimeout(() => {
      setEdgeRestarting(false);
      setEdgeStatus('online');
    }, 1800);
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
              12.5%
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">MRR (Mensual)</p>
            <h2 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">$45,230 MXN</h2>
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
              1.2%
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">Tasa de Cancelación</p>
            <h2 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">3.8%</h2>
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
              8.4%
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">Nuevas Altas</p>
            <h2 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">142</h2>
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
              Actual
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold mb-1">Ocupación</p>
            <div className="flex items-baseline gap-2">
              <h2 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">78%</h2>
              <span className="font-body text-sm text-[#c4c9ac]">/ cap. 450</span>
            </div>
            <div className="w-full bg-[#42009b] h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#c3f400] h-full rounded-full shadow-[0_0_8px_#c3f400]" style={{ width: '78%' }} />
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
                <p className="font-body text-sm text-[#c4c9ac] mt-0.5">Ingresos vs Gastos (Q3)</p>
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

                {/* Income Line (Primary Neon Lime) */}
                <path 
                  d="M0,40 Q10,35 20,20 T40,15 T60,25 T80,5 T100,10" 
                  fill="none" 
                  stroke="#c3f400" 
                  strokeWidth="1.8"
                  className="drop-shadow-[0_4px_10px_rgba(195,244,0,0.5)]" 
                />

                {/* Expenses Line (Neutral/Error Red) */}
                <path 
                  d="M0,45 Q15,40 30,35 T50,38 T70,30 T90,32 T100,28" 
                  fill="none" 
                  stroke="#ffb4ab" 
                  strokeOpacity="0.6"
                  strokeWidth="1.2" 
                />

                {/* Data Points on Income Line */}
                <circle cx="20" cy="20" r="1.8" fill="#1a0046" stroke="#c3f400" strokeWidth="0.8" />
                <circle cx="40" cy="15" r="1.8" fill="#1a0046" stroke="#c3f400" strokeWidth="0.8" />
                <circle cx="80" cy="5" r="1.8" fill="#1a0046" stroke="#c3f400" strokeWidth="0.8" />
              </svg>

              {/* Month Labels */}
              <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2 font-body text-xs text-[#c4c9ac]">
                <span>Jul</span>
                <span>Ago</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dic</span>
              </div>
            </div>
          </div>

          {/* Terminals Widget */}
          <div className="bg-[#290065] rounded-[2.5rem] p-6 sm:p-8 border border-[#35007f]/50 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-xl text-white flex items-center gap-3">
                <Router className="w-5 h-5 text-[#c3f400]" />
                Terminales ZKTeco
              </h3>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c3f400] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c3f400]" />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Terminal 1 */}
              <div 
                onClick={() => onNavigate('terminales')}
                className="bg-[#35007f] rounded-3xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer border border-[#42009b]/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#c3f400]/10 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-[#c3f400]" />
                  </div>
                  <span className="px-2.5 py-1 bg-[#c3f400]/20 text-[#c3f400] rounded-lg font-body text-xs font-bold">
                    En línea
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-white">Torno Principal A</p>
                  <p className="font-mono text-xs text-[#c4c9ac] mt-1">IP: 192.168.1.101</p>
                </div>
              </div>

              {/* Terminal 2 */}
              <div 
                onClick={() => onNavigate('terminales')}
                className="bg-[#35007f] rounded-3xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer border border-[#42009b]/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#c3f400]/10 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-[#c3f400]" />
                  </div>
                  <span className="px-2.5 py-1 bg-[#c3f400]/20 text-[#c3f400] rounded-lg font-body text-xs font-bold">
                    En línea
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-white">Torno Principal B</p>
                  <p className="font-mono text-xs text-[#c4c9ac] mt-1">IP: 192.168.1.102</p>
                </div>
              </div>

              {/* Terminal 3 (VIP) */}
              <div 
                onClick={() => onNavigate('terminales')}
                className={`rounded-3xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer border relative overflow-hidden ${
                  edgeStatus === 'online'
                    ? 'bg-[#35007f] border-[#42009b]/50'
                    : 'bg-[#35007f] border-[#ffb4ab]/40'
                }`}
              >
                {edgeStatus !== 'online' && (
                  <div className="absolute inset-0 bg-[#ffb4ab]/5 pointer-events-none" />
                )}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    edgeStatus === 'online' ? 'bg-[#c3f400]/10' : 'bg-[#ffb4ab]/10'
                  }`}>
                    {edgeStatus === 'online' ? (
                      <Fingerprint className="w-5 h-5 text-[#c3f400]" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg font-body text-xs font-bold ${
                    edgeStatus === 'online'
                      ? 'bg-[#c3f400]/20 text-[#c3f400]'
                      : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                  }`}>
                    {edgeStatus === 'online' ? 'En línea' : 'Fuera de línea'}
                  </span>
                </div>
                <div className="relative z-10">
                  <p className="font-body text-sm font-semibold text-white">Acceso VIP</p>
                  <p className={`font-body text-xs mt-1 ${
                    edgeStatus === 'online' ? 'text-[#c3f400]' : 'text-[#ffb4ab]'
                  }`}>
                    {edgeStatus === 'online' ? 'IP: 192.168.1.103 [OK]' : 'Fallo de conexión'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Activity */}
        <div className="flex flex-col gap-6">
          {/* Critical Alerts */}
          <div className="bg-[#290065] rounded-[2.5rem] p-6 flex-1 flex flex-col relative overflow-hidden border border-[#35007f]/50 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffb4ab]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-headline text-xl text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#ffb4ab]" />
                Alertas Críticas
              </h3>
              <span className="bg-[#ffb4ab] text-[#690005] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(255,180,171,0.4)]">
                3
              </span>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              {/* Alert 1 */}
              <div className="bg-[#42009b] p-4 rounded-2xl flex gap-4 items-start border-l-4 border-[#ffb4ab]">
                <div className="w-10 h-10 rounded-full bg-[#ffb4ab]/10 flex-shrink-0 flex items-center justify-center mt-1">
                  <CreditCard className="w-5 h-5 text-[#ffb4ab]" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-body text-sm font-semibold text-white">Pago Vencido: Socio VIP</p>
                  <p className="font-body text-xs text-[#c4c9ac] leading-snug">
                    Carlos Mendoza (ID: 8492) intentó acceder. Pago pendiente por $120 MXN.
                  </p>
                  <button 
                    onClick={onOpenReceipt}
                    className="mt-2 text-[#c3f400] font-body text-xs font-bold hover:underline uppercase tracking-wider text-left"
                  >
                    Resolver Ahora →
                  </button>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="bg-[#42009b] p-4 rounded-2xl flex gap-4 items-start border-l-4 border-[#ffb4ab]">
                <div className="w-10 h-10 rounded-full bg-[#ffb4ab]/10 flex-shrink-0 flex items-center justify-center mt-1">
                  <Server className="w-5 h-5 text-[#ffb4ab]" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-body text-sm font-semibold text-white">Conector Edge Caído</p>
                  <p className="font-body text-xs text-[#c4c9ac] leading-snug">
                    Sincronización con nube interrumpida hace 14 minutos.
                  </p>
                  <button 
                    onClick={handleRestartEdge}
                    disabled={edgeRestarting || edgeStatus === 'online'}
                    className="mt-2 text-[#c3f400] font-body text-xs font-bold hover:underline uppercase tracking-wider text-left flex items-center gap-1.5"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${edgeRestarting ? 'animate-spin' : ''}`} />
                    <span>
                      {edgeRestarting 
                        ? 'Reiniciando...' 
                        : edgeStatus === 'online' 
                          ? 'Servicio Restaurado ✓' 
                          : 'Reiniciar Servicio'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="bg-[#42009b] p-4 rounded-2xl flex gap-4 items-start border-l-4 border-[#8e9379]">
                <div className="w-10 h-10 rounded-full bg-[#35007f] flex-shrink-0 flex items-center justify-center mt-1">
                  <Package className="w-5 h-5 text-[#c4c9ac]" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-white">Inventario Bajo: Proteína Suero</p>
                  <p className="font-body text-xs text-[#c4c9ac] leading-snug mt-0.5">
                    Inventario de cafetería al 10%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions matching screen.png */}
          <div className="bg-[#c3f400] rounded-[2.5rem] p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(195,244,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-headline text-xl text-[#161e00] font-bold mb-4">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onOpenNewMember}
                  className="bg-black/10 hover:bg-black/20 text-[#161e00] p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all h-32 hover:scale-[1.02] active:scale-95"
                >
                  <UserPlus className="w-6 h-6" />
                  <span className="font-body text-xs font-bold">Nuevo Socio</span>
                </button>
                <button 
                  onClick={onOpenReceipt}
                  className="bg-black/10 hover:bg-black/20 text-[#161e00] p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all h-32 hover:scale-[1.02] active:scale-95"
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
