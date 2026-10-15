import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  LogIn, 
  ArrowRight,
  ShieldCheck,
  Server,
  Users,
  CreditCard,
  Fingerprint,
  Sparkles
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initializeDefaultCatalogsInFirestore, 
  loadDemoSampleDataToFirestore 
} from '../lib/firestoreService';

interface CloudMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogin: () => void;
  onMigrationComplete: () => void;
  isCloudConnected: boolean;
}

export const CloudMigrationModal: React.FC<CloudMigrationModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onMigrationComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInitializeDefaults = async () => {
    if (!user) {
      onLogin();
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setActionMessage(null);

    try {
      await initializeDefaultCatalogsInFirestore();
      setActionMessage('¡Catálogos de Planes y Terminales ZKTeco inicializados en PostgreSQL! La base de datos está lista para nuevos registros reales.');
      onMigrationComplete();
    } catch (err: any) {
      console.error('Initialization error:', err);
      setErrorMessage(err.message || 'Error inicializando catálogos en PostgreSQL');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadDemoData = async () => {
    if (!user) {
      onLogin();
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setActionMessage(null);

    try {
      const res = await loadDemoSampleDataToFirestore();
      setActionMessage(`¡Se cargaron ${res.membersCount} socios y ${res.instructorsCount} coaches de prueba en PostgreSQL para evaluación!`);
      onMigrationComplete();
    } catch (err: any) {
      console.error('Demo data error:', err);
      setErrorMessage(err.message || 'Error cargando datos demo en PostgreSQL');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#24005b] border border-[#35007f] rounded-[2.5rem] p-6 md:p-8 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-200 text-[#eaddff]">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-[#35007f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c3f400] text-[#1a0046] flex items-center justify-center shadow-[0_0_15px_rgba(195,244,0,0.3)]">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-headline text-white tracking-tight">Centro de Datos NestJS & PostgreSQL</h3>
              <p className="text-xs text-[#c4c9ac]">Sincronización persistente y Edge Connector LAN ZKTeco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#c4c9ac] hover:text-white p-1 rounded-xl hover:bg-[#35007f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Info Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-[#140039] border border-[#35007f]/60">
            <span className="text-[10px] text-[#c4c9ac] block uppercase tracking-wider font-semibold">Backend API</span>
            <span className="text-white font-mono text-[11px] truncate block mt-0.5">NestJS Core (Puerto 3000)</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#140039] border border-[#35007f]/60">
            <span className="text-[10px] text-[#c4c9ac] block uppercase tracking-wider font-semibold">Base de Datos</span>
            <span className="text-[#c3f400] font-mono text-[11px] block mt-0.5">PostgreSQL (Local / Cloud)</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#140039] border border-[#35007f]/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#c4c9ac] block uppercase tracking-wider font-semibold">Edge LAN ZKTeco</span>
            <span className="text-[#00E676] font-bold text-[11px] flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              Sincronizado
            </span>
          </div>
        </div>

        {/* Auth Banner */}
        {!user ? (
          <div className="mt-4 p-4 rounded-2xl bg-[#140039] border border-[#ffb4ab]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#ffb4ab]" />
              <div>
                <p className="text-xs font-bold text-white">Requiere Autenticación Google</p>
                <p className="text-[11px] text-[#c4c9ac]">Inicia sesión con tu cuenta de administrador para sincronizar.</p>
              </div>
            </div>
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold transition-all shadow-[0_0_12px_rgba(195,244,0,0.3)] shrink-0"
            >
              Iniciar Sesión
            </button>
          </div>
        ) : (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#140039] border border-[#c3f400]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#c3f400] text-[#1a0046] flex items-center justify-center font-bold text-xs shadow-sm">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sesión Activa con Google Workspace</p>
                <p className="text-[11px] text-[#c4c9ac] font-mono">{user.email}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-bold">
              Autenticado
            </span>
          </div>
        )}

        {/* Notifications */}
        {actionMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-[#140039] border border-[#c3f400] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#c3f400] shrink-0 mt-0.5" />
            <p className="text-xs text-white leading-relaxed">{actionMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-[#690005]/40 border border-[#ffb4ab]/40 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ffb4ab] shrink-0 mt-0.5" />
            <p className="text-xs text-[#ffb4ab] leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Action description */}
        <div className="mt-5 p-4 rounded-2xl bg-[#140039]/60 border border-[#35007f]/50 space-y-2 text-xs">
          <p className="font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-[#c3f400]" />
            Configuración para Producción
          </p>
          <p className="text-[#c4c9ac] leading-relaxed">
            Por defecto, el padrón de socios inicia limpio para que puedas realizar tus registros reales. Puedes inicializar los planes y terminales base en PostgreSQL, o cargar datos demo de muestra para pruebas.
          </p>
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={handleLoadDemoData}
            disabled={isProcessing || !user}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] font-medium text-xs border border-[#35007f] disabled:opacity-40 transition-all"
          >
            Cargar Datos Demo (Pruebas)
          </button>
          <button
            onClick={handleInitializeDefaults}
            disabled={isProcessing || !user}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] font-bold text-xs shadow-[0_0_15px_rgba(195,244,0,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isProcessing && <RefreshCw className="w-4 h-4 animate-spin" />}
            <span>Inicializar Catálogos Base</span>
          </button>
        </div>
      </div>
    </div>
  );
};
