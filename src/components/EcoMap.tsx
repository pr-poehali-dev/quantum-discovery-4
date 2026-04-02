import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Icon from "@/components/ui/icon"

interface MonitoringPoint {
  id: number
  name: string
  lat: number
  lng: number
  type: "air" | "water" | "radiation" | "noise"
  value: number
  unit: string
  status: "good" | "moderate" | "bad"
}

const POINTS: MonitoringPoint[] = [
  { id: 1, name: "Пост №1 — Центральный район", lat: 55.751, lng: 37.618, type: "air", value: 28, unit: "мкг/м³", status: "good" },
  { id: 2, name: "Пост №2 — Северный парк", lat: 55.798, lng: 37.580, type: "air", value: 62, unit: "мкг/м³", status: "moderate" },
  { id: 3, name: "Пост №3 — Промзона Восток", lat: 55.763, lng: 37.710, type: "air", value: 118, unit: "мкг/м³", status: "bad" },
  { id: 4, name: "Река Сетунь", lat: 55.730, lng: 37.440, type: "water", value: 7.2, unit: "pH", status: "good" },
  { id: 5, name: "Водоём Серебряный бор", lat: 55.789, lng: 37.428, type: "water", value: 6.8, unit: "pH", status: "good" },
  { id: 6, name: "Пост №4 — ТЭЦ-22", lat: 55.710, lng: 37.658, type: "radiation", value: 0.14, unit: "мкЗв/ч", status: "good" },
  { id: 7, name: "Пост №5 — Автовокзал", lat: 55.742, lng: 37.660, type: "noise", value: 74, unit: "дБ", status: "bad" },
  { id: 8, name: "Пост №6 — Коломенское", lat: 55.670, lng: 37.672, type: "air", value: 19, unit: "мкг/м³", status: "good" },
  { id: 9, name: "Пост №7 — Измайлово", lat: 55.788, lng: 37.810, type: "air", value: 45, unit: "мкг/м³", status: "moderate" },
  { id: 10, name: "Река Яуза", lat: 55.808, lng: 37.700, type: "water", value: 6.4, unit: "pH", status: "moderate" },
]

const TYPE_LABELS: Record<string, string> = {
  air: "Воздух",
  water: "Вода",
  radiation: "Радиация",
  noise: "Шум",
}

const TYPE_ICONS: Record<string, string> = {
  air: "Wind",
  water: "Droplets",
  radiation: "RadioTower",
  noise: "Volume2",
}

const STATUS_COLORS: Record<string, string> = {
  good: "#3DBA6F",
  moderate: "#F59E0B",
  bad: "#EF4444",
}

const STATUS_LABELS: Record<string, string> = {
  good: "Норма",
  moderate: "Умеренно",
  bad: "Превышение",
}

const FILTER_TYPES = ["all", "air", "water", "radiation", "noise"] as const
type FilterType = typeof FILTER_TYPES[number]

export default function EcoMap() {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.CircleMarker[]>([])
  const [selected, setSelected] = useState<MonitoringPoint | null>(null)
  const [filter, setFilter] = useState<FilterType>("all")

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [55.751, 37.618],
      zoom: 11,
      zoomControl: false,
    })

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: "topright" }).addTo(map)

    mapRef.current = map
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const filtered = filter === "all" ? POINTS : POINTS.filter((p) => p.type === filter)

    filtered.forEach((point) => {
      const color = STATUS_COLORS[point.status]
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: 10,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.75,
      }).addTo(map)

      const pulseIcon = L.divIcon({
        className: "",
        html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};opacity:0.25;animation:eco-pulse 2s infinite;"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
      L.marker([point.lat, point.lng], { icon: pulseIcon }).addTo(map)

      marker.on("click", () => setSelected(point))
      markersRef.current.push(marker)
    })
  }, [filter])

  const filterLabel: Record<FilterType, string> = {
    all: "Все",
    air: "Воздух",
    water: "Вода",
    radiation: "Радиация",
    noise: "Шум",
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <style>{`
        @keyframes eco-pulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.8); opacity: 0; }
        }
        .leaflet-container { background: #060E0A; }
      `}</style>

      {/* Map */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Filter Panel */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2">
        {FILTER_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur transition-all border
              ${filter === t
                ? "bg-eco text-black border-eco"
                : "bg-black/60 text-white/80 border-white/20 hover:border-eco/50"
              }`}
          >
            {filterLabel[t]}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/70 backdrop-blur border border-white/10 rounded-xl p-3 flex flex-col gap-2">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2 text-xs text-white/80">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
            {STATUS_LABELS[status]}
          </div>
        ))}
      </div>

      {/* Info Panel */}
      {selected && (
        <div className="absolute top-4 right-4 z-[1000] w-64 bg-black/80 backdrop-blur border border-white/15 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-eco/15 border border-eco/30 flex items-center justify-center">
                <Icon name={TYPE_ICONS[selected.type]} size={15} className="text-eco" />
              </div>
              <div>
                <div className="text-xs text-white/50">{TYPE_LABELS[selected.type]}</div>
                <div
                  className="text-xs font-semibold"
                  style={{ color: STATUS_COLORS[selected.status] }}
                >
                  {STATUS_LABELS[selected.status]}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-white/40 hover:text-white transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="text-sm font-semibold text-white mb-3 leading-tight">{selected.name}</div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold" style={{ color: STATUS_COLORS[selected.status] }}>
              {selected.value}
            </div>
            <div className="text-xs text-white/50 mt-0.5">{selected.unit}</div>
          </div>
          <div className="mt-3 text-xs text-white/40 text-center">Обновлено: только что</div>
        </div>
      )}
    </div>
  )
}
