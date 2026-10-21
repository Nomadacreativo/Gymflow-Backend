import React, { useState } from 'react';
import { MRRDashboard } from './MRRDashboard';
import { 
  TrendingUp, 
  Calendar, 
  Download, 
  UserCheck, 
  Repeat, 
  DollarSign, 
  Layers, 
  ArrowUpRight,
  ShieldAlert,
  Info
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const [activeDateRange] = useState('Oct 1 - Oct 31, 2024');
  const [showChurnModal, setShowChurnModal] = useState(false);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Mes,MRR Real,MRR Proyectado,Plan Mensual,Plan Trimestral,Plan Anual\n"
      + "May,32400,32400,14000,10500,7900\n"
      + "Jun,34100,34100,15200,11100,7800\n"
      + "Jul,33200,33200,14800,11200,7200\n"
      + "Ago,36800,36800,16500,12100,8200\n"
      + "Sep,38200,38200,18400,12600,7200\n"
      + "Oct,38200,41200,19500,14100,7600\n"
      + "Nov,,43800,20800,15200,7800\n"
      + "Dic,,45230,21500,16100,7630\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gymflow_reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="font-body text-xs uppercase tracking-widest text-[#c3f400] font-bold block mb-1">
            Inteligencia y Analítica Financiera
          </span>
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tight">
            Reporte de Ventas & MRR
          </h1>
          <p className="font-body text-sm text-[#c4c9ac] mt-1 max-w-xl">
            Proyecciones predictivas a 6 meses, conversión del embudo comercial y retención por categoría.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#290065] rounded-full px-4 py-2.5 flex items-center gap-2 border border-[#35007f] text-xs text-[#eaddff] font-medium shadow-md">
            <Calendar className="w-4 h-4 text-[#c3f400]" />
            <span>{activeDateRange}</span>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold rounded-full px-5 py-2.5 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(195,244,0,0.25)] active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </section>

      {/* 4 Financial KPIs Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* KPI 1 */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between hover:border-[#c3f400]/40 transition-all">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#c4c9ac] font-bold">
                Ingresos Totales (MTD)
              </span>
              <div className="w-10 h-10 rounded-full bg-[#35007f] text-[#c3f400] flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h2 className="font-headline text-2xl md:text-3xl text-white tracking-tight">$42,850 <span className="text-xs font-normal text-[#c4c9ac]">MXN</span></h2>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#35007f]/40 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#c3f400]" />
            <span className="text-[#c3f400] font-bold">+12.4%</span>
            <span className="text-[#c4c9ac]">vs. mes pasado</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between hover:border-[#c3f400]/40 transition-all">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#c4c9ac] font-bold">
                MRR Activo
              </span>
              <div className="w-10 h-10 rounded-full bg-[#35007f] text-[#c3f400] flex items-center justify-center">
                <Repeat className="w-5 h-5" />
              </div>
            </div>
            <h2 className="font-headline text-2xl md:text-3xl text-white tracking-tight">$38,200 <span className="text-xs font-normal text-[#c4c9ac]">MXN</span></h2>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#35007f]/40 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#c3f400]" />
            <span className="text-[#c3f400] font-bold">+5.2%</span>
            <span className="text-[#c4c9ac]">vs. mes pasado</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between hover:border-[#c3f400]/40 transition-all">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#c4c9ac] font-bold">
                ARPU (Promedio)
              </span>
              <div className="w-10 h-10 rounded-full bg-[#35007f] text-[#c3f400] flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <h2 className="font-headline text-2xl md:text-3xl text-white tracking-tight">$85 <span className="text-xs font-normal text-[#c4c9ac]">MXN</span></h2>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#35007f]/40 text-xs text-[#c4c9ac]">
            <span className="font-semibold text-white">0.0%</span>
            <span>estable vs. mes anterior</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg flex flex-col justify-between hover:border-[#c3f400]/40 transition-all">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#c4c9ac] font-bold">
                NRR (Retención Neta)
              </span>
              <div className="w-10 h-10 rounded-full bg-[#35007f] text-[#c3f400] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <h2 className="font-headline text-2xl md:text-3xl text-[#c3f400] tracking-tight">104%</h2>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#35007f]/40 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#c3f400]" />
            <span className="text-[#c3f400] font-bold">+2.1%</span>
            <span className="text-[#c4c9ac]">expansión de cuentas</span>
          </div>
        </div>
      </section>

      {/* Sección Analítica Recharts: MRRDashboard de los últimos 6 meses */}
      <MRRDashboard />

      {/* Visualizaciones Secundarias: Embudo y Retención */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversión de Embudo */}
        <div className="bg-[#290065] rounded-3xl p-6 md:p-8 border border-[#35007f]/60 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#c3f400] font-bold block mb-1">
              Funnel Comercial
            </span>
            <h3 className="font-headline text-xl text-white tracking-tight">Conversión de Embudo</h3>
            <p className="text-xs text-[#c4c9ac] mt-0.5">Prospecto a Miembro Activo</p>
          </div>

          <div className="flex flex-col gap-4 my-6">
            {/* Stage 1: Prospectos */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-[#eaddff] font-semibold">Prospectos (Inicio)</span>
                <span className="text-sm font-bold text-white">1,250</span>
              </div>
              <div className="h-11 bg-[#140039] rounded-2xl overflow-hidden p-1 border border-[#35007f]">
                <div className="h-full bg-[#35007f] rounded-xl flex items-center px-3 w-full justify-between text-white text-xs">
                  <span className="text-[11px] text-[#eaddff]">Tráfico Web & Redes</span>
                  <span className="text-[11px] font-bold">100%</span>
                </div>
              </div>
            </div>

            {/* Stage 2: Pruebas */}
            <div className="pl-2">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-[#eaddff] font-semibold">Pruebas (Pase de Día)</span>
                <div className="text-right">
                  <span className="text-xs text-[#c3f400] mr-2 font-bold">36% conv.</span>
                  <span className="text-sm font-bold text-white">450</span>
                </div>
              </div>
              <div className="h-11 bg-[#140039] rounded-2xl overflow-hidden p-1 border border-[#35007f]">
                <div className="h-full bg-[#42009b] rounded-xl flex items-center px-3 w-[75%] justify-between text-[#eaddff] text-xs">
                  <span className="text-[11px] text-[#eaddff] font-medium">Visitas a sede</span>
                  <span className="text-[11px] font-bold text-[#c3f400]">36.0%</span>
                </div>
              </div>
            </div>

            {/* Stage 3: Miembros */}
            <div className="pl-4">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-[#c3f400] font-bold">Miembros (Fin)</span>
                <div className="text-right">
                  <span className="text-xs text-[#c3f400] mr-2 font-bold">40% conv.</span>
                  <span className="text-sm font-black text-[#c3f400]">180</span>
                </div>
              </div>
              <div className="h-11 bg-[#140039] rounded-2xl overflow-hidden p-1 border border-[#35007f]">
                <div className="h-full bg-[#c3f400] rounded-xl flex items-center px-3 w-[55%] justify-between text-[#161e00] text-xs shadow-md font-bold">
                  <span className="text-[11px]">Altas Efectivas</span>
                  <span className="text-[11px]">14.4% neto</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#140039] p-3 rounded-2xl border border-[#35007f] flex items-center gap-2.5 text-xs text-[#c4c9ac]">
            <Info className="w-4 h-4 text-[#c3f400] shrink-0" />
            <span>El ratio de conversión global supera en 3.2% el benchmark promedio regional.</span>
          </div>
        </div>
      </section>

      {/* Bottom Section: Rendimiento por Plan & Análisis de Deserción */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rendimiento por Plan Table (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-[#290065] rounded-3xl p-6 md:p-8 border border-[#35007f]/60 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#c3f400] font-bold block mb-1">
                Desglose Financiero
              </span>
              <h3 className="font-headline text-xl text-white tracking-tight">Rendimiento por Plan</h3>
              <p className="text-xs text-[#c4c9ac]">Distribución de ingresos y tasa de retención por catálogo</p>
            </div>
            <span className="text-xs font-semibold text-[#c3f400] bg-[#c3f400]/15 px-3 py-1 rounded-full border border-[#c3f400]/40">
              Q3 Consolidado
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[#35007f] text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Plan</th>
                  <th className="py-3 px-3 text-right">Contrib. MRR</th>
                  <th className="py-3 px-3 text-center">Deserción</th>
                  <th className="py-3 px-3 text-right">Crecimiento</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[#35007f]/40">
                <tr className="hover:bg-[#35007f]/30 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#c4c9ac]" />
                      <span className="font-semibold text-white">Plan Mensual</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-white">
                    $18,400 MXN
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffb4ab]/15 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs font-bold font-mono">
                      5.2%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1 text-[#c3f400] font-bold text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+2.4%</span>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-[#35007f]/50 transition-colors bg-[#140039]/40">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#c3f400]" />
                      <div>
                        <span className="font-bold text-[#c3f400]">Plan Trimestral (Héroe)</span>
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] font-bold border border-[#c3f400]/40">
                          MÁS RENTABLE
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-white">
                    $12,600 MXN
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#35007f] text-[#eaddff] text-xs font-mono font-semibold">
                      2.8%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1 text-[#c3f400] font-bold text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+8.7%</span>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-[#35007f]/30 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#eaddff]" />
                      <span className="font-medium text-[#eaddff]">Plan Anual</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-white">
                    $7,200 MXN
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/40 text-xs font-bold font-mono">
                      1.1%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1 text-[#c4c9ac] text-xs font-medium">
                      <span>+0.5%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Churn Analysis Box */}
        <div className="bg-[#290065] border border-[#ffb4ab]/40 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldAlert className="w-5 h-5 text-[#ffb4ab]" />
              <h3 className="font-headline text-xl text-white">Análisis de Deserción</h3>
            </div>
            <p className="text-xs text-[#c4c9ac] mb-5">
              Riesgo de fuga detectado en cohortes con más de 12 días sin registro en torniquetes.
            </p>

            <div className="mb-4 bg-[#140039] p-4 rounded-2xl border border-[#ffb4ab]/30">
              <p className="text-[11px] text-[#ffb4ab] uppercase tracking-wider font-bold mb-1">
                Tasa de Cancelación Actual
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-headline text-3xl text-[#ffb4ab] leading-none">3.4%</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] font-bold">
                  +0.2%
                </span>
              </div>
            </div>

            <div className="bg-[#140039] p-4 rounded-2xl border border-[#35007f]">
              <p className="text-[11px] text-[#c4c9ac] uppercase tracking-wider font-bold mb-1">
                Impacto Proyectado (MRR)
              </p>
              <p className="text-xl font-bold text-white">
                -$1,250 MXN <span className="text-xs font-normal text-[#c4c9ac]">/ mes estimado</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowChurnModal(true)}
            className="mt-6 w-full bg-[#ffb4ab] hover:bg-[#ffdad6] text-[#690005] text-xs font-bold py-3.5 rounded-full transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Ver Riesgos de Fuga</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Modal Riesgos de Fuga */}
      {showChurnModal && (
        <div className="fixed inset-0 z-50 bg-[#140039]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#35007f] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-headline text-xl text-white">Cohortes en Riesgo de Fuga</h3>
                <p className="text-xs text-[#c4c9ac] mt-1">Socios con inactividad crítica &gt; 12 días</p>
              </div>
              <button 
                onClick={() => setShowChurnModal(false)}
                className="w-8 h-8 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#c4c9ac] flex items-center justify-center text-sm font-semibold transition-colors border border-[#35007f]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 my-5 max-h-60 overflow-y-auto pr-1">
              <div className="p-3.5 rounded-2xl bg-[#140039] border border-[#35007f] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">Elena Rostova (#8821)</p>
                  <p className="text-[11px] text-[#ffb4ab] mt-0.5">Último acceso: hace 19 días • Plan Base Neón</p>
                </div>
                <button className="px-3.5 py-1.5 bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] font-bold rounded-full text-xs transition-colors">
                  Contactar
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#140039] border border-[#35007f] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">Mauricio Garza (#7102)</p>
                  <p className="text-[11px] text-[#ffb4ab] mt-0.5">Último acceso: hace 14 días • Plan Mensual</p>
                </div>
                <button className="px-3.5 py-1.5 bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] font-bold rounded-full text-xs transition-colors">
                  Contactar
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowChurnModal(false)}
              className="w-full py-3 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] text-xs font-semibold transition-colors border border-[#35007f]"
            >
              Cerrar Panel de Riesgo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
