import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Icon from "@/components/ui/icon"

export interface MonitoringPoint {
  id: number
  name: string
  region: string
  lat: number
  lng: number
  type: "air" | "water" | "radiation" | "noise"
  value: number
  unit: string
  status: "good" | "moderate" | "bad"
}

export const ALL_POINTS: MonitoringPoint[] = [
  // Москва
  { id: 1, name: "Центральный район", region: "Москва", lat: 55.751, lng: 37.618, type: "air", value: 28, unit: "мкг/м³", status: "good" },
  { id: 2, name: "Северный парк", region: "Москва", lat: 55.798, lng: 37.580, type: "air", value: 62, unit: "мкг/м³", status: "moderate" },
  { id: 3, name: "Промзона Восток", region: "Москва", lat: 55.763, lng: 37.710, type: "air", value: 118, unit: "мкг/м³", status: "bad" },
  { id: 4, name: "Река Сетунь", region: "Москва", lat: 55.730, lng: 37.440, type: "water", value: 7.2, unit: "pH", status: "good" },
  { id: 5, name: "Серебряный бор", region: "Москва", lat: 55.789, lng: 37.428, type: "water", value: 6.8, unit: "pH", status: "good" },
  { id: 6, name: "ТЭЦ-22", region: "Москва", lat: 55.710, lng: 37.658, type: "radiation", value: 0.14, unit: "мкЗв/ч", status: "good" },
  { id: 7, name: "Автовокзал Центр", region: "Москва", lat: 55.742, lng: 37.660, type: "noise", value: 74, unit: "дБ", status: "bad" },
  { id: 8, name: "Коломенское", region: "Москва", lat: 55.670, lng: 37.672, type: "air", value: 19, unit: "мкг/м³", status: "good" },
  { id: 9, name: "Измайлово", region: "Москва", lat: 55.788, lng: 37.810, type: "air", value: 45, unit: "мкг/м³", status: "moderate" },
  { id: 10, name: "Река Яуза", region: "Москва", lat: 55.808, lng: 37.700, type: "water", value: 6.4, unit: "pH", status: "moderate" },

  // Запорожская область
  { id: 11, name: "Мелитополь — центр", region: "Запорожская обл.", lat: 46.848, lng: 35.365, type: "air", value: 55, unit: "мкг/м³", status: "moderate" },
  { id: 12, name: "Бердянск — побережье", region: "Запорожская обл.", lat: 46.757, lng: 36.793, type: "water", value: 7.0, unit: "pH", status: "good" },
  { id: 13, name: "Энергодар — ЗАЭС", region: "Запорожская обл.", lat: 47.500, lng: 34.659, type: "radiation", value: 0.38, unit: "мкЗв/ч", status: "moderate" },
  { id: 14, name: "Токмак — пром. зона", region: "Запорожская обл.", lat: 47.257, lng: 35.703, type: "air", value: 97, unit: "мкг/м³", status: "bad" },
  { id: 15, name: "Днепр — устье", region: "Запорожская обл.", lat: 46.615, lng: 33.540, type: "water", value: 6.2, unit: "pH", status: "moderate" },
  { id: 16, name: "Васильевка", region: "Запорожская обл.", lat: 47.431, lng: 35.281, type: "air", value: 32, unit: "мкг/М³", status: "good" },
  { id: 17, name: "Михайловка", region: "Запорожская обл.", lat: 47.281, lng: 35.221, type: "noise", value: 58, unit: "дБ", status: "good" },
  { id: 18, name: "Пологи", region: "Запорожская обл.", lat: 47.479, lng: 36.267, type: "air", value: 71, unit: "мкг/м³", status: "moderate" },
  { id: 19, name: "Каховское водохранилище", region: "Запорожская обл.", lat: 47.200, lng: 34.400, type: "water", value: 5.9, unit: "pH", status: "bad" },
  { id: 20, name: "Приазовье — грунт", region: "Запорожская обл.", lat: 46.900, lng: 35.900, type: "radiation", value: 0.12, unit: "мкЗв/ч", status: "good" },

  // Херсонская область
  { id: 21, name: "Херсон — центр", region: "Херсонская обл.", lat: 46.636, lng: 32.617, type: "air", value: 48, unit: "мкг/м³", status: "moderate" },
  { id: 22, name: "Каховка — река", region: "Херсонская обл.", lat: 46.820, lng: 33.487, type: "water", value: 5.7, unit: "pH", status: "bad" },
  { id: 23, name: "Новая Каховка", region: "Херсонская обл.", lat: 46.755, lng: 33.373, type: "radiation", value: 0.16, unit: "мкЗв/ч", status: "good" },
  { id: 24, name: "Скадовск — побережье", region: "Херсонская обл.", lat: 46.109, lng: 32.903, type: "water", value: 7.4, unit: "pH", status: "good" },
  { id: 25, name: "Голая Пристань", region: "Херсонская обл.", lat: 46.525, lng: 32.539, type: "air", value: 35, unit: "мкг/м³", status: "good" },
  { id: 26, name: "Геническ", region: "Херсонская обл.", lat: 46.167, lng: 34.800, type: "water", value: 7.8, unit: "pH", status: "good" },
  { id: 27, name: "Олешки — пром. зона", region: "Херсонская обл.", lat: 46.638, lng: 32.769, type: "noise", value: 68, unit: "дБ", status: "moderate" },
  { id: 28, name: "Цюрупинск", region: "Херсонская обл.", lat: 46.685, lng: 32.717, type: "air", value: 85, unit: "мкг/м³", status: "bad" },
  { id: 29, name: "Чаплинка", region: "Херсонская обл.", lat: 46.351, lng: 33.539, type: "radiation", value: 0.11, unit: "мкЗв/ч", status: "good" },
  { id: 30, name: "Новотроицкое", region: "Херсонская обл.", lat: 46.286, lng: 34.313, type: "air", value: 42, unit: "мкг/м³", status: "moderate" },

  // ДНР
  { id: 31, name: "Донецк — Центрально-Городской", region: "ДНР", lat: 47.995, lng: 37.802, type: "air", value: 134, unit: "мкг/м³", status: "bad" },
  { id: 32, name: "Мариуполь — порт", region: "ДНР", lat: 47.095, lng: 37.541, type: "water", value: 5.4, unit: "pH", status: "bad" },
  { id: 33, name: "Горловка — шахты", region: "ДНР", lat: 48.296, lng: 38.057, type: "air", value: 148, unit: "мкг/м³", status: "bad" },
  { id: 34, name: "Макеевка", region: "ДНР", lat: 48.058, lng: 37.950, type: "radiation", value: 0.22, unit: "мкЗв/ч", status: "moderate" },
  { id: 35, name: "Волноваха", region: "ДНР", lat: 47.594, lng: 37.496, type: "air", value: 66, unit: "мкг/М³", status: "moderate" },
  { id: 36, name: "Кальмиус — устье", region: "ДНР", lat: 47.093, lng: 37.590, type: "water", value: 5.1, unit: "pH", status: "bad" },
  { id: 37, name: "Снежное", region: "ДНР", lat: 47.978, lng: 38.752, type: "noise", value: 61, unit: "дБ", status: "good" },
  { id: 38, name: "Харцызск", region: "ДНР", lat: 47.992, lng: 38.153, type: "air", value: 89, unit: "мкг/м³", status: "bad" },
  { id: 39, name: "Ясиноватая", region: "ДНР", lat: 48.105, lng: 37.847, type: "radiation", value: 0.19, unit: "мкЗв/ч", status: "good" },
  { id: 40, name: "Докучаевск", region: "ДНР", lat: 47.739, lng: 37.673, type: "air", value: 76, unit: "мкг/м³", status: "moderate" },

  // ЛНР
  { id: 41, name: "Луганск — центр", region: "ЛНР", lat: 48.574, lng: 39.307, type: "air", value: 92, unit: "мкг/м³", status: "bad" },
  { id: 42, name: "Алчевск — металлургия", region: "ЛНР", lat: 48.468, lng: 38.813, type: "air", value: 162, unit: "мкг/м³", status: "bad" },
  { id: 43, name: "Стаханов", region: "ЛНР", lat: 48.562, lng: 38.648, type: "radiation", value: 0.17, unit: "мкЗв/ч", status: "good" },
  { id: 44, name: "Северодонецк — р. Северский Донец", region: "ЛНР", lat: 48.943, lng: 38.488, type: "water", value: 6.0, unit: "pH", status: "moderate" },
  { id: 45, name: "Брянка", region: "ЛНР", lat: 48.499, lng: 38.650, type: "noise", value: 70, unit: "дБ", status: "moderate" },
  { id: 46, name: "Красный Луч", region: "ЛНР", lat: 48.148, lng: 38.932, type: "air", value: 55, unit: "мкг/м³", status: "moderate" },
  { id: 47, name: "Антрацит — шахтный р-н", region: "ЛНР", lat: 48.126, lng: 39.090, type: "air", value: 108, unit: "мкг/м³", status: "bad" },
  { id: 48, name: "Ровеньки", region: "ЛНР", lat: 48.064, lng: 39.350, type: "radiation", value: 0.14, unit: "мкЗв/ч", status: "good" },
  { id: 49, name: "Лутугино", region: "ЛНР", lat: 48.408, lng: 39.201, type: "water", value: 6.7, unit: "pH", status: "moderate" },
  { id: 50, name: "Перевальск", region: "ЛНР", lat: 48.430, lng: 38.860, type: "air", value: 79, unit: "мкг/м³", status: "moderate" },

  // Ростовская область
  { id: 51, name: "Ростов-на-Дону — центр", region: "Ростовская обл.", lat: 47.222, lng: 39.720, type: "air", value: 58, unit: "мкг/м³", status: "moderate" },
  { id: 52, name: "Таганрог — порт", region: "Ростовская обл.", lat: 47.205, lng: 38.924, type: "water", value: 6.9, unit: "pH", status: "good" },
  { id: 53, name: "Новочеркасск — ГРЭС", region: "Ростовская обл.", lat: 47.422, lng: 40.093, type: "air", value: 112, unit: "мкг/м³", status: "bad" },
  { id: 54, name: "Шахты — шахтный р-н", region: "Ростовская обл.", lat: 47.708, lng: 40.217, type: "air", value: 87, unit: "мкг/М³", status: "bad" },
  { id: 55, name: "Дон — устье", region: "Ростовская обл.", lat: 47.100, lng: 39.400, type: "water", value: 6.5, unit: "pH", status: "moderate" },
  { id: 56, name: "Батайск", region: "Ростовская обл.", lat: 47.137, lng: 39.757, type: "noise", value: 72, unit: "дБ", status: "bad" },
  { id: 57, name: "Азов — дельта", region: "Ростовская обл.", lat: 47.107, lng: 39.424, type: "radiation", value: 0.13, unit: "мкЗв/ч", status: "good" },
  { id: 58, name: "Волгодонск — АЭС", region: "Ростовская обл.", lat: 47.516, lng: 42.168, type: "radiation", value: 0.21, unit: "мкЗв/ч", status: "moderate" },
  { id: 59, name: "Каменск-Шахтинский", region: "Ростовская обл.", lat: 48.319, lng: 40.267, type: "air", value: 44, unit: "мкг/м³", status: "moderate" },
  { id: 60, name: "Сальск", region: "Ростовская обл.", lat: 46.475, lng: 41.543, type: "air", value: 26, unit: "мкг/м³", status: "good" },
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

export const STATUS_COLORS: Record<string, string> = {
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

const ALL_REGIONS = ["all", ...Array.from(new Set(ALL_POINTS.map(p => p.region)))]

const REGION_BOUNDS: Record<string, { center: [number, number]; zoom: number }> = {
  all: { center: [47.5, 37.5], zoom: 6 },
  "Москва": { center: [55.751, 37.618], zoom: 10 },
  "Запорожская обл.": { center: [47.1, 35.4], zoom: 8 },
  "Херсонская обл.": { center: [46.5, 33.0], zoom: 8 },
  "ДНР": { center: [47.9, 37.8], zoom: 9 },
  "ЛНР": { center: [48.4, 38.9], zoom: 9 },
  "Ростовская обл.": { center: [47.5, 40.5], zoom: 8 },
}

interface EcoMapProps {
  onSelectPoint?: (point: MonitoringPoint) => void
}

export default function EcoMap({ onSelectPoint }: EcoMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.CircleMarker[]>([])
  const pulseMarkersRef = useRef<L.Marker[]>([])
  const [selected, setSelected] = useState<MonitoringPoint | null>(null)
  const [filter, setFilter] = useState<FilterType>("all")
  const [regionFilter, setRegionFilter] = useState("all")

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [47.5, 37.5],
      zoom: 6,
      zoomControl: false,
    })

    L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
      attribution: "",
      maxZoom: 20,
    }).addTo(map)

    L.control.zoom({ position: "topright" }).addTo(map)

    mapRef.current = map
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current

    markersRef.current.forEach((m) => m.remove())
    pulseMarkersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    pulseMarkersRef.current = []

    const filtered = ALL_POINTS
      .filter(p => filter === "all" || p.type === filter)
      .filter(p => regionFilter === "all" || p.region === regionFilter)

    filtered.forEach((point) => {
      const color = STATUS_COLORS[point.status]

      const pulseIcon = L.divIcon({
        className: "",
        html: `<div style="width:20px;height:20px;border-radius:50%;background:${color};opacity:0.2;animation:eco-pulse 2s infinite;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })
      const pulseMarker = L.marker([point.lat, point.lng], { icon: pulseIcon, interactive: false }).addTo(map)
      pulseMarkersRef.current.push(pulseMarker)

      const marker = L.circleMarker([point.lat, point.lng], {
        radius: 8,
        fillColor: color,
        color: "#000",
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.85,
      }).addTo(map)

      marker.on("click", () => {
        setSelected(point)
        onSelectPoint?.(point)
      })
      markersRef.current.push(marker)
    })
  }, [filter, regionFilter, onSelectPoint])

  useEffect(() => {
    if (!mapRef.current) return
    const bounds = REGION_BOUNDS[regionFilter] ?? REGION_BOUNDS.all
    mapRef.current.flyTo(bounds.center, bounds.zoom, { duration: 1 })
  }, [regionFilter])

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
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(2.2); opacity: 0; }
        }
        .leaflet-container { background: #060E0A; }
        .leaflet-control-attribution { display: none !important; }
      `}</style>

      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Filter Panel */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 max-w-[calc(100%-80px)]">
        {/* Type filters */}
        <div className="flex flex-wrap gap-1.5">
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
        {/* Region filters */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs backdrop-blur transition-all border
                ${regionFilter === r
                  ? "bg-white/20 text-white border-white/50 font-semibold"
                  : "bg-black/60 text-white/60 border-white/15 hover:border-white/35"
                }`}
            >
              {r === "all" ? "Все регионы" : r}
            </button>
          ))}
        </div>
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
        <div className="absolute top-4 right-4 z-[1000] w-64 bg-black/85 backdrop-blur border border-white/15 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-eco/15 border border-eco/30 flex items-center justify-center">
                <Icon name={TYPE_ICONS[selected.type]} size={15} className="text-eco" />
              </div>
              <div>
                <div className="text-xs text-white/50">{TYPE_LABELS[selected.type]} · {selected.region}</div>
                <div className="text-xs font-semibold" style={{ color: STATUS_COLORS[selected.status] }}>
                  {STATUS_LABELS[selected.status]}
                </div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition-colors text-xl leading-none">×</button>
          </div>
          <div className="text-sm font-semibold text-white mb-3 leading-tight">{selected.name}</div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold" style={{ color: STATUS_COLORS[selected.status] }}>
              {selected.value}
            </div>
            <div className="text-xs text-white/50 mt-0.5">{selected.unit}</div>
          </div>
          <div className="mt-3 text-xs text-white/40 text-center">↓ Прокрутите — график динамики</div>
        </div>
      )}
    </div>
  )
}