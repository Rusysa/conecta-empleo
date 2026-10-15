// Contratos de dominio compartidos. Sin dependencias de React, Express ni base de datos.
export const API_PREFIX = '/api/v1';
export const ROLES = Object.freeze(['candidate', 'employer']);
export const WORK_MODES = Object.freeze(['remote', 'hybrid', 'onsite']);
export const JOB_STATUSES = Object.freeze(['draft', 'published', 'closed']);
export const APPLICATION_STATUSES = Object.freeze(['submitted', 'reviewing', 'interview', 'rejected', 'hired', 'withdrawn']);
export const APPLICATION_TRANSITIONS = Object.freeze({
  submitted: Object.freeze(['reviewing', 'rejected', 'withdrawn']),
  reviewing: Object.freeze(['interview', 'rejected', 'withdrawn']),
  interview: Object.freeze(['hired', 'rejected', 'withdrawn']),
  rejected: Object.freeze([]), hired: Object.freeze([]), withdrawn: Object.freeze([]),
});
