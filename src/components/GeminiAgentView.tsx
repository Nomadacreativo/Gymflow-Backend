import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Calendar, 
  Users, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Clock, 
  Dumbbell, 
  ShieldAlert, 
  ArrowRight,
  Lightbulb,
  FileText
} from 'lucide-react';
import { GeminiChatMessage, Member, PlanItem, TerminalDevice, Instructor } from '../types';

interface GeminiAgentViewProps {
  members: Member[];
  plans: PlanItem[];
  terminals: TerminalDevice[];
  instructors: Instructor[];
  onNavigateToCalendar: () => void;
  onQuickScheduleEvent?: (summary: string, description: string) => void;
}

export const GeminiAgentView: React.FC<GeminiAgentViewProps> = ({
  members,
  plans,
  terminals,
  instructors,
  onNavigateToCalendar,
  onQuickScheduleEvent,
}) => {
  const [messages, setMessages] = useState<GeminiChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola! Soy tu Agente Ejecutivo de Inteligencia y Organización de Gymflow. Estoy conectado a la información de tu gimnasio para ayudarte a estructurar horarios de clases, redactar comunicaciones con socios, coordinar tu Google Calendar y optimizar el rendimiento de las operaciones. ¿En qué nos enfocamos hoy?',
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Organizar agenda semanal de clases para Google Calendar',
        'Redactar aviso para socios con biometría pendiente',
        'Sugerir estrategias para elevar el MRR',
        'Analizar estado de terminales ZKTeco'
      ]
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compute live context
  const activeMembers = members.filter(m => m.status === 'Activo').length;
  const suspendedMembers = members.filter(m => m.status === 'Suspendido').length;
  const pendingBio = members.filter(m => m.bioStatus === 'Pendiente').length;
  const onlineTerminals = terminals.filter(t => t.status === 'En línea').length;

  const gymContext = {
    totalMembers: members.length,
    activeMembers,
    suspendedMembers,
    pendingBioMembers: pendingBio,
    totalPlans: plans.length,
    terminalsCount: terminals.length,
    onlineTerminals,
    instructorsCount: instructors.length,
    instructors: instructors.map(i => ({ name: i.name, specialty: i.specialty })),
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: GeminiChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          gymContext,
          history: messages.slice(-5).map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      const modelReply: GeminiChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.text || 'Sin respuesta',
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelReply]);
    } catch (error: any) {
      console.error('Error in chat with Gemini:', error);
      const errorMsg: GeminiChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `Lo siento, ocurrió un inconveniente al consultar con el Agente Gemini: ${error.message || 'Verifica la conexión del servidor'}.`,
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleTriggerQuickAction = async (actionType: 'schedule-classes' | 'overdue-draft' | 'bio-campaign') => {
    setIsLoading(true);
    let promptTitle = '';
    if (actionType === 'schedule-classes') promptTitle = '🗓️ Propuesta de Clases para Google Calendar';
    if (actionType === 'overdue-draft') promptTitle = '📢 Plantillas de Aviso de Pago';
    if (actionType === 'bio-campaign') promptTitle = '⚡ Campaña de Enrolamiento Biométrico';

    const userMsg: GeminiChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: promptTitle,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/gemini/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, gymContext })
      });

      if (!res.ok) throw new Error('Error al ejecutar organizador');
      const data = await res.json();

      const modelReply: GeminiChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.result || 'Propuesta generada.',
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, modelReply]);
    } catch (err: any) {
      console.error('Error in quick action:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-body text-xs uppercase tracking-widest text-[#c3f400] font-bold">
              Gemini 3.8 Flash Agent
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#35007f] text-[#c3f400] text-[10px] font-mono font-bold border border-[#42009b]">
              Activo en Servidor
            </span>
          </div>
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-[#c3f400]" />
            <span>Agente Organizador Gymflow</span>
          </h1>
          <p className="font-body text-sm text-[#c4c9ac] mt-1 max-w-2xl">
            Inteligencia operativa en tiempo real para optimizar la agenda de Google Calendar, comunicación con socios y análisis estratégico del club.
          </p>
        </div>

        <button
          onClick={onNavigateToCalendar}
          className="h-11 px-5 rounded-full bg-[#290065] border border-[#c3f400]/40 text-[#c3f400] hover:bg-[#35007f] transition-all flex items-center gap-2 text-xs font-bold self-start sm:self-auto shadow-md"
        >
          <Calendar className="w-4 h-4" />
          <span>Ver Google Calendar</span>
        </button>
      </div>

      {/* Main Grid: Chat + Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Chat Container */}
        <div className="lg:col-span-3 bg-[#290065] rounded-[2.5rem] p-4 sm:p-6 border border-[#35007f]/50 shadow-xl flex flex-col h-[650px]">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[90%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                    msg.role === 'user'
                      ? 'bg-[#c3f400] text-[#161e00] border-[#abd600]'
                      : 'bg-[#35007f] text-[#c3f400] border-[#42009b]'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-3xl p-4 sm:p-5 text-xs sm:text-sm font-body leading-relaxed shadow-md relative group ${
                    msg.role === 'user'
                      ? 'bg-[#c3f400] text-[#161e00] font-medium rounded-tr-sm'
                      : 'bg-[#140039] text-[#eaddff] border border-[#35007f] rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Suggestions if any */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#35007f]/60 flex flex-wrap gap-2">
                      {msg.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(s)}
                          className="px-3 py-1.5 rounded-full bg-[#290065] hover:bg-[#35007f] text-[#c3f400] hover:text-white text-xs font-semibold transition-all border border-[#35007f]"
                        >
                          {s} →
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className={`text-[10px] ${msg.role === 'user' ? 'text-[#161e00]/70' : 'text-[#c4c9ac]/60'}`}>
                      {msg.timestamp}
                    </span>

                    {msg.role === 'model' && (
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="text-[#c4c9ac] hover:text-[#c3f400] transition-colors p-1"
                        title="Copiar texto"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-[#c3f400]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                <div className="w-9 h-9 rounded-2xl bg-[#35007f] text-[#c3f400] flex items-center justify-center shrink-0 border border-[#42009b]">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#140039] text-[#c4c9ac] p-3.5 rounded-3xl border border-[#35007f] text-xs">
                  Gemini está estructurando la mejor organización para tu gimnasio...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="mt-4 pt-3 border-t border-[#35007f]/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-[#140039] rounded-full p-1.5 pl-4 border border-[#35007f] focus-within:border-[#c3f400] transition-colors"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Pide organizar clases, redactar avisos o estructurar turnos..."
                className="bg-transparent border-none outline-none text-[#eaddff] text-xs sm:text-sm flex-1 placeholder:text-[#c4c9ac]/60"
              />
              <button
                type="submit"
                disabled={isLoading || !inputPrompt.trim()}
                className="w-10 h-10 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center hover:bg-[#abd600] disabled:opacity-40 disabled:hover:bg-[#c3f400] transition-all shrink-0 font-bold shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Operational Gym Context Panel */}
        <div className="space-y-5 flex flex-col">
          {/* Quick Actions Panel */}
          <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg">
            <h3 className="font-headline text-sm text-white flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-[#c3f400]" />
              Acciones Rápidas
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleTriggerQuickAction('schedule-classes')}
                className="w-full text-left p-3 rounded-2xl bg-[#140039] hover:bg-[#35007f] border border-[#35007f] text-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-white group-hover:text-[#c3f400] transition-colors">Programar Clases</p>
                  <p className="text-[10px] text-[#c4c9ac]">Sugerir 4 clases semanales</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c4c9ac] group-hover:text-[#c3f400] group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => handleTriggerQuickAction('overdue-draft')}
                className="w-full text-left p-3 rounded-2xl bg-[#140039] hover:bg-[#35007f] border border-[#35007f] text-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-white group-hover:text-[#c3f400] transition-colors">Avisos de Cobro</p>
                  <p className="text-[10px] text-[#c4c9ac]">Plantillas para socios con mora</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c4c9ac] group-hover:text-[#c3f400] group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => handleTriggerQuickAction('bio-campaign')}
                className="w-full text-left p-3 rounded-2xl bg-[#140039] hover:bg-[#35007f] border border-[#35007f] text-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-white group-hover:text-[#c3f400] transition-colors">Campaña Biometría</p>
                  <p className="text-[10px] text-[#c4c9ac]">Enrolamiento facial en tornos</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c4c9ac] group-hover:text-[#c3f400] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* Context Metrics Box */}
          <div className="bg-[#290065] rounded-3xl p-5 border border-[#35007f]/60 shadow-lg flex-1">
            <h3 className="font-headline text-sm text-white flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#c3f400]" />
              Contexto en Vivo
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-[#35007f]/50">
                <span className="text-[#c4c9ac]">Socios Totales:</span>
                <span className="font-headline text-white">{members.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#35007f]/50">
                <span className="text-[#c4c9ac]">Socios Activos:</span>
                <span className="font-bold text-[#c3f400]">{activeMembers}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#35007f]/50">
                <span className="text-[#c4c9ac]">Bio Pendiente:</span>
                <span className="font-bold text-[#ffb4ab]">{pendingBio}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#35007f]/50">
                <span className="text-[#c4c9ac]">Terminales Edge:</span>
                <span className="font-mono text-[#eaddff]">{onlineTerminals}/{terminals.length} OK</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#35007f]/50">
                <span className="text-[#c4c9ac]">Instructores:</span>
                <span className="font-bold text-white">{instructors.length} coaches</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-[#140039] border border-[#35007f] text-[11px] text-[#c4c9ac] leading-relaxed">
              💡 Gemini lee este estado para personalizar cualquier respuesta u horario que solicites.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
