import { useState } from "react"
import AppLayout from "@/components/AppLayout"
import Icon from "@/components/ui/icon"
import { ALL_POINTS, STATUS_COLORS } from "@/components/EcoMap"

const TYPE_LABELS: Record<string, string> = { air: "Воздух", water: "Вода", radiation: "Радиация", noise: "Шум" }
const TYPE_ICONS: Record<string, string> = { air: "Wind", water: "Droplets", radiation: "RadioTower", noise: "Volume2" }
const STATUS_LABELS: Record<string, string> = { good: "Норма", moderate: "Умеренно", bad: "Превышение" }

export default function DataPage() {
  const [search, setSearch] = useState("")
  const [filterRegion, setFilterRegion] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortKey, setSortKey] = useState<"name" | "value" | "region">("region")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const regions = ["all", ...Array.from(new Set(ALL_POINTS.map(p => p.region)))]
  const types = ["all", "air", "water", "radiation", "noise"]
  const statuses = ["all", "good", "moderate", "bad"]

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const filtered = ALL_POINTS
    .filter(p => filterRegion === "all" || p.region === filterRegion)
    .filter(p => filterType === "all" || p.type === filterType)
    .filter(p => filterStatus === "all" || p.status === filterStatus)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.region.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1
      if (sortKey === "value") return (a.value - b.value) * mul
      return a[sortKey].localeCompare(b[sortKey]) * mul
    })

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Данные</h1>
          <p className="text-white/50">Полный реестр постов мониторинга с текущими показателями</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white/5 ring-1 ring-white/10 rounded-xl px-4 py-2 flex-1 min-w-[200px]">
            <Icon name="Search" size={15} className="text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию..."
              className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
            />
          </div>
          {[
            { label: "Регион", value: filterRegion, set: setFilterRegion, options: regions.map(r => ({ v: r, l: r === "all" ? "Все регионы" : r })) },
            { label: "Тип", value: filterType, set: setFilterType, options: types.map(t => ({ v: t, l: t === "all" ? "Все типы" : TYPE_LABELS[t] })) },
            { label: "Статус", value: filterStatus, set: setFilterStatus, options: statuses.map(s => ({ v: s, l: s === "all" ? "Все статусы" : STATUS_LABELS[s] })) },
          ].map(f => (
            <select
              key={f.label}
              value={f.value}
              onChange={e => f.set(e.target.value)}
              className="bg-white/5 ring-1 ring-white/10 rounded-xl px-4 py-2 text-sm text-white/80 outline-none cursor-pointer"
            >
              {f.options.map(o => <option key={o.v} value={o.v} className="bg-[#0D1810]">{o.l}</option>)}
            </select>
          ))}
          <div className="text-sm text-white/40 flex items-center px-2">{filtered.length} из {ALL_POINTS.length}</div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-white/40">
                <th className="text-left px-4 py-3 font-medium">
                  <button className="flex items-center gap-1 hover:text-white transition-colors" onClick={() => toggleSort("name")}>
                    Пост <Icon name={sortKey === "name" ? (sortDir === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} size={13} />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  <button className="flex items-center gap-1 hover:text-white transition-colors" onClick={() => toggleSort("region")}>
                    Регион <Icon name={sortKey === "region" ? (sortDir === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} size={13} />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium">Тип</th>
                <th className="text-right px-4 py-3 font-medium">
                  <button className="flex items-center gap-1 hover:text-white transition-colors ml-auto" onClick={() => toggleSort("value")}>
                    Значение <Icon name={sortKey === "value" ? (sortDir === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} size={13} />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium">Статус</th>
                <th className="text-right px-4 py-3 font-medium">Коорд.</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-t border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.015]"} hover:bg-white/[0.03] transition-colors`}>
                  <td className="px-4 py-3 text-white/80 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-white/50">{p.region}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-white/60">
                      <Icon name={TYPE_ICONS[p.type]} size={13} />
                      {TYPE_LABELS[p.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: STATUS_COLORS[p.status] }}>
                    {p.value} <span className="text-white/30 font-sans text-xs">{p.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: STATUS_COLORS[p.status] + "22", color: STATUS_COLORS[p.status] }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[p.status] }} />
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-white/30 font-mono">{p.lat}, {p.lng}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-white/30">
              <Icon name="SearchX" size={32} className="mx-auto mb-3 opacity-50" />
              Ничего не найдено
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
