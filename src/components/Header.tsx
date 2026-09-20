import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Smartphone, 
  Monitor, 
  UserPlus, 
  Receipt, 
  AlertCircle,
  CheckCircle2,
  X,
  Cloud,
  RefreshCw,
  LogIn,
  LogOut,
  Database
} from 'lucide-react';
import { User } from 'firebase/auth';
import { SystemAlert } from '../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  isMobileExecutivePreview: boolean;
  onToggleMobilePreview: () => void;
  onQuickNewMember: () => void;
  onQuickInvoice: () => void;
  alerts: SystemAlert[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenMigrationModal?: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  isMobileExecutivePreview,
  onToggleMobilePreview,
  onQuickNewMember,
  onQuickInvoice,
  alerts,
  searchQuery,
  onSearchChange,
  user,
  onLogin,
  onLogout,
  onOpenMigrationModal,
  isSyncing = false,
}) => {
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full min-h-[4.75rem] py-2.5 px-4 md:px-8 bg-[#1a0046]/95 backdrop-blur-xl border-b border-[#35007f]/50 shadow-md flex items-center justify-between gap-3">
      {/* Left section: Hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-full bg-[#290065] text-[#eaddff] hover:bg-[#35007f] transition-colors shrink-0"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 min-w-[140px] max-w-xs md:max-w-sm lg:max-w-md">
          <div className="flex items-center bg-[#290065] rounded-full px-3.5 py-1.5 border border-[#35007f]/60 focus-within:border-[#c3f400] transition-colors">
            <Search className="w-4 h-4 text-[#c4c9ac] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar socio, ID o terminal..."
              className="bg-transparent border-none text-[#eaddff] placeholder-[#c4c9ac]/70 focus:outline-none w-full text-xs sm:text-sm font-body"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="text-[#c4c9ac] hover:text-[#eaddff] ml-1 p-0.5"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Cloud Firestore Status & Migration Trigger Button */}
        <button
          onClick={onOpenMigrationModal}
          title="Gestión de Datos y Sincronización en la Nube (Firebase Firestore)"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            user
              ? 'bg-[#290065] border-[#c3f400]/40 text-[#c3f400] hover:bg-[#35007f]'
              : 'bg-[#290065] border-[#ffb4ab]/40 text-[#ffb4ab] hover:bg-[#35007f]'
          }`}
        >
          {isSyncing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c3f400]" />
          ) : (
            <Cloud className={`w-3.5 h-3.5 ${user ? 'text-[#c3f400]' : 'text-[#ffb4ab]'}`} />
          )}
          <span className="hidden xl:inline">
            {user ? 'Firestore: Conectado' : 'Nube: Sin Sesión'}
          </span>
          <span className="text-[10px] bg-[#140039] px-2 py-0.5 rounded-full text-white font-mono">
            Migrar
          </span>
        </button>

        {/* Device Mode Toggle Button (Mobile Ejecutivo simulator) */}
        <button
          onClick={onToggleMobilePreview}
          title="Alternar entre Desktop y Vista Móvil Ejecutiva"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isMobileExecutivePreview
              ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)]'
              : 'bg-[#290065] text-[#eaddff] hover:bg-[#35007f] border border-[#35007f]'
          }`}
        >
          {isMobileExecutivePreview ? (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Móvil</span>
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#c4c9ac]" />
              <span className="hidden sm:inline">Desktop</span>
            </>
          )}
        </button>

        {/* Quick action: Facturar / Comprobante */}
        <button
          onClick={onQuickInvoice}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#290065] hover:bg-[#35007f] text-[#eaddff] text-xs font-medium border border-[#35007f] transition-colors"
        >
          <Receipt className="w-3.5 h-3.5 text-[#c3f400]" />
          <span>Facturar</span>
        </button>

        {/* Quick action: Nuevo Socio */}
        <button
          onClick={onQuickNewMember}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold transition-all shadow-[0_0_15px_rgba(195,244,0,0.25)]"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Nuevo Socio</span>
        </button>

        {/* Alerts Bell & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#290065] hover:bg-[#35007f] text-[#eaddff] flex items-center justify-center transition-colors border border-[#35007f]"
            aria-label="Alertas del sistema"
          >
            <Bell className="w-4 h-4 text-[#eaddff]" />
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ffb4ab] rounded-full ring-2 ring-[#290065] animate-pulse" />
            )}
          </button>

          {/* Alerts Popover */}
          {showAlertsDropdown && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#290065] border border-[#35007f] rounded-3xl p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#35007f]">
                <div className="flex items-center gap-2">
                  <span className="font-headline text-sm text-white">Alertas Críticas</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffb4ab] text-[#690005] text-xs font-bold shadow-[0_0_10px_rgba(255,180,171,0.4)]">
                    {alerts.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAlertsDropdown(false)}
                  className="text-[#c4c9ac] hover:text-white text-xs font-medium"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {alerts.map((alt) => (
                  <div 
                    key={alt.id}
                    className="p-3.5 rounded-2xl bg-[#35007f] border border-[#42009b] border-l-4 border-l-[#ffb4ab] flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-[#ffb4ab] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">{alt.title}</p>
                      <p className="text-[11px] text-[#eaddff] mt-0.5 leading-relaxed">{alt.description}</p>
                      <span className="text-[10px] text-[#c4c9ac] mt-1 block font-medium">{alt.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Avatar Header Badge or Google Login */}
        <div className="relative pl-1.5 sm:pl-2.5 border-l border-[#444933]/60">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 text-left focus:outline-none"
              >
                <div className="text-right hidden lg:block">
                  <p className="font-body text-xs font-medium text-white truncate max-w-[120px]">
                    {user.displayName || 'Admin'}
                  </p>
                  <p className="font-body text-[10px] text-[#c3f400] truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#c3f400] object-cover shadow-[0_0_12px_rgba(195,244,0,0.3)]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#c3f400] text-[#1a0046] font-bold text-xs shadow-[0_0_12px_rgba(195,244,0,0.3)]">
                    <span>{user.email ? user.email.slice(0, 2).toUpperCase() : 'AD'}</span>
                  </div>
                )}
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 top-14 w-64 bg-[#290065] border border-[#35007f] rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-3 border-b border-[#35007f]">
                    <p className="text-xs font-bold text-white truncate">{user.displayName || 'Administrador'}</p>
                    <p className="text-[11px] text-[#c4c9ac] truncate mt-0.5">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-mono">
                      Firebase: us-east1
                    </span>
                  </div>
                  <div className="pt-3 space-y-2">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenMigrationModal?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#35007f] hover:bg-[#42009b] text-white text-xs transition-colors"
                    >
                      <Database className="w-3.5 h-3.5 text-[#c3f400]" />
                      <span>Sincronizar Firestore</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#690005]/40 hover:bg-[#690005]/70 text-[#ffb4ab] text-xs transition-colors border border-[#ffb4ab]/20"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] font-bold text-xs transition-all shadow-[0_0_15px_rgba(195,244,0,0.3)] shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
