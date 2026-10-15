import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
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
import {
  loginWithGoogle,
  logoutUser,
  subscribeToAuth,
  subscribeToMembers,
  subscribeToPlans,
  subscribeToTerminals,
  subscribeToInstructors,
  subscribeToAccessEvents,
  subscribeToAlerts,
  addMemberToFirestore,
  updateMemberStatusInFirestore,
  addPlanToFirestore,
  updatePlanInFirestore,
  addTerminalToFirestore,
  updateTerminalInFirestore,
  addInstructorToFirestore,
  addAccessEventToFirestore,
  checkFirestoreHasData
} from './lib/firestoreService';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SalesView } from './components/SalesView';
import { MembersView } from './components/MembersView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { AccessAuditView } from './components/AccessAuditView';
import { TerminalsView } from './components/TerminalsView';
import { InstructorsView } from './components/InstructorsView';
import { GoogleCalendarView } from './components/GoogleCalendarView';
import { GeminiAgentView } from './components/GeminiAgentView';
import { CloudMigrationModal } from './components/CloudMigrationModal';

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
  Battery,
  Cloud,
  Database,
  LogIn,
  RefreshCw,
  Sparkles,
  Calendar
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
  const [showMigrationModal, setShowMigrationModal] = useState<boolean>(false);

  // Firebase & Cloud State
  const [user, setUser] = useState<User | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [hasFirestoreData, setHasFirestoreData] = useState<boolean>(false);
  const [cloudNotification, setCloudNotification] = useState<string | null>(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);

  // App Data States (Clean defaults)
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

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsSyncing(true);
        try {
          const hasData = await checkFirestoreHasData();
          setHasFirestoreData(hasData);
        } catch (e) {
          console.warn('Error checking Firestore data:', e);
        } finally {
          setIsSyncing(false);
        }
      }
    });
    return () => unsub();
  }, []);

  // Subscribe to live Firestore collections when user is authenticated
  useEffect(() => {
    if (!user) return;

    setIsSyncing(true);
    const unsubs: (() => void)[] = [];

    const unsubMembers = subscribeToMembers((liveMembers) => {
      setMembers(liveMembers);
      if (liveMembers.length > 0) {
        setHasFirestoreData(true);
      }
      setIsSyncing(false);
    });
    unsubs.push(unsubMembers);

    const unsubPlans = subscribeToPlans((livePlans) => {
      if (livePlans.length > 0) setPlans(livePlans);
    });
    unsubs.push(unsubPlans);

    const unsubTerminals = subscribeToTerminals((liveTerminals) => {
      if (liveTerminals.length > 0) setTerminals(liveTerminals);
    });
    unsubs.push(unsubTerminals);

    const unsubInstructors = subscribeToInstructors((liveInstructors) => {
      setInstructors(liveInstructors);
    });
    unsubs.push(unsubInstructors);

    const unsubEvents = subscribeToAccessEvents((liveEvents) => {
      setAccessEvents(liveEvents);
    });
    unsubs.push(unsubEvents);

    const unsubAlerts = subscribeToAlerts((liveAlerts) => {
      setAlerts(liveAlerts);
    });
    unsubs.push(unsubAlerts);

    return () => {
      unsubs.forEach(fn => fn());
    };
  }, [user]);

  // Auth Handlers
  const handleGoogleLogin = async () => {
    try {
      const { user: loggedUser } = await loginWithGoogle();
      setUser(loggedUser);
      setCloudNotification(`¡Sesión iniciada con Google (${loggedUser.email})! Base de datos y Google Calendar listos.`);
      setTimeout(() => setCloudNotification(null), 4500);
    } catch (err) {
      console.error('Error in Google Login:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setCloudNotification('Sesión finalizada. Base de datos en modo local.');
      setTimeout(() => setCloudNotification(null), 3000);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // Handlers for Data Mutations
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newId = `GYM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMember: Member = {
      id: newId,
      name: newMemberName,
      email: newMemberEmail || `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      plan: newMemberPlan as any,
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

    // Also record access log
    const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEvent: AccessEvent = {
      id: `ev-${Date.now()}`,
      time: now,
      memberName: newMember.name,
      memberId: `ID: ${newMember.id}`,
      terminal: 'Recepción Central',
      status: 'APROBADO',
      detail: 'Enrolamiento inicial completado con éxito',
      isNew: true
    };
    setAccessEvents([newEvent, ...accessEvents]);

    if (user) {
      try {
        await addMemberToFirestore(newMember);
        await addAccessEventToFirestore(newEvent);
        setCloudNotification(`Socio ${newMember.name} guardado en Cloud Firestore.`);
        setTimeout(() => setCloudNotification(null), 3500);
      } catch (err) {
        console.error('Error writing member to Firestore:', err);
      }
    }
  };

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setReceiptSuccess(true);
    setTimeout(() => {
      setReceiptSuccess(false);
      setShowReceiptModal(false);
    }, 1200);
  };

  const handleUpdateMemberStatus = async (id: string, newStatus: 'Activo' | 'Suspendido') => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    if (user) {
      try {
        await updateMemberStatusInFirestore(id, newStatus);
        setCloudNotification(`Estatus de socio actualizado a: ${newStatus}`);
        setTimeout(() => setCloudNotification(null), 3000);
      } catch (err) {
        console.error('Error updating status in Firestore:', err);
      }
    }
  };

  const handleUpdatePlan = async (updatedPlan: PlanItem) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    if (user) {
      try {
        await updatePlanInFirestore(updatedPlan);
        setCloudNotification(`Plan ${updatedPlan.name} actualizado en Firestore.`);
        setTimeout(() => setCloudNotification(null), 3000);
      } catch (err) {
        console.error('Error updating plan in Firestore:', err);
      }
    }
  };

  const handleAddNewPlan = async (newPlan: PlanItem) => {
    setPlans(prev => [...prev, newPlan]);
    if (user) {
      try {
        await addPlanToFirestore(newPlan);
        setCloudNotification(`Nuevo plan ${newPlan.name} registrado en Firestore.`);
        setTimeout(() => setCloudNotification(null), 3000);
      } catch (err) {
        console.error('Error adding plan to Firestore:', err);
      }
    }
  };

  const handleAddTerminal = async (newTerminal: TerminalDevice) => {
    setTerminals(prev => [...prev, newTerminal]);
    if (user) {
      try {
        await addTerminalToFirestore(newTerminal);
        setCloudNotification(`Terminal ${newTerminal.name} vinculada en Firestore.`);
        setTimeout(() => setCloudNotification(null), 3000);
      } catch (err) {
        console.error('Error adding terminal to Firestore:', err);
      }
    }
  };

  const handleRestartTerminal = async (id: string) => {
    setTerminals(prev => prev.map(t => t.id === id ? { ...t, status: 'En línea', lastPingMs: 12 } : t));
    const term = terminals.find(t => t.id === id);
    if (term && user) {
      try {
        await updateTerminalInFirestore({ ...term, status: 'En línea', lastPingMs: 12 });
      } catch (err) {
        console.error('Error updating terminal in Firestore:', err);
      }
    }
  };

  const handleAddInstructor = async (newInstructor: Instructor) => {
    setInstructors(prev => [...prev, newInstructor]);
    if (user) {
      try {
        await addInstructorToFirestore(newInstructor);
        setCloudNotification(`Instructor ${newInstructor.name} registrado en Firestore.`);
        setTimeout(() => setCloudNotification(null), 3000);
      } catch (err) {
        console.error('Error adding instructor to Firestore:', err);
      }
    }
  };

  const handleAddSimulatedAccessEvent = async (ev: AccessEvent) => {
    setAccessEvents(prev => [ev, ...prev]);
    if (user) {
      try {
        await addAccessEventToFirestore(ev);
      } catch (err) {
        console.error('Error adding access event to Firestore:', err);
      }
    }
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
            members={members}
            plans={plans}
            terminals={terminals}
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
      case 'calendar':
        return (
          <GoogleCalendarView
            user={user}
            onLogin={handleGoogleLogin}
            instructors={instructors}
            onOpenGeminiOrganizer={() => setCurrentTab('gemini')}
          />
        );
      case 'gemini':
        return (
          <GeminiAgentView
            members={members}
            plans={plans}
            terminals={terminals}
            instructors={instructors}
            onNavigateToCalendar={() => setCurrentTab('calendar')}
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
            onNavigateToCalendar={() => setCurrentTab('calendar')}
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
                onClick={() => setCurrentTab('calendar')}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                  currentTab === 'calendar' ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac] hover:text-[#eaddff]'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-[10px] font-medium">Calendar</span>
              </button>

              <button
                onClick={() => setCurrentTab('gemini')}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                  currentTab === 'gemini' ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac] hover:text-[#eaddff]'
                }`}
              >
                <Sparkles className="w-5 h-5 text-[#c3f400]" />
                <span className="text-[10px] font-medium text-[#c3f400]">Gemini</span>
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
          <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
            {/* Header */}
            <Header
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onQuickNewMember={() => setShowNewMemberModal(true)}
              onQuickInvoice={() => setShowReceiptModal(true)}
              onToggleMobilePreview={() => setIsMobileExecutivePreview(!isMobileExecutivePreview)}
              isMobileExecutivePreview={isMobileExecutivePreview}
              user={user}
              onLogin={handleGoogleLogin}
              onLogout={handleLogout}
              onOpenMigrationModal={() => setShowMigrationModal(true)}
              isSyncing={isSyncing}
              alerts={alerts}
            />

            {/* Viewport Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto pb-24">
              {/* Executive Cloud Sync Banner */}
              {!user ? (
                !isBannerDismissed && (
                  <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#24005b] to-[#290065] border border-[#35007f] shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative group">
                    <div className="flex items-start sm:items-center gap-3.5 pr-8 lg:pr-0">
                      <div className="w-11 h-11 rounded-2xl bg-[#35007f] text-[#c3f400] flex items-center justify-center shrink-0 border border-[#42009b] shadow-[0_0_15px_rgba(195,244,0,0.15)]">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-headline text-sm text-white">Google Cloud & Calendar Preparados</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#140039] text-[#c3f400] text-[10px] font-mono font-bold border border-[#35007f]">
                            us-east1
                          </span>
                        </div>
                        <p className="text-xs text-[#c4c9ac] mt-1 max-w-2xl leading-relaxed">
                          Conecta tu cuenta de Google de Administrador para sincronizar Firestore en vivo y agendar clases directamente en tu Google Calendar oficial.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-wrap">
                      <button
                        onClick={handleGoogleLogin}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95 transition-all"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Conectar con Google</span>
                      </button>
                      <button
                        onClick={() => setShowMigrationModal(true)}
                        className="px-4 py-2.5 rounded-full bg-[#140039] hover:bg-[#24005b] text-[#eaddff] font-medium text-xs border border-[#35007f] active:scale-95 transition-all"
                      >
                        Base de Datos Cloud
                      </button>
                      <button
                        onClick={() => setIsBannerDismissed(true)}
                        className="text-[#c4c9ac] hover:text-white p-1 rounded-full transition-colors ml-auto lg:ml-0"
                        title="Ocultar aviso"
                        aria-label="Ocultar aviso"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-[#24005b]/80 border border-[#c3f400]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-pulse shadow-[0_0_8px_#c3f400] shrink-0" />
                    <span className="text-white font-medium">
                      Cloud Firestore & Calendar en Vivo • <strong className="text-[#c3f400] font-mono">{user.email}</strong>
                    </span>
                    <span className="text-[#c4c9ac] hidden md:inline">
                      ({members.length} socios, {terminals.length} terminales, {instructors.length} coaches)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      onClick={() => setShowMigrationModal(true)}
                      className="text-xs text-[#c3f400] hover:underline font-semibold flex items-center gap-1.5"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Configuración Cloud</span>
                    </button>
                  </div>
                </div>
              )}

              {/* View Rendering */}
              {renderCurrentView()}
            </main>
          </div>
        </div>
      )}

      {/* Floating Gemini Agent Quick Access Button */}
      {currentTab !== 'gemini' && (
        <button
          onClick={() => setCurrentTab('gemini')}
          className="fixed bottom-6 right-6 z-40 bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-[0_0_25px_rgba(195,244,0,0.4)] flex items-center gap-2.5 font-bold text-xs transition-all hover:scale-105 active:scale-95 group"
          title="Abrir Agente Organizador Gemini"
        >
          <Sparkles className="w-5 h-5 text-[#161e00] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="hidden sm:inline">Agente Organizador AI</span>
        </button>
      )}

      {/* Modal: Registrar Nuevo Socio */}
      {showNewMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#35007f] rounded-[2.5rem] p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xl font-headline text-white tracking-tight">Registrar Nuevo Socio</h3>
                <p className="text-xs text-[#c4c9ac] mt-1">Genera la ficha administrativa y autoriza el enrolamiento biométrico en los tornos.</p>
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
                <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mariana Treviño"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-2xl px-4 py-3 text-white text-sm focus:border-[#c3f400] focus:outline-none transition-all placeholder-[#c4c9ac]/50"
                />
              </div>

              <div>
                <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="mariana@ejemplo.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full bg-[#140039] border border-[#35007f] rounded-2xl px-4 py-3 text-white text-sm focus:border-[#c3f400] focus:outline-none transition-all placeholder-[#c4c9ac]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Plan</label>
                  <select
                    value={newMemberPlan}
                    onChange={(e) => setNewMemberPlan(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl px-3 py-3 text-white text-xs focus:border-[#c3f400] focus:outline-none transition-all"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.name}>{p.name} (${p.price})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase text-[10px] tracking-wider">Biometría Facial</label>
                  <select
                    value={newMemberBio}
                    onChange={(e) => setNewMemberBio(e.target.value as any)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl px-3 py-3 text-white text-xs focus:border-[#c3f400] focus:outline-none transition-all"
                  >
                    <option value="Registrada">Registrada (Inmediata)</option>
                    <option value="Pendiente">Pendiente en Torno</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewMemberModal(false)}
                  className="px-5 py-2.5 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)] hover:bg-[#abd600] active:scale-95 transition-all"
                >
                  Confirmar Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Facturación / Comprobante */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#290065] border border-[#35007f] rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-headline text-white tracking-tight">Emisión de Factura / Cobro</h3>
                  <p className="text-xs text-[#c4c9ac]">Caja y Conciliación Administrativa</p>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-[#c4c9ac] hover:text-white p-1 rounded-lg hover:bg-[#35007f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {receiptSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">¡Cobro y Factura Procesados!</h4>
                <p className="text-xs text-[#c4c9ac]">Acceso y membresía regularizados de inmediato.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateReceipt} className="space-y-4 text-xs font-body">
                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Identificador de Socio o Nombre</label>
                  <input
                    type="text"
                    required
                    value={receiptMemberId}
                    onChange={(e) => setReceiptMemberId(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:border-[#c3f400] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Monto a Facturar (MXN)</label>
                  <input
                    type="number"
                    required
                    value={receiptAmount}
                    onChange={(e) => setReceiptAmount(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:border-[#c3f400] outline-none text-base font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">Método de Pago</label>
                  <select
                    value={receiptMethod}
                    onChange={(e) => setReceiptMethod(e.target.value)}
                    className="w-full bg-[#140039] border border-[#35007f] rounded-2xl p-3 text-white focus:border-[#c3f400] outline-none"
                  >
                    <option value="Tarjeta de Débito / Terminal">Tarjeta de Débito / Terminal</option>
                    <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                    <option value="Transferencia SPEI">Transferencia SPEI</option>
                    <option value="Efectivo en Recepción">Efectivo en Recepción</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(false)}
                    className="px-5 py-2.5 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)] hover:bg-[#abd600] active:scale-95 transition-all"
                  >
                    Emitir y Desbloquear
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Centro de Base de Datos Cloud Firestore */}
      <CloudMigrationModal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        user={user}
        onLogin={handleGoogleLogin}
        onMigrationComplete={() => {
          setHasFirestoreData(true);
        }}
        isCloudConnected={isCloudConnected}
      />

      {/* Floating System Notification Toast */}
      {cloudNotification && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#24005b] border border-[#c3f400] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#c3f400] shrink-0" />
          <p className="text-xs font-semibold">{cloudNotification}</p>
        </div>
      )}
    </div>
  );
}
