import { useState, useEffect, useRef } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"
import { useTheme } from "@/hooks/useTheme"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
const TILE_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"

// ─── Точки наблюдений (разовые фиксации) ────────────────────────────────────
const POINTS = [
  { id: 1,  lat: 52.1234, lon: 46.5678, species: "Серый журавль",    count: 47,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  { id: 2,   lat: 52.2341, lon: 46.6789, species: "Серый гусь",             count: 312, status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  { id: 3,   lat: 52.3456, lon: 46.7890, species: "Беркут",                count: 2,   status: "confirmed",           rare: true,  session: "SS-2024-001", biotope: "Лес" },
  { id: 4,   lat: 52.4567, lon: 46.8901, species: "Белый аист",            count: 3,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Лес" },
  { id: 5,   lat: 52.5678, lon: 46.9012, species: "Чёрный дрозд",         count: 8,   status: "submitted",           rare: false, session: "SS-2024-002", biotope: "Лес" },
  { id: 6,   lat: 43.1234, lon: 43.5678, species: "Орлан-белохвост",      count: 1,   status: "confirmed",           rare: true,  session: "SS-2024-003", biotope: "Побережье" },
  { id: 7,   lat: 43.2345, lon: 43.6789, species: "Сапсан",               count: 1,   status: "confirmed",           rare: true,  session: "SS-2024-003", biotope: "Побережье" },
  { id: 8,   lat: 51.9876, lon: 46.4321, species: "Серая цапля",          count: 12,  status: "confirmed",           rare: false, session: "SS-2024-005", biotope: "Водно-болотные угодья" },
  { id: 9,   lat: 52.0987, lon: 46.5432, species: "Скопа",                count: 2,   status: "needs_clarification", rare: true,  session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  { id: 10,  lat: 52.6789, lon: 47.0123, species: "Чёрный аист",          count: 1,   status: "draft",               rare: true,  session: "SS-2024-002", biotope: "Лес" },
  // Кавказ
  { id: 21,  lat: 45.050,  lon: 38.970,  species: "Болотный лунь",        count: 4,   status: "confirmed",           rare: false, session: "SS-2024-003", biotope: "Агроландшафт" },
  { id: 22,  lat: 44.820,  lon: 38.920,  species: "Большой кроншнеп",     count: 1,   status: "confirmed",           rare: true,  session: "SS-2024-003", biotope: "Побережье" },
  { id: 23,  lat: 44.650,  lon: 38.310,  species: "Серебристая чайка",    count: 47,  status: "confirmed",           rare: false, session: "SS-2024-003", biotope: "Побережье" },
  { id: 24,  lat: 44.710,  lon: 38.250,  species: "Большой баклан",       count: 120, status: "confirmed",           rare: false, session: "SS-2024-003", biotope: "Побережье" },
  // Московская область
  { id: 31,  lat: 55.812,  lon: 37.221,  species: "Домовый воробей",      count: 14,  status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Урбанизированные" },
  { id: 32,  lat: 55.799,  lon: 37.245,  species: "Серая ворона",         count: 8,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Урбанизированные" },
  { id: 33,  lat: 55.760,  lon: 37.190,  species: "Ворон",                count: 2,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Лес" },
  { id: 34,  lat: 55.834,  lon: 37.612,  species: "Зелёный дятел",       count: 1,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Урбанизированные" },
  { id: 35,  lat: 55.720,  lon: 37.050,  species: "Филин",                count: 1,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Лес" },
  // Ленинградская область
  { id: 41,  lat: 59.932,  lon: 30.214,  species: "Серая куропатка",      count: 23,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Речные поймы" },
  { id: 42,  lat: 60.120,  lon: 30.450,  species: "Чибис",                count: 31,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  { id: 43,  lat: 59.990,  lon: 30.680,  species: "Обыкновенный зимородок",count: 1,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Речные поймы" },
  { id: 44,  lat: 59.960,  lon: 30.810,  species: "Озёрная чайка",       count: 8,   status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  // Западная Сибирь
  { id: 51,  lat: 54.980,  lon: 73.410,  species: "Тетеревятник",         count: 1,   status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Лес" },
  { id: 52,  lat: 55.280,  lon: 73.760,  species: "Бекас",                count: 12,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  { id: 53,  lat: 54.910,  lon: 72.340,  species: "Речная крачка",        count: 34,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  { id: 54,  lat: 55.180,  lon: 73.080,  species: "Чибис",                count: 34,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Водно-болотные угодья" },
  // Якутия
  { id: 61,  lat: 62.450,  lon: 129.720, species: "Белая куропатка",      count: 3,   status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Тундра" },
  { id: 62,  lat: 62.580,  lon: 130.150, species: "Тетерев",              count: 7,   status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Тундра" },
  { id: 63,  lat: 62.310,  lon: 129.440, species: "Золотистая ржанка",    count: 22,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Тундра" },
  { id: 64,  lat: 62.720,  lon: 130.480, species: "Луговой конёк",       count: 11,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Тундра" },
  // Казахстан
  { id: 71,  lat: 50.280,  lon: 61.440,  species: "Дербник",              count: 1,   status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Степь" },
  { id: 72,  lat: 50.950,  lon: 62.180,  species: "Чернозобик",           count: 45,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Степь" },
  { id: 73,  lat: 50.080,  lon: 61.050,  species: "Серебристая чайка",   count: 230, status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Пустыни" },
  { id: 74,  lat: 50.410,  lon: 61.920,  species: "Обыкновенный канюк",  count: 2,   status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Степь" },
  // Беларусь
  { id: 81,  lat: 52.100,  lon: 23.680,  species: "Болотный лунь",       count: 3,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Лес" },
  { id: 82,  lat: 52.240,  lon: 24.120,  species: "Чёрный коршун",      count: 1,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Водно-болотные угодья" },
  { id: 83,  lat: 52.180,  lon: 24.660,  species: "Речная крачка",       count: 18,  status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Водно-болотные угодья" },
  // Украина — дельта Днепра
  { id: 91,  lat: 46.610,  lon: 32.720,  species: "Озёрная чайка",      count: 34,  status: "confirmed",           rare: false, session: "SS-2024-005", biotope: "Водно-болотные угодья" },
  { id: 92,  lat: 46.580,  lon: 32.840,  species: "Большой баклан",      count: 88,  status: "confirmed",           rare: false, session: "SS-2024-005", biotope: "Водно-болотные угодья" },
  { id: 93,  lat: 46.700,  lon: 33.110,  species: "Серебристая чайка",   count: 52,  status: "confirmed",           rare: false, session: "SS-2024-005", biotope: "Водно-болотные угодья" },
  // Урал
  { id: 101, lat: 56.840,  lon: 60.620,  species: "Глухарь",              count: 2,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Лес" },
  { id: 102, lat: 57.120,  lon: 61.080,  species: "Чёрный дятел",         count: 1,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Лес" },
  { id: 103, lat: 56.960,  lon: 61.340,  species: "Неясыть серая",        count: 1,   status: "confirmed",           rare: false, session: "SS-2024-002", biotope: "Лес" },
  // Дальний Восток
  { id: 111, lat: 43.870,  lon: 131.890, species: "Чёрный стриж",         count: 20,  status: "confirmed",           rare: false, session: "SS-2024-003", biotope: "Урбанизированные" },
  { id: 112, lat: 43.720,  lon: 132.100, species: "Большой баклан",       count: 76,  status: "confirmed",           rare: false, session: "SS-2024-003", biotope: "Побережье" },
  { id: 113, lat: 43.560,  lon: 131.720, species: "Серебристая чайка",    count: 91,  status: "confirmed",           rare: false, session: "SS-2024-003", biotope: "Побережье" },
  // Армения
  { id: 121, lat: 40.320,  lon: 45.280,  species: "Чибис",                count: 45,  status: "confirmed",           rare: false, session: "SS-2024-005", biotope: "Водно-болотные угодья" },
  { id: 122, lat: 40.450,  lon: 45.420,  species: "Озёрная чайка",       count: 22,  status: "confirmed",           rare: false, session: "SS-2024-005", biotope: "Водно-болотные угодья" },
  { id: 123, lat: 40.510,  lon: 45.620,  species: "Балобан",              count: 1,   status: "confirmed",           rare: true,  session: "SS-2024-005", biotope: "Горные территории" },
  // Узбекистан
  { id: 131, lat: 40.780,  lon: 71.420,  species: "Деревенская ласточка", count: 18,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Агроландшафт" },
  { id: 132, lat: 40.920,  lon: 71.860,  species: "Зелёный дятел",       count: 5,   status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Горные территории" },
  { id: 133, lat: 40.660,  lon: 71.640,  species: "Белая трясогузка",     count: 34,  status: "confirmed",           rare: false, session: "SS-2024-001", biotope: "Агроландшафт" },
]

// ─── Треки перемещений (серия фиксаций одного вида во времени) ───────────────
const TRACKS = [
  {
    id: "track-crane",
    species: "Серый журавль",
    latin: "Grus grus",
    color: "#4A90D9",
    rare: false,
    points: [
      { lat: 51.20, lon: 44.10, date: "2024-04-01", time: "06:15", count: 24 },
      { lat: 51.55, lon: 45.30, date: "2024-04-03", time: "07:40", count: 31 },
      { lat: 52.12, lon: 46.57, date: "2024-04-06", time: "08:30", count: 47 },
      { lat: 52.70, lon: 47.90, date: "2024-04-10", time: "09:10", count: 53 },
      { lat: 53.15, lon: 49.20, date: "2024-04-15", time: "07:55", count: 41 },
    ],
  },
  {
    id: "track-eagle",
    species: "Беркут",
    latin: "Aquila chrysaetos",
    color: "#f59e0b",
    rare: true,
    points: [
      { lat: 51.80, lon: 45.50, date: "2024-04-10", time: "10:00", count: 1 },
      { lat: 52.05, lon: 46.20, date: "2024-04-13", time: "11:30", count: 2 },
      { lat: 52.35, lon: 46.79, date: "2024-04-17", time: "09:00", count: 2 },
      { lat: 52.60, lon: 47.40, date: "2024-04-21", time: "08:20", count: 1 },
    ],
  },
  {
    id: "track-osprey",
    species: "Скопа",
    latin: "Pandion haliaetus",
    color: "#e879f9",
    rare: true,
    points: [
      { lat: 51.50, lon: 44.80, date: "2024-04-08", time: "07:00", count: 1 },
      { lat: 51.78, lon: 45.60, date: "2024-04-11", time: "08:45", count: 2 },
      { lat: 52.10, lon: 46.54, date: "2024-04-15", time: "09:45", count: 2 },
      { lat: 52.45, lon: 47.20, date: "2024-04-20", time: "08:10", count: 1 },
      { lat: 52.90, lon: 48.50, date: "2024-04-28", time: "07:30", count: 2 },
    ],
  },
  {
    id: "track-stork",
    species: "Белый аист",
    latin: "Ciconia ciconia",
    color: "#22c55e",
    rare: false,
    points: [
      { lat: 51.40, lon: 45.20, date: "2024-05-01", time: "09:00", count: 2 },
      { lat: 51.80, lon: 46.00, date: "2024-05-08", time: "10:20", count: 3 },
      { lat: 52.46, lon: 46.89, date: "2024-05-20", time: "10:00", count: 3 },
      { lat: 52.90, lon: 47.60, date: "2024-06-02", time: "08:30", count: 4 },
    ],
  },
]

// ─── Даты всех точек треков ──────────────────────────────────────────────────
const ALL_DATES = TRACKS.flatMap(t => t.points.map(p => p.date)).sort()
const MIN_DATE  = ALL_DATES[0]
const MAX_DATE  = ALL_DATES[ALL_DATES.length - 1]

// Уникальные отсортированные даты для шкалы
const UNIQUE_DATES = [...new Set(ALL_DATES)]

function dateToIdx(date: string): number {
  const idx = UNIQUE_DATES.indexOf(date)
  return idx >= 0 ? idx : 0
}
function idxToDate(idx: number): string {
  return UNIQUE_DATES[Math.min(idx, UNIQUE_DATES.length - 1)]
}
function fmtDate(d: string): string {
  const [y, m, day] = d.split("-")
  return `${day}.${m}.${y}`
}

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

type ObsPoint = typeof POINTS[0]
type Track    = typeof TRACKS[0]

function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

// Наконечник стрелки на каждый сегмент трека
function addArrows(map: L.Map, latlngs: [number, number][], color: string, layer: L.LayerGroup) {
  if (latlngs.length < 2) return

  for (let i = 1; i < latlngs.length; i++) {
    const from = map.latLngToContainerPoint(L.latLng(latlngs[i - 1][0], latlngs[i - 1][1]))
    const to   = map.latLngToContainerPoint(L.latLng(latlngs[i][0],     latlngs[i][1]))

    // Середина сегмента в географических координатах
    const midLat = (latlngs[i - 1][0] + latlngs[i][0]) / 2
    const midLon = (latlngs[i - 1][1] + latlngs[i][1]) / 2

    // Угол в градусах (от пиксельных координат)
    const angleDeg = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI

    const arrowHtml = `
      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"
           style="transform:rotate(${angleDeg + 90}deg);overflow:visible;display:block">
        <polygon points="11,0 18,16 11,12 4,16"
          fill="${color}" stroke="white" stroke-width="1.5"
          stroke-linejoin="round"/>
      </svg>`

    const icon = L.divIcon({
      html: arrowHtml,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      className: "",
    })

    layer.addLayer(L.marker([midLat, midLon], { icon, interactive: false }))
  }
}

export default function BirdMapPage() {
  const mapRef       = useRef<HTMLDivElement>(null)
  const leafletMap   = useRef<L.Map | null>(null)
  const markersLayer = useRef<L.LayerGroup | null>(null)
  const tracksLayer  = useRef<L.LayerGroup | null>(null)
  const tileLayer    = useRef<L.TileLayer | null>(null)
  const themeRef     = useRef("")

  const [mode, setMode]             = useState<"points" | "tracks">("points")
  const [filter, setFilter]         = useState("all")
  const [fromIdx, setFromIdx]       = useState(0)
  const [toIdx, setToIdx]           = useState(UNIQUE_DATES.length - 1)
  const [activeTrack, setActiveTrack] = useState<string | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<ObsPoint | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const { theme } = useTheme()

  const dateFrom = idxToDate(fromIdx)
  const dateTo   = idxToDate(toIdx)

  useEffect(() => { themeRef.current = theme }, [theme])

  const visiblePoints = POINTS.filter(p => {
    if (filter === "all")       return true
    if (filter === "confirmed") return p.status === "confirmed"
    if (filter === "rare")      return p.rare
    return p.session === filter
  })

  const visibleTracks = TRACKS.filter(t =>
    !activeTrack || t.id === activeTrack
  ).map(t => ({
    ...t,
    points: t.points.filter(p => p.date >= dateFrom && p.date <= dateTo),
  })).filter(t => t.points.length > 0)

  // ── Инициализация карты ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return
    const map = L.map(mapRef.current, { center: [54.0, 65.0], zoom: 3 })
    tileLayer.current   = L.tileLayer(themeRef.current === "dark" ? TILE_DARK : TILE_LIGHT, { attribution: "", maxZoom: 19 }).addTo(map)
    markersLayer.current = L.layerGroup().addTo(map)
    tracksLayer.current  = L.layerGroup().addTo(map)
    map.attributionControl.remove()
    leafletMap.current = map
    return () => { map.remove(); leafletMap.current = null }
  }, [])

  // ── Смена тайлов при смене темы ─────────────────────────────────────────
  useEffect(() => {
    if (!leafletMap.current || !tileLayer.current) return
    tileLayer.current.remove()
    tileLayer.current = L.tileLayer(theme === "dark" ? TILE_DARK : TILE_LIGHT, { attribution: "", maxZoom: 19 }).addTo(leafletMap.current)
  }, [theme])

  // ── Режим точек ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!markersLayer.current) return
    markersLayer.current.clearLayers()
    if (mode !== "points") return

    visiblePoints.forEach(p => {
      const color  = STATUS_COLOR[p.status] ?? "#94a3b8"
      const circle = L.circleMarker([p.lat, p.lon], {
        radius: p.rare ? 11 : 8,
        fillColor: color,
        color: p.rare ? "#f59e0b" : color,
        weight: p.rare ? 3 : 1.5,
        fillOpacity: 0.88,
      })
      circle.bindPopup(`
        <div style="font-family:system-ui,sans-serif;min-width:180px">
          <div style="font-weight:700;font-size:14px;margin-bottom:2px">${p.species}</div>
          <div style="color:#6b7280;font-size:11px;margin-bottom:8px">${p.session}</div>
          <div style="display:flex;gap:12px;margin-bottom:6px">
            <div><div style="font-size:10px;color:#6b7280">Числ.</div><div style="font-weight:700;font-size:18px;color:${color}">${p.count}</div></div>
            <div><div style="font-size:10px;color:#6b7280">Биотоп</div><div style="font-size:12px">${p.biotope}</div></div>
          </div>
          <div style="font-size:11px;color:#6b7280">Статус: <span style="font-weight:600;color:${color}">${STATUS_LABEL[p.status]}</span></div>
          ${p.rare ? '<div style="color:#f59e0b;font-size:11px;margin-top:4px">⭐ Редкий вид</div>' : ""}
          <div style="font-size:10px;color:#9ca3af;margin-top:6px">📍 ${p.lat.toFixed(4)}°N, ${p.lon.toFixed(4)}°E</div>
        </div>
      `, { maxWidth: 260 })
      circle.on("click", () => { setSelectedPoint(p); setSelectedTrack(null) })
      markersLayer.current!.addLayer(circle)
    })
  }, [mode, filter, visiblePoints.length])

  // ── Режим треков ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!tracksLayer.current || !leafletMap.current) return
    tracksLayer.current.clearLayers()
    markersLayer.current?.clearLayers()
    if (mode !== "tracks") return

    visibleTracks.forEach(track => {
      const latlngs = track.points.map(p => [p.lat, p.lon] as [number, number])
      if (latlngs.length < 1) return

      // Линия трека
      if (latlngs.length > 1) {
        L.polyline(latlngs, {
          color: track.color,
          weight: 3,
          opacity: 0.85,
          dashArray: "8 4",
        }).addTo(tracksLayer.current!)

        addArrows(leafletMap.current!, latlngs, track.color, tracksLayer.current!)
      }

      // Точки фиксации
      track.points.forEach((p, idx) => {
        const isFirst = idx === 0
        const isLast  = idx === track.points.length - 1

        const circle = L.circleMarker([p.lat, p.lon], {
          radius:      isFirst || isLast ? 9 : 6,
          fillColor:   track.color,
          color:       isLast ? "#fff" : track.color,
          weight:      isLast ? 2.5 : 1,
          fillOpacity: isFirst ? 0.5 : 0.9,
        })

        const daysObs = track.points.length > 1
          ? daysBetween(track.points[0].date, track.points[track.points.length - 1].date)
          : 0

        circle.bindPopup(`
          <div style="font-family:system-ui,sans-serif;min-width:190px">
            <div style="font-weight:700;font-size:13px;color:${track.color}">${track.species}</div>
            <div style="color:#6b7280;font-size:10px;font-style:italic;margin-bottom:8px">${track.latin}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
              <div style="background:#f3f4f6;border-radius:6px;padding:6px;text-align:center">
                <div style="font-size:9px;color:#6b7280">Фиксация</div>
                <div style="font-weight:700;font-size:12px">${idx + 1} из ${track.points.length}</div>
              </div>
              <div style="background:#f3f4f6;border-radius:6px;padding:6px;text-align:center">
                <div style="font-size:9px;color:#6b7280">Особей</div>
                <div style="font-weight:700;font-size:12px;color:${track.color}">${p.count}</div>
              </div>
            </div>
            <div style="font-size:11px;margin-bottom:3px">📅 ${p.date} · ${p.time}</div>
            <div style="font-size:10px;color:#9ca3af">📍 ${p.lat.toFixed(4)}°N, ${p.lon.toFixed(4)}°E</div>
            ${daysObs > 0 ? `<div style="margin-top:6px;font-size:10px;color:#6b7280">⏱ Под наблюдением: <b>${daysObs} дн.</b></div>` : ""}
          </div>
        `, { maxWidth: 280 })

        circle.on("click", () => { setSelectedTrack(track as Track); setSelectedPoint(null) })
        tracksLayer.current!.addLayer(circle)
      })
    })
  }, [mode, dateFrom, dateTo, activeTrack])

  // ─── JSX ─────────────────────────────────────────────────────────────────
  const FILTERS = [
    { value: "all",         label: "Все" },
    { value: "confirmed",   label: "Подтверждённые" },
    { value: "rare",        label: "Редкие виды" },
    { value: "SS-2024-001", label: "SS-2024-001" },
    { value: "SS-2024-002", label: "SS-2024-002" },
    { value: "SS-2024-003", label: "SS-2024-003" },
  ]

  return (
    <OrnithologyLayout>
      <div className="flex flex-col" style={{ height: "100vh" }}>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-border bg-background flex-shrink-0">

          {/* Режим */}
          <div className="flex rounded-lg border border-border overflow-hidden text-xs font-medium">
            <button
              onClick={() => { setMode("points"); setSelectedTrack(null) }}
              className={`px-3 py-1.5 transition-colors ${mode === "points" ? "bg-bird text-white" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Icon name="MapPin" size={13} className="inline mr-1" />
              Точки
            </button>
            <button
              onClick={() => { setMode("tracks"); setSelectedPoint(null) }}
              className={`px-3 py-1.5 transition-colors ${mode === "tracks" ? "bg-bird text-white" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Icon name="Waypoints" size={13} className="inline mr-1" />
              Векторы
            </button>
          </div>

          {/* Фильтры точек */}
          {mode === "points" && (
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map(f => (
                <button key={f.value} onClick={() => setFilter(f.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                    ${filter === f.value ? "bg-bird text-white border-bird" : "border-border text-muted-foreground hover:border-bird/40"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* Фильтры треков */}
          {mode === "tracks" && (
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="Calendar" size={13} className="text-bird" />
                <span className="font-medium text-foreground">{fmtDate(dateFrom)}</span>
                <span>—</span>
                <span className="font-medium text-foreground">{fmtDate(dateTo)}</span>
                <span className="text-muted-foreground ml-1">({daysBetween(dateFrom, dateTo)} дн.)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 ml-1">
                <button onClick={() => setActiveTrack(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                    ${!activeTrack ? "bg-bird text-white border-bird" : "border-border text-muted-foreground hover:border-bird/40"}`}
                >
                  Все
                </button>
                {TRACKS.map(t => (
                  <button key={t.id} onClick={() => setActiveTrack(prev => prev === t.id ? null : t.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                      ${activeTrack === t.id ? "text-white border-transparent" : "border-border text-muted-foreground hover:border-bird/40"}`}
                    style={activeTrack === t.id ? { background: t.color, borderColor: t.color } : {}}
                  >
                    <span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ background: t.color }} />
                    {t.species}
                  </button>
                ))}
              </div>
            </div>
          )}

          <span className="ml-auto text-xs text-muted-foreground">
            {mode === "points" ? `${visiblePoints.length} точек` : `${visibleTracks.length} треков`}
          </span>
        </div>

        {/* ── Карта + панель ── */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 relative">
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
          </div>

          {/* Панель точки */}
          {selectedPoint && mode === "points" && (
            <div className="w-72 border-l border-border bg-background overflow-y-auto flex-shrink-0 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">Наблюдение</h3>
                <button onClick={() => setSelectedPoint(null)} className="p-1 text-muted-foreground hover:text-foreground">
                  <Icon name="X" size={15} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Вид</div>
                  <div className="font-semibold">{selectedPoint.species}</div>
                  {selectedPoint.rare && <div className="text-amber-500 text-xs mt-0.5 flex items-center gap-1"><Icon name="Star" size={11} />Редкий вид</div>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <div className="text-xs text-muted-foreground">Числ.</div>
                    <div className="text-2xl font-bold text-bird">{selectedPoint.count}</div>
                  </div>
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <div className="text-xs text-muted-foreground">Сессия</div>
                    <div className="text-xs font-mono font-semibold">{selectedPoint.session}</div>
                  </div>
                </div>
                <div><div className="text-xs text-muted-foreground mb-0.5">Биотоп</div><div className="text-sm">{selectedPoint.biotope}</div></div>
                <div><div className="text-xs text-muted-foreground mb-0.5">Координаты</div>
                  <div className="text-xs font-mono bg-muted rounded-lg p-2">{selectedPoint.lat.toFixed(4)}°N&nbsp;&nbsp;{selectedPoint.lon.toFixed(4)}°E</div>
                </div>
                <div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: STATUS_COLOR[selectedPoint.status] + "22", color: STATUS_COLOR[selectedPoint.status], border: `1px solid ${STATUS_COLOR[selectedPoint.status]}44` }}>
                    {STATUS_LABEL[selectedPoint.status]}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Панель трека */}
          {selectedTrack && mode === "tracks" && (
            <div className="w-80 border-l border-border bg-background overflow-y-auto flex-shrink-0 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">Вектор перемещения</h3>
                <button onClick={() => setSelectedTrack(null)} className="p-1 text-muted-foreground hover:text-foreground">
                  <Icon name="X" size={15} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: selectedTrack.color }} />
                  <div>
                    <div className="font-semibold">{selectedTrack.species}</div>
                    <div className="text-xs italic text-muted-foreground">{selectedTrack.latin}</div>
                  </div>
                  {selectedTrack.rare && <Icon name="Star" size={13} className="text-amber-500 ml-auto" />}
                </div>

                {/* KPI трека */}
                {(() => {
                  const pts = selectedTrack.points.filter(p => p.date >= dateFrom && p.date <= dateTo)
                  const daysObs = pts.length > 1 ? daysBetween(pts[0].date, pts[pts.length - 1].date) : 0
                  const totalCount = pts.reduce((s, p) => s + p.count, 0)
                  return (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-muted rounded-xl p-3 text-center">
                        <div className="text-xs text-muted-foreground">Фиксаций</div>
                        <div className="text-xl font-bold" style={{ color: selectedTrack.color }}>{pts.length}</div>
                      </div>
                      <div className="bg-muted rounded-xl p-3 text-center">
                        <div className="text-xs text-muted-foreground">Дней</div>
                        <div className="text-xl font-bold text-bird">{daysObs}</div>
                      </div>
                      <div className="bg-muted rounded-xl p-3 text-center">
                        <div className="text-xs text-muted-foreground">Особей</div>
                        <div className="text-xl font-bold text-emerald-500">{totalCount}</div>
                      </div>
                    </div>
                  )
                })()}

                {/* Хронология */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Хронология фиксаций</div>
                  <div className="relative">
                    {/* вертикальная линия */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-px" style={{ background: selectedTrack.color + "44" }} />
                    <div className="space-y-3">
                      {selectedTrack.points.filter(p => p.date >= dateFrom && p.date <= dateTo).map((p, idx, arr) => (
                        <div key={idx} className="flex gap-3 items-start relative">
                          <div className="w-[22px] h-[22px] rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold z-10"
                            style={{ background: idx === arr.length - 1 ? selectedTrack.color : selectedTrack.color + "88" }}>
                            {idx + 1}
                          </div>
                          <div className="flex-1 bg-muted rounded-xl p-2.5 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-medium">{p.date}</span>
                              <span className="text-xs text-muted-foreground">{p.time}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground">Особей:</span>
                              <span className="text-sm font-bold" style={{ color: selectedTrack.color }}>{p.count}</span>
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                              {p.lat.toFixed(4)}°N {p.lon.toFixed(4)}°E
                            </div>
                            {idx > 0 && (
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                +{daysBetween(arr[idx - 1].date, p.date)} дн. с предыдущей
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Временной ползунок (только в режиме векторов) ── */}
        {mode === "tracks" && (
          <div className="flex-shrink-0 border-t border-border bg-background px-6 py-3">
            <div className="max-w-3xl mx-auto">
              {/* Метки крайних дат + текущий диапазон */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>{fmtDate(MIN_DATE)}</span>
                <span className="text-bird font-semibold">
                  {fmtDate(dateFrom)} — {fmtDate(dateTo)}
                </span>
                <span>{fmtDate(MAX_DATE)}</span>
              </div>

              {/* Двойной range slider */}
              <div className="timeline-slider relative h-6 flex items-center">
                {/* Трек */}
                <div className="absolute w-full h-1.5 bg-border rounded-full" />

                {/* Закрашенный диапазон */}
                <div
                  className="absolute h-1.5 bg-bird rounded-full pointer-events-none"
                  style={{
                    left:  `${(fromIdx / (UNIQUE_DATES.length - 1)) * 100}%`,
                    right: `${100 - (toIdx / (UNIQUE_DATES.length - 1)) * 100}%`,
                  }}
                />

                {/* Ползунок "от" */}
                <input
                  type="range"
                  min={0}
                  max={UNIQUE_DATES.length - 1}
                  value={fromIdx}
                  onChange={e => {
                    const v = Number(e.target.value)
                    if (v <= toIdx) setFromIdx(v)
                  }}
                  className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer"
                  style={{ zIndex: fromIdx >= toIdx - 1 ? 5 : 3 }}
                />

                {/* Ползунок "до" */}
                <input
                  type="range"
                  min={0}
                  max={UNIQUE_DATES.length - 1}
                  value={toIdx}
                  onChange={e => {
                    const v = Number(e.target.value)
                    if (v >= fromIdx) setToIdx(v)
                  }}
                  className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer"
                  style={{ zIndex: 4 }}
                />
              </div>

              {/* Засечки дат */}
              <div className="relative mt-1">
                <div className="flex justify-between">
                  {UNIQUE_DATES.map((d, i) => (
                    <button
                      key={d}
                      onClick={() => {
                        if (i <= toIdx)   setFromIdx(i)
                        if (i >= fromIdx) setToIdx(i)
                      }}
                      className={`flex flex-col items-center gap-0.5 group transition-opacity
                        ${d >= dateFrom && d <= dateTo ? "opacity-100" : "opacity-40"}`}
                    >
                      <div className={`w-0.5 h-2 rounded-full transition-colors
                        ${d >= dateFrom && d <= dateTo ? "bg-bird" : "bg-border"}`}
                      />
                      <span className={`text-[9px] whitespace-nowrap transition-colors
                        ${d >= dateFrom && d <= dateTo ? "text-bird font-medium" : "text-muted-foreground"}`}>
                        {fmtDate(d).slice(0, 5)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Легенда ── */}
        <div className="flex flex-wrap items-center gap-4 px-4 py-2 border-t border-border bg-background text-xs text-muted-foreground flex-shrink-0">
          {mode === "points" ? (
            <>
              {Object.entries(STATUS_COLOR).map(([s, c]) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c }} />
                  {STATUS_LABEL[s]}
                </div>
              ))}
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-400 flex-shrink-0" />
                Редкий вид
              </div>
            </>
          ) : (
            <>
              {TRACKS.map(t => (
                <div key={t.id} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
                  {t.species}
                  {t.rare && <Icon name="Star" size={10} className="text-amber-400" />}
                </div>
              ))}
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
                <span className="inline-block w-6 border-t-2 border-dashed border-gray-400" />
                Вектор перемещения
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-white bg-bird flex-shrink-0" />
                Последняя фиксация
              </div>
            </>
          )}
        </div>
      </div>
    </OrnithologyLayout>
  )
}