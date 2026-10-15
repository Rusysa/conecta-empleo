import { Heading, Text } from "@react-email/components"

import { APPLICATION_STATUS_LABELS } from "@/lib/constants"
import type { ApplicationStatus } from "@/lib/types"

import { EmailLayout, styles } from "./email-layout"

export type ApplicationStatusChangedProps = {
  fullName: string
  jobTitle: string
  companyName: string
  status: Exclude<ApplicationStatus, "SUBMITTED">
  applicationsUrl: string
}

const STATUS_COPY: Record<ApplicationStatusChangedProps["status"], string> = {
  VIEWED: "La empresa ya revisó tu postulación.",
  IN_PROCESS: "¡Buenas noticias! Tu postulación avanzó en el proceso de selección.",
  REJECTED:
    "La empresa decidió continuar con otros candidatos. Gracias por tu interés; sigue explorando vacantes.",
  HIRED: "¡Felicidades! La empresa marcó tu postulación como contratada.",
}

/** To the candidate when the company changes the status (CLAUDE.md fase 2). */
export function ApplicationStatusChangedEmail({
  fullName,
  jobTitle,
  companyName,
  status,
  applicationsUrl,
}: ApplicationStatusChangedProps) {
  const label = APPLICATION_STATUS_LABELS[status]
  return (
    <EmailLayout
      preview={`${jobTitle}: tu postulación ahora está “${label}”`}
      cta={{ label: "Ver mis postulaciones", href: applicationsUrl }}
    >
      <Heading style={styles.heading}>Tu postulación cambió de estado</Heading>
      <Text style={styles.text}>{`Hola, ${fullName}:`}</Text>
      <Text style={styles.text}>
        Tu postulación a <strong>{jobTitle}</strong> en {companyName} ahora está:{" "}
        <strong>{label}</strong>.
      </Text>
      <Text style={styles.text}>{STATUS_COPY[status]}</Text>
    </EmailLayout>
  )
}

ApplicationStatusChangedEmail.PreviewProps = {
  fullName: "Ana López",
  jobTitle: "Desarrollador Backend (Node.js)",
  companyName: "Tecnologías Norte",
  status: "IN_PROCESS",
  applicationsUrl: "http://localhost:3000/candidato/postulaciones",
} satisfies ApplicationStatusChangedProps

export default ApplicationStatusChangedEmail
