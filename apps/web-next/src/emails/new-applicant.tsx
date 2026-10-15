import { Heading, Section, Text } from "@react-email/components"

import { EmailLayout, styles } from "./email-layout"

export type NewApplicantProps = {
  jobTitle: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  message: string | null
  applicantsUrl: string
}

/**
 * To the company when someone applies (CLAUDE.md §5.2 step 7). The CV is not attached:
 * it is only available through the panel (signed URL), so it never travels by email.
 */
export function NewApplicantEmail({
  jobTitle,
  candidateName,
  candidateEmail,
  candidatePhone,
  message,
  applicantsUrl,
}: NewApplicantProps) {
  return (
    <EmailLayout
      preview={`Nuevo postulante para ${jobTitle}: ${candidateName}`}
      cta={{ label: "Ver postulante y CV", href: applicantsUrl }}
    >
      <Heading style={styles.heading}>Nuevo postulante</Heading>
      <Text style={styles.text}>
        <strong>{candidateName}</strong> aplicó a <strong>{jobTitle}</strong>.
      </Text>
      <Section style={styles.box}>
        <Text style={styles.text}>Correo: {candidateEmail}</Text>
        <Text style={{ ...styles.text, margin: 0 }}>Teléfono: {candidatePhone}</Text>
      </Section>
      {message && (
        <>
          <Text style={{ ...styles.text, fontWeight: 600 }}>Mensaje del candidato</Text>
          {/* Candidate-written text: rendered as plain text (React escapes it). */}
          <Text style={{ ...styles.text, whiteSpace: "pre-line" }}>{message}</Text>
        </>
      )}
    </EmailLayout>
  )
}

NewApplicantEmail.PreviewProps = {
  jobTitle: "Desarrollador Frontend (React)",
  candidateName: "Luis Hernández",
  candidateEmail: "luis.hernandez@example.com",
  candidatePhone: "55 2345 6789",
  message: "Tengo 3 años trabajando con React y Next.js.",
  applicantsUrl: "http://localhost:3000/empresa/vacantes/job_1/postulantes",
} satisfies NewApplicantProps

export default NewApplicantEmail
