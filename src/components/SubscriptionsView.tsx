import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Plus, 
  TrendingUp, 
  Star
} from 'lucide-react';
import { PlanItem } from '../types';

interface SubscriptionsViewProps {
  plans: PlanItem[];
  onUpdatePlan: (updatedPlan: PlanItem) => void;
  onAddNewPlan: (newPlan: PlanItem) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  plans,
  onUpdatePlan,
  onAddNewPlan,
}) => {
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);

  // New plan state
  const [newName, setNewName] = useState('');
  const [newTag, setNewTag] = useState('ESPECIAL');
  const [newPrice, setNewPrice] = useState('1499');
  const [newPeriod, setNewPeriod] = useState('/bimestre');
  const [newBenefits, setNewBenefits] = useState('Acceso 24/7,Sauna y Vestidores,1 Clase de Prueba');

  const handleSaveNewPlan = () => {
    if (!newName.trim()) return;
    const plan: PlanItem = {
      id: `plan-${Date.now()}`,
      name: newName,
      tag: newTag,
      price: parseFloat(newPrice) || 999,
      period: newPeriod,
      intervalDescription: 'Facturación periódica configurada',
      benefits: newBenefits.split(',').map(s => s.trim()).filter(Boolean),
      excludedBenefits: ['Entrenador personal dedicado'],
      activeMembers: 0
    };
    onAddNewPlan(plan);
    setShowNewPlanModal(false);
    setNewName('');
  };

  const handleSaveEdit = () => {
    if (editingPlan) {
      onUpdatePlan(editingPlan);
      setEditingPlan(null);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="font-body text-xs uppercase tracking-widest text-[#c3f400] font-bold block mb-1">
            Estrategia Comercial y Membresías
          </span>
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tight">
            Gestión de Suscripciones & Planes
          </h1>
          <p className="font-body text-sm text-[#c4c9ac] mt-1 max-w-2xl">
            Configura la oferta de valor del gimnasio. Administra tarifas, duraciones y beneficios para maximizar el MRR.
          </p>
        </div>

        <button
          onClick={() => setShowNewPlanModal(true)}
          className="bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold px-5 py-3 rounded-full shadow-[0_0_15px_rgba(195,244,0,0.25)] active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 w-full items-start">
        {/* Planes Catalog (8 cols on desktop) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
          <div className="flex justify-between items-center bg-[#290065] px-5 py-3 rounded-2xl border border-[#35007f]/60 shadow-md">
            <h2 className="text-xs uppercase tracking-wider text-[#c4c9ac] font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#c3f400]" />
              Catálogo Activo ({plans.length} Niveles)
            </h2>
            <span className="text-xs text-[#c4c9ac]/80 font-medium">Precios con IVA incluido</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-[#290065] rounded-3xl p-6 md:p-7 flex flex-col justify-between relative overflow-hidden group hover:border-[#c3f400]/40 transition-all border ${
                  plan.isPopular ? 'border-[#c3f400]/60 ring-2 ring-[#c3f400]/20' : 'border-[#35007f]/60 shadow-lg'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex justify-between items-start w-full relative z-10 mb-3">
                    <div className="flex flex-col">
                      <span className={`text-[11px] uppercase tracking-wider font-bold mb-1 flex items-center gap-1 ${
                        plan.isPopular ? 'text-[#c3f400]' : 'text-[#c4c9ac]'
                      }`}>
                        {plan.isPopular && <Star className="w-3.5 h-3.5 fill-[#c3f400] text-[#c3f400]" />}
                        {plan.tag}
                      </span>
                      <h3 className="font-headline text-xl text-white">{plan.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#c3f400]/15 border border-[#c3f400]/40 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" />
                      <span className="text-[11px] text-[#c3f400] font-bold">Activo</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 relative z-10 my-3">
                    <span className="text-lg text-[#c4c9ac] font-bold">$</span>
                    <span className="font-headline text-3xl md:text-4xl text-white tracking-tight">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#c4c9ac] font-medium">{plan.period}</span>
                    {plan.discountNote && (
                      <span className="ml-2 text-[11px] font-bold text-[#c3f400] bg-[#c3f400]/15 border border-[#c3f400]/40 px-2.5 py-0.5 rounded-full">
                        {plan.discountNote}
                      </span>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-col gap-2.5 my-5 relative z-10 text-xs">
                    {plan.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#c3f400] shrink-0" />
                        <span className="text-[#eaddff] leading-snug">{b}</span>
                      </div>
                    ))}
                    {plan.excludedBenefits.map((eb, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 opacity-40">
                        <XCircle className="w-4 h-4 text-[#c4c9ac] shrink-0" />
                        <span className="text-[#c4c9ac] line-through leading-snug">{eb}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer / Active count & edit */}
                <div className="pt-4 border-t border-[#35007f]/40 flex justify-between items-center relative z-10 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">Miembros Activos</span>
                    <span className="font-headline text-lg text-white">{plan.activeMembers}</span>
                  </div>
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="w-10 h-10 rounded-full bg-[#140039] text-[#c4c9ac] hover:text-[#c3f400] hover:bg-[#35007f] transition-colors flex items-center justify-center border border-[#35007f]"
                    title="Editar tarifa y beneficios"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Sidebar (4 cols on desktop) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <div className="flex justify-between items-center bg-[#290065] px-5 py-3 rounded-2xl border border-[#35007f]/60 shadow-md">
            <h2 className="text-xs uppercase tracking-wider text-[#c4c9ac] font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#c3f400]" />
              Métricas de Ingresos
            </h2>
          </div>

          {/* MRR Total Card in Kinetic Noir Dark Base */}
          <div className="bg-[#140039] text-white rounded-3xl p-6 md:p-8 flex flex-col gap-4 border border-[#35007f] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#c3f400]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-widest text-[#c4c9ac] font-bold">
                MRR Total (Mensual Recurrente)
              </span>
              <div className="flex items-center text-[#c3f400] bg-[#c3f400]/15 px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#c3f400]/40">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+8.4%</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl md:text-4xl text-white tracking-tight">
                $874,500 <span className="text-xs font-normal text-[#c4c9ac]">MXN</span>
              </span>
            </div>

            {/* Sparkline Curve */}
            <div className="w-full h-20 mt-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="planSparkGradNoir" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#c3f400" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#c3f400" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,25 L10,22 L20,24 L30,18 L40,20 L50,12 L60,15 L70,8 L80,10 L90,4 L100,2 L100,30 L0,30 Z"
                  fill="url(#planSparkGradNoir)"
                />
                <path
                  d="M0,25 L10,22 L20,24 L30,18 L40,20 L50,12 L60,15 L70,8 L80,10 L90,4 L100,2"
                  fill="none"
                  stroke="#c3f400"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="100" cy="2" r="3" fill="#c3f400" />
              </svg>
            </div>

            {/* Distribution breakdown */}
            <div className="space-y-3 pt-4 border-t border-[#35007f] text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#eaddff] font-medium">Trimestral Héroe (45%)</span>
                  <span className="font-bold text-white">$393,525 MXN</span>
                </div>
                <div className="w-full bg-[#290065] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#c3f400] h-full rounded-full w-[45%] shadow-[0_0_6px_#c3f400]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#eaddff] font-medium">Mensual Básico (33%)</span>
                  <span className="font-bold text-white">$288,585 MXN</span>
                </div>
                <div className="w-full bg-[#290065] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#abd600] h-full rounded-full w-[33%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#eaddff] font-medium">Titanio Anual (22%)</span>
                  <span className="font-bold text-white">$192,390 MXN</span>
                </div>
                <div className="w-full bg-[#290065] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#ffffff] h-full rounded-full w-[22%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-[#140039]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#35007f] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-headline text-xl text-white mb-1">Editar {editingPlan.name}</h3>
            <p className="text-xs text-[#c4c9ac] mb-6">Ajusta la tarifa comercial y periodicidad de cobro recurrente.</p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[#eaddff] font-semibold block mb-1">Precio (MXN)</label>
                <input
                  type="number"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#c3f400] outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[#eaddff] font-semibold block mb-1">Etiqueta</label>
                <input
                  type="text"
                  value={editingPlan.tag}
                  onChange={(e) => setEditingPlan({ ...editingPlan, tag: e.target.value })}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#c3f400] outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setEditingPlan(null)}
                className="flex-1 py-3 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] text-xs font-semibold transition-colors border border-[#35007f]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3 rounded-full bg-[#c3f400] text-[#161e00] text-xs font-bold hover:bg-[#abd600] transition-all shadow-[0_0_12px_rgba(195,244,0,0.25)]"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 bg-[#140039]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#35007f] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-headline text-xl text-white mb-1">Crear Nuevo Plan de Suscripción</h3>
            <p className="text-xs text-[#c4c9ac] mb-6">Define un nuevo paquete comercial para ofertar en sede o app.</p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[#eaddff] font-semibold block mb-1">Nombre del Plan</label>
                <input
                  type="text"
                  placeholder="ej. Membresía Crossfit Elite"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#c3f400] outline-none transition-all placeholder:text-[#c4c9ac]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#eaddff] font-semibold block mb-1">Precio (MXN)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#c3f400] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[#eaddff] font-semibold block mb-1">Periodo</label>
                  <input
                    type="text"
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                    placeholder="/mes o /semestre"
                    className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#c3f400] outline-none transition-all placeholder:text-[#c4c9ac]/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#eaddff] font-semibold block mb-1">Beneficios (separados por coma)</label>
                <textarea
                  rows={3}
                  value={newBenefits}
                  onChange={(e) => setNewBenefits(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#c3f400] outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowNewPlanModal(false)}
                className="flex-1 py-3 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] text-xs font-semibold transition-colors border border-[#35007f]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNewPlan}
                className="flex-1 py-3 rounded-full bg-[#c3f400] text-[#161e00] text-xs font-bold hover:bg-[#abd600] transition-all shadow-[0_0_12px_rgba(195,244,0,0.25)]"
              >
                Crear Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
