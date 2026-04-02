const AUTH_URL = "https://functions.poehali.dev/3e53cbf9-9124-4632-b552-99d9d0e80594"
const SESSION_KEY = "eco_session_id"

export interface User {
  id: number
  email: string
  name: string
  role: string
}

export function getSessionId(): string {
  return localStorage.getItem(SESSION_KEY) || ""
}

function saveSession(id: string) {
  localStorage.setItem(SESSION_KEY, id)
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

async function call(body: object): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const sid = getSessionId()
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sid ? { "X-Session-Id": sid } : {}),
    },
    body: JSON.stringify(body),
  })
  const raw = await res.json()
  const data: Record<string, unknown> = typeof raw === "string" ? JSON.parse(raw) : raw
  return { ok: res.ok, data }
}

export async function register(email: string, name: string, password: string): Promise<{ user: User | null; error?: string }> {
  const { ok, data } = await call({ action: "register", email, name, password })
  if (!ok) return { user: null, error: data.error as string }
  saveSession(data.sessionId as string)
  return { user: { id: 0, email: data.email as string, name: data.name as string, role: data.role as string } }
}

export async function login(email: string, password: string): Promise<{ user: User | null; error?: string }> {
  const { ok, data } = await call({ action: "login", email, password })
  if (!ok) return { user: null, error: data.error as string }
  saveSession(data.sessionId as string)
  return { user: { id: 0, email: data.email as string, name: data.name as string, role: data.role as string } }
}

export async function logout(): Promise<void> {
  await call({ action: "logout" })
  clearSession()
}

export async function getMe(): Promise<User | null> {
  const sid = getSessionId()
  if (!sid) return null
  const res = await fetch(AUTH_URL + "?action=me", {
    headers: { "X-Session-Id": sid },
  })
  if (!res.ok) { clearSession(); return null }
  const raw = await res.json()
  const data: Record<string, unknown> = typeof raw === "string" ? JSON.parse(raw) : raw
  if (data.error) { clearSession(); return null }
  return data as unknown as User
}
