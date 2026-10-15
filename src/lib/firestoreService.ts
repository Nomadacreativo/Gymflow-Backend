import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  query
} from 'firebase/firestore';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { db, auth } from './firebase';
import { 
  Member, 
  PlanItem, 
  TerminalDevice, 
  Instructor, 
  AccessEvent, 
  SystemAlert 
} from '../types';
import { 
  initialMembers, 
  initialPlans, 
  initialTerminals, 
  initialInstructors, 
  initialAccessEvents, 
  initialSystemAlerts,
  SAMPLE_DEMO_MEMBERS,
  SAMPLE_DEMO_INSTRUCTORS
} from '../data/mockData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Sanitizes ID for Firestore doc keys (removes # or invalid chars)
export function sanitizeDocId(id: string): string {
  return id.replace(/#/g, 'm_').replace(/[^a-zA-Z0-9_\-]/g, '_');
}

// Authentication & OAuth Token In-Memory Storage
let cachedAccessToken: string | null = null;

const googleProvider = new GoogleAuthProvider();
// Workspace Scopes for Google Calendar
googleProvider.addScope('https://www.googleapis.com/auth/calendar');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');

export async function loginWithGoogle(): Promise<{ user: User; accessToken: string | null }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (err) {
    console.error('Error during Google Sign-in:', err);
    throw err;
  }
}

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function setCachedAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

export async function logoutUser(): Promise<void> {
  try {
    cachedAccessToken = null;
    await signOut(auth);
  } catch (err) {
    console.error('Error during logout:', err);
    throw err;
  }
}

export function subscribeToAuth(onUserChanged: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
    }
    onUserChanged(user);
  });
}

// Subscriptions
export function subscribeToMembers(
  onData: (members: Member[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = 'members';
  const q = query(collection(db, colPath));
  return onSnapshot(q, (snapshot) => {
    const list: Member[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as Member;
      list.push(data);
    });
    onData(list);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.GET, colPath);
    } catch (e) {
      if (onError && e instanceof Error) onError(e);
    }
  });
}

export function subscribeToPlans(
  onData: (plans: PlanItem[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = 'plans';
  const q = query(collection(db, colPath));
  return onSnapshot(q, (snapshot) => {
    const list: PlanItem[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as PlanItem);
    });
    onData(list);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.GET, colPath);
    } catch (e) {
      if (onError && e instanceof Error) onError(e);
    }
  });
}

export function subscribeToTerminals(
  onData: (terminals: TerminalDevice[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = 'terminals';
  const q = query(collection(db, colPath));
  return onSnapshot(q, (snapshot) => {
    const list: TerminalDevice[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as TerminalDevice);
    });
    onData(list);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.GET, colPath);
    } catch (e) {
      if (onError && e instanceof Error) onError(e);
    }
  });
}

export function subscribeToInstructors(
  onData: (instructors: Instructor[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = 'instructors';
  const q = query(collection(db, colPath));
  return onSnapshot(q, (snapshot) => {
    const list: Instructor[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as Instructor);
    });
    onData(list);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.GET, colPath);
    } catch (e) {
      if (onError && e instanceof Error) onError(e);
    }
  });
}

export function subscribeToAccessEvents(
  onData: (events: AccessEvent[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = 'accessEvents';
  const q = query(collection(db, colPath));
  return onSnapshot(q, (snapshot) => {
    const list: AccessEvent[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as AccessEvent);
    });
    onData(list);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.GET, colPath);
    } catch (e) {
      if (onError && e instanceof Error) onError(e);
    }
  });
}

export function subscribeToAlerts(
  onData: (alerts: SystemAlert[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = 'alerts';
  const q = query(collection(db, colPath));
  return onSnapshot(q, (snapshot) => {
    const list: SystemAlert[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as SystemAlert);
    });
    onData(list);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.GET, colPath);
    } catch (e) {
      if (onError && e instanceof Error) onError(e);
    }
  });
}

// Mutations
export async function addMemberToFirestore(member: Member): Promise<void> {
  const docId = sanitizeDocId(member.id);
  const path = `members/${docId}`;
  try {
    await setDoc(doc(db, 'members', docId), member);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMemberFromFirestore(id: string): Promise<void> {
  const docId = sanitizeDocId(id);
  const path = `members/${docId}`;
  try {
    await deleteDoc(doc(db, 'members', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateMemberStatusInFirestore(id: string, status: 'Activo' | 'Suspendido' | 'Pendiente'): Promise<void> {
  const docId = sanitizeDocId(id);
  const path = `members/${docId}`;
  try {
    await updateDoc(doc(db, 'members', docId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addPlanToFirestore(plan: PlanItem): Promise<void> {
  const docId = sanitizeDocId(plan.id);
  const path = `plans/${docId}`;
  try {
    await setDoc(doc(db, 'plans', docId), plan);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updatePlanInFirestore(plan: PlanItem): Promise<void> {
  const docId = sanitizeDocId(plan.id);
  const path = `plans/${docId}`;
  try {
    await setDoc(doc(db, 'plans', docId), plan);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletePlanFromFirestore(id: string): Promise<void> {
  const docId = sanitizeDocId(id);
  const path = `plans/${docId}`;
  try {
    await deleteDoc(doc(db, 'plans', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function addTerminalToFirestore(terminal: TerminalDevice): Promise<void> {
  const docId = sanitizeDocId(terminal.id);
  const path = `terminals/${docId}`;
  try {
    await setDoc(doc(db, 'terminals', docId), terminal);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateTerminalInFirestore(terminal: TerminalDevice): Promise<void> {
  const docId = sanitizeDocId(terminal.id);
  const path = `terminals/${docId}`;
  try {
    await setDoc(doc(db, 'terminals', docId), terminal);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addInstructorToFirestore(instructor: Instructor): Promise<void> {
  const docId = sanitizeDocId(instructor.id);
  const path = `instructors/${docId}`;
  try {
    await setDoc(doc(db, 'instructors', docId), instructor);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteInstructorFromFirestore(id: string): Promise<void> {
  const docId = sanitizeDocId(id);
  const path = `instructors/${docId}`;
  try {
    await deleteDoc(doc(db, 'instructors', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function addAccessEventToFirestore(event: AccessEvent): Promise<void> {
  const docId = sanitizeDocId(event.id);
  const path = `accessEvents/${docId}`;
  try {
    await setDoc(doc(db, 'accessEvents', docId), event);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Bulk Data Migration Service
export interface MigrationSummary {
  membersCount: number;
  plansCount: number;
  terminalsCount: number;
  instructorsCount: number;
  eventsCount: number;
  alertsCount: number;
  timestamp: string;
}

export async function checkFirestoreHasData(): Promise<boolean> {
  const path = 'plans';
  try {
    const snap = await getDocs(collection(db, path));
    return !snap.empty;
  } catch (err) {
    console.warn('Could not check firestore data status:', err);
    return false;
  }
}

// Initializes standard catalogs (plans and terminals) in Firestore
export async function initializeDefaultCatalogsInFirestore(): Promise<void> {
  for (const p of initialPlans) {
    const docId = sanitizeDocId(p.id);
    await setDoc(doc(db, 'plans', docId), p);
  }
  for (const t of initialTerminals) {
    const docId = sanitizeDocId(t.id);
    await setDoc(doc(db, 'terminals', docId), t);
  }
}

// Optional: seed demo sample members and instructors for testing
export async function loadDemoSampleDataToFirestore(): Promise<{ membersCount: number; instructorsCount: number }> {
  for (const m of SAMPLE_DEMO_MEMBERS) {
    const docId = sanitizeDocId(m.id);
    await setDoc(doc(db, 'members', docId), m);
  }
  for (const inst of SAMPLE_DEMO_INSTRUCTORS) {
    const docId = sanitizeDocId(inst.id);
    await setDoc(doc(db, 'instructors', docId), inst);
  }
  return {
    membersCount: SAMPLE_DEMO_MEMBERS.length,
    instructorsCount: SAMPLE_DEMO_INSTRUCTORS.length
  };
}
