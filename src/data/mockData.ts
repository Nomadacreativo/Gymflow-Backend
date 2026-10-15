import { Member, AccessEvent, TerminalDevice, PlanItem, InstructorSession, CoachAdherence, ExerciseMovement, SystemAlert, Instructor } from '../types';

// ==========================================
// DEFAULT SYSTEM CATALOGS & READY-FOR-PRODUCTION DATA
// New installations start with empty directories for real registrations.
// ==========================================

export const DEFAULT_MEMBERS: Member[] = [];

export const DEFAULT_ACCESS_LOGS: AccessEvent[] = [];

export const DEFAULT_INSTRUCTORS: Instructor[] = [];

export const DEFAULT_ALERTS: SystemAlert[] = [];

export const DEFAULT_TERMINALS: TerminalDevice[] = [
  {
    id: 'term-1',
    name: 'Torno Principal A',
    model: 'SpeedFace-V5L',
    zone: 'Entrada Frontal',
    ip: '192.168.1.101',
    port: 4370,
    status: 'En línea',
    lastPingMs: 14,
    hmacKey: 'hmac_sha256_99a8bc43e7',
    capacity: '10,000 rostros',
    activeUsers: 0
  },
  {
    id: 'term-2',
    name: 'Torno Principal B',
    model: 'SpeedFace-V5L',
    zone: 'Entrada Frontal',
    ip: '192.168.1.102',
    port: 4370,
    status: 'En línea',
    lastPingMs: 12,
    hmacKey: 'hmac_sha256_b77d2918fc',
    capacity: '10,000 rostros',
    activeUsers: 0
  },
  {
    id: 'term-3',
    name: 'Acceso VIP & Recovery',
    model: 'ProFace-X',
    zone: 'VIP Lounge',
    ip: '192.168.1.103',
    port: 4370,
    status: 'En línea',
    lastPingMs: 16,
    hmacKey: 'hmac_sha256_f09312bba1',
    capacity: '50,000 rostros',
    activeUsers: 0
  },
  {
    id: 'term-4',
    name: 'Locker Room Caballeros',
    model: 'SpeedFace-V5L',
    zone: 'Vestidores Hombres',
    ip: '192.168.1.104',
    port: 4370,
    status: 'En línea',
    lastPingMs: 18,
    hmacKey: 'hmac_sha256_77c28b43aa',
    capacity: '10,000 rostros',
    activeUsers: 0
  },
  {
    id: 'term-5',
    name: 'Locker Room Damas',
    model: 'SpeedFace-V5L',
    zone: 'Vestidores Mujeres',
    ip: '192.168.1.105',
    port: 4370,
    status: 'En línea',
    lastPingMs: 15,
    hmacKey: 'hmac_sha256_662198acdf',
    capacity: '10,000 rostros',
    activeUsers: 0
  },
  {
    id: 'term-6',
    name: 'Puerta Staff & Backroom',
    model: 'ProFace-X',
    zone: 'Staff Only',
    ip: '192.168.1.106',
    port: 4370,
    status: 'En línea',
    lastPingMs: 9,
    hmacKey: 'hmac_sha256_1204acbb90',
    capacity: '50,000 rostros',
    activeUsers: 0
  }
];

export const DEFAULT_PLANS: PlanItem[] = [
  {
    id: 'plan-mensual',
    name: 'Mensual',
    tag: 'BÁSICO',
    price: 899,
    period: '/mes',
    intervalDescription: 'Facturación cada 30 días',
    benefits: [
      'Acceso general (6:00 - 22:00)',
      'Uso de vestuarios estándar',
      'Acceso a zona de peso libre y cardio',
      'App Gymflow de seguimiento'
    ],
    excludedBenefits: [
      'Clases grupales limitadas',
      'Acceso VIP Lounge & Criocabina',
      'Entrenador personal asignado'
    ],
    activeMembers: 0
  },
  {
    id: 'plan-trimestral',
    name: 'Trimestral',
    tag: 'POPULAR',
    isPopular: true,
    price: 2399,
    period: '/trimestre',
    intervalDescription: 'Facturación cada 90 días',
    discountNote: 'Ahorra 11%',
    benefits: [
      'Acceso 24/7 sin restricción horaria',
      '2 Clases grupales por semana',
      'Acceso a vestidores con sauna seco',
      'Enrolamiento biométrico facial de alta velocidad',
      'Invitación para 1 amigo al mes'
    ],
    excludedBenefits: [
      'Entrenador personal dedicado'
    ],
    activeMembers: 0
  },
  {
    id: 'plan-anual-pro',
    name: 'Titanio Pro Anual',
    tag: 'ELITE MÁXIMO',
    price: 7999,
    period: '/año',
    intervalDescription: 'Pago anual preferente prorrateado',
    discountNote: 'Ahorra 26%',
    benefits: [
      'Acceso ilimitado 24/7 a todas las sedes',
      'Acceso ilimitado a VIP Lounge & Criocabina',
      'Clases grupales ilimitadas (Cross, Yoga, Spinning)',
      'Sesión mensual con Head Coach para protocolo',
      'Locker privado dedicado con biometría facial'
    ],
    excludedBenefits: [],
    activeMembers: 0
  }
];

// Demo sample data retained for optional test load
export const SAMPLE_DEMO_MEMBERS: Member[] = [
  {
    id: '#9042',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@apex.mx',
    plan: 'Titanio Pro',
    renewalDate: '14 Nov 2024',
    bioStatus: 'Registrada',
    lastAccess: 'Hoy, 08:30 AM',
    location: 'Sede Centro',
    status: 'Activo',
    phone: '+52 55 4912 8821'
  },
  {
    id: '#9105',
    name: 'Valeria Sotomayor',
    email: 'valeria.soto@neon.sys',
    plan: 'Carbono Élite',
    renewalDate: 'Vence en 3 días',
    bioStatus: 'Pendiente',
    lastAccess: 'Ayer, 18:30 PM',
    location: 'Sede Norte',
    status: 'Activo',
    phone: '+52 55 3189 7720'
  },
  {
    id: '#8821',
    name: 'Esteban Morales',
    email: 'esteban.m@biogym.mx',
    plan: 'Base Neón',
    renewalDate: '01 Dic 2024',
    bioStatus: 'Registrada',
    lastAccess: 'Ayer, 14:20 PM',
    location: 'Main Gate - A1',
    status: 'Activo',
    phone: '+52 55 9811 0244'
  }
];

export const SAMPLE_DEMO_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Rodrigo "Titan" Valenzuela',
    specialty: 'Crossfit & Halterofilia',
    rating: 4.9,
    activeClasses: 12,
    attendanceRate: '96%',
    bioEnrolled: true,
    terminalsCount: 6,
    schedule: ['Lun-Vie 06:00 - 10:00', 'Sab 08:00 - 12:00'],
    email: 'rodrigo.v@gymflow.com',
    phone: '+52 55 9182 3341'
  },
  {
    id: 'inst-2',
    name: 'Elena Rostova',
    specialty: 'Spinning HIIT & Potencia',
    rating: 5.0,
    activeClasses: 14,
    attendanceRate: '98%',
    bioEnrolled: true,
    terminalsCount: 6,
    schedule: ['Lun-Mie-Vie 18:00 - 21:00'],
    email: 'elena.rostova@gymflow.com',
    phone: '+52 55 8920 1192'
  }
];

// Production Defaults
export const initialMembers = DEFAULT_MEMBERS;
export const initialPlans = DEFAULT_PLANS;
export const initialTerminals = DEFAULT_TERMINALS;
export const initialInstructors = DEFAULT_INSTRUCTORS;
export const initialAccessEvents = DEFAULT_ACCESS_LOGS;
export const initialSystemAlerts = DEFAULT_ALERTS;

// Legacy export aliases
export const INITIAL_MEMBERS = initialMembers;
export const INITIAL_ACCESS_LOGS = initialAccessEvents;
export const INITIAL_TERMINALS = initialTerminals;
export const PLANS_CATALOG = initialPlans;
export const INITIAL_INSTRUCTORS = initialInstructors;
export const INITIAL_ALERTS = initialSystemAlerts;
