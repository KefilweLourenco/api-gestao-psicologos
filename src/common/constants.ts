export const APP_TIMEZONE = process.env.APP_TIMEZONE ?? 'America/Sao_Paulo';
export const APPOINTMENT_GENERATION_WEEKS_AHEAD = Number(
  process.env.APPOINTMENT_GENERATION_WEEKS_AHEAD ?? 6,
);
export const RESCHEDULE_SUGGESTION_LIMIT = Number(
  process.env.RESCHEDULE_SUGGESTION_LIMIT ?? 3,
);
