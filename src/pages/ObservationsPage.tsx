import { useState } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import { STATUS_BADGE } from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"
import { Link } from "react-router-dom"

const OBSERVATIONS = [
  { id: 1,  species: "Серый журавль",        latin: "Grus grus",             count: 47,  status: "confirmed",            session: "SS-2024-001", date: "15.04.2024 08:30", biotope: "Водно-болотные угодья", lat: 52.1234, lon: 46.5678, rare: false, flock: "Крупная стая" },
  { id: 2,  species: "Серый гусь",           latin: "Anser anser",           count: 312, status: "confirmed",            session: "SS-2024-001", date: "16.04.2024 07:15", biotope: "Водно-болотные угодья", lat: 52.2341, lon: 46.6789, rare: false, flock: "Массовое скопление" },
  { id: 3,  species: "Беркут",               latin: "Aquila chrysaetos",      count: 2,   status: "confirmed",            session: "SS-2024-001", date: "17.04.2024 09:00", biotope: "Лес",                   lat: 52.3456, lon: 46.7890, rare: true,  flock: "Одиночная особь" },
  { id: 4,  species: "Белый аист",           latin: "Ciconia ciconia",        count: 3,   status: "confirmed",            session: "SS-2024-002", date: "20.05.2024 10:00", biotope: "Лес",                   lat: 52.4567, lon: 46.8901, rare: false, flock: "Пара" },
  { id: 5,  species: "Чёрный дрозд",        latin: "Turdus merula",         count: 8,   status: "submitted",            session: "SS-2024-002", date: "21.05.2024 06:45", biotope: "Лес",                   lat: 52.5678, lon: 46.9012, rare: false, flock: "Мелкая группа" },
  { id: 6,  species: "Орлан-белохвост",     latin: "Haliaeetus albicilla",  count: 1,   status: "confirmed",            session: "SS-2024-003", date: "10.09.2024 11:00", biotope: "Побережье",             lat: 43.1234, lon: 43.5678, rare: true,  flock: "Одиночная особь" },
  { id: 7,  species: "Сапсан",              latin: "Falco peregrinus",       count: 1,   status: "confirmed",            session: "SS-2024-003", date: "11.09.2024 12:30", biotope: "Побережье",             lat: 43.2345, lon: 43.6789, rare: true,  flock: "Одиночная особь" },
  { id: 8,  species: "Серая цапля",         latin: "Ardea cinerea",          count: 12,  status: "confirmed",            session: "SS-2024-005", date: "05.06.2024 07:00", biotope: "Водно-болотные угодья", lat: 51.9876, lon: 46.4321, rare: false, flock: "Средняя стая" },
  { id: 9,  species: "Скопа",              latin: "Pandion haliaetus",      count: 2,   status: "needs_clarification",  session: "SS-2024-001", date: "20.04.2024 09:45", biotope: "Водно-болотные угодья", lat: 52.0987, lon: 46.5432, rare: true,  flock: "Одиночная особь" },
  { id: 10, species: "Чёрный аист",        latin: "Ciconia nigra",          count: 1,   status: "draft",                session: "SS-2024-002", date: "01.06.2024 08:00", biotope: "Лес",                   lat: 52.6789, lon: 47.0123, rare: true,  flock: "Одиночная особь" },
]

const COLUMNS = [
  { key: "species",  label: "Вид" },
  { key: "session",  label: "Сессия" },
  { key: "date",     label: "Дата/время" },
  { key: "count",    label: "Числ." },
  { key: "biotope",  label: "Биотоп" },
  { key: "coords",   label: "Координаты" },
  { key: "status",   label: "Статус" },
]

export default function ObservationsPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [onlyRare, setOnlyRare] = useState(false)

  const filtered = OBSERVATIONS.filter(o => {
    const matchSearch = o.species.toLowerCase().includes(search.toLowerCase()) ||
                        o.latin.toLowerCase().includes(search.toLowerCase()) ||
                        o.session.includes(search)
    const matchStatus = filterStatus === "all" || o.status === filterStatus
    const matchRare   = !onlyRare || o.rare
    return matchSearch && matchStatus && matchRare
  })

  const totalCount = filtered.reduce((s, o) => s + o.count, 0)

  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Наблюдения</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {filtered.length} записей · суммарная численность: <span className="font-semibold text-bird">{totalCount.toLocaleString()}</span>
            </p>
          </div>
          <Link
            to="/observations/new"
            className="flex items-center gap-2 px-4 py-2 bg-bird text-white rounded-lg text-sm font-medium hover:bg-bird-dark transition-colors"
          >
            <Icon name="Plus" size={16} />
            Добавить наблюдение
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Вид, латинское название, сессия..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bird/30"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none"
          >
            <option value="all">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="submitted">На проверке</option>
            <option value="needs_clarification">Требует уточнения</option>
            <option value="confirmed">Подтверждено</option>
            <option value="rejected">Отклонено</option>
          </select>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyRare}
              onChange={e => setOnlyRare(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-bird"
            />
            <Icon name="Star" size={14} className="text-amber-500" />
            Только редкие
          </label>
        </div>

        {/* Table */}
        <div className="bg-muted rounded-2xl ring-1 ring-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  {COLUMNS.map(c => (
                    <th key={c.key} className="text-left py-3 px-4 text-xs text-muted-foreground font-medium whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(obs => (
                  <tr
                    key={obs.id}
                    className={`border-b border-border/50 hover:bg-background transition-colors
                      ${obs.status === "needs_clarification" ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}
                      ${obs.rare ? "border-l-2 border-l-amber-400" : ""}
                    `}
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {obs.rare && <Icon name="Star" size={12} className="text-amber-500 flex-shrink-0" />}
                        <div>
                          <div className="font-medium whitespace-nowrap">{obs.species}</div>
                          <div className="text-xs text-muted-foreground italic">{obs.latin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-xs font-mono text-muted-foreground">{obs.session}</span>
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground whitespace-nowrap text-xs">{obs.date}</td>
                    <td className="py-2.5 px-4 font-bold text-bird">{obs.count}</td>
                    <td className="py-2.5 px-4 text-muted-foreground text-xs whitespace-nowrap">{obs.biotope}</td>
                    <td className="py-2.5 px-4 text-xs text-muted-foreground whitespace-nowrap font-mono">
                      {obs.lat.toFixed(4)}, {obs.lon.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${STATUS_BADGE[obs.status].color}`}>
                        {STATUS_BADGE[obs.status].label}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Редактировать">
                          <Icon name="Pencil" size={14} />
                        </button>
                        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Карточка">
                          <Icon name="ExternalLink" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">Наблюдения не найдены</div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Icon name="Star" size={12} className="text-amber-500" />
            <span>Редкий/охраняемый вид</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border-l-2 border-amber-400 bg-amber-50 dark:bg-amber-900/10" />
            <span>Запись с замечанием эксперта</span>
          </div>
        </div>

      </div>
    </OrnithologyLayout>
  )
}
