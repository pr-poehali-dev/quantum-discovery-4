import { useState, useEffect, useRef } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"
import { useTheme } from "@/hooks/useTheme"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
const TILE_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"

const POINTS = [
  { id: 1,  lat: 52.1234, lon: 46.5678, species: "Серый журавль",    count: 47,  status: "confirmed",            rare: false, session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  { id: 2,  lat: 52.2341, lon: 46.6789, species: "Серый гусь",       count: 312, status: "confirmed",            rare: false, session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  { id: 3,  lat: 52.3456, lon: 46.7890, species: "Беркут",           count: 2,   status: "confirmed",            rare: true,  session: "SS-2024-001", biotope: "Лес" },
  { id: 4,  lat: 52.4567, lon: 46.8901, species: "Белый аист",       count: 3,   status: "confirmed",            rare: false, session: "SS-2024-002", biotope: "Лес" },
  { id: 5,  lat: 52.5678, lon: 46.9012, species: "Чёрный дрозд",    count: 8,   status: "submitted",            rare: false, session: "SS-2024-002", biotope: "Лес" },
  { id: 6,  lat: 43.1234, lon: 43.5678, species: "Орлан-белохвост", count: 1,   status: "confirmed",            rare: true,  session: "SS-2024-003", biotope: "Побережье" },
  { id: 7,  lat: 43.2345, lon: 43.6789, species: "Сапсан",          count: 1,   status: "confirmed",            rare: true,  session: "SS-2024-003", biotope: "Побережье" },
  { id: 8,  lat: 51.9876, lon: 46.4321, species: "Серая цапля",     count: 12,  status: "confirmed",            rare: false, session: "SS-2024-005", biotope: "Водно-болотные угодья" },
  { id: 9,  lat: 52.0987, lon: 46.5432, species: "Скопа",           count: 2,   status: "needs_clarification",  rare: true,  session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  { id: 10, lat: 52.6789, lon: 47.0123, species: "Чёрный аист",     count: 1,   status: "draft",                rare: true,  session: "SS-2024-002", biotope: "Лес" },
]

const STATUS_COLOR: Record<string, string> = {
  confirmed:            "#22c55e",
  submitted:            "#3b82f6",
  needs_clarification:  "#f59e0b",
  draft:                "#94a3b8",
  rejected:             "#ef4444",
}

const STATUS_LABEL: Record<string, string> = {
  confirmed:           "Подтверждено",
  submitted:           "На проверке",
  needs_clarification: "Требует уточнения",
  draft:               "Черновик",
  rejected:            "Отклонено",
}

const FILTERS = [
  { value: "all",          label: "Все" },
  { value: "confirmed",    label: "Подтверждённые" },
  { value: "rare",         label: "Редкие виды" },
  { value: "SS-2024-001",  label: "SS-2024-001" },
  { value: "SS-2024-002",  label: "SS-2024-002" },
  { value: "SS-2024-003",  label: "SS-2024-003" },
]

type Point = typeof POINTS[0]

export default function BirdMapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<L.Map | null>(null)
  const markersLayer = useRef<L.LayerGroup | null>(null)
  const tileLayer = useRef<L.TileLayer | null>(null)
  const [filter, setFilter] = useState("all")
  const [selected, setSelected] = useState<Point | null>(null)
  const { theme } = useTheme()

  const visible = POINTS.filter(p => {
    if (filter === "all")       return true
    if (filter === "confirmed") return p.status === "confirmed"
    if (filter === "rare")      return p.rare
    return p.session === filter
  })

  // Init map once
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return

    const map = L.map(mapRef.current, {
      center: [50.5, 45.0],
      zoom: 5,
      zoomControl: true,
    })

    tileLayer.current = L.tileLayer(TILE_LIGHT, {
      attribution: "",
      maxZoom: 19,
    }).addTo(map)

    map.attributionControl.remove()

    markersLayer.current = L.layerGroup().addTo(map)
    leafletMap.current = map

    return () => {
      map.remove()
      leafletMap.current = null
    }
  }, [])

  // Swap tile layer on theme change
  useEffect(() => {
    if (!leafletMap.current || !tileLayer.current) return
    tileLayer.current.remove()
    tileLayer.current = L.tileLayer(theme === "dark" ? TILE_DARK : TILE_LIGHT, {
      attribution: "",
      maxZoom: 19,
    }).addTo(leafletMap.current)
  }, [theme])

  // Update markers when filter changes
  useEffect(() => {
    if (!markersLayer.current) return

    markersLayer.current.clearLayers()

    visible.forEach(p => {
      const color = STATUS_COLOR[p.status] ?? "#94a3b8"
      const radius = p.rare ? 11 : 8
      const weight = p.rare ? 3 : 1.5
      const borderColor = p.rare ? "#f59e0b" : color

      const circle = L.circleMarker([p.lat, p.lon], {
        radius,
        fillColor: color,
        color: borderColor,
        weight,
        fillOpacity: 0.88,
        opacity: 1,
      })

      circle.bindPopup(`
        <div style="font-family:system-ui,sans-serif;min-width:180px">
          <div style="font-weight:700;font-size:14px;margin-bottom:2px">${p.species}</div>
          <div style="color:#6b7280;font-size:11px;margin-bottom:8px">${p.session}</div>
          <div style="display:flex;gap:12px;margin-bottom:6px">
            <div><div style="font-size:10px;color:#6b7280">Численность</div><div style="font-weight:700;font-size:18px;color:${color}">${p.count}</div></div>
            <div><div style="font-size:10px;color:#6b7280">Биотоп</div><div style="font-size:12px">${p.biotope}</div></div>
          </div>
          <div style="font-size:11px;color:#6b7280">Статус: <span style="font-weight:600;color:${color}">${STATUS_LABEL[p.status]}</span></div>
          ${p.rare ? '<div style="color:#f59e0b;font-size:11px;margin-top:4px">⭐ Редкий вид</div>' : ""}
          <div style="font-size:10px;color:#9ca3af;margin-top:6px">📍 ${p.lat.toFixed(4)}°N, ${p.lon.toFixed(4)}°E</div>
        </div>
      `, { maxWidth: 260 })

      circle.on("click", () => setSelected(p))

      markersLayer.current!.addLayer(circle)
    })
  }, [filter, visible.length])

  return (
    <OrnithologyLayout>
      <div className="flex flex-col" style={{ height: "calc(100vh - 0px)" }}>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border bg-background flex-shrink-0">
          <div className="flex items-center gap-2 mr-2">
            <Icon name="Map" size={15} className="text-bird" />
            <span className="font-semibold text-sm">Карта наблюдений</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border
                  ${filter === f.value
                    ? "bg-bird text-white border-bird"
                    : "bg-background border-border text-muted-foreground hover:border-bird/40"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{visible.length} точек</span>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">

          {/* Map */}
          <div className="flex-1 relative">
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
          </div>

          {/* Side panel */}
          {selected && (
            <div className="w-72 border-l border-border bg-background overflow-y-auto flex-shrink-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">Наблюдение</h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                  >
                    <Icon name="X" size={15} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Вид</div>
                    <div className="font-semibold">{selected.species}</div>
                    {selected.rare && (
                      <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                        <Icon name="Star" size={11} />
                        Редкий / охраняемый вид
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted rounded-xl p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-0.5">Численность</div>
                      <div className="text-2xl font-bold text-bird">{selected.count}</div>
                    </div>
                    <div className="bg-muted rounded-xl p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-0.5">Сессия</div>
                      <div className="text-xs font-mono font-semibold">{selected.session}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Биотоп</div>
                    <div className="text-sm">{selected.biotope}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Координаты</div>
                    <div className="text-xs font-mono bg-muted rounded-lg p-2">
                      {selected.lat.toFixed(4)}°N&nbsp;&nbsp;{selected.lon.toFixed(4)}°E
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1.5">Статус</div>
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{
                        background: STATUS_COLOR[selected.status] + "22",
                        color: STATUS_COLOR[selected.status],
                        border: `1px solid ${STATUS_COLOR[selected.status]}44`,
                      }}
                    >
                      {STATUS_LABEL[selected.status]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 px-4 py-2 border-t border-border bg-background text-xs text-muted-foreground flex-shrink-0">
          {Object.entries(STATUS_COLOR).map(([s, c]) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c }} />
              {STATUS_LABEL[s]}
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-border">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-400 flex-shrink-0" />
            Редкий вид
          </div>
        </div>
      </div>
    </OrnithologyLayout>
  )
}