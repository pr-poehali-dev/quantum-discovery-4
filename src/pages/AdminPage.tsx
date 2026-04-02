import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppLayout from "@/components/AppLayout"
import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { adminApi, AdminStats, AdminUser, AdminPoint } from "@/lib/admin"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

type Tab = "stats" | "users" | "points"

const ROLES = ["user", "analyst", "admin"]
const TYPES = ["air", "water", "radiation", "noise"]
const STATUSES = ["good", "moderate", "bad"]
const TYPE_LABELS: Record<string, string> = { air: "Воздух", water: "Вода", radiation: "Радиация", noise: "Шум" }
const STATUS_COLORS: Record<string, string> = { good: "#3DBA6F", moderate: "#F59E0B", bad: "#EF4444" }
const STATUS_LABELS: Record<string, string> = { good: "Норма", moderate: "Умеренно", bad: "Превышение" }
const ROLE_COLORS: Record<string, string> = { admin: "#E879F9", analyst: "#60A5FA", user: "#94A3B8" }

const EMPTY_POINT: Omit<AdminPoint, "id" | "created_at"> = {
  name: "", region: "", lat: 0, lng: 0, type: "air", value: 0, unit: "мкг/м³", status: "good",
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>("stats")

  // Stats
  const [stats, setStats] = useState<AdminStats | null>(null)

  // Users
  const [users, setUsers] = useState<AdminUser[]>([])
  const [userSearch, setUserSearch] = useState("")

  // Points
  const [points, setPoints] = useState<AdminPoint[]>([])
  const [pointSearch, setPointSearch] = useState("")
  const [editPoint, setEditPoint] = useState<AdminPoint | null>(null)
  const [newPoint, setNewPoint] = useState<Omit<AdminPoint, "id" | "created_at"> | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) navigate("/")
  }, [user, loading, navigate])

  useEffect(() => {
    if (tab === "stats") adminApi.getStats().then(setStats)
    if (tab === "users") adminApi.getUsers().then(setUsers)
    if (tab === "points") adminApi.getPoints().then(setPoints)
  }, [tab])

  if (loading || !user || user.role !== "admin") return null

  // ---- STATS ----
  const renderStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Пользователей", val: stats?.total_users ?? "—", icon: "Users", color: "#60A5FA" },
          { label: "Заблокировано", val: stats?.blocked_users ?? "—", icon: "UserX", color: "#EF4444" },
          { label: "Администраторов", val: stats?.admin_users ?? "—", icon: "ShieldCheck", color: "#E879F9" },
          { label: "Активных сессий", val: stats?.active_sessions ?? "—", icon: "Activity", color: "#3DBA6F" },
          { label: "Точек в БД", val: stats?.db_points ?? "—", icon: "MapPin", color: "#F59E0B" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 text-center">
            <Icon name={s.icon} size={22} className="mx-auto mb-3" style={{ color: s.color }} />
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs text-white/50">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Регистрации за 30 дней */}
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={16} className="text-eco" />
            Регистрации за 30 дней
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.reg_chart ?? []} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="bg-black/90 border border-white/15 rounded-xl px-3 py-2 text-xs">
                        <div className="text-white/50 mb-1">{label}</div>
                        <div className="font-bold text-eco">{payload[0].value} регистраций</div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="count" fill="#3DBA6F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Роли */}
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="PieChart" size={16} className="text-eco" />
            Распределение по ролям
          </h3>
          <div className="space-y-3">
            {Object.entries(stats?.roles ?? {}).map(([role, count]) => {
              const total = stats?.total_users ?? 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={role}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/70 capitalize">{role}</span>
                    <span className="font-semibold" style={{ color: ROLE_COLORS[role] ?? "#94A3B8" }}>{count}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: ROLE_COLORS[role] ?? "#94A3B8" }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  // ---- USERS ----
  const handleSetRole = async (uid: number, role: string) => {
    await adminApi.setRole(uid, role)
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, role } : u))
  }

  const handleSetBlocked = async (uid: number, blocked: boolean) => {
    await adminApi.setBlocked(uid, blocked)
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, blocked } : u))
  }

  const filteredUsers = users.filter(u =>
    !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 ring-1 ring-white/10 rounded-xl px-4 py-2 flex-1">
          <Icon name="Search" size={15} className="text-white/40" />
          <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Поиск по имени или email..."
            className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full" />
        </div>
        <div className="text-sm text-white/40">{filteredUsers.length} пользователей</div>
      </div>

      <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-white/40">
              <th className="text-left px-4 py-3 font-medium">ID</th>
              <th className="text-left px-4 py-3 font-medium">Имя / Email</th>
              <th className="text-left px-4 py-3 font-medium">Роль</th>
              <th className="text-left px-4 py-3 font-medium">Статус</th>
              <th className="text-left px-4 py-3 font-medium">Дата</th>
              <th className="text-right px-4 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={u.id} className={`border-t border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                <td className="px-4 py-3 text-white/30 font-mono text-xs">{u.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-white/90">{u.name}</div>
                  <div className="text-xs text-white/40">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={e => handleSetRole(u.id, e.target.value)}
                    className="bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
                    style={{ color: ROLE_COLORS[u.role] ?? "#94A3B8" }}
                  >
                    {ROLES.map(r => <option key={r} value={r} className="bg-[#0D1810] text-white">{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${u.blocked ? "bg-red-400/15 text-red-400" : "bg-eco/15 text-eco"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.blocked ? "bg-red-400" : "bg-eco"}`} />
                    {u.blocked ? "Заблокирован" : "Активен"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-white/30">{new Date(u.created_at).toLocaleDateString("ru-RU")}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSetBlocked(u.id, !u.blocked)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${u.blocked ? "bg-eco/15 text-eco hover:bg-eco/25" : "bg-red-400/15 text-red-400 hover:bg-red-400/25"}`}
                  >
                    {u.blocked ? "Разблокировать" : "Заблокировать"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">Пользователи не найдены</div>
        )}
      </div>
    </div>
  )

  // ---- POINTS ----
  const handleSavePoint = async () => {
    setSaving(true)
    if (editPoint) {
      await adminApi.updatePoint(editPoint)
      setPoints(prev => prev.map(p => p.id === editPoint.id ? editPoint : p))
      setEditPoint(null)
    } else if (newPoint) {
      const res = await adminApi.createPoint(newPoint) as { id: number }
      const created: AdminPoint = { ...newPoint, id: res.id, created_at: new Date().toISOString() }
      setPoints(prev => [created, ...prev])
      setNewPoint(null)
    }
    setSaving(false)
  }

  const handleDeletePoint = async (id: number) => {
    await adminApi.deletePoint(id)
    setPoints(prev => prev.filter(p => p.id !== id))
    setDeleteConfirm(null)
  }

  const filteredPoints = points.filter(p =>
    !pointSearch || p.name.toLowerCase().includes(pointSearch.toLowerCase()) || p.region.toLowerCase().includes(pointSearch.toLowerCase())
  )

  const PointForm = ({ data, onChange }: { data: Partial<AdminPoint>; onChange: (d: Partial<AdminPoint>) => void }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { key: "name", label: "Название", type: "text", placeholder: "Пост №1 — Центр" },
        { key: "region", label: "Регион", type: "text", placeholder: "Запорожская обл." },
        { key: "lat", label: "Широта", type: "number", placeholder: "47.500" },
        { key: "lng", label: "Долгота", type: "number", placeholder: "34.659" },
        { key: "value", label: "Значение", type: "number", placeholder: "45.5" },
        { key: "unit", label: "Единица", type: "text", placeholder: "мкг/м³" },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-xs text-white/50 mb-1.5">{f.label}</label>
          <input
            type={f.type}
            value={(data as Record<string, unknown>)[f.key] as string ?? ""}
            onChange={e => onChange({ ...data, [f.key]: f.type === "number" ? parseFloat(e.target.value) : e.target.value })}
            placeholder={f.placeholder}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-eco/50"
          />
        </div>
      ))}
      <div>
        <label className="block text-xs text-white/50 mb-1.5">Тип</label>
        <select value={data.type ?? "air"} onChange={e => onChange({ ...data, type: e.target.value })}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-eco/50">
          {TYPES.map(t => <option key={t} value={t} className="bg-[#0D1810]">{TYPE_LABELS[t]}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-white/50 mb-1.5">Статус</label>
        <select value={data.status ?? "good"} onChange={e => onChange({ ...data, status: e.target.value })}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-eco/50">
          {STATUSES.map(s => <option key={s} value={s} className="bg-[#0D1810]">{STATUS_LABELS[s]}</option>)}
        </select>
      </div>
    </div>
  )

  const renderPoints = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 ring-1 ring-white/10 rounded-xl px-4 py-2 flex-1">
          <Icon name="Search" size={15} className="text-white/40" />
          <input value={pointSearch} onChange={e => setPointSearch(e.target.value)} placeholder="Поиск по названию или региону..."
            className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full" />
        </div>
        <Button onClick={() => { setNewPoint({ ...EMPTY_POINT }); setEditPoint(null) }}
          className="bg-eco text-black hover:bg-eco/90 rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2">
          <Icon name="Plus" size={16} /> Добавить точку
        </Button>
      </div>

      {/* New point form */}
      {newPoint && (
        <div className="rounded-2xl bg-eco/5 ring-1 ring-eco/20 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-eco">
            <Icon name="Plus" size={16} /> Новая точка мониторинга
          </h3>
          <PointForm data={newPoint} onChange={d => setNewPoint(d as typeof newPoint)} />
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSavePoint} disabled={saving} className="bg-eco text-black hover:bg-eco/90 rounded-xl px-6 font-semibold">
              {saving ? <Icon name="Loader2" size={16} className="animate-spin" /> : "Сохранить"}
            </Button>
            <Button onClick={() => setNewPoint(null)} variant="outline" className="rounded-xl border-white/20 text-white/70">Отмена</Button>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-white/40">
              <th className="text-left px-4 py-3 font-medium">Название</th>
              <th className="text-left px-4 py-3 font-medium">Регион</th>
              <th className="text-left px-4 py-3 font-medium">Тип</th>
              <th className="text-right px-4 py-3 font-medium">Значение</th>
              <th className="text-left px-4 py-3 font-medium">Статус</th>
              <th className="text-right px-4 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredPoints.map((p, i) => (
              <>
                <tr key={p.id} className={`border-t border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                  <td className="px-4 py-3 text-white/80 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-white/50 text-xs">{p.region}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">{TYPE_LABELS[p.type]}</td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: STATUS_COLORS[p.status] }}>
                    {p.value} <span className="text-white/30 font-sans text-xs">{p.unit}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: STATUS_COLORS[p.status] + "22", color: STATUS_COLORS[p.status] }}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditPoint(p); setNewPoint(null) }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                        <Icon name="Pencil" size={14} />
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)}
                        className="p-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition-all">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {editPoint?.id === p.id && (
                  <tr key={`edit-${p.id}`} className="border-t border-eco/20 bg-eco/5">
                    <td colSpan={6} className="px-4 py-5">
                      <PointForm data={editPoint} onChange={d => setEditPoint(d as AdminPoint)} />
                      <div className="flex gap-3 mt-4">
                        <Button onClick={handleSavePoint} disabled={saving} className="bg-eco text-black hover:bg-eco/90 rounded-xl px-6 font-semibold">
                          {saving ? <Icon name="Loader2" size={16} className="animate-spin" /> : "Сохранить изменения"}
                        </Button>
                        <Button onClick={() => setEditPoint(null)} variant="outline" className="rounded-xl border-white/20 text-white/70">Отмена</Button>
                      </div>
                    </td>
                  </tr>
                )}
                {deleteConfirm === p.id && (
                  <tr key={`del-${p.id}`} className="border-t border-red-400/20 bg-red-400/5">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <Icon name="AlertTriangle" size={18} className="text-red-400 flex-shrink-0" />
                        <span className="text-sm text-white/80">Удалить точку <b>{p.name}</b>? Это действие необратимо.</span>
                        <div className="flex gap-2 ml-auto">
                          <Button onClick={() => handleDeletePoint(p.id)} className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-1.5 text-sm font-semibold">Удалить</Button>
                          <Button onClick={() => setDeleteConfirm(null)} variant="outline" className="rounded-xl border-white/20 text-white/70 text-sm px-4 py-1.5">Отмена</Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filteredPoints.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">
            <Icon name="MapPin" size={28} className="mx-auto mb-3 opacity-40" />
            Точек в базе данных нет. Добавьте первую!
          </div>
        )}
      </div>
    </div>
  )

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "stats", label: "Статистика", icon: "BarChart2" },
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "points", label: "Точки мониторинга", icon: "MapPin" },
  ]

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 ring-1 ring-purple-500/30 flex items-center justify-center">
            <Icon name="ShieldCheck" size={20} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Административная панель</h1>
            <p className="text-white/50 text-sm">Управление платформой ЭкоМонитор</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px
                ${tab === t.id ? "border-eco text-eco" : "border-transparent text-white/50 hover:text-white"}`}
            >
              <Icon name={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "stats" && renderStats()}
        {tab === "users" && renderUsers()}
        {tab === "points" && renderPoints()}
      </div>
    </AppLayout>
  )
}
