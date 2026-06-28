import { useState } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"
import { Link } from "react-router-dom"

const SESSIONS = [
  { id: 1, code: "SS-2024-001", name: "Весенняя миграция 2024 — Поволжье", type: "route",      status: "active",    start: "01.04.2024", end: "31.05.2024", obs: 3, coordinator: "А. Иванов",    weather: "Ясно",   temp: 12.5 },
  { id: 2, code: "SS-2024-002", name: "Гнездовой период 2024 — Лесостепь", type: "stationary", status: "active",    start: "15.05.2024", end: "15.07.2024", obs: 3, coordinator: "А. Иванов",    weather: "Облачно",temp: 18.0 },
  { id: 3, code: "SS-2024-003", name: "Осенняя миграция 2024 — Кавказ",    type: "route",      status: "completed", start: "01.09.2024", end: "31.10.2024", obs: 2, coordinator: "А. Иванов",    weather: "Ясно",   temp: 8.0  },
  { id: 4, code: "SS-2024-004", name: "Зимние скопления 2024 — Юг России", type: "aggregation",status: "planned",   start: "01.12.2024", end: "28.02.2025", obs: 0, coordinator: "А. Иванов",    weather: "Пасмурно",temp:-2.0 },
  { id: 5, code: "SS-2024-005", name: "Водно-болотный учёт ВБУ-1",         type: "stationary", status: "active",    start: "01.06.2024", end: "30.06.2024", obs: 1, coordinator: "А. Иванов",    weather: "Ясно",   temp: 22.0 },
]

const TYPE_LABEL: Record<string, string> = {
  route: "Маршрутный", stationary: "Стационарный", aggregation: "Скопления"
}
const TYPE_ICON: Record<string, string> = {
  route: "Route", stationary: "MapPin", aggregation: "Users"
}

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  active:    { label: "Активна",       color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  planned:   { label: "Запланирована", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  completed: { label: "Завершена",     color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  cancelled: { label: "Отменена",      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

export default function SessionsPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const filtered = SESSIONS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.code.includes(search)
    const matchStatus = filterStatus === "all" || s.status === filterStatus
    const matchType   = filterType === "all"   || s.type === filterType
    return matchSearch && matchStatus && matchType
  })

  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Сессии учёта</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{SESSIONS.length} сессий в системе</p>
          </div>
          <Link
            to="/sessions/new"
            className="flex items-center gap-2 px-4 py-2 bg-bird text-white rounded-lg text-sm font-medium hover:bg-bird-dark transition-colors"
          >
            <Icon name="Plus" size={16} />
            Новая сессия
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию или коду..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bird/30"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="planned">Запланированные</option>
            <option value="completed">Завершённые</option>
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none"
          >
            <option value="all">Все типы</option>
            <option value="route">Маршрутный</option>
            <option value="stationary">Стационарный</option>
            <option value="aggregation">Скопления</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-muted rounded-2xl ring-1 ring-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Сессия</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Тип</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">Период</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">Погода</th>
                <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Записей</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Статус</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs font-mono text-muted-foreground mt-0.5">{s.code}</div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icon name={TYPE_ICON[s.type]} size={13} />
                      <span className="text-xs">{TYPE_LABEL[s.type]}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                    <div className="text-xs">{s.start}</div>
                    <div className="text-xs">{s.end}</div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="text-xs text-muted-foreground">{s.weather}</div>
                    <div className="text-xs text-muted-foreground">{s.temp > 0 ? "+" : ""}{s.temp}°C</div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-bird">{s.obs}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CFG[s.status].color}`}>
                      {STATUS_CFG[s.status].label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="ChevronRight" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">Сессии не найдены</div>
          )}
        </div>

      </div>
    </OrnithologyLayout>
  )
}
