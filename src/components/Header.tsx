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
  X
} from 'lucide-react';
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
}) => {
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-[#1a0046]/85 backdrop-blur-xl z-40 px-4 md:px-8 flex items-center justify-between border-b border-[#35007f]/50 shadow-sm">
      {/* Left section: Hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2.5 rounded-full bg-[#290065] text-[#eaddff] hover:bg-[#35007f] transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 max-w-md">
          <div className="flex items-center bg-[#290065] rounded-full px-4 py-2 border border-[#35007f]/60 focus-within:border-[#c3f400] transition-colors">
            <Search className="w-4 h-4 text-[#c4c9ac] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar socio por ID, nombre o terminal..."
              className="bg-transparent border-none text-[#eaddff] placeholder-[#c4c9ac]/70 focus:outline-none w-full text-sm font-body"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="text-[#c4c9ac] hover:text-[#eaddff] ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Status Pill: Conector Edge */}
        <div className="hidden xl:flex items-center bg-[#290065] border border-[#35007f] text-[#c3f400] px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#c3f400] mr-2 animate-pulse shadow-[0_0_8px_#c3f400]" />
          Edge: Online
        </div>

        {/* Device Mode Toggle Button (Mobile Ejecutivo simulator) */}
        <button
          onClick={onToggleMobilePreview}
          title="Alternar entre Desktop y Vista Móvil Ejecutiva"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
            isMobileExecutivePreview
              ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)]'
              : 'bg-[#290065] text-[#eaddff] hover:bg-[#35007f] border border-[#35007f]'
          }`}
        >
          {isMobileExecutivePreview ? (
            <>
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Móvil</span>
            </>
          ) : (
            <>
              <Monitor className="w-4 h-4 text-[#c4c9ac]" />
              <span className="hidden sm:inline">Desktop</span>
            </>
          )}
        </button>

        {/* Quick action: Facturar / Comprobante */}
        <button
          onClick={onQuickInvoice}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#290065] hover:bg-[#35007f] text-[#eaddff] text-xs font-medium border border-[#35007f] transition-colors"
        >
          <Receipt className="w-3.5 h-3.5 text-[#c3f400]" />
          <span>Facturar</span>
        </button>

        {/* Quick action: Nuevo Socio */}
        <button
          onClick={onQuickNewMember}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold transition-all shadow-[0_0_15px_rgba(195,244,0,0.25)]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Socio</span>
        </button>

        {/* Alerts Bell & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative w-10 h-10 rounded-full bg-[#290065] hover:bg-[#35007f] text-[#eaddff] flex items-center justify-center transition-colors border border-[#35007f]"
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

        {/* User Mini Avatar Header Badge matching screenshot */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#444933]/60">
          <div className="text-right hidden sm:block">
            <p className="font-body text-sm font-medium text-[#eaddff] leading-none">Admin Core</p>
            <p className="font-body text-xs text-[#c4c9ac] mt-0.5">Sede Central</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#c3f400] text-[#161e00] font-bold shadow-[0_0_12px_rgba(195,244,0,0.3)]">
            <span className="text-sm font-bold text-[#1a0046]">AC</span>
          </div>
        </div>
      </div>
    </header>
  );
};
