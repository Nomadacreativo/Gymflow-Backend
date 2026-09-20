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
  Fingerprint
} from 'lucide-react';
import { User } from 'firebase/auth';
import { migrateMockDataToFirestore, MigrationSummary } from '../lib/firestoreService';

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
  isCloudConnected
}) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [migrationSummary, setMigrationSummary] = useState<MigrationSummary | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartMigration = async () => {
    if (!user) {
      onLogin();
      return;
    }

    setIsMigrating(true);
    setMigrationError(null);
    setMigrationSummary(null);

    try {
      const summary = await migrateMockDataToFirestore((step, percent) => {
        setCurrentStep(step);
        setProgressPercent(percent);
      });

      setMigrationSummary(summary);
      onMigrationComplete();
    } catch (err) {
      console.error('Migration failed:', err);
      setMigrationError(err instanceof Error ? err.message : 'Error inesperado durante la migración a Firestore');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#24005b] border border-[#35007f] rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-200 text-[#eaddff]">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-[#35007f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c3f400] text-[#1a0046] flex items-center justify-center shadow-[0_0_15px_rgba(195,244,0,0.3)]">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-headline text-white tracking-tight">Centro de Migración Cloud Firestore</h3>
              <p className="text-xs text-[#c4c9ac]">Sincronización de base de datos en tiempo real (Google Cloud / us-east1)</p>
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
            <span className="text-[10px] text-[#c4c9ac] block uppercase tracking-wider font-semibold">Proyecto GCP</span>
            <span className="text-white font-mono text-[11px] truncate block mt-0.5">gen-lang-client-0329551847</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#140039] border border-[#35007f]/60">
            <span className="text-[10px] text-[#c4c9ac] block uppercase tracking-wider font-semibold">Región Firestore</span>
            <span className="text-[#c3f400] font-mono text-[11px] block mt-0.5">us-east1 (Multi-AZ)</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#140039] border border-[#35007f]/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#c4c9ac] block uppercase tracking-wider font-semibold">Estado DB</span>
            <span className="text-[#c3f400] font-bold text-[11px] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
              {isCloudConnected ? 'Conectado y Listo' : 'Esperando Conexión'}
            </span>
          </div>
        </div>

        {/* Authentication Notice if not logged in */}
        {!user ? (
          <div className="mt-5 p-4 rounded-2xl bg-[#35007f]/50 border border-[#c3f400]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#c3f400] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Reglas de Seguridad Activas</h4>
                <p className="text-xs text-[#c4c9ac] mt-0.5">
                  Firestore requiere un token de administrador verificado para escribir datos en la nube. Conecta tu cuenta para autorizar la migración.
                </p>
              </div>
            </div>
            <button
              onClick={onLogin}
              className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-full bg-[#c3f400] text-[#161e00] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#abd600] transition-all shadow-[0_0_12px_rgba(195,244,0,0.3)]"
            >
              <LogIn className="w-4 h-4" />
              <span>Acceder con Google</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-2xl bg-[#140039] border border-[#c3f400]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#c3f400] text-[#1a0046] flex items-center justify-center font-bold text-xs shadow-sm">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sesión Autorizada</p>
                <p className="text-[11px] text-[#c4c9ac] font-mono">{user.email}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-bold">
              Email Verificado
            </span>
          </div>
        )}

        {/* Progress or Summary */}
        {isMigrating && (
          <div className="mt-5 p-4 rounded-2xl bg-[#140039] border border-[#35007f] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#c3f400] flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#c3f400]" />
                {currentStep}
              </span>
              <span className="font-mono text-white font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#290065] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#abd600] to-[#c3f400] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Report */}
        {migrationSummary && (
          <div className="mt-5 p-4 rounded-2xl bg-[#140039] border border-[#c3f400] space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-[#c3f400]">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">¡Migración Completada con Éxito!</h4>
            </div>
            <p className="text-xs text-[#c4c9ac]">
              Los datos maestros del gimnasio han sido migrados y sincronizados con Cloud Firestore. A partir de ahora todas las altas, bajas y accesos se almacenan en tiempo real.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-[#290065]">
                <span className="text-[10px] text-[#c4c9ac] block font-sans">Socios</span>
                <span className="text-[#c3f400] font-bold text-sm">{migrationSummary.membersCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#290065]">
                <span className="text-[10px] text-[#c4c9ac] block font-sans">Planes</span>
                <span className="text-[#c3f400] font-bold text-sm">{migrationSummary.plansCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#290065]">
                <span className="text-[10px] text-[#c4c9ac] block font-sans">Terminales</span>
                <span className="text-[#c3f400] font-bold text-sm">{migrationSummary.terminalsCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#290065]">
                <span className="text-[10px] text-[#c4c9ac] block font-sans">Instructores</span>
                <span className="text-[#c3f400] font-bold text-sm">{migrationSummary.instructorsCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#290065]">
                <span className="text-[10px] text-[#c4c9ac] block font-sans">Accesos</span>
                <span className="text-[#c3f400] font-bold text-sm">{migrationSummary.eventsCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#290065]">
                <span className="text-[10px] text-[#c4c9ac] block font-sans">Alertas</span>
                <span className="text-[#c3f400] font-bold text-sm">{migrationSummary.alertsCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {migrationError && (
          <div className="mt-4 p-4 rounded-2xl bg-[#690005]/40 border border-[#ffb4ab]/40 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ffb4ab] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-[#ffb4ab]">Error en la migración</p>
              <p className="text-[#eaddff] mt-0.5 leading-relaxed break-all">{migrationError}</p>
            </div>
          </div>
        )}

        {/* Data breakdown preview */}
        {!migrationSummary && !isMigrating && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#140039]/70 border border-[#35007f]/50 space-y-2">
            <span className="text-[10px] text-[#c4c9ac] uppercase font-bold tracking-wider block">
              Entidades listas para transferir a Firestore
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#eaddff]">
                <Users className="w-3.5 h-3.5 text-[#c3f400]" />
                <span>7 Socios Activos y Perfiles</span>
              </div>
              <div className="flex items-center gap-2 text-[#eaddff]">
                <Server className="w-3.5 h-3.5 text-[#c3f400]" />
                <span>3 Terminales ZKTeco</span>
              </div>
              <div className="flex items-center gap-2 text-[#eaddff]">
                <CreditCard className="w-3.5 h-3.5 text-[#c3f400]" />
                <span>3 Planes de Membresía</span>
              </div>
              <div className="flex items-center gap-2 text-[#eaddff]">
                <Fingerprint className="w-3.5 h-3.5 text-[#c3f400]" />
                <span>6 Logs de Auditoría Biométrica</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#35007f] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-full bg-[#35007f] hover:bg-[#42009b] text-white text-xs font-semibold transition-colors"
          >
            {migrationSummary ? 'Cerrar y Ver Datos' : 'Cancelar'}
          </button>

          {!migrationSummary && (
            <button
              onClick={handleStartMigration}
              disabled={isMigrating}
              className="px-5 py-2.5 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(195,244,0,0.3)] disabled:opacity-50"
            >
              {isMigrating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Migrando...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>{user ? 'Iniciar Migración a Firestore' : 'Conectar Google y Migrar'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
