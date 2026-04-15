import { format, isAfter, isBefore, set } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

import { APP_TIMEZONE } from '../constants';

export function parseClockToParts(clock: string): { hour: number; minute: number } {
  const [hour, minute] = clock.split(':').map(Number);
  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Invalid clock value: ${clock}`);
  }

  return { hour, minute };
}

export function formatInAppTimezone(date: Date): string {
  return format(toZonedTime(date, APP_TIMEZONE), "yyyy-MM-dd'T'HH:mm:ssXXX");
}

export function combineDateAndClock(date: Date, clock: string): Date {
  const zonedDate = toZonedTime(date, APP_TIMEZONE);
  const { hour, minute } = parseClockToParts(clock);
  const localWithTime = set(zonedDate, {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0,
  });

  return fromZonedTime(localWithTime, APP_TIMEZONE);
}

export function overlaps(
  firstStart: Date,
  firstEnd: Date,
  secondStart: Date,
  secondEnd: Date,
): boolean {
  return isBefore(firstStart, secondEnd) && isAfter(firstEnd, secondStart);
}

export function clockLabel(date: Date): string {
  return format(toZonedTime(date, APP_TIMEZONE), "EEEE 'as' HH:mm", {
    locale: ptBR,
  });
}

export function shortDateTimeLabel(date: Date): string {
  return format(toZonedTime(date, APP_TIMEZONE), "dd/MM/yyyy 'as' HH:mm", {
    locale: ptBR,
  });
}
