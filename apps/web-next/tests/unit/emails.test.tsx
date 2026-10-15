import { render } from "@react-email/components"
import { describe, expect, it } from "vitest"

import { ApplicationReceivedEmail } from "@/emails/application-received"
import { ApplicationStatusChangedEmail } from "@/emails/application-status-changed"
import { NewApplicantEmail } from "@/emails/new-applicant"

describe("transactional emails", () => {
  it("application received: greets the candidate and links to their applications", async () => {
    const html = await render(
      <ApplicationReceivedEmail {...ApplicationReceivedEmail.PreviewProps} />
    )
    expect(html).toContain("Hola, Ana López")
    expect(html).toContain("Tecnologías Norte")
    expect(html).toContain('href="http://localhost:3000/candidato/postulaciones"')
  })

  it("new applicant: includes contact data and escapes the candidate's message", async () => {
    const html = await render(
      <NewApplicantEmail
        {...NewApplicantEmail.PreviewProps}
        message={'<script>alert(1)</script><a href="https://evil.test">clic</a>'}
      />
    )
    expect(html).toContain("luis.hernandez@example.com")
    expect(html).toContain("55 2345 6789")
    expect(html).not.toContain("<script>")
    expect(html).not.toContain('href="https://evil.test"')
    expect(html).toContain("&lt;script&gt;")
  })

  it("new applicant: omits the message block when there is none", async () => {
    const html = await render(
      <NewApplicantEmail {...NewApplicantEmail.PreviewProps} message={null} />
    )
    expect(html).not.toContain("Mensaje del candidato")
  })

  it("status changed: shows the Spanish status label", async () => {
    const html = await render(
      <ApplicationStatusChangedEmail
        {...ApplicationStatusChangedEmail.PreviewProps}
        status="HIRED"
      />
    )
    expect(html).toContain("Contratado")
    expect(html).toContain("¡Felicidades!")
  })

  it("plain-text version is generated for clients without HTML", async () => {
    const text = await render(
      <ApplicationReceivedEmail {...ApplicationReceivedEmail.PreviewProps} />,
      {
        plainText: true,
      }
    )
    expect(text.toLowerCase()).toContain("postulación enviada")
    expect(text).not.toContain("<")
  })
})
