import { GoogleCalendarEvent } from '../types';
import { getCachedAccessToken } from './firestoreService';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export async function fetchGoogleCalendarEvents(
  tokenOverride?: string | null,
  timeMin?: string
): Promise<GoogleCalendarEvent[]> {
  const token = tokenOverride || getCachedAccessToken();
  if (!token) {
    throw new Error('No hay sesión de Google activa con permisos de Calendar. Conéctate primero.');
  }

  const minDate = timeMin || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const url = `${CALENDAR_API_BASE}?timeMin=${encodeURIComponent(minDate)}&singleEvents=true&orderBy=startTime&maxResults=50`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    if (res.status === 401) {
      throw new Error('El token de Google Calendar ha expirado. Por favor reconecta tu cuenta.');
    }
    throw new Error(`Error ${res.status} al consultar Google Calendar: ${errorBody}`);
  }

  const data = await res.json();
  const items: any[] = data.items || [];

  return items.map((item) => ({
    id: item.id,
    summary: item.summary || 'Evento sin título',
    description: item.description || '',
    location: item.location || '',
    start: {
      dateTime: item.start?.dateTime,
      date: item.start?.date,
      timeZone: item.start?.timeZone,
    },
    end: {
      dateTime: item.end?.dateTime,
      date: item.end?.date,
      timeZone: item.end?.timeZone,
    },
    attendees: item.attendees?.map((a: any) => ({
      email: a.email,
      displayName: a.displayName,
      responseStatus: a.responseStatus,
    })),
    htmlLink: item.htmlLink,
  }));
}

export interface CreateEventParams {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string;
  endDateTime: string;
  attendees?: string[];
}

export async function createGoogleCalendarEvent(
  params: CreateEventParams,
  tokenOverride?: string | null
): Promise<GoogleCalendarEvent> {
  const token = tokenOverride || getCachedAccessToken();
  if (!token) {
    throw new Error('Inicia sesión con Google para agendar en tu Google Calendar.');
  }

  const bodyPayload: any = {
    summary: params.summary,
    description: params.description || '',
    location: params.location || 'Gimnasio Gymflow Central',
    start: {
      dateTime: params.startDateTime,
    },
    end: {
      dateTime: params.endDateTime,
    },
  };

  if (params.attendees && params.attendees.length > 0) {
    bodyPayload.attendees = params.attendees.map((email) => ({ email }));
  }

  const res = await fetch(CALENDAR_API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyPayload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Error al crear evento en Google Calendar: ${errorBody}`);
  }

  const created = await res.json();
  return {
    id: created.id,
    summary: created.summary,
    description: created.description,
    location: created.location,
    start: created.start,
    end: created.end,
    htmlLink: created.htmlLink,
  };
}

export async function deleteGoogleCalendarEvent(
  eventId: string,
  tokenOverride?: string | null
): Promise<void> {
  const token = tokenOverride || getCachedAccessToken();
  if (!token) {
    throw new Error('Inicia sesión con Google para eliminar el evento.');
  }

  const res = await fetch(`${CALENDAR_API_BASE}/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204 && res.status !== 410) {
    const errorBody = await res.text();
    throw new Error(`Error al eliminar evento en Google Calendar: ${errorBody}`);
  }
}
