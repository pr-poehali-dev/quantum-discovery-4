import { useState } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const POINTS = [
  { id: 1,  lat: 52.1234, lon: 46.5678, species: "Серый журавль",    count: 47,  status: "confirmed", rare: false, session: "SS-2024-001" },
  { id: 2,  lat: 52.2341, lon: 46.6789, species: "Серый гусь",       count: 312, status: "confirmed", rare: false, session: "SS-2024-001" },
  { id: 3,  lat: 52.3456, lon: 46.7890, species: "Беркут",           count: 2,   status: "confirmed", rare: true,  session: "SS-2024-001" },
  { id: 4,  lat: 52.4567, lon: 46.8901, species: "Белый аист",       count: 3,   status: "confirmed", rare: false, session: "SS-2024-002" },
  { id: 5,  lat: 52.5678, lon: 46.9012, species: "Чёрный дрозд",    count: 8,   status: "submitted", rare: false, session: "SS-2024-002" },
  { id: 6,  lat: 43.1234, lon: 43.5678, species: "Орлан-белохвост", count: 1,   status: "confirmed", rare: true,  session: "SS-2024-003" },
  { id: 7,  lat: 43.2345, lon: 43.6789, species: "Сапсан",          count: 1,   status: "confirmed", rare: true,  session: "SS-2024-003" },
  { id: 8,  lat: 51.9876, lon: 46.4321, species: "Серая цапля",     count: 12,  status: "confirmed", rare: false, session: "SS-2024-005" },
  { id: 9,  lat: 52.0987, lon: 46.5432, species: "Скопа",           count: 2,   status: "needs_clarification", rare: true, session: "SS-2024-001" },
  { id: 10, lat: 52.6789, lon: 47.0123, species: "Чёрный аист",     count: 1,   status: "draft",     rare: true,  session: "SS-2024-002" },
]

const POINT_COLOR: Record<string, string> = {
  confirmed: "#22c55e",
  submitted: "#3b82f6",
  needs_clarification: "#f59e0b",
  draft: "#94a3b8",
  rejected: "#ef4444",
}

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Подтверждено",
  submitted: "На проверке",
  needs_clarification: "Требует уточнения",
  draft: "Черновик",
  rejected: "Отклонено",
}

const FILTER_OPTIONS = [
  { value: "all",       label: "Все наблюдения" },
  { value: "confirmed", label: "Подтверждённые" },
  { value: "rare",      label: "Редкие виды" },
  { value: "SS-2024-001", label: "SS-2024-001" },
  { value: "SS-2024-002", label: "SS-2024-002" },
  { value: "SS-2024-003", label: "SS-2024-003" },
]

export default function BirdMapPage() {
  const [filter, setFilter] = useState("all")
  const [selected, setSelected] = useState<typeof POINTS[0] | null>(null)

  const visible = POINTS.filter(p => {
    if (filter === "all") return true
    if (filter === "confirmed") return p.status === "confirmed"
    if (filter === "rare") return p.rare
    return p.session === filter
  })

  return (
    <OrnithologyLayout>
      <div className="flex flex-col h-[calc(100vh-0px)] lg:h-screen">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-border bg-background flex-shrink-0">
          <div className="flex items-center gap-2">
            <Icon name="Map" size={16} className="text-bird" />
            <span className="font-semibold text-sm">Карта наблюдений</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
                  ${filter === opt.value
                    ? "bg-bird text-white border-bird"
                    : "bg-background border-border text-muted-foreground hover:border-bird/40"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground ml-2">
            {visible.length} точек
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Map */}
          <div className="flex-1">
            <MapContainer
              center={[50.5, 45.0]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              />
              {visible.map(p => (
                <CircleMarker
                  key={p.id}
                  center={[p.lat, p.lon]}
                  radius={p.rare ? 10 : 7}
                  pathOptions={{
                    color: p.rare ? "#f59e0b" : POINT_COLOR[p.status],
                    fillColor: POINT_COLOR[p.status],
                    fillOpacity: 0.85,
                    weight: p.rare ? 2.5 : 1.5,
                  }}
                  eventHandlers={{ click: () => setSelected(p) }}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-bold">{p.species}</div>
                      <div className="text-gray-500 text-xs">{p.session}</div>
                      <div className="mt-1">Численность: <strong>{p.count}</strong></div>
                      <div>Статус: <strong>{STATUS_LABEL[p.status]}</strong></div>
                      {p.rare && <div className="text-amber-600 text-xs mt-1">⭐ Редкий вид</div>}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Info panel */}
          {selected && (
            <div className="w-72 border-l border-border bg-background overflow-y-auto flex-shrink-0 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">Карточка наблюдения</h3>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                  <Icon name="X" size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Вид</div>
                  <div className="font-semibold">{selected.species}</div>
                  {selected.rare && (
                    <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                      <Icon name="Star" size={11} />
                      Редкий вид
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Численность</div>
                    <div className="text-xl font-bold text-bird">{selected.count}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Сессия</div>
                    <div className="text-sm font-mono">{selected.session}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Координаты</div>
                  <div className="text-xs font-mono bg-muted rounded p-2">
                    {selected.lat.toFixed(4)}°N, {selected.lon.toFixed(4)}°E
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Статус</div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium
                    ${selected.status === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      selected.status === "submitted" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      selected.status === "needs_clarification" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {STATUS_LABEL[selected.status]}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 px-5 py-2 border-t border-border bg-background text-xs text-muted-foreground flex-shrink-0">
          <span className="font-medium">Статус:</span>
          {Object.entries(POINT_COLOR).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              {STATUS_LABEL[status]}
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-400 flex-shrink-0" />
            Редкий вид
          </div>
        </div>
      </div>
    </OrnithologyLayout>
  )
}
