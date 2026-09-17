import React, { useState } from 'react';
import { 
  NavigationTab, 
  Member, 
  PlanItem, 
  TerminalDevice, 
  Instructor, 
  AccessEvent, 
  SystemAlert 
} from './types';
import { 
  initialMembers, 
  initialPlans, 
  initialTerminals, 
  initialInstructors, 
  initialAccessEvents, 
  initialSystemAlerts 
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SalesView } from './components/SalesView';
import { MembersView } from './components/MembersView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { AccessAuditView } from './components/AccessAuditView';
import { TerminalsView } from './components/TerminalsView';
import { InstructorsView } from './components/InstructorsView';

import { 
  X, 
  UserPlus, 
  Receipt, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  Fingerprint, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Server, 
  Dumbbell,
  Wifi,
  Battery
} from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isMobileExecutivePreview, setIsMobileExecutivePreview] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showNewMemberModal, setShowNewMemberModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // App Data States
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans);
  const [terminals, setTerminals] = useState<TerminalDevice[]>(initialTerminals);
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [accessEvents, setAccessEvents] = useState<AccessEvent[]>(initialAccessEvents);
  const [alerts, setAlerts] = useState<SystemAlert[]>(initialSystemAlerts);

  // Form states for New Member Modal
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState('Titanio Pro');
  const [newMemberBio, setNewMemberBio] = useState<'Registrada' | 'Pendiente'>('Registrada');

  // Form states for Receipt Modal
  const [receiptMemberId, setReceiptMemberId] = useState('GYM-8492');
  const [receiptAmount, setReceiptAmount] = useState('899');
  const [receiptMethod, setReceiptMethod] = useState('Tarjeta de Débito / Terminal');
  const [receiptSuccess, setReceiptSuccess] = useState(false);

  // Handlers
  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newId = `GYM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMember: Member = {
      id: newId,
      name: newMemberName,
      email: newMemberEmail || `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      plan: newMemberPlan,
      renewalDate: 'Renueva en 30 días',
      bioStatus: newMemberBio,
      lastAccess: 'Hoy (Enrolamiento inicial)',
      location: 'Sede Central - Acceso A',
      status: 'Activo'
    };

    setMembers([newMember, ...members]);
    setShowNewMemberModal(false);
    setNewMemberName('');
    setNewMemberEmail('');

    // Also add to access audit log
    const now = new Date().toTimeString().split(' ')[0];
    setAccessEvents([
      {
        id: `ev-${Date.now()}`,
        time: now,
        memberName: newMember.name,
        memberId: `ID: ${newMember.id}`,
        terminal: 'Recepción Central',
        status: 'APROBADO',
        detail: 'Enrolamiento inicial completado con éxito',
        isNew: true
      },
      ...accessEvents
    ]);
  };

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setReceiptSuccess(true);
    setTimeout(() => {
      setReceiptSuccess(false);
      setShowReceiptModal(false);
    }, 1200);
  };

  const handleUpdateMemberStatus = (id: string, newStatus: 'Activo' | 'Suspendido') => {
    setMembers(members.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  const handleUpdatePlan = (updatedPlan: PlanItem) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const handleAddNewPlan = (newPlan: PlanItem) => {
    setPlans([...plans, newPlan]);
  };

  const handleAddTerminal = (newTerminal: TerminalDevice) => {
    setTerminals([...terminals, newTerminal]);
  };

  const handleRestartTerminal = (id: string) => {
    setTerminals(terminals.map(t => {
      if (t.id === id) {
        return { ...t, status: 'En línea', lastPingMs: Math.floor(10 + Math.random() * 8) };
      }
      return t;
    }));
  };

  const handleAddInstructor = (newInst: Instructor) => {
    setInstructors([...instructors, newInst]);
  };

  const handleAddSimulatedAccessEvent = (ev: AccessEvent) => {
    setAccessEvents([ev, ...accessEvents]);
  };

  // Render view router
  const renderCurrentView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewMember={() => setShowNewMemberModal(true)}
            onOpenReceipt={() => setShowReceiptModal(true)}
            alerts={alerts}
          />
        );
      case 'ventas':
        return <SalesView />;
      case 'miembros':
        return (
          <MembersView
            members={members}
            onOpenNewMember={() => setShowNewMemberModal(true)}
            onUpdateMemberStatus={handleUpdateMemberStatus}
            searchQuery={searchQuery}
          />
        );
      case 'suscripciones':
        return (
          <SubscriptionsView
            plans={plans}
            onUpdatePlan={handleUpdatePlan}
            onAddNewPlan={handleAddNewPlan}
          />
        );
      case 'accesos':
        return (
          <AccessAuditView
            events={accessEvents}
            onAddSimulatedEvent={handleAddSimulatedAccessEvent}
            searchQuery={searchQuery}
          />
        );
      case 'terminales':
        return (
          <TerminalsView
            terminals={terminals}
            onAddTerminal={handleAddTerminal}
            onRestartTerminal={handleRestartTerminal}
          />
        );
      case 'instructores':
        return (
          <InstructorsView
            instructors={instructors}
            onAddInstructor={handleAddInstructor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0046] text-[#eaddff] font-body selection:bg-[#c3f400] selection:text-[#161e00] antialiased">
      {/* If Mobile Executive Preview is active, wrap in realistic executive device frame */}
      {isMobileExecutivePreview ? (
        <div className="min-h-screen bg-[#140039] p-4 sm:p-8 flex flex-col items-center justify-center">
          {/* Top preview toolbar */}
          <div className="w-full max-w-md flex items-center justify-between mb-4 bg-[#290065] px-4 py-2.5 rounded-2xl border border-[#35007f]">
            <div className="flex items-center gap-2 text-xs text-[#c3f400] font-medium">
              <Smartphone className="w-4 h-4" />
              <span>VISTA MÓVIL EJECUTIVA (Edge Link)</span>
            </div>
            <button
              onClick={() => setIsMobileExecutivePreview(false)}
              className="text-xs bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] font-bold px-3 py-1.5 rounded-xl transition-colors shadow-[0_0_10px_rgba(195,244,0,0.3)]"
            >
              Volver a Desktop
            </button>
          </div>

          {/* Phone Frame */}
          <div className="w-full max-w-md h-[880px] bg-[#1a0046] rounded-[48px] border-[10px] border-[#24005b] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative">
            {/* Phone Status Bar */}
            <div className="h-10 bg-[#140039] px-7 flex items-center justify-between text-xs text-[#c4c9ac] font-medium select-none pt-2 z-30 border-b border-[#24005b]">
              <span>09:41</span>
              {/* Dynamic Island / Speaker */}
              <div className="w-24 h-4 bg-black rounded-full" />
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-[#c4c9ac]" />
                <Battery className="w-4 h-4 text-[#c3f400]" />
              </div>
            </div>

            {/* Mobile Header Bar */}
            <div className="h-16 px-5 flex items-center justify-between border-b border-[#35007f]/50 bg-[#1a0046]/95 backdrop-blur-md shrink-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#c3f400] flex items-center justify-center font-bold text-xs text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.3)]">
                  GF
                </div>
                <div>
                  <h2 className="text-sm font-headline text-white tracking-tight">GYMFLOW</h2>
                  <p className="text-[10px] text-[#c3f400] font-medium">Mobile Ejecutivo</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewMemberModal(true)}
                className="w-8 h-8 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center shadow-sm hover:bg-[#abd600]"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 pb-24 bg-[#1a0046]">
              {renderCurrentView()}
            </div>

            {/* Mobile Bottom Executive Navigation Dock */}
            <nav className="absolute bottom-0 left-0 right-0 h-16 bg-[#140039]/95 backdrop-blur-xl border-t border-[#24005b] flex items-center justify-around px-2 z-30 shadow-lg">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                  currentTab === 'dashboard' ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac] hover:text-[#eaddff]'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-[10px] font-medium">Panel</span>
              </button>

              <button
                onClick={() => setCurrentTab('miembros')}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                  currentTab === 'miembros' ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac] hover:text-[#eaddff]'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-medium">Socios</span>
              </button>

              <button
                onClick={() => setCurrentTab('accesos')}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                  currentTab === 'accesos' ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac] hover:text-[#eaddff]'
                }`}
              >
                <Fingerprint className="w-5 h-5" />
                <span className="text-[10px] font-medium">Accesos</span>
              </button>

              <button
                onClick={() => setCurrentTab('ventas')}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                  currentTab === 'ventas' ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac] hover:text-[#eaddff]'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span className="text-[10px] font-medium">Ventas</span>
              </button>

              <button
                onClick={() => setCurrentTab('terminales')}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                  currentTab === 'terminales' ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac] hover:text-[#eaddff]'
                }`}
              >
                <Server className="w-5 h-5" />
                <span className="text-[10px] font-medium">Edge</span>
              </button>
            </nav>
          </div>
        </div>
      ) : (
        /* Full Desktop & Responsive Back Office */
        <div className="flex w-full min-h-screen bg-[#1a0046]">
          {/* Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Main Layout Area */}
          <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
            {/* Header */}
            <Header
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              isMobileExecutivePreview={isMobileExecutivePreview}
              onToggleMobilePreview={() => setIsMobileExecutivePreview(!isMobileExecutivePreview)}
              onQuickNewMember={() => setShowNewMemberModal(true)}
              onQuickInvoice={() => setShowReceiptModal(true)}
              alerts={alerts}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Viewport Content */}
            <main className="flex-1 p-4 md:p-8 lg:p-8 pt-24 max-w-7xl w-full mx-auto">
              {renderCurrentView()}
            </main>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nuevo Socio */}
      {showNewMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#35007f] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xl font-headline text-white tracking-tight">Registrar Nuevo Socio</h3>
                <p className="text-xs text-[#c4c9ac] mt-1">Genera la ficha administrativa y autoriza el enrolamiento biométrico.</p>
              </div>
              <button
                onClick={() => setShowNewMemberModal(false)}
                className="text-[#c4c9ac] hover:text-white p-1 rounded-lg hover:bg-[#35007f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
              <div>
                <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mariana Treviño"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#c3f400] focus:outline-none transition-all placeholder-[#c4c9ac]/50"
                />
              </div>

              <div>
                <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="mariana@ejemplo.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#c3f400] focus:outline-none transition-all placeholder-[#c4c9ac]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Plan</label>
                  <select
                    value={newMemberPlan}
                    onChange={(e) => setNewMemberPlan(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#c3f400] focus:outline-none transition-all"
                  >
                    <option value="Base Neón">Base Neón ($899/m)</option>
                    <option value="Trimestral Héroe">Trimestral Héroe ($2,399)</option>
                    <option value="Titanio Pro">Titanio Pro ($7,999/a)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Biometría</label>
                  <select
                    value={newMemberBio}
                    onChange={(e) => setNewMemberBio(e.target.value as any)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#c3f400] focus:outline-none transition-all"
                  >
                    <option value="Registrada">Enrolar Inmediato (OK)</option>
                    <option value="Pendiente">Pendiente en Torniquete</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewMemberModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#35007f] hover:bg-[#42009b] text-[#eaddff] text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] text-xs font-bold uppercase tracking-wider hover:bg-[#abd600] transition-colors shadow-[0_0_15px_rgba(195,244,0,0.3)]"
                >
                  Dar de Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Facturar / Comprobante */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#35007f] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xl font-headline text-white tracking-tight">Facturación &amp; Comprobante</h3>
                <p className="text-xs text-[#c4c9ac] mt-1">Genera recibo digital timbrado con notificación al socio.</p>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-[#c4c9ac] hover:text-white p-1 rounded-lg hover:bg-[#35007f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {receiptSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#c3f400] animate-bounce" />
                <h4 className="text-lg font-headline text-white">¡Comprobante Emitido!</h4>
                <p className="text-xs text-[#c4c9ac]">
                  Se envió copia digital a la app móvil del socio y correo fiscal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateReceipt} className="space-y-4 text-xs">
                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">ID / Nombre de Socio</label>
                  <input
                    type="text"
                    value={receiptMemberId}
                    onChange={(e) => setReceiptMemberId(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#c3f400] focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Monto (MXN)</label>
                    <input
                      type="number"
                      value={receiptAmount}
                      onChange={(e) => setReceiptAmount(e.target.value)}
                      className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#c3f400] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Método de Pago</label>
                    <select
                      value={receiptMethod}
                      onChange={(e) => setReceiptMethod(e.target.value)}
                      className="w-full bg-[#140039] border border-[#35007f] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#c3f400] focus:outline-none transition-all"
                    >
                      <option value="Tarjeta">Tarjeta Débito/Crédito</option>
                      <option value="Efectivo">Efectivo en Caja</option>
                      <option value="SPEI">Transferencia SPEI</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#35007f] hover:bg-[#42009b] text-[#eaddff] text-xs font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] text-xs font-bold uppercase tracking-wider hover:bg-[#abd600] transition-colors shadow-[0_0_15px_rgba(195,244,0,0.3)]"
                  >
                    Emitir Recibo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
