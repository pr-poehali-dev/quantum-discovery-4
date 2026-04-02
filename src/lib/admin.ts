import { getSessionId } from "@/lib/auth"

const ADMIN_URL = "https://functions.poehali.dev/4ff8a0d4-d4f7-4b35-8538-adbd8f53c48d"

async function call(action: string, extra: object = {}): Promise<Record<string, unknown>> {
  const isGet = Object.keys(extra).length === 0
  const sid = getSessionId()

  const res = isGet
    ? await fetch(`${ADMIN_URL}?action=${action}`, { headers: { "X-Session-Id": sid } })
    : await fetch(ADMIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid },
        body: JSON.stringify({ action, ...extra }),
      })

  const raw = await res.json()
  return typeof raw === "string" ? JSON.parse(raw) : raw
}

export interface AdminStats {
  total_users: number
  blocked_users: number
  admin_users: number
  active_sessions: number
  db_points: number
  roles: Record<string, number>
  reg_chart: { date: string; count: number }[]
}

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
  blocked: boolean
  created_at: string
}

export interface AdminPoint {
  id: number
  name: string
  region: string
  lat: number
  lng: number
  type: string
  value: number
  unit: string
  status: string
  created_at: string
}

export const adminApi = {
  getStats: () => call("stats") as Promise<AdminStats>,
  getUsers: async (): Promise<AdminUser[]> => {
    const d = await call("users")
    return (d.users ?? []) as AdminUser[]
  },
  setRole: (user_id: number, role: string) => call("set_role", { user_id, role }),
  setBlocked: (user_id: number, blocked: boolean) => call("set_blocked", { user_id, blocked }),
  getPoints: async (): Promise<AdminPoint[]> => {
    const d = await call("points")
    return (d.points ?? []) as AdminPoint[]
  },
  createPoint: (p: Omit<AdminPoint, "id" | "created_at">) => call("create_point", p),
  updatePoint: (p: AdminPoint) => call("update_point", p),
  deletePoint: (id: number) => call("delete_point", { id }),
}
