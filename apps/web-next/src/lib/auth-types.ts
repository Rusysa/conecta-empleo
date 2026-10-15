export type User = {
  id: string
  name: string
  email: string
  role: "candidate" | "employer"
  bio: string
  resumeUrl: string
  createdAt: string
}

export type Session = {
  user: User
  role: "CANDIDATE" | "COMPANY"
  email: string
} | null
