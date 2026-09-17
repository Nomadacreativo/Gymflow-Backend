import { Member, AccessEvent, TerminalDevice, PlanItem, InstructorSession, CoachAdherence, ExerciseMovement, SystemAlert, Instructor } from '../types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: '#9042',
    name: 'Marcus Vance',
    email: 'm.vance@neon.sys',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5AVCrmrY8QJVl8HKDcXEIhB8fyu62Hv2yRoyYnU_pcPh2ZW3NOkkM9lf0oWMs4T2PLIZ3QazqUmqfD79VRETeyGN0HtrL4WbdNid65e50h70ilkCq1b9TUrA0mP_f7vT8X6pQuoyOIMy_rRk2mZredcZJ-3TDz2GG5y8_cYB7hmRgmMFav5Wb5U4KLJQx_cYF1SfWalVi0m9eWFGJ8obBU-n80hlhVM6NZIkccQ6vZJ92szBjBbM',
    plan: 'Titanio Pro',
    renewalDate: '14 Nov 2024',
    bioStatus: 'Registrada',
    lastAccess: 'Hoy, 06:42 AM',
    location: 'Sede Centro',
    status: 'Activo',
    phone: '+52 55 4912 8821'
  },
  {
    id: '#9105',
    name: 'Sarah Kinsley',
    email: 's.kinsley@void.net',
    plan: 'Carbono Élite',
    renewalDate: 'Vence en 2 días',
    bioStatus: 'Pendiente',
    lastAccess: 'Ayer, 18:30 PM',
    location: 'Sede Norte',
    status: 'Activo',
    phone: '+52 55 3189 7720'
  },
  {
    id: '#8821',
    name: 'Elena Rostova',
    email: 'elena.r@cybernet.io',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAAx41NF2zRu6AY3l_Py9gUjCHnPyFy558iGUnLq3WsLl3021duTqpf2xQIRbPy1PwBSLSaDC4wJUDRVKUCkAnyFxuuZ82Y6t-S__NIL25Y5s_i1wqLM6K89Q2Ehk5e1rWnHnNJjctNO0iz4Y3oV6z-_jWRlomfmi072J3vgTaldjriRmvu1FMObP2K5kVn7SS73YsXJjc6Rd2M6Pk5GoI7Rp6CvvIYitmLvXh9YcC9TWlcK-eHYk',
    plan: 'Base Neón',
    renewalDate: 'Vencido: 01 Oct 2024',
    bioStatus: 'Registrada',
    lastAccess: '28 Sep 2024',
    location: 'Acceso Denegado',
    status: 'Suspendido',
    phone: '+52 55 9811 0244'
  },
  {
    id: '#9244',
    name: 'Alex Mercer',
    email: 'a.mercer@apex.mx',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAycHRB54cwMOoXmElZWol6ZZkcvLkWbE1Y10_4dPnGuFvKjvuiTBCns6H4-5si2kXwTUsxS1iTeSkgYZ7XGyfYYRngiD7Mn_eavdvFt6IRkwyHCOkCDH0jOUsFuSne5lp7bpeDT22HrHcBUF8545gjq8T9LAB2KFmuS17kbmG2eX9e18BPHM_xwqPNm3H3gjcc_ML-vunw_TiIU3fv1D7nL-EJlzcMrPZ-iW1wuMM3PXiVn_ggFH8',
    plan: 'Titanio Pro',
    renewalDate: '28 Dic 2024',
    bioStatus: 'Registrada',
    lastAccess: 'Hoy, 14:22 PM',
    location: 'Main Gate - A1',
    status: 'Activo',
    phone: '+52 55 1204 8831'
  },
  {
    id: '#1104',
    name: 'Sarah Connor',
    email: 'sconnor@resistance.net',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkXg4H_FF0IdBR8XY9rNUtxvKVh1RtdqywxGBD5UEjdtGRSfY0v3q5HPB78KQwlRYfTcTwRgkpP0TXgPq_6abbgbj7CsdOCNlREBE8Y2060KXWuHpxBlJSAgQMBUfKxF0D3uFwT100noBhchxtAjYEddFzHd7AcKBVeNZHXpJ5-XepMNqfvdHttuWGe3xi8QYCTO0IyfzYDzeXCqklX5IZUsLKGZy9zAeJ0ndS30GiaUjfbOlDc48',
    plan: 'Base Neón',
    renewalDate: '15 Nov 2024',
    bioStatus: 'Registrada',
    lastAccess: 'Hoy, 14:18 PM',
    location: 'VIP Lounge (Rechazado)',
    status: 'Activo',
    phone: '+52 55 8899 1234'
  },
  {
    id: '#2019',
    name: 'Elena Rodriguez',
    email: 'elena.rdz@biogym.mx',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37jeb8r8d4XtPMhSfssgVcAYntSjM-dqfDvoI701MDD9-W3S56h3TEwT9lMf9BHVKSHuxNyLHnjc_BOtA_IlXYve_Sf1K7hdU_rf30_SzMSAR1M2yCFng5np_0gx1VJ5Eb3L1JZnxHogJ1gAUNvSA8Q6Nj9W77TJsmX07d76ZrK4tz6OIysr20UNh4A0qZqfFfZ809aBzBG7LgIcELJRvABqvWy23Hz2I0wHOO9k5X_IAYM-uH_Q',
    plan: 'Base Neón',
    renewalDate: '02 Feb 2025',
    bioStatus: 'Registrada',
    lastAccess: 'Hoy, 14:02 PM',
    location: 'Main Gate - B2',
    status: 'Activo',
    phone: '+52 55 6701 4452'
  },
  {
    id: '#9842',
    name: 'Goro Majima',
    email: 'majima.goro@madfitness.jp',
    plan: 'Titanio Pro',
    renewalDate: '24 Oct 2025',
    bioStatus: 'Registrada',
    lastAccess: 'Hoy, 10:45 AM',
    location: 'Sede Centro',
    status: 'Activo',
    phone: '+52 55 9012 3341'
  }
];

export const INITIAL_ACCESS_LOGS: AccessEvent[] = [
  {
    id: 'ev-1',
    time: '14:22:05',
    memberName: 'Alex Mercer',
    memberId: 'ID: GYM-0921',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAycHRB54cwMOoXmElZWol6ZZkcvLkWbE1Y10_4dPnGuFvKjvuiTBCns6H4-5si2kXwTUsxS1iTeSkgYZ7XGyfYYRngiD7Mn_eavdvFt6IRkwyHCOkCDH0jOUsFuSne5lp7bpeDT22HrHcBUF8545gjq8T9LAB2KFmuS17kbmG2eX9e18BPHM_xwqPNm3H3gjcc_ML-vunw_TiIU3fv1D7nL-EJlzcMrPZ-iW1wuMM3PXiVn_ggFH8',
    terminal: 'Main Gate - A1',
    status: 'APROBADO',
    detail: 'Membresía Activa (PRO)'
  },
  {
    id: 'ev-2',
    time: '14:18:42',
    memberName: 'Sarah Connor',
    memberId: 'ID: GYM-1104',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkXg4H_FF0IdBR8XY9rNUtxvKVh1RtdqywxGBD5UEjdtGRSfY0v3q5HPB78KQwlRYfTcTwRgkpP0TXgPq_6abbgbj7CsdOCNlREBE8Y2060KXWuHpxBlJSAgQMBUfKxF0D3uFwT100noBhchxtAjYEddFzHd7AcKBVeNZHXpJ5-XepMNqfvdHttuWGe3xi8QYCTO0IyfzYDzeXCqklX5IZUsLKGZy9zAeJ0ndS30GiaUjfbOlDc48',
    terminal: 'VIP Lounge',
    status: 'RECHAZADO',
    detail: 'Acceso Restringido (Nivel Básico)'
  },
  {
    id: 'ev-3',
    time: '14:15:09',
    memberName: 'John Doe',
    memberId: 'ID: GYM-0882',
    terminal: 'Locker Room Men',
    status: 'VERIFICANDO',
    detail: 'Sincronizando biometría...'
  },
  {
    id: 'ev-4',
    time: '14:02:55',
    memberName: 'Elena Rodriguez',
    memberId: 'ID: GYM-2019',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37jeb8r8d4XtPMhSfssgVcAYntSjM-dqfDvoI701MDD9-W3S56h3TEwT9lMf9BHVKSHuxNyLHnjc_BOtA_IlXYve_Sf1K7hdU_rf30_SzMSAR1M2yCFng5np_0gx1VJ5Eb3L1JZnxHogJ1gAUNvSA8Q6Nj9W77TJsmX07d76ZrK4tz6OIysr20UNh4A0qZqfFfZ809aBzBG7LgIcELJRvABqvWy23Hz2I0wHOO9k5X_IAYM-uH_Q',
    terminal: 'Main Gate - B2',
    status: 'APROBADO',
    detail: 'Membresía Activa (Básica)'
  },
  {
    id: 'ev-5',
    time: '13:55:10',
    memberName: 'Carlos Mendoza',
    memberId: 'ID: GYM-8492',
    terminal: 'Acceso VIP',
    status: 'RECHAZADO',
    detail: 'Pago pendiente por $120 MXN'
  },
  {
    id: 'ev-6',
    time: '13:48:32',
    memberName: 'Diego Valenzuela',
    memberId: 'ID: GYM-7731',
    terminal: 'Main Gate - A1',
    status: 'APROBADO',
    detail: 'Membresía Activa (Titanio)'
  }
];

export const INITIAL_TERMINALS: TerminalDevice[] = [
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
    activeUsers: 4120
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
    activeUsers: 4120
  },
  {
    id: 'term-3',
    name: 'Acceso VIP & Recovery',
    model: 'ProFace-X',
    zone: 'VIP Lounge',
    ip: '192.168.1.103',
    port: 4370,
    status: 'Fuera de línea',
    lastPingMs: 0,
    hmacKey: 'hmac_sha256_f09312bba1',
    capacity: '50,000 rostros',
    activeUsers: 840
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
    activeUsers: 2410
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
    activeUsers: 1879
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
    activeUsers: 45
  }
];

export const PLANS_CATALOG: PlanItem[] = [
  {
    id: 'plan-mensual',
    name: 'Mensual',
    tag: 'BÁSICO',
    price: 899,
    period: '/mes',
    intervalDescription: 'Facturación cada 30 días',
    benefits: [
      'Acceso general (6am - 10pm)',
      'Uso de vestuarios estándar',
      'Acceso a zona de peso libre y cardio',
      'App Gymflow de seguimiento'
    ],
    excludedBenefits: [
      'Clases grupales limitadas',
      'Acceso VIP Lounge & Criocabina',
      'Entrenador personal asignado'
    ],
    activeMembers: 428
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
      '2 Clases grupales / semana',
      'Acceso a vestidores con sauna seco',
      'Enrolamiento biométrico de alta velocidad',
      'Invitación para 1 amigo al mes'
    ],
    excludedBenefits: [
      'Entrenador personal dedicado'
    ],
    activeMembers: 612
  },
  {
    id: 'plan-anual-pro',
    name: 'Titanio Pro Anual',
    tag: 'ELITE MÁXIMO',
    price: 7999,
    period: '/año',
    intervalDescription: 'Pago único anual prorrateado',
    discountNote: 'Ahorra 26%',
    benefits: [
      'Acceso ilimitado 24/7 a todas las sedes',
      'Acceso ilimitado a VIP Lounge & Criocabina',
      'Clases grupales ilimitadas (Cross, Yoga, Spinning)',
      'Sesión mensual con Head Coach para protocolo',
      'Locker privado dedicado con biometría facial'
    ],
    excludedBenefits: [],
    activeMembers: 324
  }
];

export const INSTRUCTOR_SESSIONS: InstructorSession[] = [
  {
    time: '08',
    timeSub: '00',
    clientName: 'Marcus Wright',
    protocol: 'Hipertrofia • Empuje B',
    phase: 'Semana 4',
    completed: true
  },
  {
    time: '09',
    timeSub: '30',
    clientName: 'Sarah Connor',
    protocol: 'Metcon • Fase 3',
    phase: 'Semana 2',
    completed: false
  },
  {
    time: '11',
    timeSub: '00',
    clientName: 'Goro Majima',
    protocol: 'Fuerza Máxima • Tracción A',
    phase: 'Semana 1',
    completed: false
  },
  {
    time: '16',
    timeSub: '15',
    clientName: 'Diego Valenzuela',
    protocol: 'Potencia & Acondicionamiento',
    phase: 'Semana 6',
    completed: false
  }
];

export const COACH_ADHERENCE_LIST: CoachAdherence[] = [
  {
    id: 'c-1',
    name: 'Marcus W.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXYRbcffjP51-HOIBLF3DMbabvYB73nWfoeod4-JZ4CbVN8BDAsQyXmtzdw7SlRHHkE66-QmLiOPm2KC-Pgwit1tWvoBeeZHE6RjgKpV1LQEizrxsJTeM67zINZtS-5KlbP5oBjO0i84eU37Ai_WB2ahffUdkOhf1CaPn9sZw0OGng_Vh9ifmVEEBlnVIOj3q0fF6LQw6qpmNCLm_FfjmiLuLGBzisPkB3lhod5lX9Cn4faaqkWlQ',
    weekProgress: 'Semana 4/12',
    adherenceRate: 92
  },
  {
    id: 'c-2',
    name: 'Sarah C.',
    initials: 'SC',
    weekProgress: 'Semana 2/8',
    adherenceRate: 78
  },
  {
    id: 'c-3',
    name: 'John B.',
    initials: 'JB',
    weekProgress: 'Semana 1/4',
    adherenceRate: 45
  },
  {
    id: 'c-4',
    name: 'Elena R.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37jeb8r8d4XtPMhSfssgVcAYntSjM-dqfDvoI701MDD9-W3S56h3TEwT9lMf9BHVKSHuxNyLHnjc_BOtA_IlXYve_Sf1K7hdU_rf30_SzMSAR1M2yCFng5np_0gx1VJ5Eb3L1JZnxHogJ1gAUNvSA8Q6Nj9W77TJsmX07d76ZrK4tz6OIysr20UNh4A0qZqfFfZ809aBzBG7LgIcELJRvABqvWy23Hz2I0wHOO9k5X_IAYM-uH_Q',
    weekProgress: 'Semana 8/12',
    adherenceRate: 88
  }
];

export const INITIAL_EXERCISES: ExerciseMovement[] = [
  {
    id: 'ex-1',
    code: 'A1',
    name: 'Press Inclinado con Mancuernas',
    sets: '3',
    reps: '8-10',
    rest: '90s',
    targetWeight: '35'
  },
  {
    id: 'ex-2',
    code: 'A2',
    name: 'Aperturas en Polea Alta (Cruce)',
    sets: '4',
    reps: '12-15',
    rest: '60s',
    targetWeight: '22.5'
  },
  {
    id: 'ex-3',
    code: 'B1',
    name: 'Press Francés con Barra Z',
    sets: '3',
    reps: '10-12',
    rest: '75s',
    targetWeight: '30'
  },
  {
    id: 'ex-4',
    code: 'B2',
    name: 'Elevaciones Laterales Pesadas',
    sets: '4',
    reps: '12-15',
    rest: '45s',
    targetWeight: '14'
  }
];

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Rodrigo "Titan" Valenzuela',
    specialty: 'Crossfit & Halterofilia',
    rating: 4.9,
    activeClasses: 12,
    attendanceRate: '96%',
    bioEnrolled: true,
    terminalsCount: 12,
    schedule: ['Lun-Vie 06:00 - 10:00', 'Sab 08:00 - 12:00'],
    email: 'rodrigo.v@gymflow.com',
    phone: '+52 55 9182 3341',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXYRbcffjP51-HOIBLF3DMbabvYB73nWfoeod4-JZ4CbVN8BDAsQyXmtzdw7SlRHHkE66-QmLiOPm2KC-Pgwit1tWvoBeeZHE6RjgKpV1LQEizrxsJTeM67zINZtS-5KlbP5oBjO0i84eU37Ai_WB2ahffUdkOhf1CaPn9sZw0OGng_Vh9ifmVEEBlnVIOj3q0fF6LQw6qpmNCLm_FfjmiLuLGBzisPkB3lhod5lX9Cn4faaqkWlQ'
  },
  {
    id: 'inst-2',
    name: 'Elena Rostova',
    specialty: 'Spinning HIIT & Potencia',
    rating: 5.0,
    activeClasses: 14,
    attendanceRate: '98%',
    bioEnrolled: true,
    terminalsCount: 12,
    schedule: ['Lun-Mie-Vie 18:00 - 21:00'],
    email: 'elena.rostova@gymflow.com',
    phone: '+52 55 8920 1192',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAAx41NF2zRu6AY3l_Py9gUjCHnPyFy558iGUnLq3WsLl3021duTqpf2xQIRbPy1PwBSLSaDC4wJUDRVKUCkAnyFxuuZ82Y6t-S__NIL25Y5s_i1wqLM6K89Q2Ehk5e1rWnHnNJjctNO0iz4Y3oV6z-_jWRlomfmi072J3vgTaldjriRmvu1FMObP2K5kVn7SS73YsXJjc6Rd2M6Pk5GoI7Rp6CvvIYitmLvXh9YcC9TWlcK-eHYk'
  },
  {
    id: 'inst-3',
    name: 'Marcus Vance',
    specialty: 'Powerlifting & Biomecánica',
    rating: 4.8,
    activeClasses: 10,
    attendanceRate: '91%',
    bioEnrolled: true,
    terminalsCount: 12,
    schedule: ['Mar-Jue 07:00 - 12:00'],
    email: 'marcus.v@gymflow.com',
    phone: '+52 55 4912 8821',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5AVCrmrY8QJVl8HKDcXEIhB8fyu62Hv2yRoyYnU_pcPh2ZW3NOkkM9lf0oWMs4T2PLIZ3QazqUmqfD79VRETeyGN0HtrL4WbdNid65e50h70ilkCq1b9TUrA0mP_f7vT8X6pQuoyOIMy_rRk2mZredcZJ-3TDz2GG5y8_cYB7hmRgmMFav5Wb5U4KLJQx_cYF1SfWalVi0m9eWFGJ8obBU-n80hlhVM6NZIkccQ6vZJ92szBjBbM'
  }
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    type: 'payment',
    title: 'Pago Vencido: Socio VIP',
    description: 'Carlos Mendoza (ID: 8492) intentó acceder. Pago pendiente por $120 MXN.',
    actionText: 'RESOLVER AHORA',
    severity: 'error',
    timestamp: 'Hace 4 min'
  },
  {
    id: 'alt-2',
    type: 'edge',
    title: 'Conector Edge Caído',
    description: 'Sincronización con nube interrumpida hace 14 minutos.',
    actionText: 'REINICIAR SERVICIO',
    severity: 'error',
    timestamp: 'Hace 14 min'
  },
  {
    id: 'alt-3',
    type: 'inventory',
    title: 'Inventario Bajo: Proteína Suero',
    description: 'Inventario de cafetería al 10%. Solicitar pedido a distribuidor antes de 48h.',
    severity: 'warning',
    timestamp: 'Hoy, 09:12'
  }
];

// Aliases matching camelCase
export const initialMembers = INITIAL_MEMBERS;
export const initialPlans = PLANS_CATALOG;
export const initialTerminals = INITIAL_TERMINALS;
export const initialInstructors = INITIAL_INSTRUCTORS;
export const initialAccessEvents = INITIAL_ACCESS_LOGS;
export const initialSystemAlerts = INITIAL_ALERTS;
