import { Heading, Text } from "@react-email/components"

import { EmailLayout, styles } from "./email-layout"

export type ApplicationReceivedProps = {
  fullName: string
  jobTitle: string
  companyName: string
  applicationsUrl: string
}

/** To the candidate, right after applying (CLAUDE.md §5.2 step 6). */
export function ApplicationReceivedEmail({
  fullName,
  jobTitle,
  companyName,
  applicationsUrl,
}: ApplicationReceivedProps) {
  return (
    <EmailLayout
      preview={`Tu postulación a ${jobTitle} fue enviada`}
      cta={{ label: "Ver mis postulaciones", href: applicationsUrl }}
    >
      <Heading style={styles.heading}>¡Postulación enviada!</Heading>
      <Text style={styles.text}>{`Hola, ${fullName}:`}</Text>
      <Text style={styles.text}>
        {companyName} recibió tu postulación a <strong>{jobTitle}</strong>, junto con tus datos de
        contacto y tu CV.
      </Text>
      <Text style={styles.text}>
        Te avisaremos por correo cuando la empresa actualice el estado de tu postulación.
      </Text>
    </EmailLayout>
  )
}

ApplicationReceivedEmail.PreviewProps = {
  fullName: "Ana López",
  jobTitle: "Desarrollador Frontend (React)",
  companyName: "Tecnologías Norte",
  applicationsUrl: "http://localhost:3000/candidato/postulaciones",
} satisfies ApplicationReceivedProps

export default ApplicationReceivedEmail
