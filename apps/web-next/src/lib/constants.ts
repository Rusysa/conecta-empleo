import type {
  ApplicationStatus,
  EmploymentType,
  JobStatus,
  WorkMode,
} from "@/lib/types"

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  ONSITE: "Presencial",
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
}

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Tiempo completo",
  PART_TIME: "Medio tiempo",
  CONTRACT: "Por proyecto",
  INTERNSHIP: "Prácticas",
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  DRAFT: "Borrador",
  ACTIVE: "Activa",
  PAUSED: "Pausada",
  CLOSED: "Cerrada",
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: "Enviada",
  VIEWED: "Vista",
  IN_PROCESS: "En proceso",
  REJECTED: "Descartada",
  HIRED: "Contratado",
}

export const JOBS_PAGE_SIZE = 6
