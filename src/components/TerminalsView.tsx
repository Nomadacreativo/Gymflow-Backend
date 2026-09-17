import React, { useState } from 'react';
import { 
  Router, 
  Plus, 
  RotateCw, 
  Cpu, 
  X,
  Info,
  Network
} from 'lucide-react';
import { TerminalDevice } from '../types';

interface TerminalsViewProps {
  terminals: TerminalDevice[];
  onAddTerminal: (newTerminal: TerminalDevice) => void;
  onRestartTerminal: (id: string) => void;
}

export const TerminalsView: React.FC<TerminalsViewProps> = ({
  terminals,
  onAddTerminal,
  onRestartTerminal,
}) => {
  const [showInitModal, setShowInitModal] = useState(false);

  // Form states for New Terminal
  const [termName, setTermName] = useState('');
  const [termZone, setTermZone] = useState('entrance');
  const [termModel, setTermModel] = useState<'ProFace-X' | 'SpeedFace-V5L'>('ProFace-X');
  const [termIp, setTermIp] = useState('192.168.1.120');
  const [termPort, setTermPort] = useState('4370');
  const [autoSync, setAutoSync] = useState(true);
  const [globalProtocols, setGlobalProtocols] = useState(true);

  // Ping test simulation
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);
  const [pingLog, setPingLog] = useState('ESPERANDO RESPUESTA...');

  const simulateTestConnection = () => {
    setIsPinging(true);
    setPingLog('ESTABLECIENDO CONEXIÓN SEGURA...');
    setPingSuccess(false);

    setTimeout(() => {
      setPingLog('ENVIANDO HANDSHAKE TLS 1.3 / HMAC...');
    }, 1000);

    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
      setPingLog('CONEXIÓN EXITOSA [LATENCIA: 12ms] • HARDWARE IDENTIFICADO');
    }, 2200);
  };

  const handleRegisterTerminal = () => {
    if (!termName.trim()) return;
    const newDevice: TerminalDevice = {
      id: `term-${Date.now()}`,
      name: termName,
      model: termModel,
      zone: termZone === 'gym_floor' ? 'Piso de Gimnasio' :
            termZone === 'vip_area' ? 'VIP & Recovery Room' :
            termZone === 'staff_only' ? 'Staff Backroom' : 'Acceso Principal',
      ip: termIp,
      port: parseInt(termPort, 10) || 4370,
      status: 'En línea',
      lastPingMs: 12,
      hmacKey: `hmac_sha256_${Math.random().toString(36).slice(2, 12)}`,
      capacity: termModel === 'ProFace-X' ? '50,000 rostros' : '10,000 rostros',
      activeUsers: 4289
    };
    onAddTerminal(newDevice);
    setShowInitModal(false);
    setTermName('');
    setPingSuccess(false);
    setPingLog('ESPERANDO RESPUESTA...');
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-body text-xs uppercase tracking-widest text-[#c3f400] font-bold block mb-1">
            Infraestructura Biométrica & Torniquetes
          </span>
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tight">
            Gestión de Terminales & Edge Gateway
          </h1>
          <p className="font-body text-sm text-[#c4c9ac] mt-1 max-w-2xl">
            Monitoreo de hardware ZKTeco (SpeedFace-V5L, ProFace-X), gestión de llaves HMAC y sincronización de accesos.
          </p>
        </div>

        <button
          onClick={() => setShowInitModal(true)}
          className="bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] text-xs font-bold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(195,244,0,0.25)] active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Inicializar Nueva Terminal</span>
        </button>
      </div>

      {/* Edge Status Banner */}
      <div className="bg-[#290065] border border-[#35007f]/60 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#35007f] flex items-center justify-center text-[#c3f400] border border-[#42009b] shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline text-base text-white">Conector Edge Gymflow v4.2.8</h2>
              <span className="px-3 py-0.5 rounded-full bg-[#c3f400]/15 border border-[#c3f400]/40 text-[#c3f400] text-[11px] font-bold font-mono">
                ENLACE ACTIVO
              </span>
            </div>
            <p className="text-xs text-[#c4c9ac] mt-0.5">
              Gateway local en host <span className="font-mono text-white font-semibold">192.168.1.1</span> • Sincronización bidireccional continua con la nube.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs flex-wrap">
          <div className="px-3.5 py-1.5 rounded-full bg-[#140039] border border-[#35007f] text-[#c4c9ac]">
            Latencia promedio: <span className="text-[#c3f400] font-mono font-bold">14ms</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-[#140039] border border-[#35007f] text-[#c4c9ac]">
            Encriptación: <span className="text-white font-mono font-semibold">HMAC-SHA256</span>
          </div>
        </div>
      </div>

      {/* Terminals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {terminals.map((term) => (
          <div
            key={term.id}
            className="bg-[#290065] rounded-3xl p-6 border border-[#35007f]/60 shadow-lg hover:border-[#c3f400]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#140039] group-hover:bg-[#35007f] group-hover:text-[#c3f400] text-[#c4c9ac] flex items-center justify-center transition-colors border border-[#35007f]">
                    <Router className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base text-white">{term.name}</h3>
                    <p className="text-xs text-[#c4c9ac] font-mono">{term.model}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 border ${
                  term.status === 'En línea'
                    ? 'bg-[#c3f400]/15 border-[#c3f400]/40 text-[#c3f400]'
                    : 'bg-[#ffb4ab]/15 border-[#ffb4ab]/40 text-[#ffb4ab]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    term.status === 'En línea' ? 'bg-[#c3f400] animate-pulse shadow-[0_0_6px_#c3f400]' : 'bg-[#ffb4ab]'
                  }`} />
                  {term.status}
                </span>
              </div>

              {/* Specs & Network */}
              <div className="space-y-2 my-4 py-3.5 border-t border-b border-[#35007f]/40 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#c4c9ac]">Ubicación:</span>
                  <span className="text-white font-semibold">{term.zone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#c4c9ac]">IP / Puerto TCP:</span>
                  <span className="text-[#eaddff] font-mono font-medium">{term.ip}:{term.port}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#c4c9ac]">Capacidad:</span>
                  <span className="text-[#c3f400] font-semibold font-mono">{term.capacity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#c4c9ac]">Llave HMAC:</span>
                  <span className="text-[11px] font-mono text-[#eaddff] bg-[#140039] px-2 py-0.5 rounded-full border border-[#35007f]">
                    {term.hmacKey.slice(0, 14)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onRestartTerminal(term.id)}
                className="flex-1 py-2.5 rounded-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] hover:text-[#c3f400] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#35007f]"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#c3f400]" />
                <span>Test Ping</span>
              </button>
              <button
                onClick={() => alert(`Sincronización forzada enviada a ${term.name} (${term.ip})`)}
                className="px-4 py-2.5 rounded-full bg-[#35007f] hover:bg-[#42009b] text-[#c3f400] border border-[#42009b] text-xs font-bold transition-colors"
              >
                Sincronizar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: INICIALIZACIÓN DE NUEVA TERMINAL */}
      {showInitModal && (
        <div className="fixed inset-0 z-50 bg-[#140039]/80 backdrop-blur-md overflow-y-auto p-4 md:p-8 flex items-center justify-center">
          <div className="max-w-4xl w-full bg-[#290065] border border-[#35007f] rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 my-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#35007f]/40">
              <div className="w-12 h-12 bg-[#35007f] border border-[#42009b] rounded-2xl flex items-center justify-center text-[#c3f400] shrink-0 font-headline text-xl">
                Z
              </div>
              <div>
                <h2 className="font-headline text-xl md:text-2xl text-white tracking-tight">
                  Inicialización de Nueva Terminal
                </h2>
                <p className="text-xs text-[#c4c9ac] mt-0.5 max-w-xl">
                  Configura el nuevo hardware de acceso biométrico para la red Gymflow.
                </p>
              </div>
              <button
                onClick={() => setShowInitModal(false)}
                className="ml-auto p-2 text-[#c4c9ac] hover:text-white bg-[#140039] hover:bg-[#35007f] rounded-full transition-colors border border-[#35007f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Info & Network */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Basic Info Card */}
                <div className="bg-[#140039] rounded-2xl p-5 md:p-6 border border-[#35007f]">
                  <div className="flex items-center gap-2 mb-4 text-[#c3f400]">
                    <Info className="w-4 h-4" />
                    <h3 className="text-sm font-bold text-white">Configuración Básica</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase tracking-wider text-[10px]">
                        NOMBRE DE LA TERMINAL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Main Entrance Alpha"
                        value={termName}
                        onChange={(e) => setTermName(e.target.value)}
                        className="w-full bg-[#290065] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#c3f400] outline-none transition-colors placeholder:text-[#c4c9ac]/50"
                      />
                    </div>

                    <div>
                      <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase tracking-wider text-[10px]">
                        ZONA / UBICACIÓN
                      </label>
                      <select
                        value={termZone}
                        onChange={(e) => setTermZone(e.target.value)}
                        className="w-full bg-[#290065] border border-[#35007f] rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#c3f400] outline-none transition-colors cursor-pointer"
                      >
                        <option value="entrance" className="bg-[#140039]">Front Desk Check-in</option>
                        <option value="gym_floor" className="bg-[#140039]">Gym Floor Main</option>
                        <option value="vip_area" className="bg-[#140039]">VIP & Recovery Room</option>
                        <option value="staff_only" className="bg-[#140039]">Staff Only Backroom</option>
                      </select>
                    </div>

                    {/* Hardware Model Radio Buttons */}
                    <div className="sm:col-span-2">
                      <label className="text-[#c4c9ac] font-semibold block mb-1.5 uppercase tracking-wider text-[10px]">
                        MODELO DE HARDWARE
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          onClick={() => setTermModel('ProFace-X')}
                          className={`cursor-pointer bg-[#290065] border-2 rounded-2xl p-3.5 flex items-center justify-between transition-all ${
                            termModel === 'ProFace-X'
                              ? 'border-[#c3f400] bg-[#c3f400]/10'
                              : 'border-[#35007f] hover:border-[#42009b]'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-white">ProFace X</p>
                            <p className="text-[11px] text-[#c4c9ac] mt-0.5">Alta velocidad, 50k rostros</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            termModel === 'ProFace-X' ? 'border-[#c3f400] bg-[#c3f400]' : 'border-[#35007f]'
                          }`}>
                            {termModel === 'ProFace-X' && <div className="w-1.5 h-1.5 rounded-full bg-[#161e00]" />}
                          </div>
                        </label>

                        <label
                          onClick={() => setTermModel('SpeedFace-V5L')}
                          className={`cursor-pointer bg-[#290065] border-2 rounded-2xl p-3.5 flex items-center justify-between transition-all ${
                            termModel === 'SpeedFace-V5L'
                              ? 'border-[#c3f400] bg-[#c3f400]/10'
                              : 'border-[#35007f] hover:border-[#42009b]'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-white">SpeedFace V5L</p>
                            <p className="text-[11px] text-[#c4c9ac] mt-0.5">Compacto, 10k rostros</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            termModel === 'SpeedFace-V5L' ? 'border-[#c3f400] bg-[#c3f400]' : 'border-[#35007f]'
                          }`}>
                            {termModel === 'SpeedFace-V5L' && <div className="w-1.5 h-1.5 rounded-full bg-[#161e00]" />}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network Configuration Card */}
                <div className="bg-[#140039] rounded-2xl p-5 md:p-6 border border-[#35007f]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[#c3f400]">
                      <Network className="w-4 h-4" />
                      <h3 className="text-sm font-bold text-white">Protocolo de Red</h3>
                    </div>
                    <div className="px-3 py-0.5 bg-[#290065] rounded-full border border-[#35007f] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        pingSuccess ? 'bg-[#c3f400] shadow-[0_0_6px_#c3f400]' : 'bg-[#c4c9ac] animate-pulse'
                      }`} />
                      <span className={`text-[10px] font-mono font-bold ${
                        pingSuccess ? 'text-[#c3f400]' : 'text-[#c4c9ac]'
                      }`}>
                        {pingSuccess ? 'LISTO / ONLINE' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end gap-3 text-xs">
                    <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                      <div>
                        <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                          IP ESTÁTICA
                        </label>
                        <input
                          type="text"
                          value={termIp}
                          onChange={(e) => setTermIp(e.target.value)}
                          className="w-full bg-[#290065] border border-[#35007f] rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#c3f400] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[#c4c9ac] font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                          PUERTO TCP
                        </label>
                        <input
                          type="number"
                          value={termPort}
                          onChange={(e) => setTermPort(e.target.value)}
                          className="w-full bg-[#290065] border border-[#35007f] rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#c3f400] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={simulateTestConnection}
                      disabled={isPinging}
                      className="h-[40px] px-5 bg-[#35007f] hover:bg-[#42009b] text-white rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 border border-[#42009b]"
                    >
                      <RotateCw className={`w-3.5 h-3.5 text-[#c3f400] ${isPinging ? 'animate-spin' : ''}`} />
                      <span>{isPinging ? 'Probando...' : 'Test Ping'}</span>
                    </button>
                  </div>

                  {/* Ping Simulation Area */}
                  <div className={`w-full py-2.5 bg-[#290065] rounded-xl mt-3 border border-[#35007f] flex items-center justify-center px-4 transition-all ${
                    pingSuccess ? 'border-[#c3f400]/40 bg-[#c3f400]/10' : ''
                  }`}>
                    <p className={`font-mono text-[11px] ${
                      pingSuccess ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac]'
                    }`}>
                      {pingLog}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Sync Settings & Actions */}
              <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
                <div className="bg-[#140039] rounded-2xl p-5 md:p-6 border border-[#35007f] flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-4">Sincronización de Datos</h3>

                    <div className="space-y-4 text-xs">
                      {/* Toggle 1 */}
                      <label className="flex items-start justify-between cursor-pointer group">
                        <div className="pr-3">
                          <h4 className="font-semibold text-white mb-0.5 group-hover:text-[#c3f400] transition-colors">
                            Sincronización Automática
                          </h4>
                          <p className="text-[11px] text-[#c4c9ac] leading-relaxed">
                            Envía nuevos socios enrolados a este dispositivo de forma inmediata.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoSync}
                          onChange={(e) => setAutoSync(e.target.checked)}
                          className="w-4 h-4 accent-[#c3f400] shrink-0 mt-0.5 cursor-pointer"
                        />
                      </label>

                      <div className="h-[1px] w-full bg-[#35007f]" />

                      {/* Toggle 2 */}
                      <label className="flex items-start justify-between cursor-pointer group">
                        <div className="pr-3">
                          <h4 className="font-semibold text-white mb-0.5 group-hover:text-[#c3f400] transition-colors">
                            Protocolos Globales
                          </h4>
                          <p className="text-[11px] text-[#c4c9ac] leading-relaxed">
                            Aplica políticas de seguridad HMAC globales de Gymflow.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={globalProtocols}
                          onChange={(e) => setGlobalProtocols(e.target.checked)}
                          className="w-4 h-4 accent-[#c3f400] shrink-0 mt-0.5 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-[#290065] border border-[#35007f] p-3 flex items-center justify-center">
                    <span className="text-[11px] text-[#c4c9ac] font-mono">
                      Estado: Hardware autenticado con HMAC-SHA256
                    </span>
                  </div>
                </div>

                {/* Final Action Buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleRegisterTerminal}
                    className="w-full bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] py-3.5 rounded-full font-bold text-xs shadow-[0_0_15px_rgba(195,244,0,0.25)] transition-all active:scale-95"
                  >
                    REGISTRAR Y ACTIVAR
                  </button>
                  <button
                    onClick={() => setShowInitModal(false)}
                    className="w-full bg-[#140039] hover:bg-[#35007f] text-[#eaddff] py-3 rounded-full text-xs font-semibold transition-colors border border-[#35007f]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
