import React from 'react';
import { NavigationTab } from '../types';
import gymflowIcon from '../assets/images/gymflow_app_icon_1788414825210.jpg';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Fingerprint, 
  Dumbbell, 
  Server,
  Calendar,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Panel Principal', icon: <LayoutDashboard className="w-5 h-5 mr-4 shrink-0" /> },
    { tab: 'miembros', label: 'Miembros', icon: <Users className="w-5 h-5 mr-4 shrink-0" /> },
    { tab: 'suscripciones', label: 'Suscripciones', icon: <CreditCard className="w-5 h-5 mr-4 shrink-0" /> },
    { tab: 'ventas', label: 'Ventas', icon: <TrendingUp className="w-5 h-5 mr-4 shrink-0" /> },
    { tab: 'accesos', label: 'Personal & Accesos', icon: <Fingerprint className="w-5 h-5 mr-4 shrink-0" /> },
    { tab: 'instructores', label: 'Instructores', icon: <Dumbbell className="w-5 h-5 mr-4 shrink-0" /> },
    { tab: 'terminales', label: 'Terminales', icon: <Server className="w-5 h-5 mr-4 shrink-0" /> },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#140039] z-50 flex flex-col pt-8 pb-8 shadow-[10px_0_30px_rgba(0,0,0,0.25)] transition-transform duration-300 border-r border-[#24005b] ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header matching screen.png */}
        <div className="px-8 mb-10 flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
          <div className="w-10 h-10 bg-[#c3f400] rounded-full flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(195,244,0,0.4)] shrink-0 overflow-hidden">
            <img 
              alt="Gymflow Logo" 
              className="w-full h-full rounded-full object-cover" 
              src={gymflowIcon}
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-headline text-2xl text-[#c3f400] tracking-tighter uppercase font-bold">
            Gymflow
          </span>
        </div>

        {/* Navigation list matching screen.png */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full flex items-center px-6 py-4 rounded-xl transition-all duration-300 text-left font-body ${
                  isActive
                    ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_20px_rgba(195,244,0,0.3)]'
                    : 'text-[#c4c9ac] hover:bg-[#35007f] hover:text-[#eaddff]'
                }`}
              >
                {item.icon}
                <span className="font-body text-sm font-medium tracking-normal">{item.label}</span>
                {item.tab === 'accesos' && !isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
                )}
                {item.tab === 'terminales' && !isActive && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#35007f] text-[#c3f400] font-mono font-medium">
                    Edge
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick status bar in sidebar */}
        <div className="px-5 py-4 mx-4 mb-4 bg-[#24005b] rounded-2xl border border-[#35007f]/50">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#eaddff] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
              Torniquetes ZKTeco
            </span>
            <span className="text-[#c3f400] font-mono font-bold text-xs">12/12 OK</span>
          </div>
          <div className="w-full h-1.5 bg-[#140039] rounded-full overflow-hidden">
            <div className="h-full bg-[#c3f400] rounded-full w-[95%] shadow-[0_0_8px_#c3f400]" />
          </div>
        </div>

        {/* User profile footer */}
        <div className="px-4 pt-3 border-t border-[#24005b]">
          <div className="flex items-center gap-3 bg-[#24005b]/60 p-3 rounded-2xl border border-[#35007f]/40">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#c3f400] text-[#1a0046] font-bold text-sm shrink-0">
              AC
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[#eaddff] truncate">Admin Core</p>
              <p className="text-[10px] text-[#c4c9ac] tracking-wide uppercase font-medium">Sede Central • Ejecutivo</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

