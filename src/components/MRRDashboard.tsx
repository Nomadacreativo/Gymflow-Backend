import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  Layers, 
  Zap, 
  BarChart3, 
  CheckCircle2, 
  ShieldCheck,
  Percent,
  Sparkles
} from 'lucide-react';

export interface MRRMonthData {
  mes: string;
  mesCompleto: string;
  mrr: number;
  nuevasAltas: number;
  renovaciones: number;
  churn: number;
  crecimientoPct: number;
  sociosActivos: number;
  arpu: number;
}

// Datos de la evolución del MRR para los últimos 6 meses (Mayo - Octubre)
export const DEFAULT_MRR_HISTORY: MRRMonthData[] = [
  {
    mes: 'May',
    mesCompleto: 'Mayo 2024',
    mrr: 182000,
    nuevasAltas: 28000,
    renovaciones: 154000,
    churn: 5200,
    crecimientoPct: 0.0,
    sociosActivos: 364,
    arpu: 500
  },
  {
    mes: 'Jun',
    mesCompleto: 'Junio 2024',
    mrr: 196500,
    nuevasAltas: 31500,
    renovaciones: 165000,
    churn: 4800,
    crecimientoPct: 7.97,
    sociosActivos: 393,
    arpu: 500
  },
  {
    mes: 'Jul',
    mesCompleto: 'Julio 2024',
    mrr: 208000,
    nuevasAltas: 33000,
    renovaciones: 175000,
    churn: 4500,
    crecimientoPct: 5.85,
    sociosActivos: 416,
    arpu: 500
  },
  {
    mes: 'Ago',
    mesCompleto: 'Agosto 2024',
    mrr: 221400,
    nuevasAltas: 36400,
    renovaciones: 185000,
    churn: 4100,
    crecimientoPct: 6.44,
    sociosActivos: 442,
    arpu: 501
  },
  {
    mes: 'Sep',
    mesCompleto: 'Septiembre 2024',
    mrr: 234000,
    nuevasAltas: 38000,
    renovaciones: 196000,
    churn: 3900,
    crecimientoPct: 5.69,
    sociosActivos: 468,
    arpu: 500
  },
  {
    mes: 'Oct',
    mesCompleto: 'Octubre 2024',
    mrr: 242500,
    nuevasAltas: 39500,
    renovaciones: 203000,
    churn: 3600,
    crecimientoPct: 3.63,
    sociosActivos: 485,
    arpu: 500
  }
];

interface MRRDashboardProps {
  data?: MRRMonthData[];
  className?: string;
}

export const MRRDashboard: React.FC<MRRDashboardProps> = ({ 
  data = DEFAULT_MRR_HISTORY,
  className = ''
}) => {
  const [viewType, setViewType] = useState<'area' | 'barras'>('area');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(data.length - 1);

  // Cálculos de crecimiento
  const primerMes = data[0];
  const ultimoMes = data[data.length - 1];
  const penultimoMes = data[data.length - 2] || primerMes;

  // Crecimiento MoM del último mes
  const ultimoCrecimientoMoM = ultimoMes.crecimientoPct;
  const incrementoAbsolutoMoM = ultimoMes.mrr - penultimoMes.mrr;

  // Crecimiento acumulado en los 6 meses
  const crecimientoTotal6Meses = (((ultimoMes.mrr - primerMes.mrr) / primerMes.mrr) * 100).toFixed(1);
  const incrementoTotalAbsoluto = ultimoMes.mrr - primerMes.mrr;

  // Promedio de crecimiento mensual
  const tasaPromedioMensual = (
    data.slice(1).reduce((acc, curr) => acc + curr.crecimientoPct, 0) / (data.length - 1)
  ).toFixed(2);

  // Mes seleccionado para detalle
  const activeDetail = data[selectedMonthIndex] || ultimoMes;

  // Formateador de moneda MXN
  const formatMXN = (val: number) => {
    return `$${val.toLocaleString('es-MX')} MXN`;
  };

  const formatShortMXN = (val: number) => {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}k`;
    }
    return `$${val}`;
  };

  // Tooltip personalizado para Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentPoint = data.find(d => d.mes === label) || payload[0].payload;
      return (
        <div className="bg-[#180736] border border-[#35007f] rounded-2xl p-4 shadow-2xl backdrop-blur-md min-w-[220px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#35007f]/70">
            <span className="font-headline text-xs text-white uppercase tracking-wider">
              {currentPoint.mesCompleto}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00E676]/20 text-[#00E676] font-bold border border-[#00E676]/30">
              +{currentPoint.crecimientoPct}% MoM
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#c4c9ac] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
                MRR Total:
              </span>
              <strong className="text-white">{formatMXN(currentPoint.mrr)}</strong>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#c4c9ac] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                Renovaciones:
              </span>
              <span className="text-[#eaddff]">{formatMXN(currentPoint.renovaciones)}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#c4c9ac] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
                Nuevas Altas:
              </span>
              <span className="text-[#eaddff]">{formatMXN(currentPoint.nuevasAltas)}</span>
            </div>

            <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#35007f]/50">
              <span className="text-[#c4c9ac]">Socios Activos:</span>
              <span className="text-[#CCFF00] font-bold">{currentPoint.sociosActivos} socios</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex flex-col w-full gap-6 animate-in fade-in duration-300 ${className}`}>
      {/* Sección Superior: Título de Sección y Controles de Vista */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#180736] p-5 rounded-3xl border border-[#35007f]/60 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#240E4B] flex items-center justify-center border border-[#35007f] shadow-inner">
            <TrendingUp className="w-6 h-6 text-[#CCFF00]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
              <h2 className="font-headline text-lg sm:text-xl text-white tracking-wide uppercase">
                Evolución de Ingresos Recurrentes (MRR)
              </h2>
            </div>
            <p className="font-body text-xs text-[#c4c9ac] mt-0.5">
              Histórico de los últimos 6 meses con telemetría de retención y crecimiento MoM
            </p>
          </div>
        </div>

        {/* Selector de Tipo de Gráfica */}
        <div className="flex items-center gap-2 bg-[#240E4B] p-1.5 rounded-full border border-[#35007f] self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            onClick={() => setViewType('area')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewType === 'area'
                ? 'bg-[#CCFF00] text-[#0D0221] shadow-[0_0_15px_rgba(204,255,0,0.35)]'
                : 'text-[#eaddff] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tendencia Neón</span>
          </button>
          <button
            onClick={() => setViewType('barras')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewType === 'barras'
                ? 'bg-[#CCFF00] text-[#0D0221] shadow-[0_0_15px_rgba(204,255,0,0.35)]'
                : 'text-[#eaddff] hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Composición</span>
          </button>
        </div>
      </div>

      {/* Grid: Tarjetas de Resumen y KPIs de Crecimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Tarjeta Resumen Principal: Crecimiento Porcentual Mes a Mes (MoM) */}
        <div className="bg-[#180736] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/60 hover:border-[#CCFF00]/50 transition-colors shadow-xl md:col-span-1 flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#CCFF00]/10 rounded-full blur-2xl group-hover:bg-[#CCFF00]/20 transition-all duration-500" />
          
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
                Crecimiento Mes a Mes (MoM)
              </span>
              <span className="inline-flex items-center gap-1 bg-[#00E676]/15 border border-[#00E676]/40 px-2.5 py-1 rounded-full font-mono text-xs font-bold text-[#00E676]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{ultimoCrecimientoMoM}%
              </span>
            </div>

            <h3 className="font-headline text-2xl sm:text-3xl text-white tracking-tight font-bold">
              +{ultimoCrecimientoMoM}%
            </h3>
            <p className="font-body text-xs text-[#c4c9ac] mt-1">
              Incremento en Octubre respecto a Septiembre (
              <strong className="text-[#CCFF00] font-mono">+{formatMXN(incrementoAbsolutoMoM)}</strong>)
            </p>
          </div>

          {/* Desglose MoM de los 6 meses */}
          <div className="mt-5 pt-4 border-t border-[#35007f]/70 space-y-2">
            <span className="text-[11px] font-semibold text-[#eaddff] block">
              Variación porcentual mensual:
            </span>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {data.slice(1).map((m, idx) => (
                <div 
                  key={m.mes}
                  onClick={() => setSelectedMonthIndex(idx + 1)}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedMonthIndex === idx + 1
                      ? 'bg-[#240E4B] border-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.2)]'
                      : 'bg-[#240E4B]/40 border-[#35007f] hover:border-[#c4c9ac]/40'
                  }`}
                >
                  <span className="text-[10px] text-[#c4c9ac] block font-mono">{m.mes}</span>
                  <span className="text-[11px] font-mono font-bold text-[#00E676] block mt-0.5">
                    +{m.crecimientoPct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tarjeta 2: MRR Cierre Actual vs Base Inicial */}
        <div className="bg-[#180736] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/60 hover:border-[#00E5FF]/50 transition-colors shadow-xl md:col-span-1 flex flex-col justify-between">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-2xl group-hover:bg-[#00E5FF]/20 transition-all duration-500" />
          
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
                MRR Actual (Cierre 6M)
              </span>
              <span className="inline-flex items-center gap-1 bg-[#240E4B] border border-[#35007f] px-2.5 py-1 rounded-full font-mono text-xs font-bold text-[#00E5FF]">
                {ultimoMes.mesCompleto}
              </span>
            </div>

            <h3 className="font-mono text-2xl sm:text-3xl text-white tracking-tight font-bold">
              ${ultimoMes.mrr.toLocaleString('es-MX')}{' '}
              <span className="text-sm font-normal text-[#c4c9ac]">MXN</span>
            </h3>

            <p className="font-body text-xs text-[#c4c9ac] mt-1">
              Partiendo de <span className="font-mono text-white">${primerMes.mrr.toLocaleString('es-MX')} MXN</span> en Mayo
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-[#35007f]/70 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#c4c9ac] block">Expansión acumulada</span>
              <strong className="text-[#CCFF00] text-sm">+{crecimientoTotal6Meses}% total</strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#c4c9ac] block">Ganancia neta</span>
              <strong className="text-white text-sm">+{formatMXN(incrementoTotalAbsoluto)}</strong>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Métricas de Soporte / Rendimiento */}
        <div className="bg-[#180736] rounded-3xl p-6 relative overflow-hidden group border border-[#35007f]/60 hover:border-[#CCFF00]/50 transition-colors shadow-xl md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="font-body text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
                Rendimiento y Socios
              </span>
              <span className="inline-flex items-center gap-1 bg-[#240E4B] border border-[#35007f] px-2.5 py-1 rounded-full font-mono text-xs font-bold text-[#CCFF00]">
                {ultimoMes.sociosActivos} Socios
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="p-3 rounded-2xl bg-[#240E4B]/60 border border-[#35007f]">
                <span className="text-[10px] text-[#c4c9ac] block uppercase tracking-wider">
                  Promedio MoM
                </span>
                <span className="font-mono text-lg font-bold text-white block mt-0.5">
                  +{tasaPromedioMensual}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#240E4B]/60 border border-[#35007f]">
                <span className="text-[10px] text-[#c4c9ac] block uppercase tracking-wider">
                  ARPU Promedio
                </span>
                <span className="font-mono text-lg font-bold text-[#CCFF00] block mt-0.5">
                  $500 MXN
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#35007f]/70 flex items-center justify-between text-xs text-[#c4c9ac]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
              <span>Retención Neta: <strong className="text-white font-mono">98.5%</strong></span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#240E4B] text-[#00E5FF] font-mono">
              PostgreSQL
            </span>
          </div>
        </div>
      </div>

      {/* Gráfica Recharts Principal: Evolución a 6 Meses */}
      <div className="bg-[#180736] rounded-[2.5rem] p-6 sm:p-8 border border-[#35007f]/60 shadow-xl relative overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-headline text-xl sm:text-2xl text-white tracking-wide uppercase">
              Curva de Crecimiento del MRR
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#c4c9ac] mt-0.5">
              Visualización continua de ingresos recurrentes mensuales con picos de renovación
            </p>
          </div>

          {/* Leyenda interactiva */}
          <div className="flex items-center gap-4 text-xs font-mono flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]" />
              <span className="text-white">MRR Total</span>
            </div>
            {viewType === 'barras' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#00E5FF]" />
                  <span className="text-[#c4c9ac]">Renovaciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#35007f]" />
                  <span className="text-[#c4c9ac]">Nuevas Altas</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contenedor del Gráfico de Recharts */}
        <div className="w-full h-80 sm:h-96 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'area' ? (
              <AreaChart data={data} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  {/* Gradiente Neón Verde Volt */}
                  <linearGradient id="colorMrrVolt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#CCFF00" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Gradiente Cyan para Renovaciones */}
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#35007f" 
                  opacity={0.5} 
                  vertical={false} 
                />

                <XAxis 
                  dataKey="mes" 
                  stroke="#8e9379" 
                  tick={{ fill: '#c4c9ac', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                  tickLine={{ stroke: '#35007f' }}
                  axisLine={{ stroke: '#35007f' }}
                />

                <YAxis 
                  stroke="#8e9379" 
                  tick={{ fill: '#c4c9ac', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  tickLine={{ stroke: '#35007f' }}
                  axisLine={{ stroke: '#35007f' }}
                  tickFormatter={formatShortMXN}
                  domain={['dataMin - 20000', 'dataMax + 15000']}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Área de Renovaciones base */}
                <Area 
                  type="monotone" 
                  dataKey="renovaciones" 
                  name="Renovaciones"
                  stroke="#00E5FF" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#colorCyan)" 
                />

                {/* Área de MRR Total */}
                <Area 
                  type="monotone" 
                  dataKey="mrr" 
                  name="MRR Total"
                  stroke="#CCFF00" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMrrVolt)" 
                  activeDot={{ 
                    r: 6, 
                    fill: '#CCFF00', 
                    stroke: '#0D0221', 
                    strokeWidth: 2, 
                    className: 'filter drop-shadow-[0_0_8px_#CCFF00]' 
                  }}
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#35007f" 
                  opacity={0.5} 
                  vertical={false} 
                />

                <XAxis 
                  dataKey="mes" 
                  stroke="#8e9379" 
                  tick={{ fill: '#c4c9ac', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                  tickLine={{ stroke: '#35007f' }}
                  axisLine={{ stroke: '#35007f' }}
                />

                <YAxis 
                  stroke="#8e9379" 
                  tick={{ fill: '#c4c9ac', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  tickLine={{ stroke: '#35007f' }}
                  axisLine={{ stroke: '#35007f' }}
                  tickFormatter={formatShortMXN}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar 
                  dataKey="renovaciones" 
                  name="Renovaciones" 
                  fill="#00E5FF" 
                  radius={[4, 4, 0, 0]} 
                  stackId="a"
                />

                <Bar 
                  dataKey="nuevasAltas" 
                  name="Nuevas Altas" 
                  fill="#CCFF00" 
                  radius={[6, 6, 0, 0]} 
                  stackId="a"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Barra Inferior Informativa de la Gráfica */}
        <div className="mt-6 pt-4 border-t border-[#35007f]/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-[#c4c9ac]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#CCFF00]" />
            <span>
              Proyección siguiente mes: <strong className="text-white font-mono">$251,300 MXN</strong> (Estimado +3.6% MoM)
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Base de datos: <strong className="text-white">PostgreSQL</strong></span>
            <span className="text-[#35007f]">•</span>
            <span>Motor de cálculo: <strong className="text-[#CCFF00]">NestJS Engine</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MRRDashboard;
