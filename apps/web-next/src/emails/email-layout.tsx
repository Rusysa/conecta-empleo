import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

// Shared shell for transactional emails (CLAUDE.md fase 2). Inline styles only:
// many email clients ignore <style> tags and CSS variables.
export const styles = {
  body: { backgroundColor: "#f4f4f5", fontFamily: "Arial, Helvetica, sans-serif", margin: 0 },
  container: {
    backgroundColor: "#ffffff",
    margin: "24px auto",
    padding: "32px",
    maxWidth: "560px",
    borderRadius: "12px",
  },
  brand: { color: "#1d4ed8", fontSize: "16px", fontWeight: 700, margin: "0 0 24px" },
  heading: { color: "#18181b", fontSize: "22px", fontWeight: 700, margin: "0 0 16px" },
  text: { color: "#3f3f46", fontSize: "15px", lineHeight: "24px", margin: "0 0 12px" },
  muted: { color: "#71717a", fontSize: "13px", lineHeight: "20px", margin: 0 },
  box: { backgroundColor: "#f4f4f5", borderRadius: "8px", padding: "12px 16px", margin: "16px 0" },
  button: {
    backgroundColor: "#1d4ed8",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 600,
    padding: "12px 20px",
    textDecoration: "none",
  },
} as const

export function EmailLayout({
  preview,
  children,
  cta,
}: {
  preview: string
  children: React.ReactNode
  cta?: { label: string; href: string }
}) {
  return (
    <Html lang="es-MX">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>Bolsa de Trabajo</Text>
          {children}
          {cta && (
            <Section style={{ margin: "24px 0" }}>
              <Button href={cta.href} style={styles.button}>
                {cta.label}
              </Button>
            </Section>
          )}
          <Hr style={{ borderColor: "#e4e4e7", margin: "24px 0" }} />
          <Text style={styles.muted}>
            Recibes este correo por tu actividad en Bolsa de Trabajo. Si no reconoces esta acción,
            ignora este mensaje.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
