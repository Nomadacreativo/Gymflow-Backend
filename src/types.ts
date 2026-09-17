export type NavigationTab = 
  | 'dashboard'
  | 'ventas'
  | 'miembros'
  | 'suscripciones'
  | 'accesos'
  | 'terminales'
  | 'instructores';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'Titanio Pro' | 'Carbono Élite' | 'Base Neón' | 'Trimestral Héroe';
  renewalDate: string;
  bioStatus: 'Registrada' | 'Pendiente';
  lastAccess: string;
  location: string;
  status: 'Activo' | 'Suspendido' | 'Pendiente';
  phone?: string;
}

export interface AccessEvent {
  id: string;
  time: string;
  memberName: string;
  memberId: string;
  avatar?: string;
  terminal: string;
  status: 'APROBADO' | 'RECHAZADO' | 'VERIFICANDO';
  detail: string;
  isNew?: boolean;
}

export interface TerminalDevice {
  id: string;
  name: string;
  model: 'SpeedFace-V5L' | 'ProFace-X';
  zone: string;
  ip: string;
  port: number;
  status: 'En línea' | 'Fuera de línea' | 'Sincronizando';
  lastPingMs: number;
  hmacKey: string;
  capacity: string;
  activeUsers: number;
}

export interface PlanItem {
  id: string;
  name: string;
  tag: string;
  isPopular?: boolean;
  price: number;
  period: string;
  intervalDescription: string;
  discountNote?: string;
  benefits: string[];
  excludedBenefits: string[];
  activeMembers: number;
}

export interface InstructorSession {
  time: string;
  timeSub: string;
  clientName: string;
  protocol: string;
  phase: string;
  completed: boolean;
}

export interface CoachAdherence {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  weekProgress: string;
  adherenceRate: number;
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  activeClasses: number;
  attendanceRate: string;
  bioEnrolled: boolean;
  terminalsCount: number;
  schedule: string[];
  email: string;
  phone?: string;
  avatar?: string;
}

export interface ExerciseMovement {
  id: string;
  code: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  targetWeight: string;
}

export interface SystemAlert {
  id: string;
  type: 'payment' | 'edge' | 'inventory';
  title: string;
  description: string;
  actionText?: string;
  severity: 'error' | 'warning' | 'info';
  timestamp: string;
}
